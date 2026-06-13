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
      <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">CV Builder</h1>
            <p className="text-sm sm:text-base text-gray-600">Buat dan kelola CV profesional Anda dengan mudah</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Buat CV Baru
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-hide -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'builder'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'templates'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Template
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cvTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <FileText className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary-400" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{template.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{template.preview}</p>
                  <Button className="w-full text-xs sm:text-sm">Gunakan Template</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-3 sm:space-y-4">
            {savedCVs.map((cv) => (
              <Card key={cv.id} className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="p-2 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cv.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Template: {cv.template} • Diperbarui {cv.updated}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1 sm:flex-none">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {cvTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-primary-500 transition-colors"
                  >
                    <p className="text-xs sm:text-sm font-medium text-center">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
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
