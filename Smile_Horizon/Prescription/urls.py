from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'prescriptions', views.PrescriptionViewSet, basename='prescription')
router.register(r'medicines', views.MedicineViewSet, basename='medicine')
router.register(r'prescribed-medicines', views.PrescribedMedicineViewSet, basename='prescribed-medicine')

urlpatterns = [
    path('api/', include(router.urls)),
]
