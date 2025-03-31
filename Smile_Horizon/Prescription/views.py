from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Medicine, Prescription, PrescribedMedicine
from .serializers import MedicineSerializer, PrescriptionSerializer, PrescribedMedicineSerializer


class MedicineViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage commonly prescribed medicines.
    """
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]


class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage prescriptions given after appointments.
    """
    queryset = Prescription.objects.all().order_by('-created_at')
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter prescriptions by appointment or treatment record if provided.
        """
        queryset = super().get_queryset()
        appointment_id = self.request.query_params.get('appointment_id')
        treatment_record_id = self.request.query_params.get('treatment_record_id')

        if appointment_id:
            queryset = queryset.filter(appointment__id=appointment_id)
        if treatment_record_id:
            queryset = queryset.filter(treatment_record__id=treatment_record_id)

        return queryset


class PrescribedMedicineViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage prescribed medicines within a prescription.
    """
    queryset = PrescribedMedicine.objects.all()
    serializer_class = PrescribedMedicineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter prescribed medicines by prescription if provided.
        """
        queryset = super().get_queryset()
        prescription_id = self.request.query_params.get('prescription_id')

        if prescription_id:
            queryset = queryset.filter(prescription__id=prescription_id)

        return queryset
