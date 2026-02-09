import { MapPinIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function EventCard({ event }) {
  // محاسبه درصد پر شدن ظرفیت (برای نوار رنگی پایین کارت)
  // فعلا چون دیتای فروش واقعی نداریم، یک عدد رندوم یا ثابت می‌گذاریم
  const sold = Math.floor(Math.random() * event.capacity); 
  const percent = Math.round((sold / event.capacity) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* بخش تصویر */}
      <div className="relative h-48 w-full">
        <img 
          src={event.image_url || "https://placehold.co/600x400"} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-700">
          {event.category || 'آموزشی'}
        </div>
        <button className="absolute top-3 left-3 p-1.5 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-700 hover:text-red-500">
          <HeartIcon className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
          {Number(event.price).toLocaleString()} تومان
        </div>
      </div>

      {/* بخش اطلاعات */}
      <div className="p-5">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{event.location}</span>
            </div>
            <span>{new Date(event.start_time).toLocaleDateString('fa-IR')}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
        
        {/* نوار ظرفیت */}
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>ظرفیت تکمیل شده</span>
                <span className="text-blue-600 font-bold">٪{percent}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>

        {/* دکمه رزرو */}
        <button className="w-full mt-4 py-2.5 border border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <span>رزرو بلیط</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </button>
      </div>
    </div>
  );
}