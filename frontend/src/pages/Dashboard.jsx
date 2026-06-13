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
      <div className="mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang! Berikut ringkasan aktivitas Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full mb-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow h-full w-full flex flex-col">
              <div className="flex-1 min-w-0 w-full">
                
                {/* Label */}
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mb-1 sm:mb-2">
                  {stat.label}
                </p>
                
                {/* Value & Icon Row */}
                <div className="flex items-center justify-between w-full">
                  {/* Teks di kiri */}
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight break-words">
                    {stat.value}
                  </p>
                  
                  {/* Ikon di kanan */}
                  <div className={`${stat.bg} p-2 sm:p-3 lg:p-4 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                  </div>
                </div>                
                
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tutorial Section - Panduan Menggunakan Aplikasi (Carousel) */}
      <Card className="p-4 md:p-6 pb-0 mb-0">
        <div className="flex items-center justify-between w-full mb-4 md:mb-6">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-600 mr-2 md:mr-3" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Panduan Menggunakan IntervU AI</h2>
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="pb-0"
          >
            {tutorialSteps.map((item, index) => {
              return (
                <SwiperSlide key={item.step}>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200 flex flex-col max-w-sm mx-auto min-h-[160px] md:min-h-[160px] h-full">
                    <div className="flex items-start mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </span>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">{item.description}</p>
                                          {item.linkText} →
                  </div>
                  <div>
                  <a 
                      href={item.link}
                      className="inline-flex items-center text-sm text-primary-600 font-medium hover:text-primary-700 mt-8"
                    >
                    </a>
                    </div>
                  
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-4 md:p-6 mb-0">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </div>
        
        <div className="space-y-3 md:space-y-4">
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
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                  {/* Ikon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${bgColor}`}>
                    <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
                  </div>
                  
                  {/* Konten Teks */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
                  </div>
                </div>
                
                {/* Badge dinamis di kanan */}
                <div className="flex-shrink-0 ml-2">
                  {activity.type === 'interview' && activity.score && (
                    <Badge variant="success" className="text-xs">
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