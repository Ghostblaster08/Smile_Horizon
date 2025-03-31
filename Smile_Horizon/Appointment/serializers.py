from rest_framework import serializers
from .models import Appointment, TreatmentRecord
from Patient.models import Patient



from rest_framework import serializers
from .models import Appointment, Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["first_name", "last_name"]

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True)  # Used to accept patient name
    patient = PatientSerializer(read_only=True)  # Use PatientSerializer here

    class Meta:
        model = Appointment
        fields = ["id", "patient_name", "patient", "appointment_date", "appointment_time", "reason"]

    def create(self, validated_data):
        patient_name = validated_data.pop("patient_name")
        first_name, last_name = patient_name.split(" ", 1)  # Split to get first_name and last_name
        
        # Get or create patient based on first_name and last_name
        patient, created = Patient.objects.get_or_create(first_name=first_name, last_name=last_name)

        # Create the appointment with the existing/new patient
        appointment = Appointment.objects.create(patient=patient, **validated_data)
        return appointment




class TreatmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentRecord
        fields = '_all_'
        
