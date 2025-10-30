from rest_framework import serializers

from .models import Marker, MarkerPhoto, PollutionType


class PollutionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollutionType
        fields = ("id", "name", "description")


class MarkerPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarkerPhoto
        fields = ("id", "image_path", "uploaded_at")
        read_only_fields = ("id", "uploaded_at")


class MarkerSerializer(serializers.ModelSerializer):
    pollution_type = PollutionTypeSerializer()
    photos = MarkerPhotoSerializer(many=True, required=False)

    class Meta:
        model = Marker
        fields = (
            "id",
            "latitude",
            "longitude",
            "description",
            "region_type",
            "pollution_type",
            "photos",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        pollution_type_data = validated_data.pop("pollution_type")
        photos_data = validated_data.pop("photos", [])

        pollution_type, created = PollutionType.objects.get_or_create(
            name=pollution_type_data["name"],
            defaults={"description": pollution_type_data.get("description", "")},
        )
        if not created and "description" in pollution_type_data:
            # Обновим описание, если пришло новое значение
            description = pollution_type_data.get("description")
            if description and description != pollution_type.description:
                pollution_type.description = description
                pollution_type.save(update_fields=["description"])

        marker = Marker.objects.create(pollution_type=pollution_type, **validated_data)

        for photo_data in photos_data:
            MarkerPhoto.objects.create(marker=marker, **photo_data)

        return marker

    def update(self, instance, validated_data):
        pollution_type_data = validated_data.pop("pollution_type", None)
        photos_data = validated_data.pop("photos", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if pollution_type_data:
            pollution_type, created = PollutionType.objects.get_or_create(
                name=pollution_type_data["name"],
                defaults={"description": pollution_type_data.get("description", "")},
            )
            if not created and "description" in pollution_type_data:
                description = pollution_type_data.get("description")
                if description and description != pollution_type.description:
                    pollution_type.description = description
                    pollution_type.save(update_fields=["description"])
            instance.pollution_type = pollution_type

        instance.save()

        if photos_data is not None:
            instance.photos.all().delete()
            for photo_data in photos_data:
                MarkerPhoto.objects.create(marker=instance, **photo_data)

        return instance
