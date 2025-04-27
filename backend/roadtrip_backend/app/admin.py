from django.contrib import admin
from .models import Country, City, Itinerary, Stop
from django.utils.html import format_html

# Register Country so it shows up
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Register City so it shows up
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'latitude', 'longitude')
    list_filter = ('country',)
    search_fields = ('name',)

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_city', 'end_city', 'created_at')
    list_filter = ('start_city', 'end_city', 'created_at')
    search_fields = ('title', 'start_city__name', 'end_city__name')
    def photo_thumbnail(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="height:50px;"/>',
                obj.photo.url
            )
        return ""
    photo_thumbnail.short_description = 'Photo'


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ('itinerary', 'order', 'city')
    list_filter = ('itinerary',)
    ordering = ('itinerary', 'order')
    search_fields = ('city__name',)
