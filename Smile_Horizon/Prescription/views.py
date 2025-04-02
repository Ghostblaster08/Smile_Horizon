from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Medicine, Prescription, PrescribedMedicine
from .serializers import (
    MedicineSerializer, 
    PrescriptionSerializer, 
    PrescribedMedicineSerializer,
    SimplePrescriptionSerializer,
    PrescriptionCreateFromTreatmentSerializer
)
from Patient.models import Patient


class MedicineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medicines.
    """
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Medicine.objects.all().order_by('name')
        if self.request.query_params.get('active_only') == 'true':
            queryset = queryset.filter(is_active=True)
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search medicines by name"""
        search_term = request.query_params.get('term', '')
        if search_term:
            medicines = Medicine.objects.filter(name__icontains=search_term)
            serializer = self.get_serializer(medicines, many=True)
            return Response(serializer.data)
        return Response([])


class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing prescriptions.
    """
    queryset = Prescription.objects.all().order_by('-prescription_date')
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.AllowAny]  # This allows any user to access this endpoint
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SimplePrescriptionSerializer
        elif self.action == 'create_from_treatment':
            return PrescriptionCreateFromTreatmentSerializer
        return PrescriptionSerializer
    
    def get_queryset(self):
        queryset = Prescription.objects.all().order_by('-prescription_date')
        
        # Filter by patient ID
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
            
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(prescription_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(prescription_date__lte=end_date)
            
        return queryset
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def create_from_treatment(self, request):
        """
        Create a prescription directly from patient treatment data.
        This endpoint handles the format sent from patientdetails.jsx
        """
        # Add some debug output to help diagnose issues
        print("Received data:", request.data)
        
        serializer = PrescriptionCreateFromTreatmentSerializer(data=request.data)
        if serializer.is_valid():
            prescription = serializer.save()
            return Response(
                PrescriptionSerializer(prescription).data, 
                status=status.HTTP_201_CREATED
            )
        
        # Print validation errors for debugging
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_medicine(self, request, pk=None):
        """
        Add a medicine to an existing prescription.
        """
        prescription = self.get_object()
        
        # Get medicine (create if needed)
        medicine_name = request.data.get('medicine_name')
        if not medicine_name:
            return Response(
                {"error": "Medicine name is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        medicine, created = Medicine.objects.get_or_create(
            name=medicine_name,
            defaults={'description': request.data.get('description', '')}
        )
        
        # Create the prescribed medicine
        prescribed_medicine = PrescribedMedicine.objects.create(
            prescription=prescription,
            medicine=medicine,
            dosage=request.data.get('dosage', 'As directed'),
            frequency=request.data.get('frequency', 'As needed'),
            duration=request.data.get('duration', 'As required'),
            special_instructions=request.data.get('special_instructions', '')
        )
        
        return Response(
            PrescribedMedicineSerializer(prescribed_medicine).data,
            status=status.HTTP_201_CREATED
        )


class PrescribedMedicineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing prescribed medicines.
    """
    queryset = PrescribedMedicine.objects.all()
    serializer_class = PrescribedMedicineSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def mark_as_taken(self, request, pk=None):
        """Mark a prescribed medicine as taken"""
        prescribed_medicine = self.get_object()
        prescribed_medicine.is_taken = True
        prescribed_medicine.save()
        return Response(
            PrescribedMedicineSerializer(prescribed_medicine).data
        )
    
    @action(detail=True, methods=['post'])
    def unmark_as_taken(self, request, pk=None):
        """Unmark a prescribed medicine as taken"""
        prescribed_medicine = self.get_object()
        prescribed_medicine.is_taken = False
        prescribed_medicine.save()
        return Response(
            PrescribedMedicineSerializer(prescribed_medicine).data
        )
