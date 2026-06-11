import { TrendingUp, Video, FileText, Award, Clock, Users } from 'lucide-react'
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang! Berikut ringkasan aktivitas Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'interview' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'interview' ? (
                      <Video className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                {activity.score && (
                  <Badge variant="success">Score: {activity.score}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-24 flex flex-col space-y-2" variant="primary">
              <Video className="w-8 h-8" />
              <span>Mulai Interview</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="secondary">
              <FileText className="w-8 h-8" />
              <span>Buat CV Baru</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="secondary">
              <TrendingUp className="w-8 h-8" />
              <span>Cari Lowongan</span>
            </Button>
            <Button className="h-24 flex flex-col space-y-2" variant="secondary">
              <Award className="w-8 h-8" />
              <span>Lihat Skor</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Lowongan Rekomendasi</h2>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </div>
        <div className="space-y-4">
          {upcomingJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="text-xs text-gray-500 mt-1">Diposting {job.posted}</p>
              </div>
              <Button size="sm">Lamar</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}