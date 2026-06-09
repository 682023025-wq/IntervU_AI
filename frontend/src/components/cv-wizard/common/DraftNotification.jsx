import React from 'react';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

/**
 * Komponen notifikasi untuk menampilkan draft yang ditemukan
 * 
 * @param {Object} props
 * @param {Date} props.timestamp - Timestamp draft terakhir
 * @param {Function} props.onClear - Callback saat user klik "Hapus draft"
 * @param {Function} props.onDismiss - Callback saat user dismiss notifikasi
 * @param {boolean} props.show - Apakah notifikasi ditampilkan
 */
const DraftNotification = ({ timestamp, onClear, onDismiss, show = true }) => {
  if (!show || !timestamp) return null;
  
  const formatTimestamp = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} menit yang lalu`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} jam yang lalu`;
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="animate-fade-in mt-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4 max-w-2xl mx-auto shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Draft ditemukan
              </h3>
              <div className="mt-1 flex items-center space-x-2 text-sm text-yellow-700">
                <Clock className="h-4 w-4" />
                <span>
                  Terakhir disimpan: <strong>{formatTimestamp(timestamp)}</strong>
                </span>
              </div>
              <p className="mt-2 text-sm text-yellow-600">
                Data Anda dari sesi sebelumnya telah dipulihkan otomatis. 
                Lanjutkan mengisi atau hapus draft untuk mulai dari awal.
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              aria-label="Hapus draft"
            >
              Hapus draft
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 inline-flex items-center justify-center p-1 rounded-md text-yellow-400 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen indikator auto-save (pojok kanan atas)
 * 
 * @param {Object} props
 * @param {string} props.status - Status save: 'idle' | 'saving' | 'saved' | 'error'
 * @param {string} props.lastSaved - Text timestamp terakhir save
 */
export const AutoSaveIndicator = ({ status = 'idle', lastSaved = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Clock className="h-3 w-3 animate-pulse" />,
          text: 'Menyimpan...',
          className: 'bg-gray-100 text-gray-600 border-gray-200'
        };
      case 'saved':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: `Tersimpan ${lastSaved}`,
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          text: 'Gagal menyimpan',
          className: 'bg-red-50 text-red-700 border-red-200'
        };
      default:
        return {
          icon: null,
          text: lastSaved ? `Tersimpan ${lastSaved}` : '',
          className: 'bg-gray-50 text-gray-500 border-gray-200'
        };
    }
  };
  
  const config = getStatusConfig();
  
  if (!config.text) return null;
  
  return (
    <div 
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${config.className}`}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default DraftNotification;
