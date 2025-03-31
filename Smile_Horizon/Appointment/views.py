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
