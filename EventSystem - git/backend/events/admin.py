from django.contrib import admin
from .models import Lecturer, Event, Ticket

@admin.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty')
    search_fields = ('name', 'specialty')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'lecturer', 'start_time', 'capacity', 'price', 'is_active')
    list_filter = ('is_active', 'category', 'mode')
    search_fields = ('title', 'description')
    date_hierarchy = 'start_time'

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'status', 'ticket_code', 'is_checked_in')
    list_filter = ('status', 'is_checked_in', 'event')
    search_fields = ('user__username', 'ticket_code')
    readonly_fields = ('ticket_code', 'purchase_date')