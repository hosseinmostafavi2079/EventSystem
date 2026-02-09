from django.db import models
from django.contrib.auth.models import User
import uuid

# مدل اساتید (طبق عکس مدیریت اساتید)
class Lecturer(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام و نام خانوادگی")
    specialty = models.CharField(max_length=100, verbose_name="تخصص")
    bio = models.TextField(verbose_name="بیوگرافی", blank=True)
    image = models.ImageField(upload_to='lecturers/', verbose_name="تصویر استاد")
    
    def __str__(self):
        return self.name

# مدل رویدادها (طبق عکس ایجاد رویداد)
class Event(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان رویداد")
    lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, verbose_name="مدرس / سخنران")
    
    # دسته‌بندی
    CATEGORY_CHOICES = [
        ('educational', 'آموزشی'),
        ('concert', 'کنسرت'),
        ('conference', 'همایش'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="دسته‌بندی")
    
    # نحوه برگزاری
    MODE_CHOICES = [
        ('in_person', 'حضوری'),
        ('virtual', 'مجازی / آنلاین'),
    ]
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='in_person', verbose_name="نحوه برگزاری")
    location = models.CharField(max_length=300, verbose_name="مکان برگزاری / لینک اسکای‌روم")
    
    # زمان و ظرفیت
    start_time = models.DateTimeField(verbose_name="تاریخ و ساعت شروع")
    capacity = models.PositiveIntegerField(verbose_name="ظرفیت کل")
    price = models.PositiveIntegerField(default=0, verbose_name="قیمت بلیت (تومان)")
    
    # اطلاعات تکمیلی
    image_url = models.URLField(blank=True, verbose_name="لینک تصویر (طبق عکس)")
    # یا اگر آپلود فایل خواستید: image = models.ImageField(...) 
    
    description = models.TextField(verbose_name="توضیحات تکمیلی", blank=True)
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "رویداد"
        verbose_name_plural = "رویدادها"

    def __str__(self):
        return self.title

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده / نهایی'),
        ('cancelled', 'لغو شده'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="کاربر")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets', verbose_name="رویداد")
    
    # کد یکتا برای QR Code (مثلاً: 550e8400-e29b...)
    ticket_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="کد یکتا بلیط")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="وضعیت")
    purchase_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ خرید")
    
    # فیلدهای حضور و غیاب (طبق درخواست شما)
    is_checked_in = models.BooleanField(default=False, verbose_name="حاضر شده؟")
    check_in_time = models.DateTimeField(null=True, blank=True, verbose_name="زمان ورود")

    class Meta:
        verbose_name = "بلیط / ثبت‌نام"
        verbose_name_plural = "بلیط‌ها"

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"