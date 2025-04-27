from rest_framework import serializers
from .models import Country, City

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']

class CitySerializer(serializers.ModelSerializer):
    country = serializers.SlugRelatedField(
        slug_field = 'name',
        queryset = Country.objects.all()
    )

    photo = serializers.ImageField(read_only=True)
    country_code = serializers.ReadOnlyField(source='country.iso_code')

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'slug',
            'country',
            'country_id',
            'country_code',
            'latitude',
            'longitude',
            'photo',
        ]
        read_only_fields = ['slug', 'photo']