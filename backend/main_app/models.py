from django.conf import settings
from django.db import models


class PollutionType(models.Model):
    """Справочник типов загрязнений."""

    slug = models.SlugField(max_length=80, unique=True)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("name",)
        verbose_name = "Тип загрязнения"
        verbose_name_plural = "Типы загрязнений"

    def __str__(self) -> str:
        return self.name


class PollutionReport(models.Model):
    """Сообщение о загрязнении, созданное пользователем."""

    STATUS_NEW = "new"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_RESOLVED = "resolved"

    STATUS_CHOICES = (
        (STATUS_NEW, "Новая"),
        (STATUS_IN_PROGRESS, "В работе"),
        (STATUS_RESOLVED, "Очищено"),
    )

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pollution_reports",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    pollution_type = models.ForeignKey(
        PollutionType,
        on_delete=models.PROTECT,
        related_name="reports",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    region = models.CharField(max_length=150, blank=True)
    address = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW,
    )
    photo = models.ImageField(upload_to="pollutions/", blank=True, null=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_reports",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Сообщение о загрязнении"
        verbose_name_plural = "Сообщения о загрязнении"

    def __str__(self) -> str:
        return f"{self.title} ({self.get_status_display()})"


class PollutionStatusLog(models.Model):
    """История изменений статуса сообщения."""

    report = models.ForeignKey(
        PollutionReport,
        on_delete=models.CASCADE,
        related_name="status_logs",
    )
    previous_status = models.CharField(max_length=20, choices=PollutionReport.STATUS_CHOICES)
    new_status = models.CharField(max_length=20, choices=PollutionReport.STATUS_CHOICES)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pollution_status_changes",
    )
    comment = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-changed_at",)
        verbose_name = "История статусов"
        verbose_name_plural = "Истории статусов"

    def __str__(self) -> str:
        return f"{self.report_id}: {self.previous_status} -> {self.new_status}"


class PollutionComment(models.Model):
    """Комментарии к сообщению о загрязнении."""

    report = models.ForeignKey(
        PollutionReport,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pollution_comments",
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at",)
        verbose_name = "Комментарий к загрязнению"
        verbose_name_plural = "Комментарии к загрязнениям"

    def __str__(self) -> str:
        return f"Комментарий {self.author_id} к отчету {self.report_id}"
