import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';
import ExperienceForm from './form/ExperienceForm';
import CVPreview from './preview/CVPreview';
import { Download, Save, Eye, X, MessageCircle } from 'lucide-react';

export default function CVBuilder() {
  const { state, setCurrentStep, exportCVData } = useCV();
  const { currentStep, cvData } = state;
  
  // State UI Utama
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  // State Panel Preview (Draggable)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // State FAB (Floating Action Button)
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
  const [isFabDragging, setIsFabDragging] = useState(false);
  const [fabDragOffset, setFabDragOffset] = useState({ x: 0, y: 0 });
  
  // State Orientasi
  const [isLandscape, setIsLandscape] = useState(false);
  
  const chatRef = useRef(null);
  const containerRef = useRef(null);
  
  // Konfigurasi Layout & Safe Areas
  const NAVBAR_HEIGHT = 64;
  const BOTTOM_NAV_HEIGHT = 70;
  const FAB_SIZE = 60;
  const FAB_PADDING = 16;
  
  // Dimensi Panel (Ukuran Kecil Fixed)
  const getPanelDimensions = () => {
    if (isLandscape) {
      return { 
        width: Math.min(200, window.innerWidth - 20), 
        height: Math.min(360, window.innerHeight - NAVBAR_HEIGHT ) 
      };
    }
    return { width: 200, height: 350 };
  };

  const panelDimensions = getPanelDimensions();

  // Inisialisasi Posisi Awal
  useEffect(() => {
    const defaultFab = {
      x: window.innerWidth - FAB_SIZE - FAB_PADDING,
      y: window.innerHeight - FAB_SIZE - BOTTOM_NAV_HEIGHT - FAB_PADDING
    };
    setFabPosition(defaultFab);
    
    setPosition({
      x: Math.max(0, window.innerWidth - panelDimensions.width - FAB_PADDING),
      y: Math.max(NAVBAR_HEIGHT, window.innerHeight - panelDimensions.height - BOTTOM_NAV_HEIGHT - FAB_SIZE - FAB_PADDING - 10)
    });
  }, []);

  // Handle Orientation Change
  useEffect(() => {
    const handleOrientationChange = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      
      setFabPosition({
        x: window.innerWidth - FAB_SIZE - FAB_PADDING,
        y: window.innerHeight - FAB_SIZE - BOTTOM_NAV_HEIGHT - FAB_PADDING
      });
      
      const newDims = landscape 
        ? { width: Math.min(300, window.innerWidth - 20), height: Math.min(350, window.innerHeight - 100) }
        : { width: 280, height: 400 };
      
      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, window.innerWidth - newDims.width)),
        y: Math.max(NAVBAR_HEIGHT, Math.min(prev.y, window.innerHeight - newDims.height - BOTTOM_NAV_HEIGHT))
      }));
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // ✅ FIX: Efek untuk mengunci scroll body saat dragging
  useEffect(() => {
    if (isDragging || isFabDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging, isFabDragging]);

  // --- Handlers untuk Drag Panel ---
  const handleDragStart = (e) => {
    // ✅ Mencegah event merambat ke parent dan mencegah default browser
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      // ✅ Cegah default saat move juga
      e.preventDefault(); 
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;
      
      const maxX = window.innerWidth - panelDimensions.width;
      const maxY = window.innerHeight - panelDimensions.height - BOTTOM_NAV_HEIGHT;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(NAVBAR_HEIGHT, Math.min(newY, maxY))
      });
    };

    const handleDragEnd = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove, { passive: false });
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

  // --- Handlers untuk Drag FAB ---
  const handleFabDragStart = (e) => {
    // ✅ Mencegah event merambat ke parent dan mencegah default browser
    e.stopPropagation();
    e.preventDefault();
    
    setIsFabDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setFabDragOffset({
      x: clientX - fabPosition.x,
      y: clientY - fabPosition.y
    });
  };

  useEffect(() => {
    const handleFabDragMove = (e) => {
      if (!isFabDragging) return;
      // ✅ Cegah default saat move juga
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - fabDragOffset.x;
      const newY = clientY - fabDragOffset.y;
      
      const minX = FAB_PADDING;
      const maxX = window.innerWidth - FAB_SIZE - FAB_PADDING;
      const minY = NAVBAR_HEIGHT + FAB_PADDING;
      const maxY = window.innerHeight - FAB_SIZE - BOTTOM_NAV_HEIGHT - FAB_PADDING;
      
      setFabPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    };

    const handleFabDragEnd = () => setIsFabDragging(false);

    if (isFabDragging) {
      document.addEventListener('mousemove', handleFabDragMove, { passive: false });
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

  // --- Logic Form Steps ---
  const steps = [
    { id: 1, name: 'Informasi Pribadi', icon: 'person' },
    { id: 2, name: 'Skill & Keahlian', icon: 'star' },
    { id: 3, name: 'Pengalaman Kerja', icon: 'briefcase' },
    { id: 4, name: 'Pendidikan', icon: 'school' },
  ];
  
  const handleDownloadPDF = () => alert('Fitur download PDF akan segera hadir!');
  
  const handleSave = () => {
    const data = exportCVData();
    localStorage.setItem('cv_draft', JSON.stringify(data));
    alert('CV berhasil disimpan!');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoForm />;
      case 2: return <SkillsForm />;
      case 3: return <ExperienceForm />;
      case 4:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Pendidikan</h2>
            <p className="text-gray-600">Form pendidikan akan ditambahkan selanjutnya...</p>
          </Card>
        );
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-3 md:px-4 lg:px-6">
        
        {/* GABUNGAN: Progress Bar + Form Content dalam Satu Card */}
        <div className="lg:col-span-7 xl:col-span-8 mb-4 sm:mb-6 lg:mb-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Progress Bar Section */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-start md:justify-center gap-3 sm:gap-6 md:gap-8 min-w-max md:min-w-0">
                
                {/* Step 1 */}
                <button onClick={() => setCurrentStep(1)} className="flex flex-col items-center group transition-opacity hover:opacity-80">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 shadow-md ring-4 ring-[#9FD3F7]/30 scale-110 ${currentStep >= 1 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                    <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M393.5 135.5C375.9 87.6 331.7 56 256 56S136.1 87.6 118.5 135.5C51.7 157.1 0 219.9 0 296c0 92.8 75.2 168 168 168h176c92.8 0 168-75.2 168-168c0-76.1-51.7-138.9-118.5-160.5zM256 88c44.2 0 80 35.8 80 80s-35.8 80-80 80s-80-35.8-80-80S211.8 88 256 88zm0 280c-61.9 0-112-50.1-112-112c0-39.8 20.8-74.8 52.2-95.1c10.5 24.5 34.8 41.1 62.8 41.1s52.3-16.6 62.8-41.1C353.2 181.2 374 216.2 374 256c0 61.9-50.1 112-112 112z"/>
                    </svg>
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-bold text-center whitespace-nowrap ${currentStep >= 1 ? 'text-[#0F4C75]' : 'text-gray-500'}`}>
                    Informasi Pribadi
                  </span>
                </button>

                {/* Step 2 */}
                <button onClick={() => setCurrentStep(2)} className="flex flex-col items-center group transition-opacity hover:opacity-80">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ${currentStep >= 2 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30 scale-110' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M256 112l64 128l144 24l-104 96l24 144L256 448L128 504l24-144L48 264l144-24L256 112z"/>
                    </svg>
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${currentStep >= 2 ? 'text-[#0F4C75] font-bold' : 'text-gray-500'}`}>
                    Skill & Keahlian
                  </span>
                </button>

                {/* Step 3 */}
                <button onClick={() => setCurrentStep(3)} className="flex flex-col items-center group transition-opacity hover:opacity-80">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ${currentStep >= 3 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30 scale-110' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M400 96H320V80c0-26.5-21.5-48-48-48H240c-26.5 0-48 21.5-48 48v16H112c-35.3 0-64 28.7-64 64v224c0 35.3 28.7 64 64 64h288c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64zM224 80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v16h-64V80zm224 304c0 17.6-14.4 32-32 32H112c-17.6 0-32-14.4-32-32V160c0-17.6 14.4-32 32-32h288c17.6 0 32 14.4 32 32v224z"/>
                    </svg>
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${currentStep >= 3 ? 'text-[#0F4C75] font-bold' : 'text-gray-500'}`}>
                    Pengalaman Kerja
                  </span>
                </button>

                {/* Step 4 */}
                <button onClick={() => setCurrentStep(4)} className="flex flex-col items-center group transition-opacity hover:opacity-80">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ${currentStep >= 4 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30 scale-110' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    <svg xmlns="http://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M256 32L32 144l224 112l224-112L256 32zm0 256L32 176v96l224 112l224-112v-96L256 288zm0 64L32 240v96l224 112l224-112v-96L256 352z"/>
                    </svg>
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${currentStep >= 4 ? 'text-[#0F4C75] font-bold' : 'text-gray-500'}`}>
                    Pendidikan
                  </span>
                </button>

              </div>
            </div>

            {/* Form Content */}
            <div className="p-5 sm:p-6 bg-white">
               {renderStep()}
            </div>

          </div>
        </div>

        {/* Desktop Preview */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <Card className="p-3 sm:p-4 bg-white sticky top-6 h-[calc(100vh-3rem)] flex flex-col shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0F4C75] to-[#2872A3] rounded-lg flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Preview CV</h3>
              </div>
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
          <div 
            ref={chatRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-200 h-full w-full flex flex-col"
          >
            {/* Draggable Header - UPDATED with touch-none */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="bg-gradient-to-r from-[#0F4C75] to-[#2872A3] text-white cursor-move select-none flex-shrink-0 flex items-center justify-between px-3 py-2 touch-none"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 w-7 h-7">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <h3 className="font-semibold truncate text-xs">Preview CV</h3>
                  <p className="text-white/80 truncate text-[10px]">Geser untuk pindah posisi</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="hover:bg-white/20 rounded-full transition-colors cursor-pointer flex items-center justify-center p-1.5"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
              <div className="p-2">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
                  <CVPreview cvData={cvData} />
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

      {/* Chat Toggle Button (FAB) - UPDATED with touch-none */}
      {!isChatOpen && (
        <button
          onMouseDown={handleFabDragStart}
          onTouchStart={handleFabDragStart}
          onClick={(e) => {
            if (!isFabDragging) {
              setIsChatOpen(true);
              const landscape = window.innerWidth > window.innerHeight;
              const defaultPanelWidth = landscape ? 500 : 320;
              const defaultPanelHeight = landscape ? 350 : 450;
              
              setPosition({
                x: Math.max(0, window.innerWidth - defaultPanelWidth - FAB_PADDING),
                y: Math.max(NAVBAR_HEIGHT, window.innerHeight - defaultPanelHeight - BOTTOM_NAV_HEIGHT - FAB_SIZE - FAB_PADDING - 10)
              });
            }
          }}
          className="lg:hidden fixed z-40 bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-200 active:scale-95 cursor-move select-none touch-none"
          style={{
            left: `${fabPosition.x}px`,
            top: `${fabPosition.y}px`,
            width: `${FAB_SIZE}px`,
            height: `${FAB_SIZE}px`,
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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