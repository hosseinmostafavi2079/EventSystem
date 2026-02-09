from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import Event, Lecturer, Ticket, Category
from .serializers import EventSerializer, LecturerSerializer, TicketSerializer, CategorySerializer
# اگر مدل Transaction دارید: from payments.models import Transaction

# --- ویوهای اصلی ---
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [IsAdminUser] # اگر خواستید فقط ادمین ببیند

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer

class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user, status='paid').order_by('-purchase_date')

# --- آمار ادمین (حفظ شد) ---
class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        total_events = Event.objects.count()
        total_users = User.objects.count()
        total_tickets = Ticket.objects.filter(status='paid').count()
        # total_income = ... (محاسبه درآمد مثل قبل)
        return Response({
            'total_events': total_events,
            'total_users': total_users,
            'total_tickets': total_tickets,
            'total_income': 0
        })