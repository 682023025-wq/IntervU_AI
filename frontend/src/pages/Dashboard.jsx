import { TrendingUp, Video, FileText, Award, BookOpen, CheckCircle, Briefcase } from 'lucide-react'
import { Card, Button, Badge } from '../components/UI'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function Dashboard() {
  const stats = [
    { label: 'Interview Selesai', value: '12', icon: Video, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'CV Dibuat', value: '3', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Skor Rata-rata', value: '85', icon: Award, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]
  
  const recentActivities = [
    { id: 1, type: 'interview', title: 'Mock Interview - Software Engineer', date: '2 jam yang lalu', score: 88 },
    { id: 2, type: 'cv', title: 'CV Updated', date: '1 hari yang lalu', score: null },
    { id: 3, type: 'interview', title: 'Mock Interview - Product Manager', date: '3 hari yang lalu', score: 82 },
  ]

  const tutorialSteps = [
    { 
      step: 1, 
      title: 'Lengkapi CV Profesional', 
      description: 'Isi data CV Anda sebagai baseline. AI akan menganalisis dan memberikan skor awal untuk mengukur kesiapan Anda.',
      icon: FileText,
      link: '/cv',
      linkText: 'Isi CV Sekarang'
    },
    { 
      step: 2, 
      title: 'Simulasi Wawancara AI', 
      description: 'Latihan interview dengan Dual AI (Gemini & Groq). Dapatkan feedback real-time untuk jawaban, kontak mata, dan gesture.',
      icon: Video,
      link: '/interview',
      linkText: 'Mulai Simulasi'
    },
    { 
      step: 3, 
      title: 'Revisi CV & Cari Tempat Kerja', 
      description: 'Terima saran perbaikan CV otomatis pasca-interview, dan temukan lowongan dengan skor kecocokan AI yang akurat.',
      icon: Briefcase,
      link: '/jobs',
      linkText: 'Cari Lowongan'
    },
  ]

  return (
    <div className="space-y-6 pb-0">
      {/* Welcome Section */}
      <div className="mb-0 px-3 sm:px-4 md:px-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Selamat datang! Berikut ringkasan aktivitas Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 w-full mb-0 px-3 sm:px-4 md:px-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-1.5 sm:p-2 md:p-3 lg:p-4 hover:shadow-md transition-shadow h-full w-full flex flex-col min-h-[70px] sm:min-h-[80px] md:min-h-[90px]">
              <div className="flex-1 min-w-0 w-full">
                
                {/* Label */}
                <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-600 truncate mb-0.5 sm:mb-1 leading-tight">
                  {stat.label}
                </p>
                
                {/* Value & Icon Row */}
                <div className="flex items-center justify-between w-full">
                  {/* Teks di kiri */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight break-words max-w-[65%]">
                    {stat.value}
                  </p>
                  
                  {/* Ikon di kanan */}
                  <div className={`${stat.bg} p-1 sm:p-1.5 lg:p-2 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${stat.color}`} />
                  </div>
                </div>                
                
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tutorial Section - Panduan Menggunakan Aplikasi (Carousel) */}
      <Card className="p-2 sm:p-3 md:p-4 pb-0 mb-0 mx-2 sm:mx-3 md:mx-0">
        <div className="flex items-center justify-between w-full mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary-600 mr-1.5 sm:mr-2" />
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">Panduan Menggunakan IntervU AI</h2>
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={8}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 12 },
            }}
            className="pb-6 sm:pb-8"
          >
            {tutorialSteps.map((item, index) => {
              return (
                <SwiperSlide key={item.step}>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-2 sm:p-3 border border-primary-200 flex flex-col max-w-sm mx-auto min-h-[120px] sm:min-h-[130px] md:min-h-[140px] h-full">
                    <div className="flex items-start mb-1.5 sm:mb-2">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
                        {item.step}
                      </span>
                      <div className="ml-1.5 sm:ml-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-1.5 sm:mb-2 line-clamp-2 flex-1 leading-snug">{item.description}</p>
                    <a 
                      href={item.link}
                      className="inline-flex items-center text-[10px] sm:text-xs text-primary-600 font-medium hover:text-primary-700 mt-auto pt-0.5"
                    >
                      {item.linkText} →
                    </a>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-2 sm:p-3 md:p-4 mb-0 mx-2 sm:mx-3 md:mx-0">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">Aktivitas Terbaru</h2>
          <Button variant="outline" size="sm" className="text-[10px] sm:text-xs flex-shrink-0">Lihat Semua</Button>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
          {recentActivities.map((activity) => {
            // Konfigurasi ikon & warna dinamis berdasarkan tipe aktivitas
            const getIconConfig = () => {
              switch (activity.type) {
                case 'interview':
                  return { icon: Video, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
                case 'cv':
                  return { icon: FileText, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
                default:
                  return { icon: FileText, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
              }
            };

            const { icon: IconComponent, bgColor, iconColor } = getIconConfig();

            return (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 min-w-0 flex-1">
                  {/* Ikon */}
                  <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${bgColor}`}>
                    <IconComponent className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${iconColor}`} />
                  </div>
                  
                  {/* Konten Teks */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-[10px] sm:text-xs md:text-sm truncate leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-[8px] sm:text-[9px] md:text-xs text-gray-400 mt-0.5">{activity.date}</p>
                  </div>
                </div>
                
                {/* Badge dinamis di kanan */}
                <div className="flex-shrink-0 ml-1.5 sm:ml-2">
                  {activity.type === 'interview' && activity.score && (
                    <Badge variant="success" className="text-[8px] sm:text-[9px] px-1.5 py-0.5">
                      Skor: {activity.score}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  )
}