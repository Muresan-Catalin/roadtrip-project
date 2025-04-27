from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Country, City
from .serializers import CountrySerializer, CitySerializer
from django.conf import settings
from openai import OpenAI, OpenAIError

@api_view(['GET', 'POST'])
def country_list(request):
    if request.method == 'GET':
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)
    
    #POST
    serializer = CountrySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def country_detail(request, pk):

    try:
        country = Country.objects.get(pk=pk)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CountrySerializer(country)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    country.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def city_list(request):

    if request.method == 'GET':
        cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)

    # POST
    serializer = CitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def city_detail(request, pk):

    try:
        city = City.objects.get(pk=pk)
    except City.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CitySerializer(city)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = CitySerializer(city, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    city.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


client = OpenAI(
    api_key=settings.DEEPSEEK_API_KEY,
    base_url=settings.DEEPSEEK_API_BASE
)

@api_view(['POST'])
def driving_distance(request):
    """
    POST payload: { "city_a": "Prague", "city_b": "Hamburg" }
    Returns: { "distance_km": "XXX" }
    """
    city_a = request.data.get('city_a')
    city_b = request.data.get('city_b')
    if not city_a or not city_b:
        return Response(
            {"detail": "Both city_a and city_b are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    prompt = f"What is the driving distance from {city_a} to {city_b} in km? Only respond with the value!"

    try:
        resp = client.chat.completions.create(
            model="deepseek-chat",
           messages=[{"role": "user", "content": prompt}],
       )
        # extract and strip out any whitespace/newlines
        distance = resp.choices[0].message.content.strip()
        return Response({"distance_km": distance})
    except openai.OpenAIError as e:
        return Response(
            {"detail": f"DeepSeek API error: {e}"},
            status=status.HTTP_502_BAD_GATEWAY
        )