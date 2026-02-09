"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  UsersIcon, 
  CalendarDaysIcon, 
  TicketIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/solid';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_events: 0,
    total_users: 0,
    total_tickets: 0,
    total_income: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // دریافت آمار از سرور
    axios.get('http://127.0.0.1:8000/api/admin/stats/', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        setStats(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  const cards = [
    { title: 'درآمد کل', value: `${Number(stats.total_income).toLocaleString()} تومان`, icon: BanknotesIcon, color: 'bg-green-500', shadow: 'shadow-green-200' },
    { title: 'تعداد رویدادها', value: stats.total_events, icon: CalendarDaysIcon, color: 'bg-blue-500', shadow: 'shadow-blue-200' },
    { title: 'بلیط‌های فروخته شده', value: stats.total_tickets, icon: TicketIcon, color: 'bg-purple-500', shadow: 'shadow-purple-200' },
    { title: 'کاربران عضو', value: stats.total_users, icon: UsersIcon, color: 'bg-orange-500', shadow: 'shadow-orange-200' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-8">داشبورد مدیریت</h1>

      {loading ? (
          <div className="text-center py-20">در حال بارگذاری آمار...</div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition duration-300">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${card.color} ${card.shadow}`}>
                        <card.icon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold mb-1">{card.title}</p>
                        <h3 className="text-xl font-black text-gray-800">{card.value}</h3>
                    </div>
                </div>
            ))}
          </div>
      )}

      {/* بخش نمودار یا لیست‌های اخیر (جای خالی) */}
      <div className="mt-8 bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-400">
          <p>نمودار فروش ۳۰ روز گذشته (به زودی...)</p>
      </div>
    </div>
  );
}