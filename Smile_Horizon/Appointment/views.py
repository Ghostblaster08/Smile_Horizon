from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Appointment, TreatmentRecord
from .serializers import AppointmentSerializer, TreatmentRecordSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing Appointments
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['appointment_date', 'status', 'doctor', 'patient']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name']
    ordering_fields = ['appointment_date', 'appointment_time']
    
    def perform_create(self, serializer):
        """Assigns the logged-in user as the doctor when creating an appointment."""
        serializer.save(doctor=self.request.user)

    @action(detail=True, methods=['PATCH'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        Custom endpoint to update the appointment status.
        """
        appointment = get_object_or_404(Appointment, pk=pk)
        new_status = request.data.get('status')

        if not new_status:
            return Response({"error": "Status field is required"}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()
        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_200_OK)


class TreatmentRecordViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing Treatment Records
    """
    queryset = TreatmentRecord.objects.all()
    serializer_class = TreatmentRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'doctor', 'date_of_treatment']
    search_fields = ['patient__first_name', 'doctor__first_name']
    ordering_fields = ['date_of_treatment']

    def perform_create(self, serializer):
        """Assigns the logged-in user as the doctor when creating a treatment record."""
        serializer.save(doctor=self.request.user)
# =======
# def appointment_list(request):
#     # Get the selected date from the query parameters or default to today
#     selected_date_str = request.GET.get('date', date.today().strftime('%Y-%m-%d'))
#     try:
#         selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()
#     except ValueError:
#         selected_date = date.today()
    
#     # Get all appointments for the selected date
#     appointments = Appointment.objects.filter(appointment_date=selected_date).order_by('appointment_time')
    
#     context = {
#         'appointments': appointments,
#         'selected_date': selected_date,
#         'prev_date': selected_date - timedelta(days=1),
#         'next_date': selected_date + timedelta(days=1),
#     }
    
#     return render(request, 'appointment/appointment_list.html', context)


# def appointment_create(request):
#     # Get patient_id from query parameters if coming from patient detail page
#     patient_id = request.GET.get('patient_id', None)
#     initial_data = {}
    
#     if patient_id:
#         try:
#             patient = Patient.objects.get(id=patient_id)
#             initial_data = {'patient': patient}
#         except Patient.DoesNotExist:
#             pass
    
#     if request.method == 'POST':
#         form = AppointmentForm(request.POST)
#         if form.is_valid():
#             appointment = form.save(commit=False)
#             appointment.doctor = request.user  # Assuming the logged-in user is the doctor
#             appointment.save()
#             messages.success(request, 'Appointment created successfully')
            
#             # Redirect to the appointments list for that date
#             return redirect('appointment_list') + f'?date={appointment.appointment_date}'
#     else:
#         form = AppointmentForm(initial=initial_data)
    
#     context = {
#         'form': form,
#         'title': 'Create New Appointment'
#     }
    
#     return render(request, 'appointment/appointment_form.html', context)

# def appointment_update(request, pk):
#     appointment = get_object_or_404(Appointment, pk=pk)
    
#     if request.method == 'POST':
#         form = AppointmentForm(request.POST, instance=appointment)
#         if form.is_valid():
#             form.save()
#             messages.success(request, 'Appointment updated successfully')
#             return redirect('appointment_list') + f'?date={appointment.appointment_date}'
#     else:
#         form = AppointmentForm(instance=appointment)
    
#     context = {
#         'form': form,
#         'title': 'Update Appointment',
#         'appointment': appointment
#     }
    
#     return render(request, 'appointment/appointment_form.html', context)

# def appointment_check_in(request, pk):
#     appointment = get_object_or_404(Appointment, pk=pk)
#     appointment.status = 'CHECKED_IN'
#     appointment.save()
#     messages.success(request, f'Patient {appointment.patient} checked in successfully')
#     return redirect('appointment_list') + f'?date={appointment.appointment_date}'


# def treatment_record_create(request, appointment_pk):
#     appointment = get_object_or_404(Appointment, pk=appointment_pk)
    
#     if request.method == 'POST':
#         form = TreatmentRecordForm(request.POST)
#         if form.is_valid():
#             treatment_record = form.save(commit=False)
#             treatment_record.patient = appointment.patient
#             treatment_record.doctor = request.user
#             treatment_record.appointment = appointment
#             treatment_record.date_of_treatment = appointment.appointment_date
#             treatment_record.save()
            
#             # Update appointment status to completed
#             appointment.status = 'COMPLETED'
#             appointment.save()
            
#             messages.success(request, 'Treatment record created successfully')
#             return redirect('patient_detail', pk=appointment.patient.pk)
#     else:
#         form = TreatmentRecordForm()
    
#     context = {
#         'form': form,
#         'title': 'Create Treatment Record',
#         'appointment': appointment
#     }
    
#     return render(request, 'appointment/treatment_record_form.html', context)
# >>>>>>> main
