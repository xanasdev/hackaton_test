from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny

from .models import Marker, PollutionType
from .serializers import MarkerSerializer, PollutionTypeSerializer


class PollutionTypeViewSet(viewsets.ModelViewSet):
    """Управление типами загрязнений."""

    queryset = PollutionType.objects.all().order_by("name")
    serializer_class = PollutionTypeSerializer
    permission_classes = [AllowAny]


class MarkerViewSet(viewsets.ModelViewSet):
    """Управление метками загрязнений."""

    queryset = Marker.objects.select_related("pollution_type").prefetch_related("photos")
    serializer_class = MarkerSerializer
    permission_classes = [AllowAny]
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
