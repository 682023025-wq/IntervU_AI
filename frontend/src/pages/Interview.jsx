import { useState } from 'react'
import { Video, Mic, MicOff, Camera, CameraOff, Phone, Clock, Award, ChevronRight } from 'lucide-react'
import { Card, Button, Badge, Modal } from '../components/UI'

export default function Interview() {
  const [interviewState, setInterviewState] = useState('idle') // idle, preparing, active, completed
  const [selectedRole, setSelectedRole] = useState(null)
  const [questionNumber, setQuestionNumber] = useState(0)

  const interviewRoles = [
    { id: 1, title: 'Software Engineer', level: 'Junior - Senior', duration: '30 menit', questions: 10 },
    { id: 2, title: 'Product Manager', level: 'Mid - Senior', duration: '45 menit', questions: 12 },
    { id: 3, title: 'Data Scientist', level: 'Junior - Mid', duration: '35 menit', questions: 10 },
    { id: 4, title: 'UX Designer', level: 'All Levels', duration: '40 menit', questions: 11 },
    { id: 5, title: 'DevOps Engineer', level: 'Mid - Senior', duration: '40 menit', questions: 12 },
    { id: 6, title: 'Frontend Developer', level: 'Junior - Senior', duration: '30 menit', questions: 10 },
  ]

  const mockQuestions = [
    {
      id: 1,
      question: 'Ceritakan tentang diri Anda dan pengalaman kerja Anda.',
      category: 'Introduction',
    },
    {
      id: 2,
      question: 'Apa kelebihan dan kekurangan Anda?',
      category: 'Self Assessment',
    },
    {
      id: 3,
      question: 'Mengapa Anda tertarik dengan posisi ini?',
      category: 'Motivation',
    },
  ]

  const handleStartInterview = () => {
    if (selectedRole) {
      setInterviewState('preparing')
    }
  }

  const handleBeginInterview = () => {
    setInterviewState('active')
    setQuestionNumber(0)
  }

  const handleEndInterview = () => {
    setInterviewState('completed')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interview</h1>
        <p className="text-gray-600">
          Latih kemampuan wawancara Anda dengan AI interviewer kami
        </p>
      </div>

      {interviewState === 'idle' && (
        <>
          {/* Role Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Pilih Posisi Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedRole?.id === role.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.level}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {role.duration}
                        </span>
                        <span>{role.questions} Questions</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            {selectedRole && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleStartInterview} size="lg">
                  <Video className="w-5 h-5 mr-2" />
                  Mulai Interview
                </Button>
              </div>
            )}
          </Card>

          {/* How it Works */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Cara Kerja</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-medium mb-2">Pilih Posisi</h3>
                <p className="text-sm text-gray-600">
                  Pilih posisi yang ingin Anda latih sesuai target karir Anda
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-medium mb-2">Jawab Pertanyaan</h3>
                <p className="text-sm text-gray-600">
                  AI akan memberikan pertanyaan dan Anda menjawab melalui video/audio
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-medium mb-2">Dapatkan Feedback</h3>
                <p className="text-sm text-gray-600">
                  Dapatkan evaluasi detail dan saran perbaikan dari AI
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {interviewState === 'preparing' && (
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Persiapan Interview</h2>
            <p className="text-gray-600">Posisi: {selectedRole?.title}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mic className="w-5 h-5 text-gray-600 mr-3" />
              <span>Pastikan mikrofon Anda berfungsi dengan baik</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Camera className="w-5 h-5 text-gray-600 mr-3" />
              <span>Pastikan kamera dan pencahayaan cukup</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mr-3" />
              <span>Durasi estimasi: {selectedRole?.duration}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="secondary" className="flex-1" onClick={() => setInterviewState('idle')}>
              Kembali
            </Button>
            <Button className="flex-1" onClick={handleBeginInterview}>
              <Video className="w-5 h-5 mr-2" />
              Mulai Interview Sekarang
            </Button>
          </div>
        </Card>
      )}

      {interviewState === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Preview Kamera</p>
                  <p className="text-sm opacity-75">(Akan aktif saat interview)</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="secondary" size="lg">
                  <MicOff className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg">
                  <CameraOff className="w-5 h-5" />
                </Button>
                <Button variant="danger" size="lg" onClick={handleEndInterview}>
                  <Phone className="w-5 h-5 mr-2" />
                  Akhiri
                </Button>
              </div>
            </Card>
          </div>

          {/* Question Section */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="mb-4">
                <Badge variant="primary">Pertanyaan {questionNumber + 1}</Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {mockQuestions[questionNumber]?.category}
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-4">
                {mockQuestions[questionNumber]?.question}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Anda (Opsional)
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Tulis poin-poin penting..."
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setQuestionNumber(Math.max(0, questionNumber - 1))}
                    disabled={questionNumber === 0}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setQuestionNumber(Math.min(mockQuestions.length - 1, questionNumber + 1))}
                  >
                    {questionNumber === mockQuestions.length - 1 ? 'Selesai' : 'Lanjut'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {interviewState === 'completed' && (
        <Card className="p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Interview Selesai!</h2>
            <p className="text-gray-600">Berikut adalah hasil evaluasi Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary-600 mb-1">85</p>
              <p className="text-sm text-gray-600">Skor Total</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600 mb-1">B+</p>
              <p className="text-sm text-gray-600">Grade</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 mb-1">30</p>
              <p className="text-sm text-gray-600">Menit</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold">Feedback Detail:</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">✅ Kelebihan:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Jawaban terstruktur dengan baik</li>
                <li>Komunikasi jelas dan percaya diri</li>
                <li>Contoh konkret yang relevan</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">⚠️ Area Perbaikan:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Bisa lebih spesifik dalam menjelaskan pencapaian</li>
                <li>Perhatikan durasi jawaban agar tidak terlalu panjang</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="secondary" className="flex-1" onClick={() => setInterviewState('idle')}>
              Interview Lagi
            </Button>
            <Button className="flex-1">
              Download Laporan PDF
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}