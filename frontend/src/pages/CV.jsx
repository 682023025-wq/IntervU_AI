import { useState } from 'react'
import { Plus, Trash2, Edit2, Download, Upload, FileText } from 'lucide-react'
import { Card, Button, Input, Badge, Modal } from '../components/UI'
import CVBuilder from '../components/cv/CVBuilder'
import { CVProvider } from '../contexts/CVContext'

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
    <CVProvider>
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
        {activeTab === 'builder' && <CVBuilder />}

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
    </CVProvider>
  )
}
