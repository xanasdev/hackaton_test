from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Marker, PollutionType
from .models import MarkerComment
from .serializers import MarkerSerializer, PollutionTypeSerializer, MarkerCommentSerializer


class PollutionTypeViewSet(viewsets.ModelViewSet):
    """Управление типами загрязнений."""

    queryset = PollutionType.objects.all().order_by("name")
    serializer_class = PollutionTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MarkerViewSet(viewsets.ModelViewSet):
    """Управление метками загрязнений."""

    queryset = Marker.objects.select_related("pollution_type", "creator").prefetch_related("photos")
    serializer_class = MarkerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["region_type", "description", "pollution_type__name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        pollution_type_id = self.request.query_params.get("pollution_type")
        region_type = self.request.query_params.get("region_type")

        if pollution_type_id:
            queryset = queryset.filter(pollution_type_id=pollution_type_id)
        if region_type:
            queryset = queryset.filter(region_type__iexact=region_type)
        return queryset

    def perform_create(self, serializer):
        """Автоматически добавляем создателя маркера и обрабатываем фотографии."""
        files = self.request.FILES.getlist('photos')
        photos_data = []
        
        if files:
            for photo in files:
                photos_data.append({'image': photo})
                
        serializer.context['photos'] = photos_data
        serializer.save(
            creator=self.request.user,
            creator_username=self.request.user.username
        )

    @action(detail=True, methods=['get'], url_path='comments')
    def list_comments(self, request, pk=None):
        """List comments for a marker"""
        marker = self.get_object()
        comments = marker.comments.select_related('creator').all()
        serializer = MarkerCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='comments')
    def create_comment(self, request, pk=None):
        """Add a comment to a marker. User must be authenticated."""
        marker = self.get_object()
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)

        serializer = MarkerCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(marker=marker, creator=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'], url_path='status-stats')
    def status_stats(self, request):
        """Return counts of markers by status: in_progress and cleared."""
        queryset = self.get_queryset()
        in_progress = queryset.filter(status=Marker.STATUS_IN_PROGRESS).count()
        cleared = queryset.filter(status=Marker.STATUS_CLEARED).count()
        return Response({
            'in_progress': in_progress,
            'cleared': cleared,
        })
