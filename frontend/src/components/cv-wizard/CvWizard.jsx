import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cvSchema } from '../../lib/validations/cvSchema';
import Step1BasicInfo from './Step1BasicInfo';
import Step2EducationSkills from './Step2EducationSkills';
import Step3ExperienceProjects from './Step3ExperienceProjects';
import Step4CertificationsReview from './Step4CertificationsReview';
import CvPreview from './CvPreview';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const steps = [
  { number: 1, title: 'Informasi Dasar' },
  { number: 2, title: 'Pendidikan & Keahlian' },
  { number: 3, title: 'Pengalaman & Proyek' },
  { number: 4, title: 'Sertifikasi & Review' }
];

const CACHE_KEY = 'cv_wizard_draft';

const CvWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasCache, setHasCache] = useState(false);
  const { user, updateUserProfile } = useAuth();

  // Load cached data on mount
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setFormData(parsed);
        setHasCache(true);
      } catch (e) {
        console.error('Error parsing cached CV data:', e);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(cvSchema),
    mode: 'onChange',
    defaultValues: {
      nama_lengkap: '',
      email: '',
      telepon: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      url_foto_cv: '',
      tautan_profesional: [],
      deskripsi_diri: '',
      pendidikan: [],
      keahlian_teknis: [],
      keahlian_non_teknis: [],
      bahasa: [],
      pengalaman_kerja: [],
      pengalaman_organisasi: [],
      proyek: [],
      sertifikasi: [],
      prestasi: [],
      posisi_target: '',
      bahasa_preferensi: 'id'
    }
  });

  // Load cached data into form
  useEffect(() => {
    if (formData && hasCache) {
      reset(formData);
    }
  }, [formData, hasCache, reset]);

  // Also load user profile data into form on mount
  useEffect(() => {
    if (profile && !hasCache) {
      const profileData = {
        nama_lengkap: profile.nama_lengkap || '',
        email: profile.email || '',
        telepon: profile.telepon || '',
        tanggal_lahir: profile.tanggal_lahir || '',
        jenis_kelamin: profile.jenis_kelamin || '',
        alamat: profile.alamat || '',
        url_foto_cv: profile.url_foto_cv || '',
        deskripsi_diri: profile.data_cv?.deskripsi_diri || '',
        tautan_profesional: profile.data_cv?.tautan_profesional || [],
        pendidikan: profile.data_cv?.pendidikan || [],
        keahlian_teknis: profile.data_cv?.keahlian_teknis || [],
        keahlian_non_teknis: profile.data_cv?.keahlian_non_teknis || [],
        bahasa: profile.data_cv?.bahasa || [],
        pengalaman_kerja: profile.data_cv?.pengalaman_kerja || [],
        pengalaman_organisasi: profile.data_cv?.pengalaman_organisasi || [],
        proyek: profile.data_cv?.proyek || [],
        sertifikasi: profile.data_cv?.sertifikasi || [],
        prestasi: profile.data_cv?.prestasi || [],
        posisi_target: profile.posisi_target || '',
        bahasa_preferensi: profile.bahasa_preferensi || 'id'
      };
      reset(profileData);
      setFormData(profileData);
    }
  }, [profile, hasCache, reset]);

  // Save to cache whenever formData changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const form = { register, handleSubmit, watch, setValue, formState: { errors } };

  const handleNext = async (data) => {
    // Validate current step before proceeding
    let fieldsToValidate = [];
    
    switch(currentStep) {
      case 1:
        fieldsToValidate = ['nama_lengkap', 'email', 'telepon', 'deskripsi_diri'];
        break;
      case 2:
        fieldsToValidate = ['pendidikan', 'keahlian_teknis', 'keahlian_non_teknis', 'bahasa'];
        break;
      case 3:
        // Step 3 is optional, no validation needed
        break;
      case 4:
        fieldsToValidate = ['sertifikasi', 'prestasi'];
        break;
      default:
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    // Merge new data with existing formData
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    // Save to cache immediately after merging
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedData));

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit CV
      await submitCV(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setHasCache(false);
  };

  const submitCV = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Prepare CV data for database
      const cvData = {
        pendidikan: data.pendidikan || [],
        keahlian_teknis: data.keahlian_teknis || [],
        keahlian_non_teknis: data.keahlian_non_teknis || [],
        bahasa: data.bahasa || [],
        pengalaman_kerja: data.pengalaman_kerja || [],
        pengalaman_organisasi: data.pengalaman_organisasi || [],
        proyek: data.proyek || [],
        sertifikasi: data.sertifikasi || [],
        prestasi: data.prestasi || [],
        ringkasan_profesional: data.deskripsi_diri || '',
        tautan_profesional: data.tautan_profesional || {}
      };

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nama_lengkap: data.nama_lengkap,
          email: data.email,
          telepon: data.telepon,
          tanggal_lahir: data.tanggal_lahir || null,
          jenis_kelamin: data.jenis_kelamin || null,
          alamat: data.alamat || null,
          url_foto_cv: data.url_foto_cv || null,
          posisi_target: data.posisi_target || null,
          bahasa_preferensi: data.bahasa_preferensi || 'id',
          data_cv: cvData,
          tanggal_diperbarui: new Date().toISOString()
        });

      if (error) throw error;

      // Clear cache after successful submission
      clearCache();
      
      setSubmitSuccess(true);
      
      // Update auth context
      await updateUserProfile();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Gagal menyimpan CV. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <Step1BasicInfo form={form} onNext={handleNext} />;
      case 2:
        return <Step2EducationSkills form={form} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3ExperienceProjects form={form} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4CertificationsReview form={form} onNext={handleNext} onBack={handleBack} data={formData} />;
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">CV Berhasil Disimpan!</h2>
          <p className="text-gray-600 mb-4">Anda akan diarahkan ke dashboard...</p>
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat CV Anda</h1>
          <p className="text-gray-600">Lengkapi informasi berikut untuk membuat CV profesional</p>
          {hasCache && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
              <p className="text-sm text-yellow-700">
                💾 Draft sebelumnya ditemukan! Data Anda telah dipulihkan otomatis.
                <button
                  type="button"
                  onClick={clearCache}
                  className="ml-2 text-yellow-900 underline hover:no-underline"
                >
                  Hapus draft
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                } hidden sm:block`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {renderStep()}
        </div>

        {/* Preview Button */}
        {currentStep === 4 && formData && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              👁️ Lihat Preview CV
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-700 font-medium">Menyimpan CV...</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <CvPreview data={formData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default CvWizard;
