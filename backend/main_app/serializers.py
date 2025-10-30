from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import PollutionComment, PollutionReport, PollutionStatusLog, PollutionType


User = get_user_model()


class PollutionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollutionType
        fields = (
            "id",
            "slug",
            "name",
            "description",
            "is_active",
        )


class PollutionCommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PollutionComment
        fields = (
            "id",
            "author",
            "text",
            "created_at",
        )
        read_only_fields = ("id", "author", "created_at")


class PollutionCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollutionComment
        fields = ("text",)


class PollutionStatusLogSerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = PollutionStatusLog
        fields = (
            "id",
            "previous_status",
            "new_status",
            "changed_by",
            "comment",
            "changed_at",
        )
        read_only_fields = fields


class PollutionReportListSerializer(serializers.ModelSerializer):
    pollution_type = PollutionTypeSerializer(read_only=True)
    reporter = serializers.StringRelatedField()
    assigned_to = serializers.StringRelatedField()

    class Meta:
        model = PollutionReport
        fields = (
            "id",
            "title",
            "pollution_type",
            "status",
            "latitude",
            "longitude",
            "region",
            "created_at",
            "reporter",
            "assigned_to",
        )


class PollutionReportDetailSerializer(serializers.ModelSerializer):
    pollution_type = PollutionTypeSerializer(read_only=True)
    reporter = serializers.StringRelatedField()
    assigned_to = serializers.StringRelatedField()
    status_logs = PollutionStatusLogSerializer(many=True, read_only=True)
    comments = PollutionCommentSerializer(many=True, read_only=True)

    class Meta:
        model = PollutionReport
        fields = (
            "id",
            "title",
            "description",
            "pollution_type",
            "status",
            "latitude",
            "longitude",
            "region",
            "address",
            "photo",
            "assigned_to",
            "reporter",
            "created_at",
            "updated_at",
            "status_logs",
            "comments",
        )
        read_only_fields = (
            "id",
            "reporter",
            "created_at",
            "updated_at",
            "status_logs",
            "comments",
        )


class PollutionReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollutionReport
        fields = (
            "title",
            "description",
            "pollution_type",
            "latitude",
            "longitude",
            "region",
            "address",
            "photo",
        )

    def create(self, validated_data):
        request = self.context.get("request")
        return PollutionReport.objects.create(
            reporter=request.user,
            **validated_data,
        )


class PollutionReportStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=PollutionReport.STATUS_CHOICES)
    comment = serializers.CharField(allow_blank=True, required=False)
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
    )
