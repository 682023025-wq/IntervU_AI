import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Halo! Selamat datang di sesi wawancara. Saya akan menjadi interviewer Anda hari ini. Bisa ceritakan tentang diri Anda?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terakhir
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Request camera access
  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 },
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'system',
          text: 'Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.',
          timestamp: new Date()
        }]);
      }
    };

    getCamera();

    // Cleanup
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    // Simulate AI response (nanti diganti dengan API call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Terima kasih atas jawaban Anda. Bisa berikan contoh spesifik dari pengalaman kerja Anda?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-all duration-500 ease-in-out">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-primary-500">IntervU AI</div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {isRecording ? '● Recording' : 'Not Recording'}
              </span>
              <Button size="sm" variant="outline" onClick={toggleRecording}>
                {isRecording ? 'Stop' : 'Start'} Recording
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="pt-16 min-h-screen">
        <div className="h-[calc(100vh-4rem)] transition-all duration-500 ease-in-out">
          {/* Mobile Portrait: Full screen video with overlay chat */}
          <div className="md:hidden h-full flex flex-col">
            {/* Video Container - Full Screen */}
            <div className="flex-1 relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Chat at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-2xl max-h-[40%] overflow-hidden flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-primary-500 text-white'
                            : msg.sender === 'system'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ketik jawaban Anda..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <Button size="sm" onClick={handleSendMessage}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Bar - Fixed Bottom */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex justify-center gap-4">
                <Button variant="secondary" size="sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </Button>
                <Button variant={isRecording ? 'secondary' : 'primary'} size="sm" onClick={toggleRecording}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
                <Button variant="secondary" size="sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop/Landscape: Split Screen */}
          <div className="hidden md:flex h-full">
            {/* Left: Video (60%) */}
            <div className="w-3/5 bg-black relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
            </div>

            {/* Right: Chat Panel (40%) */}
            <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-800">Interview Chat</h2>
                <p className="text-sm text-gray-500">AI Interviewer</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-primary-500 text-white'
                          : msg.sender === 'system'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ketik jawaban Anda..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button onClick={handleSendMessage}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
