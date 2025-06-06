# Generated by Django 5.2 on 2025-04-24 09:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Name your trip', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='When the itinerary was created')),
                ('end_city', models.ForeignKey(help_text='Where the trip ends', on_delete=django.db.models.deletion.PROTECT, related_name='ending_itineraries', to='app.city')),
                ('start_city', models.ForeignKey(help_text='Where the trip starts', on_delete=django.db.models.deletion.PROTECT, related_name='starting_itineraries', to='app.city')),
            ],
        ),
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveSmallIntegerField(help_text='position in the trip (1-5)')),
                ('city', models.ForeignKey(help_text='The city to visit', on_delete=django.db.models.deletion.PROTECT, to='app.city')),
                ('itinerary', models.ForeignKey(help_text='the trip this stop belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='stops', to='app.itinerary')),
            ],
            options={
                'ordering': ('order',),
                'unique_together': {('itinerary', 'order')},
            },
        ),
    ]
