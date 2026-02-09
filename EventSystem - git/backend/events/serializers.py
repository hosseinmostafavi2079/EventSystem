from rest_framework import serializers
from .models import Event, Lecturer, Ticket

class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = ['id', 'name', 'specialty', 'image', 'bio']

class EventSerializer(serializers.ModelSerializer):
    # اینجا می‌گوییم به جای ID استاد، کل مشخصاتش را بفرست
    lecturer = LecturerSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__' # یعنی همه فیلدها (عنوان، قیمت، ظرفیت و...) را بفرست

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'event', 'status', 'ticket_code', 'purchase_date']
        read_only_fields = ['ticket_code', 'purchase_date']