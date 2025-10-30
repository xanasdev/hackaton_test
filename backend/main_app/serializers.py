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
    pollution_type = PollutionTypeSerializer(read_only=True)
    pollution_type_name = serializers.CharField(write_only=True)
    photos = MarkerPhotoSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Marker
        fields = (
            "id",
            "latitude",
            "longitude",
            "description",
            "region_type",
            "pollution_type",
            "pollution_type_name",
            "photos",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        pollution_type_name = validated_data.pop("pollution_type_name")
        photos_data = self.context.get('photos', [])

        try:
            pollution_type = PollutionType.objects.get(name=pollution_type_name)
        except PollutionType.DoesNotExist:
            raise serializers.ValidationError({"pollution_type_name": f"Тип загрязнения '{pollution_type_name}' не найден"})

        marker = Marker.objects.create(pollution_type=pollution_type, **validated_data)

        for photo_data in photos_data:
            MarkerPhoto.objects.create(marker=marker, **photo_data)

        return marker

    def update(self, instance, validated_data):
        pollution_type_name = validated_data.pop("pollution_type_name", None)
        photos_data = self.context.get('photos', None)

        if pollution_type_name:
            try:
                pollution_type = PollutionType.objects.get(name=pollution_type_name)
                instance.pollution_type = pollution_type
            except PollutionType.DoesNotExist:
                raise serializers.ValidationError({"pollution_type_name": f"Тип загрязнения '{pollution_type_name}' не найден"})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if photos_data is not None:
            instance.photos.all().delete()
            for photo_data in photos_data:
                MarkerPhoto.objects.create(marker=instance, **photo_data)

        return instance