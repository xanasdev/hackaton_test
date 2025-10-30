from django.db import models


class PollutionType(models.Model):
    """Справочник типов загрязнений."""

    name = models.CharField("Название", max_length=120, unique=True)
    description = models.TextField("Описание", blank=True)

    class Meta:
        ordering = ("name",)
        verbose_name = "Тип загрязнения"
        verbose_name_plural = "Типы загрязнений"

    def __str__(self) -> str:
        return self.name


class Marker(models.Model):
    """Метка на карте с координатами и типом региона."""

    latitude = models.CharField("Широта", max_length=64)
    longitude = models.CharField("Долгота", max_length=64)
    description = models.TextField("Описание", blank=True)
    region_type = models.CharField("Тип региона", max_length=100)
    pollution_type = models.ForeignKey(
        PollutionType,
        on_delete=models.PROTECT,
        related_name="markers",
        verbose_name="Тип загрязнения",
    )
    created_at = models.DateTimeField("Создано", auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Метка"
        verbose_name_plural = "Метки"

    def __str__(self) -> str:
        return f"Метка {self.latitude}, {self.longitude}"


class MarkerPhoto(models.Model):
    """Фотографии, прикреплённые к метке загрязнения."""

    marker = models.ForeignKey(
        Marker,
        on_delete=models.CASCADE,
        related_name="photos",
        verbose_name="Метка",
    )
    image_path = models.CharField("Путь к изображению", max_length=255)
    uploaded_at = models.DateTimeField("Загружено", auto_now_add=True)

    class Meta:
        ordering = ("uploaded_at",)
        verbose_name = "Фотография метки"
        verbose_name_plural = "Фотографии меток"

    def __str__(self) -> str:
        return f"Photo for marker {self.marker_id}"
