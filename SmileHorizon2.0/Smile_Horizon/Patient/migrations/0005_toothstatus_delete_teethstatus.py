# Generated by Django 5.1.7 on 2025-04-12 11:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0004_remove_patient_allergies'),
    ]

    operations = [
        migrations.CreateModel(
            name='ToothStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tooth_number', models.IntegerField()),
                ('status', models.CharField(default='normal', max_length=20)),
                ('notes', models.TextField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teeth_status', to='Patient.patient')),
            ],
            options={
                'ordering': ['tooth_number'],
                'unique_together': {('patient', 'tooth_number')},
            },
        ),
        migrations.DeleteModel(
            name='TeethStatus',
        ),
    ]
