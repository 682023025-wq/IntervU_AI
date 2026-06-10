import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { usePhotoUpload, formatFileSize } from '../../../hooks/usePhotoUpload';
import api from '../../../services/api';

const PhotoUpload = ({
  value,
  onChange,
  maxSize = 2 * 1024 * 1024,
  aspectRatio = '3/4',
  name,
  label,
  required = false,
  onFileDelete
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const handleUploadComplete = useCallback((url, publicId) => {
    if (onChange) {
      onChange(url, publicId);
    }
  }, [onChange]);

  const { uploadFile, uploading, progress, error, uploadedUrl, setError } = usePhotoUpload(handleUploadComplete, onFileDelete);

  // Gunakan value dari props atau uploadedUrl dari hook
  const displayUrl = value || uploadedUrl;

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    try {
      // Pass current URL untuk cleanup nanti
      await uploadFile(file, maxSize, displayUrl);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setShowConfirmDelete(true);
  };

  const confirmRemove = async () => {
    console.log('🗑️ Starting photo deletion process...');
    
    // First, delete from Cloudinary via backend API
    if (displayUrl) {
      const publicId = extractPublicIdFromUrl(displayUrl);
      console.log('🔍 Extracted publicId:', publicId, 'from URL:', displayUrl);
      
      if (publicId) {
        try {
          console.log('📡 Calling backend API to delete from Cloudinary...');
          // Call backend API untuk hapus dari Cloudinary
          const response = await api.post('/cloudinary/delete', { public_id: publicId });
          console.log('✅ Cloudinary delete response:', response.data);
          
          if (response.data.status === 'success') {
            console.log('✅ Foto berhasil dihapus dari Cloudinary');
          } else if (response.data.status === 'skipped') {
            console.warn('⚠️ Cleanup dilewati (mungkin credentials tidak lengkap):', response.data.message);
          } else {
            console.error('❌ Gagal menghapus dari Cloudinary:', response.data);
          }
        } catch (err) {
          console.error('❌ Network error saat hapus dari Cloudinary:', err.message);
          console.error('Error details:', err.response?.data || err);
          // Jangan tampilkan error ke user, log saja
        }
      } else {
        console.warn('⚠️ Tidak dapat extract publicId dari URL:', displayUrl);
      }
    }
    
    // Then execute onFileDelete callback for database cleanup
    if (onFileDelete && displayUrl) {
      const publicId = extractPublicIdFromUrl(displayUrl);
      try {
        await onFileDelete(displayUrl, publicId);
      } catch (err) {
        console.error('Error in onFileDelete callback:', err);
      }
    }
    
    // Finally, remove from UI
    if (onChange) {
      onChange(null);
    }
    setShowConfirmDelete(false);
    setError(null);
  };

  // Helper function to extract public ID from Cloudinary URL
  const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1 && pathParts.length > uploadIndex + 2) {
        const afterUpload = pathParts.slice(uploadIndex + 1);
        const publicIdWithExt = afterUpload.slice(1).join('/'); // Skip version
        const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
        return publicId;
      }
    } catch {
      // Fallback: parse manual
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const cancelRemove = () => {
    setShowConfirmDelete(false);
  };

  // Extract filename from URL
  const getFilename = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    } catch {
      return url.split('/').pop() || 'foto.jpg';
    }
  };

  const filename = getFilename(displayUrl);

  // Render states
  if (showConfirmDelete) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">Yakin ingin menghapus foto?</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmRemove}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Ya, Hapus
            </button>
            <button
              type="button"
              onClick={cancelRemove}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - belum upload
  if (!displayUrl && !uploading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
          {!required && <span className="text-gray-400 text-xs ml-2">(Opsional, JPG/PNG, max {formatFileSize(maxSize)})</span>}
        </label>
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
            ${dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
            }
          `}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleInputChange}
            disabled={uploading}
            className="hidden"
            id={`${name}-upload`}
          />
          
          <div className="flex flex-col items-center">
            <ImageIcon className={`h-12 w-12 mb-3 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 font-medium">
              {dragOver ? 'Lepaskan file di sini' : 'Klik untuk upload atau drag & drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Format: JPG, PNG | Max: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Loading state - sedang upload
  if (uploading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6 opacity-70">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-12 w-12 text-blue-500 animate-pulse" />
            <p className="text-sm text-gray-600 font-medium">Mengupload...</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - sudah upload
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Mobile Layout (< md breakpoint) */}
      <div className="md:hidden">
        <div className="border-2 border-green-500 bg-white rounded-lg p-4 shadow-sm">
          <div className="badge-success mb-3">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3" />
              <span>Upload Berhasil</span>
            </span>
          </div>
          
          <div className="flex items-start space-x-3">
            {/* Preview */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="h-24 w-18 object-cover rounded-lg shadow-md"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title={filename}>
                {filename.length > 20 ? filename.substring(0, 20) + '...' : filename}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(maxSize)} • JPG/PNG
              </p>
            </div>
          </div>
          
          {/* Action Buttons - Stack Vertical */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="inline-flex items-center justify-center px-3 py-2 border-2 border-primary text-primary text-xs font-medium rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              <Upload className="h-3 w-3 mr-1" />
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Hapus
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop Layout (≥ md breakpoint) */}
      <div className="hidden md:block">
        <div className="border-2 border-green-500 bg-white rounded-lg p-6 shadow-sm max-w-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Upload Berhasil</span>
            </div>
          </div>
          
          <div className="flex items-start space-x-6">
            {/* Preview - Larger */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="h-40 w-32 object-cover rounded-lg shadow-md"
                  style={{ aspectRatio: '3/4' }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Lihat Full Size
                  </span>
                </div>
              </div>
            </div>
            
            {/* Info - Right Side with More Spacing */}
            <div className="flex-1">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-900" title={filename}>
                    {filename.length > 30 ? filename.substring(0, 30) + '...' : filename}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {filename.split('.').pop()?.toUpperCase() || 'JPG'}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(maxSize)}</span>
                </div>
                <p className="text-xs text-gray-400">Uploaded just now</p>
              </div>
              
              {/* Action Buttons - Inline */}
              <div className="mt-6 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border-2 border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleInputChange}
        disabled={uploading}
        className="hidden"
        id={`${name}-upload-desktop`}
      />
      
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
