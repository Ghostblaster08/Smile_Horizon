from django.db import models
from Appointment.models import Appointment

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

class Prescription(models.Model):
    """
    Model to store prescriptions given after appointments
    """
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    medicines = models.ManyToManyField(Medicine, through='PrescribedMedicine')
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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