from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, TreatmentRecordViewSet

# Create a router for the API endpoints
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'treatment-records', TreatmentRecordViewSet, basename='treatment-record')

urlpatterns = [
    path('api/', include(router.urls)),  # Include API routes
]
