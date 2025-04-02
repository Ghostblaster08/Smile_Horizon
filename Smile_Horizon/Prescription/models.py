from django.db import models
from Appointment.models import Appointment, TreatmentRecord
from Patient.models import Patient
from django.utils import timezone

class Medicine(models.Model):
    """
    Model to store commonly prescribed medicines
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    dosage_instructions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
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
    PRESCRIPTION_STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions', null=True)
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    treatment_record = models.OneToOneField(TreatmentRecord, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    medicines = models.ManyToManyField(Medicine, through='PrescribedMedicine')
    notes = models.TextField(blank=True)
    work_done = models.TextField(blank=True, help_text="Description of dental work performed")
    pending_work = models.TextField(blank=True, help_text="Description of pending dental work")
    status = models.CharField(max_length=20, choices=PRESCRIPTION_STATUS_CHOICES, default='ACTIVE')
    prescription_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        patient_name = self.patient.full_name if self.patient else (
            self.appointment.patient.full_name if self.appointment else 
            self.treatment_record.patient.full_name if self.treatment_record else "Unknown Patient"
        )
        date = self.prescription_date
        return f"Prescription for {patient_name} on {date}"
    
    @property
    def full_prescription_text(self):
        """Return the complete prescription text including all medicines"""
        medicines_text = "\n".join([
            f"- {pm.medicine.name}: {pm.dosage}, {pm.frequency} for {pm.duration}" +
            (f" ({pm.special_instructions})" if pm.special_instructions else "")
            for pm in self.prescribedmedicine_set.all()
        ])
        return f"{medicines_text}\n\nNotes: {self.notes}"
    
    @classmethod
    def create_from_frontend(cls, patient_id, prescription_text=None, work_done=None, pending_work=None):
        """
        Create a prescription from frontend data
        This helps bridge the gap between frontend form data and model structure
        """
        try:
            patient = Patient.objects.get(id=patient_id)
            prescription = cls.objects.create(
                patient=patient,
                notes=prescription_text or "",
                work_done=work_done or "",
                pending_work=pending_work or "",
            )
            return prescription
        except Patient.DoesNotExist:
            raise ValueError(f"Patient with ID {patient_id} does not exist")
        except Exception as e:
            raise Exception(f"Failed to create prescription: {str(e)}")

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
    is_taken = models.BooleanField(default=False, help_text="Whether the patient has taken/completed this medicine")
    
    def __str__(self):
        return f"{self.medicine.name} - {self.dosage}"
    
    @classmethod
    def add_medicine_to_prescription(cls, prescription_id, medicine_name, dosage="As directed", 
                                frequency="As needed", duration="As required", instructions=""):
        """
        Add a medicine to a prescription, creating the medicine if it doesn't exist
        This helps process data from the frontend more easily
        """
        try:
            prescription = Prescription.objects.get(id=prescription_id)
            
            # Try to find existing medicine or create a new one
            medicine, created = Medicine.objects.get_or_create(
                name=medicine_name,
                defaults={
                    'description': f"Added from patient details on {timezone.now().date()}",
                    'dosage_instructions': f"{dosage}, {frequency}, {duration}"
                }
            )
            
            # Create the prescribed medicine record
            prescribed_med = cls.objects.create(
                prescription=prescription,
                medicine=medicine,
                dosage=dosage,
                frequency=frequency,
                duration=duration,
                special_instructions=instructions
            )
            
            return prescribed_med
        except Prescription.DoesNotExist:
            raise ValueError(f"Prescription with ID {prescription_id} does not exist")
        except Exception as e:
            raise Exception(f"Failed to add medicine to prescription: {str(e)}")