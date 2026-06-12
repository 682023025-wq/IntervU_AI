import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [showPreview, setShowPreview] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 20, y: 80 });
  const [previewSize, setPreviewSize] = useState({ width: 350, height: 550 });
  const previewRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  
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
      window.innerWidth - previewSize.width - 32,
      clientX - dragOffset.current.x
    ));
    const newY = Math.max(60, Math.min(
      window.innerHeight - previewSize.height - 32,
      clientY - dragOffset.current.y
    ));
    
    setPreviewPosition({ x: newX, y: newY });
  };

  // Resize functionality
  const handleResizeStart = (e) => {
    setIsResizing(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStartPos.current = { x: clientX, y: clientY };
    resizeStartSize.current = { ...previewSize };
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - resizeStartPos.current.x;
    const deltaY = clientY - resizeStartPos.current.y;
    
    const newWidth = Math.max(320, Math.min(500, resizeStartSize.current.width + deltaX));
    const newHeight = Math.max(450, Math.min(window.innerHeight - 150, resizeStartSize.current.height + deltaY));
    
    setPreviewSize({ width: newWidth, height: newHeight });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', isDragging ? handleDragMove : handleResizeMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', isDragging ? handleDragMove : handleResizeMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', isDragging ? handleDragMove : handleResizeMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', isDragging ? handleDragMove : handleResizeMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, isResizing]);

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
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-gray-500 px-2 py-1 text-xs"
            >
              <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-4 h-4" viewBox="0 0 512 512">
                {showPreview ? (
                  <path fill="currentColor" d="M405 136.798L375.202 107a20.021 20.021 0 0 0-28.284 0L256 197.717L165.083 107a20.021 20.021 0 0 0-28.284 0L107 136.798a20.021 20.021 0 0 0 0 28.284L197.717 256L107 346.917a20.021 20.021 0 0 0 0 28.284l29.799 29.799a20.021 20.021 0 0 0 28.284 0L256 314.283l90.919 90.919a20.021 20.021 0 0 0 28.284 0l29.799-29.799a20.021 20.021 0 0 0 0-28.284L314.283 256l90.919-90.917a20.021 20.021 0 0 0 0-28.284Z"/>
                ) : (
                  <path fill="currentColor" d="M464 256A208 208 0 0 1 256 464a208 208 0 0 1-208-208a208 208 0 0 1 208-208a208 208 0 0 1 208 208Zm0 0a208 208 0 0 0-208-208a208 208 0 0 0-208 208a208 208 0 0 0 208 208a208 208 0 0 0 208-208Zm-208 80a80 80 0 1 1 80-80a80 80 0 0 1-80 80Z"/>
                )}
              </svg>
            </button>
          </div>
          
          <div className={`flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden ${showPreview ? 'block' : 'hidden'}`}>
            <CVPreview cvData={cvData} />
          </div>
        </Card>
      </div>
    </div>

    {/* Mobile Floating Preview Panel */}
    <div 
      ref={previewRef}
      className={`lg:hidden fixed z-50 transition-shadow duration-200 ${isDragging || isResizing ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'}`}
      style={{
        left: `${previewPosition.x}px`,
        top: `${previewPosition.y}px`,
        width: `${previewSize.width}px`,
        height: `${previewSize.height}px`,
      }}
    >
      <Card className="p-3 bg-white/95 backdrop-blur-sm h-full flex flex-col relative">
        {/* Header with drag handle */}
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="cursor-move p-1 rounded hover:bg-gray-100 active:bg-gray-200"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-4 h-4 text-gray-400" viewBox="0 0 512 512">
                <path fill="currentColor" d="M112 268a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0-128a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0 256a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm144-128a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0-128a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0 256a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm144-128a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0-128a36 36 0 1 1 36-36a36 36 0 0 1-36 36Zm0 256a36 36 0 1 1 36-36a36 36 0 0 1-36 36Z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-xs">Preview CV</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 px-1.5 py-1 text-[10px]"
            >
              <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-3.5 h-3.5" viewBox="0 0 512 512">
                {showPreview ? (
                  <path fill="currentColor" d="M464 256A208 208 0 0 1 256 464a208 208 0 0 1-208-208a208 208 0 0 1 208-208a208 208 0 0 1 208 208Zm0 0a208 208 0 0 0-208-208a208 208 0 0 0-208 208a208 208 0 0 0 208 208a208 208 0 0 0 208-208Zm-208 80a80 80 0 1 1 80-80a80 80 0 0 1-80 80Z"/>
                ) : (
                  <path fill="currentColor" d="M448 336v-40L288 136.8V96a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v16L64 280.7V240a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h32a15.9 15.9 0 0 0 16-16v-17.3l160 160V512a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-31.2L448 352a16 16 0 0 0 0-16Z"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className={`flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden ${showPreview ? 'block' : 'hidden'}`}>
          <CVPreview cvData={cvData} />
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 p-1.5 cursor-se-resize"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 512 512">
            <path fill="currentColor" d="M456.12 431.532h-30.128c-4.418 0-6.628-5.335-3.51-8.453l105.04-105.04a4.93 4.93 0 0 0 0-6.97l-105.04-105.04c-3.118-3.118-.908-8.453 3.51-8.453h30.128a4.95 4.95 0 0 1 3.51 1.44l148.632 148.632a4.93 4.93 0 0 1 0 6.97L459.63 430.092a4.95 4.95 0 0 1-3.51 1.44ZM24.008 488.008h30.128c4.418 0 6.628-5.335 3.51-8.453l-105.04-105.04a4.93 4.93 0 0 0 0-6.97l105.04-105.04c3.118-3.118.908-8.453-3.51-8.453H24.008a4.95 4.95 0 0 0-3.51 1.44L-128.14 404.124a4.93 4.93 0 0 0 0 6.97L20.498 486.568a4.95 4.95 0 0 0 3.51 1.44Z"/>
          </svg>
        </div>
      </Card>
    </div>
  );
}
