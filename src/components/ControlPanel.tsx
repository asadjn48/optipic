import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Target } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlPanelProps {
  targetSize: number;
  setTargetSize: (size: number) => void;
  onCompress: () => void;
  isCompressing: boolean;
  disabled: boolean;
}

const QUICK_SIZES = [50, 100, 200, 500, 1000];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  targetSize,
  setTargetSize,
  onCompress,
  isCompressing,
  disabled
}) => {
  return (
    <div className="space-y-8 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 shadow-xl shadow-black/20 backdrop-blur-md">
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-indigo-400">
          <Target className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Your Target</h3>
        </div>

        <div className="space-y-5">
          <label className="block group">
            <span className="text-sm font-medium text-zinc-400 mb-2 block group-hover:text-zinc-300 transition-colors">
              Desired File Size
            </span>
            <div className="relative">
              <input
                type="number"
                value={targetSize || ''}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                placeholder="e.g., 150"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs uppercase font-bold tracking-wider bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                KB
              </div>
            </div>
          </label>

          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider ">Quick Select</span>
            <div className="flex flex-wrap gap-2 ">
              {QUICK_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setTargetSize(size)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer" ,
                    targetSize === size
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-zinc-900"
                      : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
                  )}
                >
                  {size >= 1000 ? `${size / 1000} MB` : `${size} KB`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onCompress}
        disabled={disabled || isCompressing}
        className={cn(
          "w-full group relative overflow-hidden rounded-xl py-4 font-bold transition-all duration-300 flex justify-center",
          isCompressing
            ? "bg-indigo-600/50 text-white cursor-wait"
            : disabled
              ? "bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-800"
              : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-xl shadow-indigo-500/20"
        )}
      >
        <div className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
          {isCompressing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Wand2 className={cn("w-5 h-5", disabled ? "opacity-50" : "fill-current/20")} />
          )}
          <span>
            {isCompressing 
              ? 'Squeezing pixels...' 
              : disabled 
                ? 'Drop an image first' 
                : 'Shrink Image'}
          </span>
        </div>
        
        {!disabled && !isCompressing && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent skew-x-12"
            animate={{
              x: ['-150%', '150%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
          />
        )}
      </button>

      <div className="text-[11px] text-zinc-500 text-center leading-relaxed font-medium px-2">
        We'll intelligently reduce the file size to hit your target while trying to keep your image looking as crisp as possible.
      </div>
    </div>
  );
};