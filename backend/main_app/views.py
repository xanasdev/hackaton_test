from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import PollutionComment, PollutionReport, PollutionType
from .serializers import (
    PollutionCommentCreateSerializer,
    PollutionCommentSerializer,
    PollutionReportCreateSerializer,
    PollutionReportDetailSerializer,
    PollutionReportListSerializer,
    PollutionReportStatusUpdateSerializer,
    PollutionTypeSerializer,
)


def _has_permission(user, permission: str) -> bool:
    if not user or not user.is_authenticated:
        return False
    if getattr(user, "is_superuser", False):
        return True
    if hasattr(user, "has_permission"):
        return user.has_permission(permission)
    return False


class PollutionTypeViewSet(viewsets.ModelViewSet):
    queryset = PollutionType.objects.filter(is_active=True)
    serializer_class = PollutionTypeSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = PollutionType.objects.all()
        if self.action in {"list", "retrieve"}:
            qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        if not _has_permission(self.request.user, "pollution_type:manage"):
            self.permission_denied(self.request, message=_("Недостаточно прав"))
        serializer.save()

    def perform_update(self, serializer):
        if not _has_permission(self.request.user, "pollution_type:manage"):
            self.permission_denied(self.request, message=_("Недостаточно прав"))
        serializer.save()

    def perform_destroy(self, instance):
        if not _has_permission(self.request.user, "pollution_type:manage"):
            self.permission_denied(self.request, message=_("Недостаточно прав"))
        instance.delete()


class PollutionReportViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = PollutionReport.objects.select_related(
        "pollution_type",
        "reporter",
        "assigned_to",
    ).prefetch_related("status_logs", "comments")
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        if self.action == "comments" and self.request.method.lower() == "get":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get_serializer_class(self):
        if self.action == "create":
            return PollutionReportCreateSerializer
        if self.action == "retrieve":
            return PollutionReportDetailSerializer
        if self.action == "list":
            return PollutionReportListSerializer
        if self.action == "status":
            return PollutionReportStatusUpdateSerializer
        if self.action == "comments":
            return PollutionCommentCreateSerializer
        return PollutionReportDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        pollution_type = self.request.query_params.get("pollution_type")
        if pollution_type:
            qs = qs.filter(pollution_type_id=pollution_type)
        region = self.request.query_params.get("region")
        if region:
            qs = qs.filter(region__iexact=region)
        reporter = self.request.query_params.get("reporter")
        if reporter:
            qs = qs.filter(reporter_id=reporter)
        return qs

    def perform_create(self, serializer):
        if not _has_permission(self.request.user, "report:create"):
            self.permission_denied(self.request, message=_("Недостаточно прав для создания отчёта"))
        serializer.save()

    @action(detail=True, methods=["post"], url_path="status")
    def status(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not _has_permission(request.user, "report:update_status"):
            self.permission_denied(request, message=_("Недостаточно прав для смены статуса"))

        new_status = serializer.validated_data["status"]
        comment_text = serializer.validated_data.get("comment", "")
        assignee = serializer.validated_data.get("assigned_to")

        with transaction.atomic():
            previous_status = report.status
            report.status = new_status
            report.assigned_to = assignee
            report.save(update_fields=["status", "assigned_to", "updated_at"])

            if previous_status != new_status or comment_text:
                report.status_logs.create(
                    previous_status=previous_status,
                    new_status=new_status,
                    changed_by=request.user,
                    comment=comment_text,
                )

        return Response(PollutionReportDetailSerializer(report, context={"request": request}).data)

    @action(detail=True, methods=["post", "get"], url_path="comments")
    def comments(self, request, pk=None):
        report = self.get_object()

        if request.method.lower() == "get":
            serializer = PollutionCommentSerializer(report.comments.all(), many=True)
            return Response(serializer.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not _has_permission(request.user, "report:comment"):
            self.permission_denied(request, message=_("Недостаточно прав для добавления комментария"))

        comment = PollutionComment.objects.create(
            report=report,
            author=request.user,
            text=serializer.validated_data["text"],
        )
        return Response(
            PollutionCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )
