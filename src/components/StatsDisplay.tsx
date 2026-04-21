import React from 'react';
import { motion } from 'motion/react';
import { Download, Sparkles, Scale } from 'lucide-react';
import { formatBytes } from '../utils/compressor';

interface StatsDisplayProps {
  originalSize: number;
  compressedSize: number;
  onDownload: () => void;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  originalSize,
  compressedSize,
  onDownload
}) => {
  const saved = originalSize - compressedSize;
  const percentage = Math.max(0, Math.min(100, (saved / originalSize) * 100));

  // Staggered animation variants for a smooth reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    // Inside StatsDisplay.tsx return statement:

<motion.div 
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch"
>
  {/* Heavy Original Card */}
  <motion.div variants={itemVariants} className="md:col-span-3 p-5 rounded-2xl bg-[#12141D] border border-[#24283B] flex flex-col justify-center shadow-lg">
    <div className="flex items-center gap-2 mb-2 text-slate-500">
      <Scale className="w-4 h-4" />
      <p className="text-[10px] font-bold uppercase tracking-widest">Heavy Original</p>
    </div>
    <p className="text-2xl font-mono font-medium text-slate-300">{formatBytes(originalSize)}</p>
  </motion.div>

  {/* Sleek Result Card */}
  <motion.div variants={itemVariants} className="md:col-span-4 p-5 rounded-2xl bg-[#1A1D2A] border border-[#24283B] relative overflow-hidden shadow-inner flex flex-col justify-center">
    <div className="flex items-center gap-2 mb-2 text-indigo-400">
      <Sparkles className="w-4 h-4" />
      <p className="text-[10px] font-bold uppercase tracking-widest">Sleek Result</p>
    </div>
    <p className="text-3xl font-mono font-bold text-indigo-400">{formatBytes(compressedSize)}</p>
    
    <div className="absolute bottom-0 left-0 h-1.5 bg-[#0B0C10] w-full">
      <motion.div 
        className="h-full bg-linear-to-r from-indigo-600 to-violet-500 rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${100 - percentage}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  </motion.div>

      {/* Massive Download CTA */}
      <motion.div variants={itemVariants} className="md:col-span-5 flex">
        <button
          onClick={onDownload}
          className="w-full relative group overflow-hidden p-1 rounded-2xl cursor-pointer"
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-70 group-hover:opacity-100 transition-opacity rounded-2xl" />
          
          <div className="relative h-full bg-zinc-950 rounded-xl p-5 flex items-center justify-between group-hover:bg-zinc-900/50 transition-colors">
            <div className="text-left">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                You Saved {percentage.toFixed(1)}%
              </p>
              <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Download Now
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/20">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
};