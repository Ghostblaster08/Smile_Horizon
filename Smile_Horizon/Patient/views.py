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

# <<<<<<< naya-branch

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
# =======

# def patient_list(request):
#     search_query = request.GET.get('search', '')
#     status_filter = request.GET.get('status', '')
    
#     patients = Patient.objects.all()
    
#     if search_query:
#         patients = patients.filter(
#             Q(first_name__icontains=search_query) | 
#             Q(last_name__icontains=search_query) | 
#             Q(contact_number__icontains=search_query) | 
#             Q(email__icontains=search_query)
#         )
    
#     if status_filter:
#         patients = patients.filter(status=status_filter)
        
#     context = {
#         'patients': patients,
#         'search_query': search_query,
#         'status_filter': status_filter,
#         'status_choices': Patient.STATUS_CHOICES,
#     }
    
#     return render(request, 'patient/patient_list.html', context)


# def patient_detail(request, pk):
#     patient = get_object_or_404(Patient, pk=pk)
#     medical_histories = patient.medical_histories.all()
#     current_medications = patient.medications.filter(status='CURRENT')
#     past_medications = patient.medications.filter(status='PAST')
#     documents = patient.documents.all()
#     appointments = patient.appointments.all().order_by('-appointment_date')
#     treatment_records = patient.treatment_records.all().order_by('-date_of_treatment')
    
#     context = {
#         'patient': patient,
#         'medical_histories': medical_histories,
#         'current_medications': current_medications,
#         'past_medications': past_medications,
#         'documents': documents,
#         'appointments': appointments,
#         'treatment_records': treatment_records,
#     }
    
#     return render(request, 'patient/patient_detail.html', context)

# def patient_create(request):
#     if request.method == 'POST':
#         form = PatientForm(request.POST)
#         if form.is_valid():
#             patient = form.save()
#             # Verify the patient exists in the database
#             test_patient = Patient.objects.filter(id=patient.id).first()
#             if test_patient:
#                 print(f"Patient saved successfully with ID: {test_patient.id}")
#             else:
#                 print("Patient was not saved to database!")
#             return redirect('patient_detail', pk=patient.pk)
#     else:
#         form = PatientForm()
    
#     return render(request, 'patient/patient_form.html', {'form': form, 'title': 'Add New Patient'})


# def patient_update(request, pk):
#     patient = get_object_or_404(Patient, pk=pk)
    
#     if request.method == 'POST':
#         form = PatientForm(request.POST, instance=patient)
#         if form.is_valid():
#             patient = form.save()
#             return redirect('patient_detail', pk=patient.pk)
#     else:
#         form = PatientForm(instance=patient)
    
#     return render(request, 'patient/patient_form.html', {'form': form, 'title': 'Edit Patient', 'patient': patient})
# >>>>>>> main
