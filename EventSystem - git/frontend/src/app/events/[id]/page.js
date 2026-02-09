"use client";
import { useEffect, useState, useContext, use } from 'react';
import axios from 'axios';
import { MapPinIcon, UserIcon, CalendarIcon, ClockIcon, TicketIcon, ShareIcon, HeartIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../../../context/AuthContext'; 
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header'; // <--- هدر ایمپورت شد

export default function EventDetail({ params }) {
  const { id } = use(params); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (id) {
        axios.get(`http://127.0.0.1:8000/api/events/${id}/`)
        .then(res => { setEvent(res.data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [id]);

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
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('خرید با موفقیت انجام شد! 🎉');
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

  if (!event) return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header />
        <div className="text-center py-20 font-bold text-gray-500">رویداد یافت نشد!</div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20" dir="rtl">
      <Toaster position="top-center" />
      
      {/* --- اضافه شدن هدر سایت --- */}
      <Header />

      {/* --- هدر و عکس رویداد --- */}
      <div className="w-full bg-white md:bg-transparent">
          <div className="max-w-7xl mx-auto md:px-4 md:pt-6">
            <div className="relative h-[300px] md:h-[450px] w-full md:rounded-3xl overflow-hidden shadow-sm md:shadow-xl group">
                <img 
                    src={event.image_url || "https://placehold.co/1200x500"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={event.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:via-black/20"></div>
                
                <div className="absolute bottom-0 w-full p-6 md:p-10 text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs md:text-sm font-bold mb-3 inline-block shadow-lg">
                                {event.category}
                            </span>
                            <h1 className="text-2xl md:text-5xl font-black mb-4 leading-tight shadow-black drop-shadow-md">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 md:gap-8 text-sm md:text-base font-medium text-gray-200">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-blue-300" />
                                    <span>مدرس: {event.lecturer ? event.lecturer.name : 'نامشخص'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                                    <MapPinIcon className="w-5 h-5 text-red-400" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden md:flex gap-3">
                            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition">
                                <HeartIcon className="w-6 h-6 text-white" />
                            </button>
                            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition">
                                <ShareIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* توضیحات */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-100"></span>
                    درباره این رویداد
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-8 text-justify whitespace-pre-line">
                    {event.description || "توضیحات تکمیلی برای این رویداد ثبت نشده است."}
                </div>
            </div>

            {event.lecturer && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-right">
                    <img 
                        src={event.lecturer.image || "https://placehold.co/100x100"} 
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-50 shadow-md"
                        alt={event.lecturer.name} 
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.lecturer.name}</h3>
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                            {event.lecturer.specialty}
                        </span>
                        <p className="text-gray-500 text-sm leading-6">{event.lecturer.bio}</p>
                    </div>
                </div>
            )}
        </div>

        {/* باکس خرید Sticky */}
        <div className="lg:col-span-4 sticky top-24 self-start">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <p className="text-gray-400 text-sm font-medium mb-2">قیمت نهایی بلیت</p>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-black text-gray-900 tracking-tight">
                            {Number(event.price).toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-gray-500 mt-2">تومان</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 text-gray-600">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold">تاریخ</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{new Date(event.start_time).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 text-gray-600">
                            <ClockIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold">ساعت</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                            {new Date(event.start_time).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-gray-600">
                            <TicketIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold">ظرفیت</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{event.capacity} نفر</span>
                    </div>
                </div>

                <button 
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                        purchasing 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-blue-600/40'
                    }`}
                >
                    {purchasing ? (
                        <>در حال پردازش...</>
                    ) : (
                        'خرید بلیت و شرکت'
                    )}
                </button>
            </div>
        </div>

      </main>
    </div>
  );
}