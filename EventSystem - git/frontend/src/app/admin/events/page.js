"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت لیست رویدادها
  const fetchEvents = () => {
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // تابع حذف رویداد
  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این رویداد مطمئن هستید؟')) return;

    const token = localStorage.getItem('access_token');
    try {
        await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('رویداد با موفقیت حذف شد');
        fetchEvents(); // بروزرسانی لیست
    } catch (err) {
        toast.error('خطا در حذف رویداد');
    }
  };

  return (
    <div>
      {/* هدر صفحه */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800">مدیریت رویدادها</h1>
        <Link 
            href="/admin/events/create" 
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
            <PlusIcon className="w-5 h-5" />
            افزودن رویداد جدید
        </Link>
      </div>

      {/* جدول لیست */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center text-gray-500">در حال بارگذاری...</div>
        ) : (
            <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-sm">
                    <tr>
                        <th className="p-5">تصویر</th>
                        <th className="p-5">عنوان رویداد</th>
                        <th className="p-5">تاریخ</th>
                        <th className="p-5">قیمت</th>
                        <th className="p-5">ظرفیت</th>
                        <th className="p-5 text-center">عملیات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {events.map(event => (
                        <tr key={event.id} className="hover:bg-gray-50/50 transition">
                            <td className="p-4">
                                <img 
                                    src={event.image_url || "https://placehold.co/100x100"} 
                                    className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                                    alt={event.title}
                                />
                            </td>
                            <td className="p-4 font-bold text-gray-800">{event.title}</td>
                            <td className="p-4 text-sm text-gray-500">
                                {new Date(event.start_time).toLocaleDateString('fa-IR')}
                            </td>
                            <td className="p-4 font-bold text-gray-700">
                                {Number(event.price).toLocaleString()}
                            </td>
                            <td className="p-4 text-sm">
                                {event.capacity} نفر
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(event.id)}
                                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        
        {!loading && events.length === 0 && (
            <div className="p-10 text-center text-gray-400">هیچ رویدادی یافت نشد.</div>
        )}
      </div>
    </div>
  );
}