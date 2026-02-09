"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPinIcon, UserIcon, CalendarIcon, ClockIcon, TicketIcon } from '@heroicons/react/24/solid';

export default function EventDetail({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // دریافت آیدی از آدرس صفحه
  const { id } = params; 

  useEffect(() => {
    // دریافت اطلاعات تکمیلی رویداد
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

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!event) return <div className="text-center py-20">رویداد یافت نشد!</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20" dir="rtl">
      
      {/* --- هدر عکس بزرگ (Hero) --- */}
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

      {/* --- محتوای اصلی --- */}
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ستون راست: توضیحات */}
        <div className="lg:col-span-2 space-y-8">
            {/* باکس درباره رویداد */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                    درباره رویداد
                </h2>
                <p className="text-gray-600 leading-8 text-justify whitespace-pre-line">
                    {event.description || "توضیحاتی برای این رویداد ثبت نشده است."}
                </p>
            </div>

            {/* باکس مدرس */}
            {event.lecturer && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-6 items-center">
                    <img 
                        src={event.lecturer.image || "https://placehold.co/100x100"} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                        alt={event.lecturer.name} 
                    />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{event.lecturer.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-2">{event.lecturer.specialty}</p>
                        <p className="text-gray-500 text-sm line-clamp-2">{event.lecturer.bio}</p>
                    </div>
                </div>
            )}
        </div>

        {/* ستون چپ: باکس خرید (Sticky) */}
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
                            <ClockIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold">ساعت</span>
                        </div>
                        <span className="text-sm font-medium">
                            {new Date(event.start_time).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600">
                            <TicketIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold">ظرفیت باقی‌مانده</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{event.capacity} نفر</span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95">
                    خرید بلیت و ثبت‌نام
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