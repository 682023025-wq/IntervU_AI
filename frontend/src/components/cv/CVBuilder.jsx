import { useState, useRef, useEffect } from 'react';
import { useCV } from '../../contexts/CVContext';
import { Card } from '../UI';
import PersonalInfoForm from './form/PersonalInfoForm';
import SkillsForm from './form/SkillsForm';              // ✅ Sudah mencakup semua skill
import EducationForm from './form/EducationForm';
import ExperienceFormDynamic from './form/ExperienceFormDynamic';
import CVPreview from './preview/CVPreview';

// SVG Icon Components (Clean & Simple)
const Eye = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

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
      case 2: return <SkillsForm />;  // ✅ Satu komponen untuk semua skill
      case 3: return <ExperienceFormDynamic />;
      case 4: return <EducationForm />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      {/* Main Grid Layout - Optimized for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 lg:px-6">
        
        {/* GABUNGAN: Progress Bar + Form Content dalam Satu Card */}
        <div className="lg:col-span-7 xl:col-span-8 mb-4 sm:mb-6 lg:mb-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Progress Bar Section - Mobile Optimized */}
            <div className="p-3 sm:p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-center md:justify-center gap-2 sm:gap-4 md:gap-6 min-w-max md:min-w-0 overflow-x-auto pb-2 scrollbar-hide">
                
                {/* Step 1 */}
                <button onClick={() => setCurrentStep(1)} className="flex flex-col items-center group transition-opacity hover:opacity-80 flex-shrink-0">
                  <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-200 shadow-md ring-4 ring-[#9FD3F7]/30 ${currentStep >= 1 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                    {currentStep >= 1 ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">1</span>
                    )}
                  </div>
                  <span className={`mt-1.5 text-[10px] sm:text-xs font-semibold text-center whitespace-nowrap ${currentStep >= 1 ? 'text-[#0F4C75]' : 'text-gray-500'}`}>
                    Info Pribadi
                  </span>
                </button>

                {/* Step 2 */}
                <button onClick={() => setCurrentStep(2)} className="flex flex-col items-center group transition-opacity hover:opacity-80 flex-shrink-0">
                  <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-200 ${currentStep >= 2 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    {currentStep >= 2 ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">2</span>
                    )}
                  </div>
                  <span className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${currentStep >= 2 ? 'text-[#0F4C75] font-semibold' : 'text-gray-500'}`}>
                    Skill
                  </span>
                </button>

                {/* Step 3 */}
                <button onClick={() => setCurrentStep(3)} className="flex flex-col items-center group transition-opacity hover:opacity-80 flex-shrink-0">
                  <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-200 ${currentStep >= 3 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    {currentStep >= 3 ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">3</span>
                    )}
                  </div>
                  <span className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${currentStep >= 3 ? 'text-[#0F4C75] font-semibold' : 'text-gray-500'}`}>
                    Pengalaman
                  </span>
                </button>

                {/* Step 4 */}
                <button onClick={() => setCurrentStep(4)} className="flex flex-col items-center group transition-opacity hover:opacity-80 flex-shrink-0">
                  <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-200 ${currentStep >= 4 ? 'bg-gradient-to-br from-[#0F4C75] to-[#2872A3] text-white shadow-md ring-4 ring-[#9FD3F7]/30' : 'bg-white border-2 border-gray-200 text-gray-400 opacity-60'}`}>
                    {currentStep >= 4 ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">4</span>
                    )}
                  </div>
                  <span className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${currentStep >= 4 ? 'text-[#0F4C75] font-semibold' : 'text-gray-500'}`}>
                    Pendidikan
                  </span>
                </button>

              </div>
            </div>

            {/* Form Content - Mobile Padding */}
            <div className="p-4 sm:p-5 bg-white">
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

      {/* Mobile Chat-Style Floating Preview Panel - Optimized */}
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
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-200 h-full w-full flex flex-col"
          >
            {/* Draggable Header - Touch Optimized */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="bg-gradient-to-r from-[#0F4C75] to-[#2872A3] text-white cursor-move select-none flex-shrink-0 flex items-center justify-between px-3 py-2.5 touch-none"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div className="overflow-hidden min-w-0">
                  <h3 className="font-bold truncate text-xs sm:text-sm">Preview CV</h3>
                  <p className="text-white/85 truncate text-[9px] sm:text-[10px] font-medium">Geser untuk pindah posisi</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="hover:bg-white/20 rounded-lg transition-colors cursor-pointer flex items-center justify-center p-1.5 active:scale-90"
                  title="Tutup Preview"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area - Better Scrolling */}
            <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0 scrollbar-thin">
              <div className="p-2">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
                  <CVPreview cvData={cvData} />
                </div>
              </div>
            </div>

            {/* Quick Actions Footer - Larger Touch Targets */}
            <div className="border-t border-gray-200 bg-white px-2 sm:px-3 py-2.5 flex gap-2 flex-shrink-0 safe-area-pb">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#0F4C75] text-white py-2.5 px-3 rounded-lg font-semibold text-xs hover:bg-[#1B5F8C] transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17,21 17,13 7,13 7,21" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,3 7,8 15,8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Simpan
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gray-800 text-white py-2.5 px-3 rounded-lg font-semibold text-xs hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,10 12,15 17,10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button (FAB) - Touch Optimized with Clean Icon */}
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
          <svg className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}