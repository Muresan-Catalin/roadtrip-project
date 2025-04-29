from django.db import models
from django.utils.text import slugify

class Country(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Country name"

    )
    iso_code = models.CharField(
        max_length=2,
        unique=True,
        help_text="RO, US ..."
    )

    def __str__(self):
        return self.name
    
class City(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="City name"
    )

    slug = models.SlugField(
        max_length=100,
        unique=True,
        help_text="URL friendly identifier"
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='cities',
        help_text="The country that the city belongs to"
    )

    photo = models.ImageField(
        upload_to='cities/',
        blank=True,
        null=True,
        help_text='Upload image of city'
    )

    interestPoints = models.CharField(
        max_length=200,
        help_text="3 interest points divided by ,",
        null=True,
        blank=True
    )

    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.name}, {self.country.name}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Itinerary(models.Model):

    title = models.CharField(
        max_length=50,
        help_text='Name your trip'
    )

    start_city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name='starting_itineraries',
        help_text='Where the trip starts'
    )

    end_city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name='ending_itineraries',
        help_text='Where the trip ends'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When the itinerary was created'
    )

    def __str__(self):
        return f"{self.title}, ({self.start_city} -> {self.end_city})"
    
class Stop(models.Model):
    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE,
        related_name='stops',
        help_text='the trip this stop belongs to'
    )

    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        help_text='The city to visit'
    )

    order = models.PositiveSmallIntegerField(
        help_text="position in the trip (1-5)"
    )

    class Meta:
        unique_together = ("itinerary", "order")
        ordering = ("order",)

        def __str__(self):
            return f"{self.order}. {self.city}"
        
