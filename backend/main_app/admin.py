from django.contrib import admin

from .models import PollutionComment, PollutionReport, PollutionStatusLog, PollutionType


@admin.register(PollutionType)
class PollutionTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    search_fields = ("name", "slug")
    list_filter = ("is_active",)


@admin.register(PollutionReport)
class PollutionReportAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "pollution_type",
        "status",
        "region",
        "created_at",
    )
    search_fields = ("title", "description", "region")
    list_filter = ("status", "pollution_type__name", "region")
    raw_id_fields = ("reporter", "assigned_to")
    readonly_fields = ("created_at", "updated_at")


@admin.register(PollutionStatusLog)
class PollutionStatusLogAdmin(admin.ModelAdmin):
    list_display = (
        "report",
        "previous_status",
        "new_status",
        "changed_by",
        "changed_at",
    )
    search_fields = ("report__title", "comment")
    list_filter = ("new_status", "changed_at")
    raw_id_fields = ("report", "changed_by")


@admin.register(PollutionComment)
class PollutionCommentAdmin(admin.ModelAdmin):
    list_display = ("report", "author", "created_at")
    search_fields = ("text", "report__title", "author__username")
    list_filter = ("created_at",)
    raw_id_fields = ("report", "author")
