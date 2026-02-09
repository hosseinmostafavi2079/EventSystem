"use client";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MapPinIcon, UserIcon, CalendarIcon, ClockIcon, TicketIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../../../context/AuthContext'; // مسیر کانتکست
import toast, { Toaster } from 'react-hot-toast'; // برای نمایش پیام
import { useRouter } from 'next/navigation';

export default function EventDetail({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false); // وضعیت دکمه خرید
  
  const { user } = useContext(AuthContext); // دریافت اطلاعات کاربر
  const router = useRouter();
  const { id } = params; 

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/events/${id}/`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // --- تابع خرید بلیط ---
  const handlePurchase = async () => {
    if (!user) {
        toast.error('برای خرید بلیط ابتدا وارد شوید');
        setTimeout(() => router.push('/login'), 1500);
        return;
    }

    setPurchasing(true);
    const token = localStorage.getItem('access_token');

    try {
        await axios.post('http://127.0.0.1:8000/api/purchase/', 
            { event_id: event.id },
            { headers: { Authorization: `Bearer ${token}` } } // ارسال توکن
        );
        
        toast.success('خرید با موفقیت انجام شد! 🎉');
        // در آینده اینجا کاربر را به صفحه "بلیط‌های من" می‌بریم
        setPurchasing(false);
    } catch (err) {
        toast.error(err.response?.data?.error || 'خطا در انجام تراکنش');
        setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!event) return <div className="text-center py-20">رویداد یافت نشد!</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20" dir="rtl">
      <Toaster position="top-center" />
      
      {/* --- هدر عکس --- */}
      <div className="relative h-[400px] w-full">
        <img 
            src={event.image_url || "https://placehold.co/1200x500"} 
            className="w-full h-full object-cover" 
            alt={event.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 w-full">
            <div className="max-w-6xl mx-auto px-4 pb-10 text-white">
                <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm font-bold mb-4 inline-block">
                    {event.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight shadow-black drop-shadow-lg">
                    {event.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium text-gray-200">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-blue-400" />
                        <span>مدرس: {event.lecturer ? event.lecturer.name : 'نامشخص'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-400" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ستون راست (توضیحات) */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                    درباره رویداد
                </h2>
                <p className="text-gray-600 leading-8 text-justify whitespace-pre-line">
                    {event.description || "توضیحاتی ثبت نشده است."}
                </p>
            </div>
        </div>

        {/* ستون چپ (باکس خرید) */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-1">قیمت بلیت</p>
                    <div className="text-3xl font-black text-gray-900">
                        {Number(event.price).toLocaleString()} <span className="text-sm font-normal text-gray-500">تومان</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold">تاریخ برگزاری</span>
                        </div>
                        <span className="text-sm font-medium">{new Date(event.start_time).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600">
                            <TicketIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold">ظرفیت کل</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{event.capacity} نفر</span>
                    </div>
                </div>

                <button 
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
                        purchasing 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02]'
                    }`}
                >
                    {purchasing ? 'در حال پردازش...' : 'خرید بلیت و ثبت‌نام'}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                    گارانتی بازگشت وجه در صورت لغو رویداد
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}