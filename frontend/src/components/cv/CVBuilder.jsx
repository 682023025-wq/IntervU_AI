import { useState } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import { Download, Save, Eye, Edit3 } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { id: 1, name: 'Informasi Pribadi', icon: '👤' },
    { id: 2, name: 'Skill & Keahlian', icon: '⭐' },
    { id: 3, name: 'Pengalaman Kerja', icon: '💼' },
    { id: 4, name: 'Pendidikan', icon: '🎓' },
    { id: 5, name: 'Review & Download', icon: '✅' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation with html2pdf or similar
    alert('Fitur download PDF akan segera hadir!');
  };

  const handleSave = () => {
    // TODO: Save to backend/localStorage
    const data = exportCVData();
    localStorage.setItem('cv_draft', JSON.stringify(data));
    alert('CV berhasil disimpan!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <SkillsForm />;
      case 3:
        return <ExperienceForm />;
      case 4:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Pendidikan</h2>
            <p className="text-gray-600">Form pendidikan akan ditambahkan selanjutnya...</p>
          </Card>
        );
      case 5:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Review & Download</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Status Kelengkapan CV</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p>✓ Informasi Pribadi: {cvData.profileSummary ? 'Lengkap' : 'Belum lengkap'}</p>
                  <p>✓ Skill: {cvData.skills.length} skill ditambahkan</p>
                  <p>✓ Pengalaman Kerja: {cvData.workExperience.length} pengalaman</p>
                </div>
              </div>
              <Button onClick={handleDownloadPDF} className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden md:block ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={currentStep === 1}
          >
            Sebelumnya
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Lanjutkan</Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="w-5 h-5 mr-2" />
              Simpan CV
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar - Preview */}
      <div className="lg:col-span-1">
        <Card className="p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Preview CV</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg bg-white min-h-[400px] p-4">
            {cvData.photo?.url && (
              <img
                src={cvData.photo.url}
                alt="Profile"
                className="w-20 h-24 object-cover rounded-lg mx-auto mb-3"
              />
            )}
            
            <div className="text-center mb-4">
              <h4 className="font-bold text-gray-900">Nama Anda</h4>
              <p className="text-sm text-gray-600">Posisi yang Dilamar</p>
            </div>

            {cvData.contactInfo.length > 0 && (
              <div className="space-y-1 mb-4">
                {cvData.contactInfo.slice(0, 3).map((contact, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <span>{contact.icon}</span>
                    <span>{contact.value}</span>
                  </p>
                ))}
              </div>
            )}

            {cvData.profileSummary && (
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Profil</h5>
                <p className="text-xs text-gray-600 line-clamp-3">{cvData.profileSummary}</p>
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Skill</h5>
                <div className="flex flex-wrap gap-1">
                  {cvData.skills.slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {cvData.skills.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{cvData.skills.length - 5} lainnya
                    </span>
                  )}
                </div>
              </div>
            )}

            {cvData.workExperience.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Pengalaman</h5>
                <div className="space-y-2">
                  {cvData.workExperience.slice(0, 2).map((exp, i) => (
                    <div key={i} className="text-xs">
                      <p className="font-medium text-gray-800">{exp.position}</p>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!cvData.profileSummary && cvData.skills.length === 0 && cvData.workExperience.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Isi formulir untuk melihat preview</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
