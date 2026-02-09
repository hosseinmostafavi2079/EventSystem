import { MapPinIcon, UserIcon } from '@heroicons/react/24/solid'; // نسخه توپر (Solid)
import { HeartIcon } from '@heroicons/react/24/outline'; // قلب توخالی (برای لایک)
import Link from 'next/link';

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* بخش تصویر */}
      <div className="relative h-52 w-full">
        <img 
          src={event.image_url || "https://placehold.co/600x400"} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* بج دسته‌بندی شیشه‌ای */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
          {event.category || 'آموزشی'}
        </div>

        {/* دکمه لایک */}
        <Link href={`/events/${event.id}`} className="block">
        <button className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white border border-white/20 rounded-full transition-all text-white hover:text-red-500">
          <HeartIcon className="w-5 h-5" />
        </button>
        </Link>
      </div>
       

      {/* بخش اطلاعات */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
             <span className={`text-xs font-bold px-2 py-1 rounded-lg ${event.mode === 'virtual' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                {event.mode === 'virtual' ? 'مجازی / آنلاین' : 'حضوری'}
             </span>
             <div className="flex items-center gap-1 text-gray-400 text-xs">
                <MapPinIcon className="w-4 h-4 text-gray-300" />
                <span>{event.location}</span>
            </div>
        </div>

        <h3 className="text-lg font-black text-gray-800 mb-2 leading-snug line-clamp-2 min-h-[3.5rem]">
            {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <UserIcon className="w-4 h-4 text-gray-300" />
            <span>مدرس: {event.lecturer ? event.lecturer.name : 'نامشخص'}</span>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-gray-50 my-4"></div>

        <div className="flex justify-between items-center">
            <div>
                <span className="block text-xs text-gray-400 mb-1">قیمت بلیت</span>
                <span className="text-lg font-black text-gray-800">
                    {Number(event.price).toLocaleString()} <span className="text-xs font-normal text-gray-500">تومان</span>
                </span>
            </div>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-400 transition-all flex items-center gap-2">
                ثبت نام
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
}