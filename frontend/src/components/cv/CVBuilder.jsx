import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save, Eye, X, MessageCircle, Maximize2 } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [sizePercent, setSizePercent] = useState(30); // Default 30% untuk mobile agar tidak terlalu besar
  const chatRef = useRef(null);
  const containerRef = useRef(null);
  
  // Initialize position and size based on screen
  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && isChatOpen && !isDragging) {
        const rect = containerRef.current.getBoundingClientRect();
        if (position.x === 0 && position.y === 0) {
          // Default position: bottom right with some margin
          setPosition({
            x: window.innerWidth - 350,
            y: window.innerHeight - 500
          });
          // Calculate size based on percentage
          setSize({
            width: Math.floor(window.innerWidth * (sizePercent / 100)),
            height: Math.floor(window.innerHeight * (sizePercent / 100))
          });
        } else {
          // Update size when window resizes based on current percentage
          setSize({
            width: Math.floor(window.innerWidth * (sizePercent / 100)),
            height: Math.floor(window.innerHeight * (sizePercent / 100))
          });
        }
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isChatOpen, sizePercent]);

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent default to fix passive event listener error
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

  // Handle percentage-based resize
  const handleSizeChange = (newSizePercent) => {
    setSizePercent(newSizePercent);
    setSize({
      width: Math.floor(window.innerWidth * (newSizePercent / 100)),
      height: Math.floor(window.innerHeight * (newSizePercent / 100))
    });
  };
  
  // Handle reset size
  const handleResetSize = () => {
    setSizePercent(30);
    setSize({
      width: Math.floor(window.innerWidth * (30 / 100)),
      height: Math.floor(window.innerHeight * (30 / 100))
    });
  };
  
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-3 md:px-4 lg:px-6">
        {/* Progress Bar - Clickable Steps */}
        <div className="lg:col-span-12 mb-2 sm:mb-3 md:mb-4">
          <Card className="p-2 sm:p-3 md:p-4 overflow-x-auto shadow-sm border border-gray-100">
            <div className="flex items-center justify-start md:justify-between min-w-max md:min-w-0 gap-1 sm:gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className="flex items-center flex-shrink-0 group mx-0.5 sm:mx-1 transition-opacity hover:opacity-80"
                >
                  <div
                    className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full transition-all duration-200 ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    } ${currentStep === step.id ? 'ring-2 ring-[#9FD3F7] ring-offset-1 sm:ring-offset-2 scale-105 sm:scale-110' : ''}`}
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
                    className={`ml-1 sm:ml-2 text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                      currentStep >= step.id ? 'text-[#0F4C75] font-semibold' : 'text-gray-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.name}</span>
                    <span className="sm:hidden">{step.name.split(' ')[0]}</span>
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-3 sm:w-8 md:w-12 h-0.5 mx-0.5 sm:mx-1 md:mx-2 transition-colors ${
                        currentStep > step.id ? 'bg-gradient-to-r from-[#0F4C75] to-[#2872A3]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Form Content - Left Side */}
        <div className="lg:col-span-7 xl:col-span-8 mb-4 sm:mb-6 lg:mb-0">
          {renderStep()}
        </div>

        {/* Desktop Preview - Fixed sidebar on right */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <Card className="p-3 sm:p-4 bg-white sticky top-6 h-[calc(100vh-3rem)] flex flex-col shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0F4C75] to-[#2872A3] rounded-lg flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Preview CV</h3>
              </div>
              <button
                onClick={() => {}}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500 px-2.5 sm:px-3 py-1.5 text-xs"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
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
            height: `${size.height}px`
          }}
        >
          {/* Floating Window Container */}
          <div 
            ref={chatRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-200"
            style={{
              minHeight: '300px'
            }}
          >
            {/* Draggable Header */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="bg-gradient-to-r from-[#0F4C75] to-[#2872A3] text-white px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between cursor-move select-none"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-xs sm:text-sm truncate">Preview CV</h3>
                  <p className="text-[10px] sm:text-xs text-white/80 truncate">Geser untuk pindah, pilih ukuran di menu</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Reset size button - icon only */}
                <button
                  onClick={handleResetSize}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Reset Ukuran"
                >
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                {/* Size selector dropdown */}
                <select
                  value={sizePercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    handleSizeChange(val);
                  }}
                  className="bg-[#0F4C75] text-white text-[10px] sm:text-xs rounded px-1.5 sm:px-2 py-1 border border-white/30 focus:outline-none focus:ring-1 focus:ring-white/50"
                  title="Ukuran Panel"
                >
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                </select>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <>
              {/* Preview Content */}
              <div className="h-[calc(100%-120px)] overflow-y-auto bg-gray-50">
                <div className="p-2 sm:p-3">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <CVPreview cvData={cvData} />
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="border-t border-gray-200 bg-white px-2 sm:px-3 py-2 flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#0F4C75] text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs hover:bg-[#1B5F8C] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Simpan
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-gray-800 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs hover:bg-gray-900 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  PDF
                </button>
              </div>
            </>
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
                width: Math.floor(window.innerWidth * (sizePercent / 100)),
                height: Math.floor(window.innerHeight * (sizePercent / 100))
              });
            }
          }}
          className="lg:hidden fixed bottom-5 right-5 bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 active:scale-95 z-40"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}
    </div>
  );
}
