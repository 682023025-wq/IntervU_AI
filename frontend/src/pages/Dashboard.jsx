import { TrendingUp, Video, FileText, Award, BookOpen, CheckCircle, Briefcase } from 'lucide-react'
import { Card, Button, Badge } from '../components/UI'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-2 md:p-3 rounded-lg`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tutorial Section - Panduan Menggunakan Aplikasi */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-600 mr-2" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Panduan Menggunakan IntervU AI</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutorialSteps.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="relative">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 h-full border border-primary-200">
                  <div className="flex items-start mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </span>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-3">{item.description}</p>
                  <a 
                    href={item.link}
                    className="inline-flex items-center text-xs md:text-sm text-primary-600 font-medium hover:text-primary-700"
                  >
                    {item.linkText} →
                  </a>
                </div>
                {index < tutorialSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">{activity.title}</p>
                    <p className="text-xs md:text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                {activity.score && (
                  <Badge variant="success">Score: {activity.score}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Jobs */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Lowongan Rekomendasi</h2>
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{job.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{job.company} • {job.location}</p>
                  <p className="text-xs text-gray-500 mt-1">Diposting {job.posted}</p>
                </div>
                <Button size="sm">Lamar</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
