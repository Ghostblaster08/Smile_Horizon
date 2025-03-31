from rest_framework import serializers
from .models import Appointment, TreatmentRecord

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'  # Serialize all fields

class TreatmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentRecord
        fields = '__all__'
