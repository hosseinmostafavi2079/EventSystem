from rest_framework import viewsets, generics
from rest_framework.views import APIView # <--- این باید باشد
from rest_framework.response import Response # <--- این باید باشد
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User # <--- حیاتی
from django.db.models import Sum # <--- حیاتی
from .models import Event, Lecturer, Ticket
from .serializers import EventSerializer, LecturerSerializer, TicketSerializer
from payments.models import Transaction # <--- حیاتی (آدرس دقیق مدل تراکنش)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer

class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user, status='paid').order_by('-purchase_date')

# --- ویوی جدید آمار ---
class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_events = Event.objects.count()
        total_users = User.objects.count()
        total_tickets = Ticket.objects.filter(status='paid').count()
        
        # محاسبه درآمد
        total_income = 0
        # روش امن برای جمع زدن (اگر تراکنش دارید)
        transactions = Transaction.objects.filter(is_successful=True)
        if transactions.exists():
             total_income = transactions.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'total_events': total_events,
            'total_users': total_users,
            'total_tickets': total_tickets,
            'total_income': total_income
        })