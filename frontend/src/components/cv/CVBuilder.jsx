import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import { Download, Save, X, Move, Eye } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [showPreview, setShowPreview] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 80 });
  const previewRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const steps = [
    { id: 1, name: 'Informasi Pribadi', icon: '👤' },
    { id: 2, name: 'Skill & Keahlian', icon: '⭐' },
    { id: 3, name: 'Pengalaman Kerja', icon: '💼' },
    { id: 4, name: 'Pendidikan', icon: '🎓' },
    { id: 5, name: 'Review & Download', icon: '✅' },
  ];
  
  const handleDownloadPDF = () => {
    alert('Fitur download PDF akan segera hadir!');
  };
  
  const handleSave = () => {
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

  // Mobile drag functionality
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = previewRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleDragMove = (e) => {
    if (!isDragging || !previewRef.current) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(0, Math.min(
      window.innerWidth - previewRef.current.offsetWidth - 32,
      clientX - dragOffset.current.x
    ));
    const newY = Math.max(60, Math.min(
      window.innerHeight - previewRef.current.offsetHeight - 32,
      clientY - dragOffset.current.y
    ));
    
    setPreviewPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className="relative min-h-screen pb-20 lg:pb-0">
      {/* Progress Bar - Clickable Steps */}
      <Card className="p-3 md:p-4 mb-4 md:mb-6 overflow-x-auto">
        <div className="flex items-center justify-start md:justify-between min-w-max md:min-w-0">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className="flex items-center flex-shrink-0 group mx-1"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all ${
                  currentStep >= step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${currentStep === step.id ? 'ring-2 ring-primary-300 ring-offset-2' : ''}`}
              >
                {currentStep > step.id ? '✓' : step.icon}
              </div>
              <span
                className={`ml-2 text-xs md:text-sm font-medium whitespace-nowrap ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <span className="hidden sm:inline">{step.name}</span>
                <span className="sm:hidden">{step.name.split(' ')[0]}</span>
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-3 md:w-16 h-0.5 mx-1 md:mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Form Content */}
      <div className="mb-6 lg:mb-0">
        {renderStep()}
      </div>

      {/* Floating Preview Panel - Desktop: Fixed sidebar, Mobile: Draggable */}
      <div 
        ref={previewRef}
        className={`
          fixed lg:static
          z-50 lg:z-auto
          transition-shadow duration-200
          ${isDragging ? 'shadow-2xl scale-105' : 'shadow-lg'}
        `}
        style={
          typeof window !== 'undefined' && window.innerWidth < 1024
            ? {
                left: `${previewPosition.x}px`,
                top: `${previewPosition.y}px`,
                width: 'calc(100vw - 2rem)',
                maxWidth: '24rem',
              }
            : {}
        }
      >
        <Card className="p-3 md:p-4 bg-white/95 backdrop-blur-sm">
          {/* Header with drag handle for mobile */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="lg:hidden cursor-move p-1 rounded hover:bg-gray-100 active:bg-gray-200"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                <Move className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Preview CV</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 px-2 py-1.5 text-xs"
              >
                {showPreview ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="hidden lg:inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-gray-500 px-2 py-1 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Content - Collapsible on mobile */}
          <div className={`
            border border-gray-200 rounded-lg bg-white min-h-[300px] lg:min-h-[400px] p-3 md:p-4
            transition-all duration-300 ease-in-out
            ${showPreview ? 'block' : 'hidden lg:block'}
          `}>
            {cvData.photo?.url && (
              <img
                src={cvData.photo.url}
                alt="Profile"
                className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-lg mx-auto mb-2 md:mb-3"
              />
            )}
            
            <div className="text-center mb-3 md:mb-4">
              <h4 className="font-bold text-gray-900 text-sm md:text-base">
                {cvData.fullName || 'Nama Anda'}
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                {cvData.targetPosition || 'Posisi yang Dilamar'}
              </p>
            </div>

            {cvData.contactInfo.length > 0 && (
              <div className="space-y-1 mb-3 md:mb-4">
                {cvData.contactInfo.slice(0, 3).map((contact, i) => (
                  <p key={i} className="text-[10px] md:text-xs text-gray-600 flex items-center justify-center gap-1">
                    <span>{contact.icon}</span>
                    <span className="truncate max-w-[120px] md:max-w-none">{contact.value}</span>
                  </p>
                ))}
              </div>
            )}

            {cvData.profileSummary && (
              <div className="mb-3 md:mb-4">
                <h5 className="text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1">Profil</h5>
                <p className="text-[10px] md:text-xs text-gray-600 line-clamp-3">{cvData.profileSummary}</p>
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-3 md:mb-4">
                <h5 className="text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1">Skill</h5>
                <div className="flex flex-wrap gap-1">
                  {cvData.skills.slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-primary-50 text-primary-700 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {cvData.skills.length > 5 && (
                    <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-600 rounded">
                      +{cvData.skills.length - 5} lainnya
                    </span>
                  )}
                </div>
              </div>
            )}

            {cvData.workExperience.length > 0 && (
              <div>
                <h5 className="text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1">Pengalaman</h5>
                <div className="space-y-1 md:space-y-2">
                  {cvData.workExperience.slice(0, 2).map((exp, i) => (
                    <div key={i} className="text-[10px] md:text-xs">
                      <p className="font-medium text-gray-800 truncate">{exp.position}</p>
                      <p className="text-gray-600 truncate">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!cvData.profileSummary && cvData.skills.length === 0 && cvData.workExperience.length === 0) && (
              <div className="text-center py-6 md:py-8 text-gray-400">
                <p className="text-[10px] md:text-sm">Isi formulir untuk melihat preview</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
