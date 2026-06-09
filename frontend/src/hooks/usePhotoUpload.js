import { useState, useCallback } from 'react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
const CLOUDINARY_ASSET_FOLDER = import.meta.env.VITE_CLOUDINARY_ASSET_FOLDER || 'cv-uploads';

// Debug: Log jika env vars tidak ada (hanya di development)
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables:', {
    VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    VITE_CLOUDINARY_ASSET_FOLDER: import.meta.env.VITE_CLOUDINARY_ASSET_FOLDER
  });
  
  if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
    console.warn('⚠️ VITE_CLOUDINARY_CLOUD_NAME tidak ditemukan, menggunakan default "demo"');
  }
  if (!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
    console.warn('⚠️ VITE_CLOUDINARY_UPLOAD_PRESET tidak ditemukan, menggunakan default "ml_default"');
  }
  
  console.log('🔧 Cloudinary config:', { 
    cloudName: CLOUDINARY_CLOUD_NAME, 
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    assetFolder: CLOUDINARY_ASSET_FOLDER,
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  });
}

/**
 * Custom hook untuk handle photo upload ke Cloudinary
 * @param {Function} onUploadComplete - Callback saat upload selesai dengan URL
 * @param {Function} onFileDelete - Callback saat file akan dihapus (untuk cleanup backend)
 */
export const usePhotoUpload = (onUploadComplete, onFileDelete) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);
  
  // Extract public_id dari Cloudinary URL
  const extractPublicId = useCallback((url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{ext}
      const pathParts = urlObj.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1 && pathParts.length > uploadIndex + 2) {
        // Skip version (v1234567890) and get the rest
        const afterUpload = pathParts.slice(uploadIndex + 1);
        const publicIdWithExt = afterUpload.slice(1).join('/'); // Skip version
        return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
      }
    } catch (err) {
      console.error('Error extracting public_id:', err);
    }
    return null;
  }, []);

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

  const uploadFile = async (file, maxSize = 2 * 1024 * 1024, currentUrl = null) => {
    // Validasi file
    const validation = validateFile(file, maxSize);
    if (!validation.valid) {
      setError(validation.message);
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    // Simpan URL lama untuk cleanup nanti
    const oldUrl = currentUrl || uploadedUrl;
    if (oldUrl) {
      setPreviousUrl(oldUrl);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', CLOUDINARY_ASSET_FOLDER || 'cv-uploads');
      
      // Generate unique public_id untuk setiap upload agar tidak ada overwrite
      // Format: cv-uploads/{user-id}/{timestamp}-{random}
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const uniquePublicId = `${CLOUDINARY_ASSET_FOLDER || 'cv-uploads'}/temp/${timestamp}-${randomStr}`;
      formData.append('public_id', uniquePublicId);

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
        const errorData = await response.json().catch(() => ({}));
        console.error('Cloudinary upload error response:', errorData);
        throw new Error(errorData.error?.message || `Upload gagal: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cloudinary upload success:', data); // Debug log
      
      const imageUrl = data.secure_url;
      const publicId = data.public_id;
      
      if (!imageUrl) {
        throw new Error('Upload berhasil tapi tidak ada URL yang dikembalikan');
      }
      
      setUploadedUrl(imageUrl);
      
      // Jika ada URL lama, schedule cleanup
      if (oldUrl && oldUrl !== imageUrl) {
        const oldPublicId = extractPublicId(oldUrl);
        if (oldPublicId) {
          // Notify parent untuk cleanup (call backend API untuk delete dari Cloudinary)
          if (onFileDelete) {
            // Delay cleanup sebentar untuk memastikan upload baru berhasil
            setTimeout(() => {
              onFileDelete(oldUrl, oldPublicId);
            }, 2000);
          }
        }
      }
      
      if (onUploadComplete) {
        onUploadComplete(imageUrl, publicId);
      }
      
      return imageUrl;
    } catch (err) {
      console.error('❌ Error uploading image:', err);
      const errorMessage = err.message.includes('CORS') 
        ? 'Upload gagal: Masalah CORS. Pastikan Cloudinary preset sudah dikonfigurasi untuk unsigned upload.'
        : `Gagal mengupload foto: ${err.message}`;
      setError(errorMessage);
      // Restore previous URL jika upload gagal
      if (previousUrl) {
        setUploadedUrl(previousUrl);
      }
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = useCallback(async () => {
    const urlToRemove = uploadedUrl;
    const publicId = extractPublicId(urlToRemove);
    
    setUploadedUrl(null);
    setError(null);
    
    if (onUploadComplete) {
      onUploadComplete(null, null);
    }
    
    // Notify parent untuk cleanup file dari Cloudinary
    if (urlToRemove && publicId && onFileDelete) {
      try {
        await onFileDelete(urlToRemove, publicId);
      } catch (err) {
        console.error('Error deleting file:', err);
        // Jangan throw error ke user, file sudah dihapus dari UI
      }
    }
  }, [uploadedUrl, extractPublicId, onUploadComplete, onFileDelete]);

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
