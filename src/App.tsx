import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#00FF00]/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-[#FF00FF]/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch gap-8 z-10">
        
        {/* Game Area */}
        <div className="flex-1 w-full flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.6)] mb-1">
              Neon Snake
            </h1>
            <p className="text-[#00FF00]/60 text-xs sm:text-sm tracking-[0.3em] uppercase">
              Cybernetic Edition
            </p>
          </div>
          
          <div className="w-full max-w-[500px] relative rounded-2xl overflow-hidden border border-[#00FF00]/30 shadow-[0_0_40px_rgba(0,255,0,0.15)] bg-black/60 backdrop-blur-md p-4 sm:p-6 flex justify-center">
             <SnakeGame score={score} setScore={setScore} />
          </div>
          
          <p className="text-[#00FF00]/40 text-xs text-center">
            [ W A S D ] or [ ARROWS ] to move. [ SPACE ] to pause.
          </p>
        </div>
        
        {/* Side Panel: Music & Stats */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 justify-center">
          
          {/* Score Board */}
          <div className="border border-[#00FFFF]/30 bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_30px_rgba(0,255,255,0.1)] relative overflow-hidden group">
            <div className="absolute top-[0] left-[50%] -translate-x-[50%] w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_top,_rgba(0,255,255,0.15)_0%,_transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <h2 className="text-[#00FFFF] text-sm uppercase tracking-widest font-bold opacity-80 mb-2 relative z-10">
              System Score
            </h2>
            <div className="text-6xl sm:text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10 tracking-tighter">
              {score}
            </div>
          </div>

          {/* Music Player */}
          <MusicPlayer />
          
        </div>
      </div>
    </div>
  );
}
