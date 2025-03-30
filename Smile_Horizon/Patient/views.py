from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Patient, MedicalHistory, Medication, Document
from .forms import PatientForm, MedicalHistoryForm, MedicationForm, DocumentForm


def patient_list(request):
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')
    
    patients = Patient.objects.all()
    
    if search_query:
        patients = patients.filter(
            Q(first_name__icontains=search_query) | 
            Q(last_name__icontains=search_query) | 
            Q(contact_number__icontains=search_query) | 
            Q(email__icontains=search_query)
        )
    
    if status_filter:
        patients = patients.filter(status=status_filter)
        
    context = {
        'patients': patients,
        'search_query': search_query,
        'status_filter': status_filter,
        'status_choices': Patient.STATUS_CHOICES,
    }
    
    return render(request, 'patient/patient_list.html', context)


def patient_detail(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    medical_histories = patient.medical_histories.all()
    current_medications = patient.medications.filter(status='CURRENT')
    past_medications = patient.medications.filter(status='PAST')
    documents = patient.documents.all()
    appointments = patient.appointments.all().order_by('-appointment_date')
    treatment_records = patient.treatment_records.all().order_by('-date_of_treatment')
    
    context = {
        'patient': patient,
        'medical_histories': medical_histories,
        'current_medications': current_medications,
        'past_medications': past_medications,
        'documents': documents,
        'appointments': appointments,
        'treatment_records': treatment_records,
    }
    
    return render(request, 'patient/patient_detail.html', context)

def patient_create(request):
    if request.method == 'POST':
        form = PatientForm(request.POST)
        if form.is_valid():
            patient = form.save()
            # Verify the patient exists in the database
            test_patient = Patient.objects.filter(id=patient.id).first()
            if test_patient:
                print(f"Patient saved successfully with ID: {test_patient.id}")
            else:
                print("Patient was not saved to database!")
            return redirect('patient_detail', pk=patient.pk)
    else:
        form = PatientForm()
    
    return render(request, 'patient/patient_form.html', {'form': form, 'title': 'Add New Patient'})


def patient_update(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    
    if request.method == 'POST':
        form = PatientForm(request.POST, instance=patient)
        if form.is_valid():
            patient = form.save()
            return redirect('patient_detail', pk=patient.pk)
    else:
        form = PatientForm(instance=patient)
    
    return render(request, 'patient/patient_form.html', {'form': form, 'title': 'Edit Patient', 'patient': patient})