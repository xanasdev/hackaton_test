from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PollutionReportViewSet, PollutionTypeViewSet

router = DefaultRouter()
router.register(r"pollution-types", PollutionTypeViewSet, basename="pollution-type")
router.register(r"reports", PollutionReportViewSet, basename="pollution-report")

urlpatterns = [
    path("", include(router.urls)),
]
