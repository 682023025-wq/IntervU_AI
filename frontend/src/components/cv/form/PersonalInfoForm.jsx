import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input, Label, Textarea } from '../../UI';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function PersonalInfoForm() {
  const { state, updateProfileSummary, updatePhoto, addContact, removeContact } = useCV();
  const { profileSummary, photo, contactInfo } = state.cvData;

  const [newContact, setNewContact] = useState({
    platform: 'linkedin',
    value: '',
    url: '',
    show: true,
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        order: contactInfo.length + 1,
      });
      setNewContact({ platform: 'linkedin', value: '', url: '', show: true });
    }
  };

  const getIconForPlatform = (platform) => {
    const icons = {
      email: '✉️',
      phone: '📱',
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
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telepon' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'portfolio', label: 'Portfolio Website' },
    { value: 'other', label: 'Lainnya' },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Informasi Pribadi</h2>

      <div className="space-y-6">
        {/* Foto Profil */}
        <div>
          <Label>Foto Profil (3x4)</Label>
          <div className="mt-2 flex items-center gap-4">
            {photo?.url ? (
              <img
                src={photo.url}
                alt="Profile"
                className="w-24 h-32 object-cover rounded-lg border-2 border-primary-500"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Foto 3x4</span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" as="span" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Foto
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPG/PNG, max 2MB, rasio 3:4
              </p>
            </div>
          </div>
        </div>

        {/* Ringkasan Profesional */}
        <div>
          <Label>Ringkasan Profesional *</Label>
          <Textarea
            placeholder="Ceritakan secara singkat profil Anda, keahlian utama, dan tujuan karir..."
            value={profileSummary}
            onChange={(e) => updateProfileSummary(e.target.value)}
            rows={4}
            maxLength={300}
          />
          <p className="text-xs text-gray-500 mt-1">
            {profileSummary.length}/300 karakter (min 150 karakter)
          </p>
        </div>

        {/* Informasi Kontak */}
        <div>
          <Label>Informasi Kontak</Label>
          <p className="text-xs text-gray-500 mb-3">
            Tambahkan kontak dan atur urutan prioritas
          </p>

          {/* List Kontak yang Sudah Ditambahkan */}
          {contactInfo.length > 0 && (
            <div className="space-y-2 mb-4">
              {contactInfo.map((contact, index) => (
                <div
                  key={contact.value}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{contact.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{contact.platform}</p>
                      <p className="text-xs text-gray-500">{contact.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeContact(contact.value)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Tambah Kontak */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={newContact.platform}
              onChange={(e) =>
                setNewContact({ ...newContact, platform: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <Input
              placeholder="Nilai (email/nomor/link)"
              value={newContact.value}
              onChange={(e) =>
                setNewContact({ ...newContact, value: e.target.value })
              }
            />
            <Button onClick={handleAddContact} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
