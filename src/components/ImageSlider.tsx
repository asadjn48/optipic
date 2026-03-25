import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ArrowLeftRight } from 'lucide-react';

interface ImageSliderProps {
  before: string;
  after: string;
  className?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ before, after, className }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video rounded-3xl overflow-hidden select-none cursor-ew-resize border border-zinc-800/80 shadow-2xl", 
        className
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        // Designer touch: A subtle checkerboard for transparent PNGs/WEBPs
        backgroundImage: `linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)`,
        backgroundSize: `20px 20px`,
        backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`,
        backgroundColor: `#09090b`
      }}
    >
      {/* Before Image (Original) */}
      <img 
        src={before} 
        alt="Original uncompressed image" 
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* After Image (Compressed) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img 
          src={after} 
          alt="Compressed image result" 
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Glassmorphic Slider Handle */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10 transition-all duration-75"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full shadow-2xl flex items-center justify-center text-zinc-300 hover:text-indigo-400 hover:scale-110 hover:bg-zinc-900 transition-all">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-widest shadow-lg pointer-events-none">
        Original
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-indigo-600/80 backdrop-blur-md border border-indigo-400/30 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 pointer-events-none">
        OptiPic Result
      </div>
    </div>
  );
};