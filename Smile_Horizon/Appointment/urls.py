from django.urls import path
from . import views

urlpatterns = [
    path('', views.appointment_list, name='appointment_list'),
    path('create/', views.appointment_create, name='appointment_create'),
    path('<int:pk>/update/', views.appointment_update, name='appointment_update'),
    path('<int:pk>/check-in/', views.appointment_check_in, name='appointment_check_in'),
    path('<int:appointment_pk>/treatment-record/create/', views.treatment_record_create, name='treatment_record_create'),
]