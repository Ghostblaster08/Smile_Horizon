from rest_framework import serializers
from .models import Medicine, Prescription, PrescribedMedicine


class MedicineSerializer(serializers.ModelSerializer):
    """
    Serializer for the Medicine model.
    """
    class Meta:
        model = Medicine
        fields = '__all__'


class PrescribedMedicineSerializer(serializers.ModelSerializer):
    """
    Serializer for the PrescribedMedicine model.
    """
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)

    class Meta:
        model = PrescribedMedicine
        fields = ['id', 'prescription', 'medicine', 'medicine_name', 'dosage', 'frequency', 'duration', 'special_instructions']


class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Prescription model.
    """
    prescribed_medicines = PrescribedMedicineSerializer(many=True, source='prescribedmedicine_set', read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'treatment_record', 'notes', 'created_at', 'updated_at', 'patient_name', 'prescribed_medicines']

    def get_patient_name(self, obj):
        """
        Get the patient's full name from the appointment or treatment record.
        """
        if obj.appointment:
            return f"{obj.appointment.patient.first_name} {obj.appointment.patient.last_name}"
        elif obj.treatment_record:
            return f"{obj.treatment_record.patient.first_name} {obj.treatment_record.patient.last_name}"
        return "Unknown Patient"
