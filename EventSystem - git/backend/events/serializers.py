from rest_framework import serializers
from .models import Event, Lecturer, Ticket

class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = ['id', 'name', 'specialty', 'image', 'bio']

class EventSerializer(serializers.ModelSerializer):
    lecturer = LecturerSerializer(read_only=True)
    class Meta:
        model = Event
        fields = '__all__'

# --- تغییر مهم: رویداد به صورت کامل داخل بلیط قرار می‌گیرد ---
class TicketSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)  # <--- این خط جدید است (Nested)
    
    class Meta:
        model = Ticket
        fields = ['id', 'event', 'status', 'ticket_code', 'purchase_date']