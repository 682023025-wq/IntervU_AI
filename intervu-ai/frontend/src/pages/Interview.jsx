import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Interview page with camera and AI chat
const Interview = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Halo! Selamat datang di wawancara. Saya akan membantu Anda melalui proses ini. Mari kita mulai!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Initialize camera and microphone
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        streamRef.current = mediaStream;
        setStream(mediaStream);
        setError(null);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Tidak dapat mengakses kamera/mikrofon. Pastikan Anda memberikan izin.');
      }
    };

    startCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Terima kasih atas jawaban Anda. Bisa Anda jelaskan lebih detail tentang pengalaman tersebut?',
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // End interview
  const handleEndInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/profile');
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
            ← Kembali
          </Button>
          <h1 className="text-lg font-semibold">Wawancara AI</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={handleEndInterview}>
          Akhiri Wawancara
        </Button>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Camera Section */}
        <div 
          className={`
            relative bg-black transition-all duration-500 ease-in-out
            ${chatOpen ? 'w-full lg:w-[60%]' : 'w-full'}
          `}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
              <Card className="max-w-md">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
              </Card>
            </div>
          )}

          {/* Recording Indicator */}
          {stream && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              LIVE
            </div>
          )}

          {/* Mobile Chat Toggle */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="lg:hidden absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Chat Panel */}
        <div 
          className={`
            absolute lg:relative inset-x-0 bottom-0 lg:inset-auto lg:w-[40%]
            bg-white lg:bg-slate-50 rounded-t-2xl lg:rounded-none
            shadow-2xl lg:shadow-none
            transform transition-all duration-500 ease-in-out
            ${chatOpen ? 'translate-y-0 h-[60vh] lg:h-full' : 'translate-y-full lg:hidden'}
            flex flex-col
          `}
        >
          {/* Chat Header */}
          <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-slate-800">Chat AI</h2>
            <button
              onClick={() => setChatOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] px-4 py-2 rounded-2xl
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-md' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}
                  `}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik jawaban Anda..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={!inputMessage.trim()}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Interview;
