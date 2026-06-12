import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save, Eye, X, MessageCircle, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const chatRef = useRef(null);
  const containerRef = useRef(null);
  
  // Initialize position and size based on screen
  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && isChatOpen && !isDragging && !isResizing) {
        const rect = containerRef.current.getBoundingClientRect();
        if (position.x === 0 && position.y === 0) {
          // Default position: bottom right with some margin
          setPosition({
            x: window.innerWidth - 350,
            y: window.innerHeight - 500
          });
          setSize({
            width: Math.min(350, window.innerWidth - 40),
            height: Math.min(500, window.innerHeight - 150)
          });
        }
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isChatOpen]);

  // Handle drag start
  const handleDragStart = (e) => {
    if (isMinimized) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  // Handle drag move
  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;
      
      // Boundary checks
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset, size]);

  // Handle resize start
  const handleResizeStart = (e) => {
    setIsResizing(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setResizeStart({
      x: clientX,
      y: clientY,
      width: size.width,
      height: size.height
    });
  };

  // Handle resize move
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!isResizing) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;
      
      const newWidth = Math.max(280, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x - 20));
      const newHeight = Math.max(300, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y - 100));
      
      setSize({
        width: newWidth,
        height: newHeight
      });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('touchend', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, resizeStart, position]);
  
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
    <div className="relative min-h-screen pb-24 lg:pb-0">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Progress Bar - Clickable Steps */}
        <div className="lg:col-span-12 mb-4">
          <Card className="p-3 sm:p-4 overflow-x-auto shadow-sm">
            <div className="flex items-center justify-start md:justify-between min-w-max md:min-w-0 gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className="flex items-center flex-shrink-0 group mx-1 transition-opacity hover:opacity-80"
                >
                  <div
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    } ${currentStep === step.id ? 'ring-2 ring-primary-400 ring-offset-2 scale-110' : ''}`}
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
                    className={`ml-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      currentStep >= step.id ? 'text-primary-700 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.name}</span>
                    <span className="sm:hidden">{step.name.split(' ')[0]}</span>
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-4 sm:w-12 md:w-16 h-0.5 mx-1 sm:mx-2 transition-colors ${
                        currentStep > step.id ? 'bg-gradient-to-r from-primary-500 to-primary-700' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Form Content - Left Side */}
        <div className="lg:col-span-7 xl:col-span-8 mb-6 lg:mb-0">
          {renderStep()}
        </div>

        {/* Desktop Preview - Fixed sidebar on right */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <Card className="p-4 bg-white sticky top-6 h-[calc(100vh-3rem)] flex flex-col shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Preview CV</h3>
              </div>
              <button
                onClick={() => {}}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500 px-3 py-1.5 text-xs"
              >
                <Eye className="w-4 h-4 mr-1" />
                Lihat
              </button>
            </div>
            
            <div className="flex-1 min-h-0 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
              <CVPreview cvData={cvData} />
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Chat-Style Floating Preview Panel */}
      {isChatOpen && (
        <div 
          ref={containerRef}
          className="lg:hidden fixed z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: isMinimized ? 'auto' : `${size.height}px`
          }}
        >
          {/* Floating Window Container */}
          <div 
            ref={chatRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-200"
            style={{
              minHeight: isMinimized ? '56px' : '300px'
            }}
          >
            {/* Draggable Header */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 flex items-center justify-between cursor-move select-none"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                {!isMinimized && (
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">Preview CV</h3>
                    <p className="text-xs text-white/80 truncate">Geser untuk pindah, tarik sudut untuk ubah ukuran</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isMinimized && (
                  <>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="Minimize"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSize({ width: Math.min(400, window.innerWidth - 40), height: Math.min(600, window.innerHeight - 150) })}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="Reset Size"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!isMinimized && (
              <>
                {/* Preview Content */}
                <div className="h-[calc(100%-120px)] overflow-y-auto bg-gray-50">
                  <div className="p-3">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                      <CVPreview cvData={cvData} />
                    </div>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="border-t border-gray-200 bg-white px-3 py-2 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg font-medium text-xs hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 bg-gray-800 text-white py-2 px-3 rounded-lg font-medium text-xs hover:bg-gray-900 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>

                {/* Resize Handle */}
                <div
                  onMouseDown={handleResizeStart}
                  onTouchStart={handleResizeStart}
                  className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1"
                >
                  <div className="w-3 h-3 border-r-2 border-b-2 border-gray-400 opacity-50"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat Toggle Button (FAB) - Improved size and position */}
      {!isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true);
            // Reset position if needed
            if (position.x === 0 && position.y === 0) {
              setPosition({
                x: window.innerWidth - 350,
                y: window.innerHeight - 500
              });
              setSize({
                width: Math.min(350, window.innerWidth - 40),
                height: Math.min(500, window.innerHeight - 150)
              });
            }
          }}
          className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 active:scale-95 z-40"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
