import { TrendingUp, Video, FileText, Award, BookOpen, CheckCircle, Briefcase } from 'lucide-react'
import { Card, Button, Badge } from '../components/UI'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Dashboard() {
  const stats = [
    { label: 'Interview Selesai', value: '12', icon: Video, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'CV Dibuat', value: '3', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Lamaran Dikirim', value: '8', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Skor Rata-rata', value: '85', icon: Award, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]
  
  const recentActivities = [
    { id: 1, type: 'interview', title: 'Mock Interview - Software Engineer', date: '2 jam yang lalu', score: 88 },
    { id: 2, type: 'cv', title: 'CV Updated', date: '1 hari yang lalu', score: null },
    { id: 3, type: 'interview', title: 'Mock Interview - Product Manager', date: '3 hari yang lalu', score: 82 },
  ]

  const upcomingJobs = [
    { id: 1, title: 'Frontend Developer', company: 'Tech Startup', location: 'Remote', posted: '2 jam lalu' },
    { id: 2, title: 'Full Stack Engineer', company: 'E-commerce Company', location: 'Jakarta', posted: '5 jam lalu' },
    { id: 3, title: 'Software Developer', company: 'FinTech Corp', location: 'Bandung', posted: '1 hari lalu' },
  ]

  const tutorialSteps = [
    { 
      step: 1, 
      title: 'Buat CV Anda', 
      description: 'Mulai dengan membuat CV profesional menggunakan CV Builder kami',
      icon: FileText,
      link: '/cv',
      linkText: 'Buat CV Sekarang'
    },
    { 
      step: 2, 
      title: 'Latihan Interview', 
      description: 'Latih kemampuan interview Anda dengan AI Mock Interview',
      icon: Video,
      link: '/interview',
      linkText: 'Mulai Interview'
    },
    { 
      step: 3, 
      title: 'Cari Lowongan', 
      description: 'Temukan lowongan pekerjaan yang sesuai dengan profil Anda',
      icon: Briefcase,
      link: '/jobs',
      linkText: 'Lihat Lowongan'
    },
    { 
      step: 4, 
      title: 'Lamar Pekerjaan', 
      description: 'Gunakan CV dan hasil interview untuk melamar pekerjaan',
      icon: CheckCircle,
      link: '/profile',
      linkText: 'Lengkapi Profil'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang! Berikut ringkasan aktivitas Anda.</p>
      </div>

      {/* Stats Grid - Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tutorial Section - Panduan Menggunakan Aplikasi (Carousel) */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-600 mr-2" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Panduan Menggunakan IntervU AI</h2>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="pb-12"
        >
          {tutorialSteps.map((item, index) => {
            const Icon = item.icon
            return (
              <SwiperSlide key={item.step}>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 h-full border border-primary-200">
                  <div className="flex items-start mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </span>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <a 
                    href={item.link}
                    className="inline-flex items-center text-sm text-primary-600 font-medium hover:text-primary-700"
                  >
                    {item.linkText} →
                  </a>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Activities */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'interview' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'interview' ? (
                      <Video className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{activity.title}</p>
                    <p className="text-xs md:text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                {activity.score && (
                  <Badge variant="success" className="flex-shrink-0 ml-2">Score: {activity.score}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
