
import React, { useState, useEffect } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/common/Button';

interface VideoCallProps {
  doctorName: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ doctorName, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const { t, language } = useLanguage();

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Call timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (!isConnecting) {
      interval = window.setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnecting]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Doctor's video (simulated) */}
      <div className="flex-1 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnecting ? (
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>{language === 'fr' ? 'Connexion en cours...' : 'جاري الاتصال...'}</p>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl mb-2">
                {doctorName.charAt(0)}
              </div>
              <p>{doctorName}</p>
            </div>
          )}
        </div>
        
        {/* Patient's video preview */}
        <div className={cn(
          "absolute bottom-4 right-4 w-32 h-48 bg-gray-900 rounded-lg overflow-hidden border-2",
          isVideoOff ? "border-red-500" : "border-white"
        )}>
          {isVideoOff ? (
            <div className="h-full flex items-center justify-center text-white">
              <VideoOff size={24} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white bg-gray-700">
              <User size={24} />
            </div>
          )}
        </div>
        
        {/* Call timer */}
        <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {formatTime(callTime)}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              isMuted ? "bg-red-500" : "bg-gray-700"
            )}
          >
            {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
          </button>
          
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center"
          >
            <Phone size={24} className="text-white transform rotate-135" />
          </button>
          
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              isVideoOff ? "bg-red-500" : "bg-gray-700"
            )}
          >
            {isVideoOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
