from rest_framework import viewsets
from .models import Event, Lecturer, Ticket
from .serializers import EventSerializer, LecturerSerializer, TicketSerializer

class EventViewSet(viewsets.ModelViewSet):
    # فقط رویدادهای فعال را نشان بده
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer