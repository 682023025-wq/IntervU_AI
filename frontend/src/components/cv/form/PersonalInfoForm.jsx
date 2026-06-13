import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Plus, Trash2, Upload, GripVertical, Eye, EyeOff, Check, User } from 'lucide-react';

export default function PersonalInfoForm() {
  const { 
    state, 
    updateProfileSummary, 
    updatePhoto, 
    addContact, 
    removeContact, 
    reorderContacts,
    updateEmail,      // TODO: Pastikan fungsi ini ada di CVContext
    updatePhone,      // TODO: Pastikan fungsi ini ada di CVContext
    updateAddress,    // TODO: Pastikan fungsi ini ada di CVContext
  } = useCV();
  
  const { profileSummary, photo, contactInfo } = state.cvData;
  
  // State untuk field terpisah (diinisialisasi dari contactInfo jika ada, untuk backward compatibility)
  const [email, setEmail] = useState(contactInfo?.find(c => c.platform === 'email')?.value || '');
  const [phone, setPhone] = useState(contactInfo?.find(c => c.platform === 'phone')?.value || '');
  const [address, setAddress] = useState('');
  
  // State untuk feedback simpan
  const [saveMessage, setSaveMessage] = useState('');
  
  // State untuk kontak dinamis (media sosial/portfolio)
  const [newContact, setNewContact] = useState({
    platform: 'linkedin',
    value: '',
    url: '',
    show: true,
  });

  // Filter contactInfo untuk tidak menampilkan email & phone (karena sudah dipisah)
  const otherContacts = (contactInfo || []).filter(c => c.platform !== 'email' && c.platform !== 'phone');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showFeedback('❌ Ukuran foto maksimal 2MB');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showFeedback('❌ Format foto harus JPG atau PNG');
        return;
      }

      // TODO: Implement Cloudinary upload
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePhoto({
          url: reader.result,
          publicId: `temp_${Date.now()}`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContact = () => {
    if (newContact.value) {
      addContact({
        ...newContact,
        icon: getIconForPlatform(newContact.platform),
        order: (contactInfo?.length || 0) + 1,
      });
      setNewContact({ platform: 'linkedin', value: '', url: '', show: true });
    }
  };

  const getIconForPlatform = (platform) => {
    const icons = {
      linkedin: '💼',
      github: '🔧',
      instagram: '📷',
      facebook: '👥',
      portfolio: '🌐',
      other: '➕',
    };
    return icons[platform] || '➕';
  };

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'portfolio', label: 'Portfolio Website' },
    { value: 'other', label: 'Lainnya' },
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(\+62|08)[\d\-]{7,15}$/.test(phone.replace(/\s/g, ''));

  const toggleContactVisibility = (contactValue) => {
    const updated = (contactInfo || []).map(c => 
      c.value === contactValue ? { ...c, show: !c.show } : c
    );
    reorderContacts(updated);
  };

  const showFeedback = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Handle Simpan Semua Perubahan
  const handleSaveAll = () => {
    // Validasi
    if (!email) {
      showFeedback('❌ Email wajib diisi');
      return;
    }
    if (!validateEmail(email)) {
      showFeedback('❌ Format email tidak valid');
      return;
    }
    if (phone && !validatePhone(phone)) {
      showFeedback('❌ Format telepon tidak valid. Gunakan: 08xx-xxxx-xxxx');
      return;
    }

    // Simpan ke context
    try {
      updateEmail?.(email);
      updatePhone?.(phone);
      updateAddress?.(address);
      showFeedback('✓ Data informasi pribadi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving personal info:', error);
      showFeedback('❌ Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Feedback Toast */}
      {saveMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
          saveMessage.includes('❌') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* ========================================== */}
      {/* 1. HEADER: Judul & Deskripsi (Kiri) + Tombol Simpan (Kanan) */}
      {/* ========================================== */}
<div className="w-full">
  {/* BARIS 1: Judul (Kiri) dan Tombol (Kanan) */}
  <div className="flex justify-between items-center gap-3 w-full mb-1">
    
    {/* Judul */}
    <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 flex-1 min-w-0">
      <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
      <span className="truncate">Informasi Pribadi</span>
    </h2>

    {/* Tombol Simpan */}
    <button 
      onClick={handleSaveAll}
      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold text-xs sm:text-sm active:scale-95 shadow-sm whitespace-nowrap flex-shrink-0"
    >
      <Check className="w-4 h-4" />
      {/* Trik Responsive: Teks memendek di HP agar tombol tidak terlalu lebar */}
      <span className="hidden sm:inline">Simpan Perubahan</span>
      <span className="sm:hidden">Simpan</span>
    </button>
  </div>

  {/* BARIS 2: Deskripsi (Kiri, lebar penuh di bawah judul) */}
  <p className="text-[11px] sm:text-[16px] text-gray-600 leading-tight">
    Lengkapi informasi dasar Anda untuk CV yang profesional.
  </p>
</div>

      {/* ========================================== */}
      {/* 2. BOX FORM UTAMA */}
      {/* ========================================== */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        
        {/* Header Form */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            👤 Data Pribadi
          </span>
          <span className="text-xs text-gray-500 font-medium">Form Informasi Pribadi</span>
        </div>

        <div className="flex flex-col gap-5">
          
          {/* Foto Profil - Full Width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Foto Profil (3x4)</label>
            <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
              {photo?.url ? (
                <img
                  src={photo.url}
                  alt="Profile"
                  className="w-24 h-32 object-cover rounded-lg border-2 border-blue-500 shadow-sm"
                />
              ) : (
                <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-xs text-center">Foto<br/>3x4</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label 
                  htmlFor="photo-upload" 
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 w-fit"
                >
                  <Upload className="w-4 h-4" />
                  Upload Foto
                </label>
                <p className="text-xs text-gray-500">JPG/PNG, maks 2MB, rasio 3:4</p>
              </div>
            </div>
          </div>

          {/* Ringkasan Profesional - Full Width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Ringkasan Profesional <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Ceritakan secara singkat profil Anda, keahlian utama, dan tujuan karir..."
              value={profileSummary || ''}
              onChange={(e) => updateProfileSummary(e.target.value)}
              rows={4}
              maxLength={300}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
            <div className="flex justify-between items-center">
              <p className={`text-xs ${(profileSummary?.length || 0) < 150 ? 'text-red-500' : 'text-green-600'}`}>
                {(profileSummary?.length || 0) < 150 
                  ? `Min 150 karakter (kurang ${150 - (profileSummary?.length || 0)})` 
                  : '✓ Panjang sesuai'}
              </p>
              <p className="text-xs text-gray-500">
                {profileSummary?.length || 0}/300 karakter
              </p>
            </div>
          </div>

          {/* ========================================== */}
          {/* GRID: Email, Telepon, Alamat (TERPISAH) */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-sm font-semibold text-gray-700 sm:col-span-2 mb-1">Informasi Kontak Utama</span>
            {/* Alamat - Full Width */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Jl. Diponegoro No. 14, Salatiga, Jawa Tengah"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
              <p className="text-xs text-gray-500">💡 Opsional. Bisa diisi dengan kota domisili saja jika tidak ingin detail.</p>
            </div>            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
              {email && !validateEmail(email) && (
                <p className="text-xs text-red-500">Format email tidak valid</p>
              )}
            </div>

            {/* Telepon */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
              {phone && !validatePhone(phone) && (
                <p className="text-xs text-red-500">Format: 08xx-xxxx-xxxx atau +62xxx</p>
              )}
            </div>


          </div>

          {/* ========================================== */}
          {/* KONTAK LAINNYA (Media Sosial/Portfolio) */}
          {/* ========================================== */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <div>
              <label className="text-sm font-medium text-gray-700">Kontak Lainnya (Opsional)</label>
              <p className="text-xs text-gray-500 mt-0.5">LinkedIn, GitHub, Instagram, Portofolio, dll.</p>
            </div>

            {/* List Kontak yang Sudah Ditambahkan */}
            {otherContacts.length > 0 && (
              <div className="space-y-2">
                {otherContacts.map((contact) => (
                  <div
                    key={contact.value}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
                      <span className="text-lg flex-shrink-0">{contact.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium capitalize">{contact.platform}</p>
                        <p className="text-xs text-gray-500 truncate">{contact.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleContactVisibility(contact.value)}
                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        title={contact.show ? "Sembunyikan dari CV" : "Tampilkan di CV"}
                      >
                        {contact.show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeContact(contact.value)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Tambah Kontak */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newContact.platform}
                onChange={(e) => setNewContact({ ...newContact, platform: e.target.value })}
                className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white sm:w-40"
              >
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder={
                  newContact.platform === 'other' ? 'Link atau username' :
                  newContact.platform === 'portfolio' ? 'https://website-anda.com' :
                  `Link atau username ${newContact.platform}`
                }
                value={newContact.value}
                onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {newContact.platform === 'other' && (
                <input
                  type="text"
                  placeholder="Nama platform"
                  value={newContact.url}
                  onChange={(e) => setNewContact({ ...newContact, url: e.target.value })}
                  className="sm:w-36 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}
              <button
                onClick={handleAddContact}
                disabled={!newContact.value}
                className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}