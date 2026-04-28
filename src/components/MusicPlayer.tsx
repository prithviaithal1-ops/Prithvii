import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc3 } from 'lucide-react';

const TRACKS = [
  { 
    id: 1, 
    title: 'Neon Drift {AI Mix}', 
    artist: 'Neural-Net Alpha', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
  },
  { 
    id: 2, 
    title: 'Cybernetic Dreams', 
    artist: 'GAN Synth', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' 
  },
  { 
    id: 3, 
    title: 'Quantum Resonance', 
    artist: 'Deep Lrn', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' 
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full border border-[#FF00FF]/30 bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(255,0,255,0.1)] relative overflow-hidden group">
      
      {/* Decorative background glow */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(255,0,255,0.15)_0%,_transparent_50%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full border-2 border-[#FF00FF] flex items-center justify-center bg-black shadow-[0_0_15px_rgba(255,0,255,0.4)]">
            <Disc3 size={28} className={`text-[#FF00FF] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-[#FF00FF] font-bold text-sm tracking-wide truncate">
              {currentTrack.title}
            </h3>
            <p className="text-[#FF00FF]/60 text-xs truncate">
              {currentTrack.artist}
            </p>
          </div>
          <Volume2 size={16} className="text-[#FF00FF]/40" />
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-[#FF00FF]/20 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#FF00FF] shadow-[0_0_10px_rgba(255,0,255,0.8)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={skipBack}
            className="text-[#FF00FF]/70 hover:text-[#FF00FF] hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#FF00FF]/10 border border-[#FF00FF] flex items-center justify-center text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={skipForward}
            className="text-[#FF00FF]/70 hover:text-[#FF00FF] hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
