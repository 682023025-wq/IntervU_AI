import { useEffect, useCallback, useState, useRef } from 'react';

/**
 * Custom hook untuk auto-save form data ke localStorage dengan debounce
 * 
 * @param {Object} formData - Data form yang akan di-save (dari watch() react-hook-form)
 * @param {string} userId - ID user untuk key localStorage
 * @param {Function} onDraftFound - Callback saat draft ditemukan (optional)
 * @returns {Object} { isSaving, lastSavedAt, saveStatus, clearDraft, manualSave }
 */
export const useAutoSave = (formData, userId, onDraftFound) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState(null);
  
  const timeoutRef = useRef(null);
  const DEBOUNCE_DELAY = 500; // 500ms debounce
  
  // Generate localStorage key
  const getStorageKey = useCallback(() => {
    return `intervu_cv_draft_${userId}`;
  }, [userId]);
  
  const getTimestampKey = useCallback(() => {
    return `intervu_cv_draft_${userId}_timestamp`;
  }, [userId]);
  
  // Check for existing draft on mount
  useEffect(() => {
    const checkForDraft = () => {
      try {
        const storageKey = getStorageKey();
        const timestampKey = getTimestampKey();
        
        const savedData = localStorage.getItem(storageKey);
        const savedTimestamp = localStorage.getItem(timestampKey);
        
        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Only consider it a draft if it has meaningful data
          if (parsed && Object.keys(parsed).length > 0) {
            setHasDraft(true);
            setDraftTimestamp(savedTimestamp ? new Date(savedTimestamp) : new Date());
            
            if (onDraftFound) {
              onDraftFound(parsed, savedTimestamp ? new Date(savedTimestamp) : null);
            }
          }
        }
      } catch (error) {
        console.warn('Error checking for draft:', error);
        // Don't crash, just log the error
      }
    };
    
    checkForDraft();
  }, [getStorageKey, getTimestampKey, onDraftFound]);
  
  // Filter out file/blob data before saving (too large for localStorage)
  const filterFormData = useCallback((data) => {
    if (!data) return {};
    
    const filtered = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip if value is a File or Blob
      if (value instanceof File || value instanceof Blob) {
        continue;
      }
      
      // Handle arrays (filter out file objects)
      if (Array.isArray(value)) {
        filtered[key] = value.filter(item => !(item instanceof File || item instanceof Blob));
      } else {
        filtered[key] = value;
      }
    }
    
    return filtered;
  }, []);
  
  // Save to localStorage with error handling
  const saveToStorage = useCallback((data) => {
    try {
      const storageKey = getStorageKey();
      const timestampKey = getTimestampKey();
      
      // Filter out file data
      const filteredData = filterFormData(data);
      
      // Check localStorage quota (rough estimate)
      const estimatedSize = JSON.stringify(filteredData).length;
      const QUOTA_LIMIT = 4.5 * 1024 * 1024; // ~4.5MB (safe limit under 5MB)
      
      if (estimatedSize > QUOTA_LIMIT) {
        setSaveStatus('error');
        console.warn('⚠️ LocalStorage hampir penuh! Data terlalu besar untuk di-save.');
        return false;
      }
      
      localStorage.setItem(storageKey, JSON.stringify(filteredData));
      localStorage.setItem(timestampKey, new Date().toISOString());
      
      setLastSavedAt(new Date());
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        setSaveStatus('error');
        console.error('❌ LocalStorage penuh! Tidak bisa menyimpan draft.');
      } else {
        setSaveStatus('error');
        console.error('❌ Error saving draft:', error);
      }
      return false;
    }
  }, [getStorageKey, getTimestampKey, filterFormData]);
  
  // Manual save function (can be called externally)
  const manualSave = useCallback((data) => {
    if (!data || Object.keys(data).length === 0) return false;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    const success = saveToStorage(data);
    setIsSaving(false);
    
    return success;
  }, [saveToStorage]);
  
  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      const timestampKey = getTimestampKey();
      
      localStorage.removeItem(storageKey);
      localStorage.removeItem(timestampKey);
      
      setHasDraft(false);
      setDraftTimestamp(null);
      setLastSavedAt(null);
      setSaveStatus('idle');
      
      console.log('✅ Draft berhasil dihapus');
      return true;
    } catch (error) {
      console.error('❌ Error clearing draft:', error);
      return false;
    }
  }, [getStorageKey, getTimestampKey]);
  
  // Auto-save effect with debounce
  useEffect(() => {
    // Don't save if no userId or empty formData
    if (!userId || !formData || Object.keys(formData).length === 0) {
      return;
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      manualSave(formData);
    }, DEBOUNCE_DELAY);
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, userId, manualSave]);
  
  // Format timestamp for display
  const formatLastSaved = useCallback(() => {
    if (!lastSavedAt) return '';
    
    const now = new Date();
    const diff = Math.floor((now - lastSavedAt) / 1000); // seconds
    
    if (diff < 5) return 'Baru saja';
    if (diff < 60) return `${diff} detik yang lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    
    return lastSavedAt.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, [lastSavedAt]);
  
  return {
    isSaving,
    lastSavedAt,
    saveStatus,
    hasDraft,
    draftTimestamp,
    clearDraft,
    manualSave,
    formatLastSaved
  };
};

export default useAutoSave;
