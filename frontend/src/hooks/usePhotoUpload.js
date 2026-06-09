import { useState, useCallback } from 'react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Custom hook untuk handle photo upload ke Cloudinary
 */
export const usePhotoUpload = (onUploadComplete) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const validateFile = (file, maxSize = 2 * 1024 * 1024) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Format foto harus JPG atau PNG' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, message: `Ukuran foto maksimal ${formatFileSize(maxSize)}` };
    }
    
    return { valid: true };
  };

  const uploadFile = async (file, maxSize = 2 * 1024 * 1024) => {
    // Validasi file
    const validation = validateFile(file, maxSize);
    if (!validation.valid) {
      setError(validation.message);
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'cv_photos');

      // Simulasi progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Upload gagal');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;
      
      setUploadedUrl(imageUrl);
      
      if (onUploadComplete) {
        onUploadComplete(imageUrl);
      }
      
      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Gagal mengupload foto. Silakan coba lagi.');
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = useCallback(() => {
    setUploadedUrl(null);
    setError(null);
    if (onUploadComplete) {
      onUploadComplete(null);
    }
  }, [onUploadComplete]);

  return {
    uploadFile,
    removeFile,
    uploading,
    progress,
    error,
    uploadedUrl,
    setError
  };
};

/**
 * Format file size dari bytes ke KB/MB
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file sebelum upload
 */
export const validateFile = (file, maxSize = 2 * 1024 * 1024) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Format foto harus JPG atau PNG' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, message: `Ukuran foto maksimal ${formatFileSize(maxSize)}` };
  }
  
  return { valid: true };
};
