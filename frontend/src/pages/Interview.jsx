import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Interview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State untuk session dan messages
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // State untuk camera
  const videoRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Ref untuk auto-scroll chat
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sessionId && sessionId !== 'new') {
      fetchSession();
      fetchMessages();
    } else {
      setLoading(false);
    }

    return () => {
      // Cleanup camera stream saat component unmount
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [sessionId]);

  useEffect(() => {
    // Auto-scroll ke pesan terakhir
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Enable camera saat component mount
    enableCamera();
  }, []);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
    }
  };

  const disableCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
    }
  };

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      setSession(response.data);
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('Gagal memuat sesi wawancara');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Gagal memuat riwayat chat');
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await api.post('/sessions', {
        mode: 'video',
        posisi_target: 'Software Engineer',
        bahasa: 'id',
      });
      navigate(`/interview/${response.data.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Gagal membuat sesi wawancara baru');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const currentSessionId = sessionId === 'new' ? session?.id : sessionId;
      
      // Kirim pesan kandidat
      const response = await api.post(`/sessions/${currentSessionId}/messages`, {
        peran: 'kandidat',
        isi: inputMessage.trim(),
      });

      const newUserMessage = response.data;
      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');

      // Trigger AI response (biasanya backend akan auto-respond, tapi kita bisa poll atau wait)
      // Untuk simplicity, kita asumsikan backend akan auto-generate response
      setTimeout(async () => {
        await fetchMessages();
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.detail || 'Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  const endInterview = async () => {
    if (!confirm('Akhiri wawancara ini?')) return;

    try {
      await api.patch(`/sessions/${sessionId}`, {
        status: 'selesai',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending interview:', error);
    }
  };

  const handleStartNew = () => {
    if (sessionId === 'new') {
      createNewSession();
    }
  };

  if (loading && sessionId !== 'new') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 transition-layout relative overflow-hidden">
      {/* Video Background / Camera Area */}
      <div className={`
        absolute inset-0 transition-all duration-500 ease-in-out
        ${sessionId !== 'new' ? 'md:w-3/5 md:left-0 md:right-auto' : ''}
      `}>
        {cameraEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-400">Kamera tidak aktif</p>
              {cameraError && <p className="text-red-400 text-sm mt-2">{cameraError}</p>}
            </div>
          </div>
        )}

        {/* Camera Toggle */}
        <button
          onClick={() => cameraEnabled ? disableCamera() : enableCamera()}
          className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {cameraEnabled ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* End Interview Button (desktop) */}
        {sessionId !== 'new' && (
          <button
            onClick={endInterview}
            className="absolute top-4 right-4 hidden md:block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Akhiri Wawancara
          </button>
        )}
      </div>

      {/* Chat Overlay Panel */}
      <div className={`
        absolute transition-all duration-500 ease-in-out
        ${sessionId === 'new' 
          ? 'inset-0 flex items-center justify-center p-4' 
          : 'bottom-0 left-0 right-0 md:left-3/5 md:w-2/5 md:h-screen'
        }
      `}>
        <Card 
          className={`
            bg-white/90 backdrop-blur-lg shadow-2xl
            ${sessionId === 'new' 
              ? 'w-full max-w-md' 
              : 'w-full h-[40vh] md:h-screen rounded-t-2xl md:rounded-none border-l border-slate-200'
            }
          `}
          padding="p-0"
        >
          {sessionId === 'new' ? (
            /* Start New Session Screen */
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-primary-light rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Mulai Wawancara Baru</h2>
              <p className="text-slate-600 mb-6">
                AI akan menjadi pewawancara Anda. Siap untuk memulai?
              </p>
              <Button onClick={handleStartNew} loading={sending} fullWidth size="lg">
                Mulai Sekarang
              </Button>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 text-sm text-slate-600 hover:text-slate-800"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">Wawancara AI</h3>
                  <p className="text-xs text-slate-500">
                    {messages.length} pesan • {session?.posisi_target || 'Posisi Umum'}
                  </p>
                </div>
                <button
                  onClick={endInterview}
                  className="md:hidden px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  Akhiri
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.peran === 'kandidat' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] px-4 py-3 rounded-2xl
                        ${msg.peran === 'kandidat'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-slate-100 text-slate-800 rounded-bl-md'
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.isi}</p>
                      <p className={`text-xs mt-1 ${msg.peran === 'kandidat' ? 'text-white/70' : 'text-slate-500'}`}>
                        {new Date(msg.dibuat_pada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ketik jawaban Anda..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={sending}
                  />
                  <Button 
                    type="submit" 
                    loading={sending} 
                    disabled={!inputMessage.trim()}
                    className="px-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Interview;
