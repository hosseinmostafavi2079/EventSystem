from rest_framework import serializers
from .models import Event, Lecturer, Ticket, Category

# --- سریالایزر دسته‌بندی ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug']

# --- سریالایزر مدرس ---
class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = ['id', 'name', 'specialty', 'bio', 'image']

# --- سریالایزر رویداد ---
class EventSerializer(serializers.ModelSerializer):
    # برای خواندن (GET): آبجکت کامل را برمی‌گرداند (مثلاً شامل عکس مدرس)
    lecturer_details = LecturerSerializer(source='lecturer', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 
            'category', 'category_details', # هم ID را داریم هم جزئیات
            'lecturer', 'lecturer_details', 
            'start_time', 'location', 'price', 
            'capacity', 'image', 'is_active', 'created_at'
        ]
        extra_kwargs = {
            'category': {'write_only': True}, # هنگام نوشتن فقط ID می‌گیریم
            'lecturer': {'write_only': True}
        }

# --- سریالایزر تیکت ---
class TicketSerializer(serializers.ModelSerializer):
    # رویداد را کامل نشان می‌دهیم تا در پنل کاربر عکس و عنوان دیده شود
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'event', 'status', 'ticket_code', 'purchase_date']