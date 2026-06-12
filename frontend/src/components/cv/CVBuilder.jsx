import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card, Button } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save, Eye, X, MessageCircle, Maximize2, Minimize2 } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Mode ukuran: 'medium' atau 'large'
  const [previewSize, setPreviewSize] = useState('medium');
  
  // State untuk FAB (Floating Action Button) yang bisa di-drag
  const [fabPosition, setFabPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 70 : 300,
    y: typeof window !== 'undefined' ? window.innerHeight - 70 : 500
  });
  const [isFabDragging, setIsFabDragging] = useState(false);
  const [fabDragOffset, setFabDragOffset] = useState({ x: 0, y: 0 });
  
  // Track orientation for responsive adjustments
  const [isLandscape, setIsLandscape] = useState(false);
  
  const chatRef = useRef(null);
  const containerRef = useRef(null);
  
  // Konfigurasi ukuran berdasarkan mode
  const isLarge = previewSize === 'large';
  const panelDimensions = isLarge 
    ? { width: 400, height: 600 } 
    : { width: 320, height: 450 };

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      
      // Auto-adjust FAB position if it's outside visible area after rotation
      setFabPosition(prev => {
        const fabSize = 60;
        const maxX = window.innerWidth - fabSize;
        const maxY = window.innerHeight - fabSize;
        
        return {
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        };
      });
      
      // Auto-adjust panel position if outside visible area
      setPosition(prev => {
        const maxX = window.innerWidth - panelDimensions.width;
        const maxY = window.innerHeight - panelDimensions.height;
        
        return {
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        };
      });
    };

    // Initial check
    handleOrientationChange();
    
    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Handle drag start (Panel Preview)
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  // Handle FAB drag start
  const handleFabDragStart = (e) => {
    setIsFabDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setFabDragOffset({
      x: clientX - fabPosition.x,
      y: clientY - fabPosition.y
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
      const maxX = window.innerWidth - panelDimensions.width;
      const maxY = window.innerHeight - panelDimensions.height;
      
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
  }, [isDragging, dragOffset, panelDimensions]);

  // Handle FAB drag move & end
  useEffect(() => {
    const handleFabDragMove = (e) => {
      if (!isFabDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - fabDragOffset.x;
      const newY = clientY - fabDragOffset.y;
      
      // FAB size is approximately 60px
      const fabSize = 60;
      const maxX = window.innerWidth - fabSize;
      const maxY = window.innerHeight - fabSize;
      
      setFabPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleFabDragEnd = () => {
      setIsFabDragging(false);
    };

    if (isFabDragging) {
      document.addEventListener('mousemove', handleFabDragMove);
      document.addEventListener('mouseup', handleFabDragEnd);
      document.addEventListener('touchmove', handleFabDragMove, { passive: false });
      document.addEventListener('touchend', handleFabDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleFabDragMove);
      document.removeEventListener('mouseup', handleFabDragEnd);
      document.removeEventListener('touchmove', handleFabDragMove);
      document.removeEventListener('touchend', handleFabDragEnd);
    };
  }, [isFabDragging, fabDragOffset]);

  // Handle percentage-based resize
  const handleSizeChange = (newSizePercent) => {
    // Fungsi ini tidak digunakan lagi karena sekarang menggunakan fixed sizes
    console.log('Size change requested:', newSizePercent);
  };
  
  // Handle reset size
  const handleResetSize = () => {
    // Fungsi ini tidak digunakan lagi karena sekarang menggunakan fixed sizes
    console.log('Reset size requested');
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
            width: `${panelDimensions.width}px`,
            height: `${panelDimensions.height}px`
          }}
        >
          {/* Floating Window Container */}
          <div 
            ref={chatRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-200 h-full w-full flex flex-col"
          >
            {/* Draggable Header */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className={`bg-gradient-to-r from-[#0F4C75] to-[#2872A3] text-white cursor-move select-none flex-shrink-0 flex items-center justify-between ${isLarge ? 'px-4 py-3' : 'px-3 py-2'}`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className={`bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 ${isLarge ? 'w-8 h-8' : 'w-7 h-7'}`}>
                  <Eye className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <h3 className={`font-semibold truncate ${isLarge ? 'text-sm' : 'text-xs'}`}>Preview CV</h3>
                  <p className={`text-white/80 truncate ${isLarge ? 'text-xs' : 'text-[10px]'}`}>Geser untuk pindah, klik tombol untuk ubah ukuran</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                {/* Toggle size button - Sedang <-> Besar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewSize(isLarge ? 'medium' : 'large');
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`hover:bg-white/20 rounded-full transition-colors cursor-pointer flex items-center justify-center ${isLarge ? 'p-2' : 'p-1.5'}`}
                  title={isLarge ? "Ubah ke Ukuran Sedang" : "Ubah ke Ukuran Besar"}
                >
                  {isLarge ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-3.5 h-3.5 text-white" />}
                </button>
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`hover:bg-white/20 rounded-full transition-colors cursor-pointer flex items-center justify-center ${isLarge ? 'p-2' : 'p-1.5'}`}
                  title="Tutup Preview"
                >
                  <X className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
                </button>
              </div>
            </div>

            {/* Content Area - Flexible height */}
            <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
              <div className={isLarge ? 'p-4' : 'p-2'}>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
                  <CVPreview 
                    cvData={cvData} 
                    size={previewSize}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-gray-200 bg-white px-2 sm:px-3 py-2 flex gap-2 flex-shrink-0">
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
          </div>
        </div>
      )}

      {/* Chat Toggle Button (FAB) - DRAGGABLE */}
      {!isChatOpen && (
        <button
          onMouseDown={handleFabDragStart}
          onTouchStart={handleFabDragStart}
          onClick={(e) => {
            // Hanya buka chat jika tidak sedang drag
            if (!isFabDragging) {
              setIsChatOpen(true);
              // Reset panel position if needed
              if (position.x === 0 && position.y === 0) {
                setPosition({
                  x: window.innerWidth - 350,
                  y: window.innerHeight - 500
                });
              }
            }
          }}
          className="lg:hidden fixed z-40 bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-200 active:scale-95 cursor-move select-none"
          style={{
            left: `${fabPosition.x}px`,
            top: `${fabPosition.y}px`,
            width: '60px',
            height: '60px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Tambah efek visual saat di-drag
            transform: isFabDragging ? 'scale(1.1)' : 'scale(1)',
            transition: isFabDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s'
          }}
          title="Geser untuk pindah posisi, klik untuk buka preview"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" />
        </button>
      )}
    </div>
  );
}
