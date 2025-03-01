from django.db import models
from Appointment.models import Appointment, TreatmentRecord

class Medicine(models.Model):
    """
    Model to store commonly prescribed medicines
    """
    name = models.CharField(max_length=200)
    description = models.TextField()
    dosage_instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Prescription(models.Model):
    """
    Model to store prescriptions given after appointments
    """
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    treatment_record = models.OneToOneField(TreatmentRecord, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    medicines = models.ManyToManyField(Medicine, through='PrescribedMedicine')
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        patient_name = self.appointment.patient if self.appointment else self.treatment_record.patient
        date = self.created_at.date()
        return f"Prescription for {patient_name} on {date}"

class PrescribedMedicine(models.Model):
    """
    Through model for Prescription and Medicine with specific instructions
    """
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    special_instructions = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.medicine.name} - {self.dosage}"