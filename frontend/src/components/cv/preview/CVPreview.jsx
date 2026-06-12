import React from 'react';

export default function CVPreview({ cvData }) {
  // Konfigurasi ukuran tetap (Small/Compact)
  const containerPadding = 'p-3';
  const nameSize = 'text-lg';
  const positionSize = 'text-xs';
  const sectionTitleSize = 'text-sm font-bold';
  const textSize = 'text-xs';
  const subTextSize = 'text-[10px]';
  const gapSize = 'gap-2';
  const mbSize = 'mb-3';
  const photoSize = 'w-14 h-16';

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
    <div className={`bg-white shadow-sm rounded-lg ${containerPadding} font-sans text-gray-800 h-full overflow-y-auto`}>
      {/* Header Section */}
      <div className={`border-b-2 border-[#0F4C75] pb-3 mb-3`}>
        <div className="flex items-start gap-3">
          {cvData.photo?.url && (
            <img
              src={cvData.photo.url}
              alt="Profile"
              className={`${photoSize} object-cover rounded border border-gray-300 flex-shrink-0`}
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className={`${nameSize} font-bold text-gray-900 mb-0.5 truncate`}>
              {cvData.fullName || 'Nama Anda'}
            </h1>
            <p className={`${positionSize} text-[#0F4C75] font-medium mb-1.5 truncate`}>
              {cvData.targetPosition || 'Posisi yang Dilamar'}
            </p>
            
            {/* Contact Info */}
            {cvData.contactInfo.length > 0 && (
              <div className={`flex flex-wrap ${gapSize} ${subTextSize} text-gray-600`}>
                {cvData.contactInfo.map((contact, i) => (
                  <div key={i} className="flex items-center gap-1 min-w-0">
                    <span className="flex-shrink-0">{contact.icon}</span>
                    <span className="truncate max-w-[120px]">{contact.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {cvData.profileSummary && (
        <div className={`mb-3`}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-1.5 border-b border-gray-200 pb-1`}>
            Profil Profesional
          </h2>
          <p className={`${textSize} leading-tight text-gray-700 line-clamp-3`}>
            {cvData.profileSummary}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {cvData.skills.length > 0 && (
        <div className={`mb-3`}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-1.5 border-b border-gray-200 pb-1`}>
            Keahlian & Skill
          </h2>
          <div className="space-y-2">
            {cvData.skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`${textSize} font-medium text-gray-800 truncate pr-2`}>{skill.name}</span>
                  <span className={`${textSize} text-gray-500 flex-shrink-0`}>{getMasteryLevel(skill.masteryLevel)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#0F4C75] h-1.5 rounded-full transition-all"
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
        <div className={`mb-3`}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-2 border-b border-gray-200 pb-1`}>
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {cvData.workExperience.map((exp, i) => (
              <div key={i} className="page-break-inside-avoid">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`${textSize} font-semibold text-gray-900 truncate pr-2`}>{exp.position}</h3>
                  <span className={`${subTextSize} text-gray-500 whitespace-nowrap ml-2`}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className={`${textSize} text-[#0F4C75] font-medium mb-0.5`}>{exp.company}</p>
                {exp.location && (
                  <p className={`${subTextSize} text-gray-500 mb-1`}>{exp.location}</p>
                )}
                
                {exp.description && (
                  <p className={`${textSize} text-gray-700 mb-1.5 leading-tight line-clamp-2`}>{exp.description}</p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-0.5">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className={`${textSize} text-gray-700 flex items-start`}>
                        <span className="mr-1.5 text-[#0F4C75] mt-0.5">•</span>
                        <span className="line-clamp-2">{achievement}</span>
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
        <div className={`mb-3`}>
          <h2 className={`${sectionTitleSize} text-[#0F4C75] uppercase tracking-wide mb-2 border-b border-gray-200 pb-1`}>
            Pendidikan
          </h2>
          <div className="space-y-2">
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
        <div className={`flex items-center justify-center h-48 text-gray-400`}>
          <p className={`${textSize} text-center px-4`}>Isi formulir untuk melihat preview CV</p>
        </div>
      )}
    </div>
  );
}
