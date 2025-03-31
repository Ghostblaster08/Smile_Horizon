from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Patient, MedicalHistory, Medication, Document
from .serializers import (
    PatientSerializer, MedicalHistorySerializer, MedicationSerializer, DocumentSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patients (list, create, retrieve, update, delete).
    """
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Apply search and filter queries dynamically.
        """
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', '')
        status_filter = self.request.query_params.get('status', '')

        if search_query:
            queryset = queryset.filter(
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(contact_number__icontains=search_query) |
                Q(email__icontains=search_query)
            )

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage a patient's medical history.
    """
    queryset = MedicalHistory.objects.all().order_by('-diagnosis_date')
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]


class MedicationViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patient medications.
    """
    queryset = Medication.objects.all().order_by('-prescribed_date')
    serializer_class = MedicationSerializer
    permission_classes = [IsAuthenticated]


class DocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patient documents (X-rays, reports, etc.).
    """
    queryset = Document.objects.all().order_by('-upload_date')
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
