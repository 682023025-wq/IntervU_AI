import React, { useRef, useEffect, useState } from 'react';

export default function CVPreview({ cvData, containerWidth }) {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  
  // Base width desain CV (width asli saat belum di-resize)
  const BASE_WIDTH = 350;

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      // Hitung scale factor berdasarkan lebar container
      // Clamp scale antara 0.4 sampai 1.2 agar tidak terlalu kecil atau besar
      const newScale = Math.max(0.4, Math.min(1.2, containerWidth / BASE_WIDTH));
      setScale(newScale);
    }
  }, [containerWidth]);

export default function CVPreview({ cvData, size = 'medium' }) {
  const isLarge = size === 'large';

  // Konfigurasi ukuran berdasarkan mode
  const containerPadding = isLarge ? 'p-6' : 'p-4';
  const nameSize = isLarge ? 'text-2xl' : 'text-lg';
  const positionSize = isLarge ? 'text-sm' : 'text-xs';
  const sectionTitleSize = isLarge ? 'text-base font-bold' : 'text-sm font-semibold';
  const textSize = isLarge ? 'text-sm' : 'text-xs';
  const subTextSize = isLarge ? 'text-xs' : 'text-[10px]';
  const gapSize = isLarge ? 'gap-3' : 'gap-2';
  const mbSize = isLarge ? 'mb-4' : 'mb-3';
  const photoSize = isLarge ? 'w-20 h-24' : 'w-16 h-20';

export default function CVPreview({ cvData, size = 'medium' }) {
  const isLarge = size === 'large';

  // Konfigurasi ukuran berdasarkan mode
  const containerPadding = isLarge ? 'p-6' : 'p-4';
  const nameSize = isLarge ? 'text-2xl' : 'text-lg';
  const positionSize = isLarge ? 'text-sm' : 'text-xs';
  const sectionTitleSize = isLarge ? 'text-base font-bold' : 'text-sm font-semibold';
  const textSize = isLarge ? 'text-sm' : 'text-xs';
  const subTextSize = isLarge ? 'text-xs' : 'text-[10px]';
  const gapSize = isLarge ? 'gap-3' : 'gap-2';
  const mbSize = isLarge ? 'mb-4' : 'mb-3';
  const photoSize = isLarge ? 'w-20 h-24' : 'w-16 h-20';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  };

  const getMasteryLevel = (level) => {
    switch (level) {
      case 'beginner': return 'Pemula';
      case 'intermediate': return 'Menengah';
      case 'advanced': return 'Lanjut';
      case 'expert': return 'Ahli';
      default: return level;
    }
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg ${containerPadding} font-sans text-gray-800 transition-all duration-300 h-full`}>
      {/* Header Section */}
      <div className={`border-b-2 border-primary-600 pb-4 mb-4`}>
        <div className="flex items-start gap-4">
          {cvData.photo?.url && (
            <img
              src={cvData.photo.url}
              alt="Profile"
              className={`${photoSize} object-cover rounded-lg border border-gray-300`}
            />
          )}
          <div className="flex-1">
            <h1 className={`${nameSize} font-bold text-gray-900 mb-1`}>
              {cvData.fullName || 'Nama Anda'}
            </h1>
            <p className={`${positionSize} text-primary-600 font-medium mb-2`}>
              {cvData.targetPosition || 'Posisi yang Dilamar'}
            </p>
            
            {/* Contact Info */}
            {cvData.contactInfo.length > 0 && (
              <div className={`flex flex-wrap ${gapSize} ${subTextSize} text-gray-600`}>
                {cvData.contactInfo.map((contact, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span>{contact.icon}</span>
                    <span className="truncate max-w-[150px]">{contact.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {cvData.profileSummary && (
        <div className={`mb-4`}>
          <h2 className={`${sectionTitleSize} text-primary-600 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1`}>
            Profil Profesional
          </h2>
          <p className={`${textSize} leading-relaxed text-gray-700`}>
            {cvData.profileSummary}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {cvData.skills.length > 0 && (
        <div className={`mb-4`}>
          <h2 className={`${sectionTitleSize} text-primary-600 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1`}>
            Keahlian & Skill
          </h2>
          <div className="space-y-3">
            {cvData.skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`${textSize} font-medium text-gray-800`}>{skill.name}</span>
                  <span className={`${textSize} text-gray-500`}>{getMasteryLevel(skill.masteryLevel)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full transition-all"
                    style={{ 
                      width: `${skill.masteryLevel === 'beginner' ? 25 : skill.masteryLevel === 'intermediate' ? 50 : skill.masteryLevel === 'advanced' ? 75 : 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {cvData.workExperience.length > 0 && (
        <div className={`mb-4`}>
          <h2 className={`${sectionTitleSize} text-primary-600 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1`}>
            Pengalaman Kerja
          </h2>
          <div className="space-y-4">
            {cvData.workExperience.map((exp, i) => (
              <div key={i} className="page-break-inside-avoid">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`${textSize} font-semibold text-gray-900`}>{exp.position}</h3>
                  <span className={`${subTextSize} text-gray-500 whitespace-nowrap ml-2`}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className={`${textSize} text-primary-600 font-medium mb-1`}>{exp.company}</p>
                {exp.location && (
                  <p className={`${subTextSize} text-gray-500 mb-2`}>{exp.location}</p>
                )}
                
                {exp.description && (
                  <p className={`${textSize} text-gray-700 mb-2 leading-relaxed`}>{exp.description}</p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className={`${textSize} text-gray-700 flex items-start`}>
                        <span className="mr-2 text-primary-600">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div className={`mb-4`}>
          <h2 className={`${sectionTitleSize} text-primary-600 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1`}>
            Pendidikan
          </h2>
          <div className="space-y-3">
            {cvData.education.map((edu, i) => (
              <div key={i}>
                <h3 className={`${textSize} font-semibold text-gray-900`}>{edu.institution}</h3>
                <p className={`${textSize} text-gray-700`}>{edu.degree}</p>
                {edu.graduationYear && (
                  <p className={`${subTextSize} text-gray-500`}>Lulus: {edu.graduationYear}</p>
                )}
                {edu.gpa && (
                  <p className={`${subTextSize} text-gray-500`}>IPK: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!cvData.fullName && cvData.skills.length === 0 && cvData.workExperience.length === 0) && (
        <div className={`flex items-center justify-center h-64 text-gray-400`}>
          <p className={`${textSize} text-center`}>Isi formulir untuk melihat preview CV</p>
        </div>
      )}
      </div>
    </div>
  );
}
