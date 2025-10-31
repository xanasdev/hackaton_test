from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class StatusChoice(models.Model):
    """Справочник статусов меток."""

    name = models.CharField("Название статуса", max_length=50, unique=True)

    class Meta:
        ordering = ("name",)
        verbose_name = "Статус метки"
        verbose_name_plural = "Статусы меток"

    def __str__(self) -> str:
        return self.name


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

    status_choice = models.ForeignKey(
        StatusChoice,
        on_delete=models.PROTECT,
        related_name="markers",
        verbose_name="Статус метки",
        null=True,
        blank=True,
    )
    latitude = models.CharField("Широта", max_length=64)
    longitude = models.CharField("Долгота", max_length=64)
    description = models.TextField("Описание", blank=True)
    region_type = models.CharField("Тип региона", max_length=100, blank=True, null=True)
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_CLEARED = 'cleared'
    STATUS_CHOICES = (
        (STATUS_IN_PROGRESS, 'В работе'),
        (STATUS_CLEARED, 'Очищено'),
    )
    status = models.CharField(
        "Статус",
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_IN_PROGRESS,
    )
    pollution_type = models.ForeignKey(
        PollutionType,
        on_delete=models.PROTECT,
        related_name="markers",
        verbose_name="Тип загрязнения",
    )
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    creator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="markers",
        verbose_name="Создатель"
    )
    creator_username = models.CharField("Имя создателя", max_length=150, blank=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Метка"
        verbose_name_plural = "Метки"

    def __str__(self) -> str:
        return f"Метка {self.latitude}, {self.longitude}"

    def save(self, *args, **kwargs):
        """Override save to update status statistics when status changes."""
        old_status = None
        if self.pk:
            try:
                old_status = self.__class__.objects.get(pk=self.pk).status
            except self.__class__.DoesNotExist:
                old_status = None

        super().save(*args, **kwargs)

        # Update statistics counters if status changed or record created
        try:
            from .models import MarkerStatusStatistic  # resolve at runtime
        except Exception:
            MarkerStatusStatistic = None

        if MarkerStatusStatistic:
            if old_status != self.status:
                MarkerStatusStatistic.increment(self.status)
                if old_status:
                    MarkerStatusStatistic.decrement(old_status)

    def delete(self, *args, **kwargs):
        # on delete, decrement counter for current status
        status = self.status
        super().delete(*args, **kwargs)
        try:
            from .models import MarkerStatusStatistic
        except Exception:
            MarkerStatusStatistic = None
        if MarkerStatusStatistic:
            MarkerStatusStatistic.decrement(status)


class MarkerPhoto(models.Model):
    """Фотографии, прикреплённые к метке загрязнения."""

    marker = models.ForeignKey(
        Marker,
        on_delete=models.CASCADE,
        related_name="photos",
        verbose_name="Метка",
    )
    image = models.ImageField("Изображение", upload_to='marker_photos/', default='')
    uploaded_at = models.DateTimeField("Загружено", auto_now_add=True)

    class Meta:
        ordering = ("uploaded_at",)
        verbose_name = "Фотография метки"
        verbose_name_plural = "Фотографии меток"

    def __str__(self) -> str:
        return f"Photo for marker {self.marker_id}"


class MarkerComment(models.Model):
    """Короткие сообщения/обсуждения, привязанные к метке."""

    marker = models.ForeignKey(
        Marker,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="Метка",
    )
    creator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="marker_comments",
        verbose_name="Автор",
    )
    message = models.TextField("Сообщение")
    created_at = models.DateTimeField("Отправлено", auto_now_add=True)

    class Meta:
        ordering = ("created_at",)
        verbose_name = "Комментарий к метке"
        verbose_name_plural = "Комментарии к меткам"

    def __str__(self) -> str:
        return f"Comment by {self.creator_id} on marker {self.marker_id}"


class MarkerStatusStatistic(models.Model):
    """Статистика по статусам меток — хранит количество меток в каждом статусе."""

    status = models.CharField("Статус", max_length=30, choices=Marker.STATUS_CHOICES, unique=True)
    count = models.IntegerField("Количество", default=0)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Статистика статусов меток"
        verbose_name_plural = "Статистика статусов меток"

    def __str__(self) -> str:
        return f"{self.get_status_display()}: {self.count}"

    @classmethod
    def increment(cls, status):
        from django.db.models import F
        obj, created = cls.objects.get_or_create(status=status, defaults={'count': 0})
        obj.count = F('count') + 1
        obj.save()
        obj.refresh_from_db()
        return obj

    @classmethod
    def decrement(cls, status):
        from django.db.models import F
        try:
            obj = cls.objects.get(status=status)
            obj.count = F('count') - 1
            obj.save()
            obj.refresh_from_db()
            if obj.count < 0:
                obj.count = 0
                obj.save()
            return obj
        except cls.DoesNotExist:
            # nothing to decrement
            return None

    @classmethod
    def recalc_all(cls):
        """Recalculate all statistics from current Marker table state."""
        from django.db.models import Count
        from .models import Marker
        counts = Marker.objects.values('status').annotate(total=Count('id'))
        # reset existing stats
        cls.objects.all().delete()
        objs = []
        for c in counts:
            objs.append(cls(status=c['status'], count=c['total']))
        if objs:
            cls.objects.bulk_create(objs)
        return cls.objects.all()


