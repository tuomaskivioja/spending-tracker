from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/upload_csv/', views.upload_csv, name='upload_csv'),
    path('api/monthly_spending/', views.get_monthly_spending, name='get_monthly_spending'),
]