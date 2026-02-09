from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.views import EventViewSet, LecturerViewSet
from django.conf import settings
from django.conf.urls.static import static

# ساخت روتر خودکار برای APIها
router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'lecturers', LecturerViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # همه APIها با پیشوند /api/ شروع می‌شوند
]

# تنظیمات نمایش عکس‌های آپلود شده
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)