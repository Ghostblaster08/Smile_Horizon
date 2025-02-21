from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

class User(AbstractUser):
    """
    Extended User model to handle both patients and doctors
    """
    ROLE_CHOICES = (
        ('DOCTOR', 'Doctor'),
        ('PATIENT', 'Patient'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)