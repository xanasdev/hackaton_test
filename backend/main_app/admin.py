from django.contrib import admin

from .models import Marker, MarkerPhoto, PollutionType


@admin.register(PollutionType)
class PollutionTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
    list_display = (
        "latitude",
        "longitude",
        "region_type",
        "pollution_type",
        "created_at",
    )
    search_fields = ("latitude", "longitude", "region_type", "description")
    list_filter = ("pollution_type", "region_type")
    readonly_fields = ("created_at",)


@admin.register(MarkerPhoto)
class MarkerPhotoAdmin(admin.ModelAdmin):
    list_display = ("marker", "image", "uploaded_at")
    search_fields = ("image", "marker__region_type")
    list_filter = ("uploaded_at",)
    raw_id_fields = ("marker",)
