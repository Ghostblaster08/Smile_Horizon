from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime, date, timedelta
from .models import Appointment, TreatmentType, TreatmentRecord
from .forms import AppointmentForm, TreatmentRecordForm
from Patient.models import Patient
from User.models import User

def appointment_list(request):
    # Get the selected date from the query parameters or default to today
    selected_date_str = request.GET.get('date', date.today().strftime('%Y-%m-%d'))
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()
    except ValueError:
        selected_date = date.today()
    
    # Get all appointments for the selected date
    appointments = Appointment.objects.filter(appointment_date=selected_date).order_by('appointment_time')
    
    context = {
        'appointments': appointments,
        'selected_date': selected_date,
        'prev_date': selected_date - timedelta(days=1),
        'next_date': selected_date + timedelta(days=1),
    }
    
    return render(request, 'appointment/appointment_list.html', context)


def appointment_create(request):
    # Get patient_id from query parameters if coming from patient detail page
    patient_id = request.GET.get('patient_id', None)
    initial_data = {}
    
    if patient_id:
        try:
            patient = Patient.objects.get(id=patient_id)
            initial_data = {'patient': patient}
        except Patient.DoesNotExist:
            pass
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.doctor = request.user  # Assuming the logged-in user is the doctor
            appointment.save()
            messages.success(request, 'Appointment created successfully')
            
            # Redirect to the appointments list for that date
            return redirect('appointment_list') + f'?date={appointment.appointment_date}'
    else:
        form = AppointmentForm(initial=initial_data)
    
    context = {
        'form': form,
        'title': 'Create New Appointment'
    }
    
    return render(request, 'appointment/appointment_form.html', context)

def appointment_update(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST, instance=appointment)
        if form.is_valid():
            form.save()
            messages.success(request, 'Appointment updated successfully')
            return redirect('appointment_list') + f'?date={appointment.appointment_date}'
    else:
        form = AppointmentForm(instance=appointment)
    
    context = {
        'form': form,
        'title': 'Update Appointment',
        'appointment': appointment
    }
    
    return render(request, 'appointment/appointment_form.html', context)

def appointment_check_in(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    appointment.status = 'CHECKED_IN'
    appointment.save()
    messages.success(request, f'Patient {appointment.patient} checked in successfully')
    return redirect('appointment_list') + f'?date={appointment.appointment_date}'


def treatment_record_create(request, appointment_pk):
    appointment = get_object_or_404(Appointment, pk=appointment_pk)
    
    if request.method == 'POST':
        form = TreatmentRecordForm(request.POST)
        if form.is_valid():
            treatment_record = form.save(commit=False)
            treatment_record.patient = appointment.patient
            treatment_record.doctor = request.user
            treatment_record.appointment = appointment
            treatment_record.date_of_treatment = appointment.appointment_date
            treatment_record.save()
            
            # Update appointment status to completed
            appointment.status = 'COMPLETED'
            appointment.save()
            
            messages.success(request, 'Treatment record created successfully')
            return redirect('patient_detail', pk=appointment.patient.pk)
    else:
        form = TreatmentRecordForm()
    
    context = {
        'form': form,
        'title': 'Create Treatment Record',
        'appointment': appointment
    }
    
    return render(request, 'appointment/treatment_record_form.html', context)