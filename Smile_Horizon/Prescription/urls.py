from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, PrescriptionViewSet, PrescribedMedicineViewSet

# Create a router to automatically generate URL patterns for ViewSets
router = DefaultRouter()
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'prescribed-medicines', PrescribedMedicineViewSet, basename='prescribed-medicine')

urlpatterns = [
    path('api/', include(router.urls)),
]
