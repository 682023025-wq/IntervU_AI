import { useState } from 'react'
import { User, Mail, Phone, MapPin, Camera, Edit2, Save, Bell, Shield, CreditCard } from 'lucide-react'
import { Card, Button, Input, Badge, Modal } from '../components/UI'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta, Indonesia',
    avatar: null,
    bio: 'Software Engineer dengan pengalaman 3 tahun dalam pengembangan web aplikasi.',
    skills: ['React', 'Node.js', 'Python', 'TypeScript'],
    joinedDate: 'Januari 2024',
  }

  const notifications = {
    email: true,
    push: true,
    interviewReminders: true,
    jobAlerts: false,
    newsletter: false,
  }

  const accountStats = {
    interviewsCompleted: 12,
    cvsCreated: 3,
    jobsApplied: 8,
    averageScore: 85,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Profile Settings</h1>
        <p className="text-xs sm:text-sm text-gray-600">Kelola informasi akun dan preferensi Anda</p>
      </div>

      {/* Tabs - Scrollable on Mobile */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-1 sm:space-x-2 md:space-x-4 min-w-max">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Notifikasi
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Keamanan
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'subscription'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Langganan
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Profile Card */}
          <Card className="p-4 sm:p-5 md:p-6 lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-3 sm:mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400" />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                </button>
              </div>
              <h2 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4">Software Engineer</p>
              <Badge variant="primary">Premium Member</Badge>
              
              <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{userProfile.location}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{userProfile.email}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-[10px] sm:text-xs text-gray-500">Bergabung sejak {userProfile.joinedDate}</p>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="p-4 sm:p-5 md:p-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Informasi Pribadi</h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="w-full sm:w-auto text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                    Batal
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Simpan
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Input
                  label="Nama Lengkap"
                  defaultValue={userProfile.name}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue={userProfile.email}
                  disabled={true}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Nomor Telepon"
                  defaultValue={userProfile.phone}
                  disabled={!isEditing}
                />
                <Input
                  label="Lokasi"
                  defaultValue={userProfile.location}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                  rows="4"
                  defaultValue={userProfile.bio}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="primary" className="text-[10px] sm:text-xs">
                      {skill}
                      {isEditing && (
                        <button className="ml-1 hover:text-red-600">×</button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <button className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-[10px] sm:text-xs hover:bg-gray-200 min-h-[28px] sm:min-h-[32px]">
                      + Tambah Skill
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-6">Preferensi Notifikasi</h2>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Terima notifikasi via email' },
              { key: 'push', label: 'Push Notifications', description: 'Notifikasi browser' },
              { key: 'interviewReminders', label: 'Reminder Interview', description: 'Pengingat jadwal interview' },
              { key: 'jobAlerts', label: 'Job Alerts', description: 'Info lowongan baru yang sesuai' },
              { key: 'newsletter', label: 'Newsletter', description: 'Tips dan artikel mingguan' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={notifications[item.key]} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button>Simpan Preferensi</Button>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-2xl">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Keamanan Akun
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Google Login</h3>
                  <p className="text-sm text-gray-600">john.doe@example.com</p>
                </div>
                <Badge variant="success">Terverifikasi</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Hubungkan Akun Google Lainnya
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Session Aktif</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Chrome - Windows</h3>
                  <p className="text-sm text-gray-600">Jakarta, Indonesia • Sekarang</p>
                </div>
                <Badge variant="primary">Session Ini</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Chrome Mobile - Android</h3>
                  <p className="text-sm text-gray-600">Jakarta, Indonesia • 2 hari lalu</p>
                </div>
                <Button variant="danger" size="sm">Logout</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 max-w-3xl">
          {/* Current Plan */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Premium Plan</h2>
                <p className="text-gray-600">Berlangganan aktif hingga 31 Desember 2024</p>
              </div>
              <Badge variant="primary" className="text-lg px-4 py-2">Active</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">∞</p>
                <p className="text-sm text-gray-600">Interview</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">∞</p>
                <p className="text-sm text-gray-600">CV Storage</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">AI</p>
                <p className="text-sm text-gray-600">Advanced Feedback</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">24/7</p>
                <p className="text-sm text-gray-600">Support</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Kelola Langganan
            </Button>
          </Card>

          {/* Usage Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Statistik Penggunaan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{accountStats.interviewsCompleted}</p>
                <p className="text-sm text-gray-600">Interview Selesai</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{accountStats.cvsCreated}</p>
                <p className="text-sm text-gray-600">CV Dibuat</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{accountStats.jobsApplied}</p>
                <p className="text-sm text-gray-600">Lamaran Dikirim</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{accountStats.averageScore}</p>
                <p className="text-sm text-gray-600">Skor Rata-rata</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}