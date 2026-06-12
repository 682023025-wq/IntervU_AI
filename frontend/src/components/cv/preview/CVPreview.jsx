import React from 'react';

export default function CVPreview({ cvData }) {
  // ✅ Konfigurasi ukuran SUPER MINI - Semua teks tampil lengkap
  const containerPadding = 'p-1';
  const nameSize = 'text-[8px]';        // 10px
  const positionSize = 'text-[6px]';     // 8px
  const sectionTitleSize = 'text-[7px] font-bold';  // 9px
  const textSize = 'text-[6px]';         // 8px
  const subTextSize = 'text-[5px]';      // 7px
  const gapSize = 'gap-0.2';             // 2px
  const mbSize = 'mb-1';                 // 4px
  const photoSize = 'w-3.5 h-6';           // 28x36px

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
    <div className={`bg-white shadow-sm rounded ${containerPadding} font-sans text-gray-800 h-full overflow-y-auto`}>
      {/* Header Section */}
      <div className={`border-b-2 border-[#0F4C75] pb-1 mb-1`}>
        <div className="flex items-start gap-1">
          {cvData.photo?.url && (
            <img
              src={cvData.photo.url}
              alt="Profile"
              className={`${photoSize} object-cover rounded-sm border border-gray-300 flex-shrink-0`}
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className={`${nameSize} font-bold text-gray-900 mb-0.5 leading-tight break-words`}>
              {cvData.fullName || 'Nama Anda'}
            </h1>
            <p className={`${positionSize} text-[#0F4C75] font-medium mb-0.5 break-words`}>
              {cvData.targetPosition || 'Posisi yang Dilamar'}
            </p>
            
            {/* Contact Info */}
            {cvData.contactInfo?.length > 0 && (
              <div className={`flex flex-wrap ${gapSize} ${subTextSize} text-gray-600`}>
                {cvData.contactInfo.map((contact, i) => (
                  <div key={i} className="flex items-center gap-0.5 min-w-0 break-all">
                    <span className="flex-shrink-0">{contact.icon}</span>
                    <span>{contact.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {cvData.profileSummary && (
        <div className={mbSize}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-0.5 border-b border-gray-200 pb-0.5`}>
            Profil
          </h2>
          <p className={`${textSize} leading-tight text-gray-700`}>
            {cvData.profileSummary}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {cvData.skills?.length > 0 && (
        <div className={mbSize}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-0.5 border-b border-gray-200 pb-0.5`}>
            Skill
          </h2>
          <div className="space-y-0.5">
            {cvData.skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`${textSize} font-medium text-gray-800`}>{skill.name}</span>
                  <span className={`${subTextSize} text-gray-500 flex-shrink-0 ml-1`}>{getMasteryLevel(skill.masteryLevel)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-0.5">
                  <div
                    className="bg-[#0F4C75] h-0.5 rounded-full transition-all"
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
      {cvData.workExperience?.length > 0 && (
        <div className={mbSize}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-0.5 border-b border-gray-200 pb-0.5`}>
            Pengalaman
          </h2>
          <div className="space-y-1">
            {cvData.workExperience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-0.5 gap-0.5">
                  <h3 className={`${textSize} font-semibold text-gray-900`}>{exp.position}</h3>
                  <span className={`${subTextSize} text-gray-500 whitespace-nowrap flex-shrink-0`}>
                    {formatDate(exp.startDate)}-{exp.current ? 'Now' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className={`${textSize} text-[#0F4C75] font-medium mb-0.5`}>{exp.company}</p>
                {exp.location && (
                  <p className={`${subTextSize} text-gray-500 mb-0.5`}>{exp.location}</p>
                )}
                
                {exp.description && (
                  <p className={`${textSize} text-gray-700 mb-0.5 leading-tight`}>{exp.description}</p>
                )}
                
                {exp.achievements?.length > 0 && (
                  <ul className="space-y-0.5">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className={`${subTextSize} text-gray-700 flex items-start`}>
                        <span className="mr-0.5 text-[#0F4C75] flex-shrink-0">•</span>
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
      {cvData.education?.length > 0 && (
        <div className={mbSize}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-0.5 border-b border-gray-200 pb-0.5`}>
            Pendidikan
          </h2>
          <div className="space-y-0.5">
            {cvData.education.map((edu, i) => (
              <div key={i}>
                <h3 className={`${textSize} font-semibold text-gray-900`}>{edu.institution}</h3>
                <p className={`${textSize} text-gray-700`}>{edu.degree}</p>
                {edu.graduationYear && (
                  <p className={`${subTextSize} text-gray-500`}>{edu.graduationYear}</p>
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
      {(!cvData.fullName && (!cvData.skills || cvData.skills.length === 0) && (!cvData.workExperience || cvData.workExperience.length === 0)) && (
        <div className={`flex items-center justify-center h-20 text-gray-400`}>
          <p className={`${textSize} text-center px-1`}>Isi formulir</p>
        </div>
      )}
    </div>
  );
}