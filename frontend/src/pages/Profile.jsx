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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Kelola informasi akun dan preferensi Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Profil Saya
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Notifikasi
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'security'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Keamanan
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'subscription'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Langganan
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-gray-600 mb-4">Software Engineer</p>
              <Badge variant="primary">Premium Member</Badge>
              
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {userProfile.location}
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {userProfile.email}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">Bergabung sejak {userProfile.joinedDate}</p>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Informasi Pribadi</h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(false)}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                  rows="4"
                  defaultValue={userProfile.bio}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="primary">
                      {skill}
                      {isEditing && (
                        <button className="ml-1 hover:text-red-600">×</button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
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