from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from events.models import Event, Ticket
from .models import Transaction

class PurchaseTicketView(APIView):
    permission_classes = [IsAuthenticated] # فقط کاربران لاگین شده

    def post(self, request):
        event_id = request.data.get('event_id')
        user = request.user
        
        # 1. پیدا کردن رویداد
        event = get_object_or_404(Event, id=event_id)

        # 2. چک کردن ظرفیت (تعداد بلیط‌های فروخته شده)
        sold_count = Ticket.objects.filter(event=event, status='paid').count()
        if sold_count >= event.capacity:
            return Response({'error': 'متاسفانه ظرفیت این رویداد تکمیل شده است.'}, status=400)

        # 3. چک کردن خرید تکراری
        if Ticket.objects.filter(user=user, event=event, status='paid').exists():
            return Response({'error': 'شما قبلاً بلیط این رویداد را خریداری کرده‌اید.'}, status=400)

        # 4. صدور بلیط (شبیه‌سازی پرداخت موفق)
        ticket = Ticket.objects.create(
            user=user,
            event=event,
            status='paid' # فرض می‌کنیم پرداخت موفق بوده
        )

        # 5. ثبت در تاریخچه تراکنش‌ها
        Transaction.objects.create(
            user=user,
            amount=event.price,
            description=f"خرید بلیط رویداد: {event.title}",
            is_successful=True
        )

        return Response({
            'message': 'خرید با موفقیت انجام شد!',
            'ticket_code': ticket.ticket_code
        })