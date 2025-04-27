from django.urls import path
from .views import country_list, country_detail, city_list, city_detail, driving_distance

urlpatterns = [
    path('countries/', country_list, name='country-list'),
    path('countries/<int:pk>/', country_detail, name='country-detail'),
    path('cities/', city_list, name='city-list'),
    path('cities/<int:pk>/', city_detail, name='city-detail'),
    path('distance/', driving_distance, name='driving-distance'),
]