import React from 'react';
import { X, Download } from 'lucide-react';

const CvPreview = ({ data, onClose }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 relative print:static print:shadow-none print:m-0">
        {/* Close Button - Hidden on Print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg print:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Print Button - Hidden on Print */}
        <button
          onClick={handlePrint}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 print:hidden"
        >
          <Download className="w-4 h-4" />
          Cetak / Simpan PDF
        </button>

        {/* CV Content - A4 Layout */}
        <div className="p-8 print:p-0 print:w-full">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.nama_lengkap}</h1>
                <p className="text-lg text-gray-600 mb-3">{data.posisi_target || 'Posisi yang Ditargetkan'}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📧 {data.email}</span>
                  <span>📱 {data.telepon}</span>
                  {data.alamat && <span>📍 {data.alamat}</span>}
                </div>
                {data.tautan_profesional && (
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-600">
                    {data.tautan_profesional.linkedin && (
                      <a href={data.tautan_profesional.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {data.tautan_profesional.github && (
                      <a href={data.tautan_profesional.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        GitHub
                      </a>
                    )}
                    {data.tautan_profesional.portfolio && (
                      <a href={data.tautan_profesional.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>
              {data.url_foto_cv && (
                <img
                  src={data.url_foto_cv}
                  alt="Foto Profil"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 print:border-gray-600"
                />
              )}
            </div>
          </div>

          {/* Deskripsi Diri */}
          {data.deskripsi_diri && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">TENTANG SAYA</h2>
              <p className="text-gray-700 leading-relaxed">{data.deskripsi_diri}</p>
            </div>
          )}

          {/* Pendidikan */}
          {data.pendidikan && data.pendidikan.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">PENDIDIKAN</h2>
              <div className="space-y-4">
                {data.pendidikan.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.institusi}</h3>
                        <p className="text-gray-700">{edu.jurusan}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">{edu.tahun_masuk} - {edu.tahun_lulus}</p>
                        <p className="text-sm text-gray-500">{edu.jenjang}</p>
                      </div>
                    </div>
                    {(edu.ipk || edu.prestasi) && (
                      <div className="mt-1 text-sm text-gray-600">
                        {edu.ipk && <span>IPK: {edu.ipk}</span>}
                        {edu.ipk && edu.prestasi && <span> | </span>}
                        {edu.prestasi && <span>{edu.prestasi}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keahlian */}
          {(data.keahlian_teknis?.length > 0 || data.keahlian_non_teknis?.length > 0 || data.bahasa?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">KEAHLIAN</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.keahlian_teknis?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Teknis</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.keahlian_teknis.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.keahlian_non_teknis?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Non-Teknis</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.keahlian_non_teknis.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.bahasa?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Bahasa</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.bahasa.map((lang, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pengalaman Kerja */}
          {data.pengalaman_kerja && data.pengalaman_kerja.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">PENGALAMAN KERJA</h2>
              <div className="space-y-4">
                {data.pengalaman_kerja.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.posisi}</h3>
                        <p className="text-gray-700">{exp.perusahaan}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{exp.tanggal_mulai}</p>
                        <p>{exp.sedang_bekerja ? 'Sekarang' : exp.tanggal_selesai}</p>
                      </div>
                    </div>
                    {exp.deskripsi && exp.deskripsi.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.deskripsi.map((point, pointIdx) => (
                          <li key={pointIdx} className="text-gray-700 text-sm list-disc list-inside">
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proyek */}
          {data.proyek && data.proyek.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">PROYEK</h2>
              <div className="space-y-4">
                {data.proyek.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{proj.nama_proyek}</h3>
                        <p className="text-gray-700">{proj.peran}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{proj.tanggal}</p>
                      </div>
                    </div>
                    {proj.teknologi && proj.teknologi.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {proj.teknologi.map((tech, techIdx) => (
                          <span key={techIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.deskripsi && (
                      <p className="mt-2 text-gray-700 text-sm">{proj.deskripsi}</p>
                    )}
                    {proj.pencapaian && (
                      <p className="mt-1 text-gray-600 text-sm italic">{proj.pencapaian}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sertifikasi */}
          {data.sertifikasi && data.sertifikasi.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">SERTIFIKASI</h2>
              <div className="space-y-3">
                {data.sertifikasi.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.nama}</h3>
                      <p className="text-gray-700">{cert.institusi}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{cert.tanggal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prestasi */}
          {data.prestasi && data.prestasi.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">PRESTASI</h2>
              <div className="space-y-3">
                {data.prestasi.map((achievement, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.nama}</h3>
                        <p className="text-gray-700">{achievement.penyelenggara}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{achievement.tanggal}</p>
                      </div>
                    </div>
                    {achievement.deskripsi && (
                      <p className="mt-1 text-gray-700 text-sm">{achievement.deskripsi}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvPreview;
