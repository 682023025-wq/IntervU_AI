import { useState } from 'react'
import { Plus, Trash2, Edit2, Download, Upload } from 'lucide-react'
import { Card, Button, Input, Badge, Modal } from '../components/UI'

export default function CV() {
  const [activeTab, setActiveTab] = useState('builder')
  const [showModal, setShowModal] = useState(false)

  const cvTemplates = [
    { id: 1, name: 'Modern', preview: 'Template modern dengan desain minimalis' },
    { id: 2, name: 'Professional', preview: 'Template profesional untuk corporate' },
    { id: 3, name: 'Creative', preview: 'Template kreatif untuk industri kreatif' },
  ]

  const savedCVs = [
    { id: 1, title: 'CV - Software Engineer', updated: '2 hari lalu', template: 'Modern' },
    { id: 2, title: 'CV - Product Manager', updated: '1 minggu lalu', template: 'Professional' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Builder</h1>
          <p className="text-gray-600">Buat dan kelola CV profesional Anda dengan mudah</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Buat CV Baru
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'builder'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Template
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'saved'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CV Tersimpan
        </button>
      </div>

      {/* Content */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Informasi Pribadi</h2>
            <div className="space-y-4">
              <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Input label="Nomor Telepon" placeholder="+62 xxx xxxx xxxx" />
              <Input label="LinkedIn" placeholder="linkedin.com/in/username" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ringkasan Profesional
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Deskripsikan pengalaman dan keahlian Anda..."
                />
              </div>
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            <div className="border border-gray-200 rounded-lg p-8 bg-white min-h-[500px]">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Foto</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nama Anda</h3>
                <p className="text-gray-600">Posisi yang Dilamar</p>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <p>Preview CV akan muncul di sini saat Anda mengisi formulir.</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Upload Foto
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-primary-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.preview}</p>
                <Button className="w-full">Gunakan Template</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedCVs.map((cv) => (
            <Card key={cv.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cv.title}</h3>
                    <p className="text-sm text-gray-500">
                      Template: {cv.template} • Diperbarui {cv.updated}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New CV Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Buat CV Baru"
      >
        <div className="space-y-4">
          <Input label="Judul CV" placeholder="Contoh: CV - Software Engineer" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Template
            </label>
            <div className="grid grid-cols-3 gap-4">
              {cvTemplates.map((template) => (
                <button
                  key={template.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
                >
                  <p className="text-sm font-medium">{template.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={() => setShowModal(false)}>
              Buat CV
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Helper component for template preview
function FileText({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}