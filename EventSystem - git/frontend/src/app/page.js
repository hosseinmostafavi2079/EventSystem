"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دریافت اطلاعات از بک‌ند
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FD]" dir="rtl">
      {/* --- هدر ساده --- */}
      <header className="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">R</div>
                <h1 className="text-xl font-bold text-gray-800">رویداد<span className="text-blue-600">پرو</span></h1>
            </div>
            <div className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
                <a href="#" className="text-blue-600">خانه</a>
                <a href="#" className="hover:text-blue-600">رویدادها</a>
                <a href="#" className="hover:text-blue-600">تماس با ما</a>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                ورود / ثبت نام
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* --- عنوان و توضیحات --- */}
        <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">رویدادهای برگزیده</h2>
            <p className="text-gray-500">محبوب‌ترین رویدادهای این هفته را از دست ندهید</p>
        </div>

        {/* --- نوار جستجو (طبق عکس) --- */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto mb-16">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 ml-2" />
                <input type="text" placeholder="جستجو در نام رویداد یا مکان..." className="bg-transparent w-full py-3 outline-none text-gray-700 text-sm placeholder-gray-400" />
            </div>
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border-r border-gray-100 md:border-r-0">
                <CalendarIcon className="w-6 h-6 text-gray-400 ml-2" />
                <input type="text" placeholder="همه دسته‌بندی‌ها" className="bg-transparent w-full py-3 outline-none text-gray-700 text-sm placeholder-gray-400" />
            </div>
             <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition">
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </button>
        </div>

        {/* --- لیست رویدادها --- */}
        {loading ? (
             <div className="text-center py-20 text-gray-400">در حال دریافت اطلاعات...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        )}
      </main>
    </div>
  );
}