import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save, Eye, X, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatRef = useRef(null);
  
  const steps = [
    { id: 1, name: 'Informasi Pribadi', icon: 'person' },
    { id: 2, name: 'Skill & Keahlian', icon: 'star' },
    { id: 3, name: 'Pengalaman Kerja', icon: 'briefcase' },
    { id: 4, name: 'Pendidikan', icon: 'school' },
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
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen pb-20 lg:pb-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Progress Bar - Clickable Steps */}
      <Card className="p-3 md:p-4 mb-4 md:mb-6 overflow-x-auto lg:col-span-3">
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
                {currentStep > step.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-5 h-5" viewBox="0 0 512 512">
                    {step.icon === 'person' && <path fill="currentColor" d="M393.5 135.5C375.9 87.6 331.7 56 256 56S136.1 87.6 118.5 135.5C51.7 157.1 0 219.9 0 296c0 92.8 75.2 168 168 168h176c92.8 0 168-75.2 168-168c0-76.1-51.7-138.9-118.5-160.5zM256 88c44.2 0 80 35.8 80 80s-35.8 80-80 80s-80-35.8-80-80S211.8 88 256 88zm0 280c-61.9 0-112-50.1-112-112c0-39.8 20.8-74.8 52.2-95.1c10.5 24.5 34.8 41.1 62.8 41.1s52.3-16.6 62.8-41.1C353.2 181.2 374 216.2 374 256c0 61.9-50.1 112-112 112z"/>}
                    {step.icon === 'star' && <path fill="currentColor" d="M256 112l64 128l144 24l-104 96l24 144L256 448L128 504l24-144L48 264l144-24L256 112z"/>}
                    {step.icon === 'briefcase' && <path fill="currentColor" d="M400 96H320V80c0-26.5-21.5-48-48-48H240c-26.5 0-48 21.5-48 48v16H112c-35.3 0-64 28.7-64 64v224c0 35.3 28.7 64 64 64h288c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64zM224 80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v16h-64V80zm224 304c0 17.6-14.4 32-32 32H112c-17.6 0-32-14.4-32-32V160c0-17.6 14.4-32 32-32h288c17.6 0 32 14.4 32 32v224z"/>}
                    {step.icon === 'school' && <path fill="currentColor" d="M256 32L32 144l224 112l224-112L256 32zm0 256L32 176v96l224 112l224-112v-96L256 288zm0 64L32 240v96l224 112l224-112v-96L256 352z"/>}
                  </svg>
                )}
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
      <div className="mb-6 lg:mb-0 lg:col-span-2">
        {renderStep()}
      </div>

      {/* Desktop Preview - Fixed sidebar on right */}
      <div className="hidden lg:block lg:col-span-1">
        <Card className="p-4 bg-white sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 text-base">Preview CV</h3>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-gray-500 px-2 py-1 text-xs"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden">
            <CVPreview cvData={cvData} />
          </div>
        </Card>
      </div>

      {/* Mobile Chat-Style Preview Panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Chat Toggle Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all active:scale-95"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        {/* Chat Panel */}
        {isChatOpen && (
          <div 
            ref={chatRef}
            className={`bg-white shadow-2xl transition-all duration-300 ease-in-out ${
              isMinimized ? 'h-14' : 'h-[70vh]'
            }`}
          >
            {/* Chat Header */}
            <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Preview CV</h3>
                  <p className="text-xs text-white/80">Lihat hasil CV Anda</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Content - Preview */}
            {!isMinimized && (
              <div className="h-[calc(100%-56px)] overflow-y-auto bg-gray-50">
                <div className="p-4">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <CVPreview cvData={cvData} />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Simpan
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
