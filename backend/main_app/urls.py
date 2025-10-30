from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MarkerViewSet, PollutionTypeViewSet

router = DefaultRouter()
router.register(r"pollution-types", PollutionTypeViewSet, basename="pollution-type")
router.register(r"markers", MarkerViewSet, basename="marker")

urlpatterns = [
    path("", include(router.urls)),
]
