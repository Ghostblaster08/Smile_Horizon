from django.db import models
from User.models import User

class Patient(models.Model):
    """
    Patient specific information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_number = models.CharField(max_length=17, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class MedicalHistory(models.Model):
    """
    Patient's medical history records
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    condition = models.CharField(max_length=200)
    diagnosis_date = models.DateField()
    treatment = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Medical histories"

class Document(models.Model):
    """
    Model to store patient documents (reports, x-rays, etc.)
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='patient_documents/')
    document_type = models.CharField(max_length=50)  # X-ray, Report, etc.
    upload_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)