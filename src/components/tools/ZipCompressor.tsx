// components/tools/ZipCompressor.tsx
import React from 'react';
import { FileArchive, Sparkles, Box, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const ZipCompressor: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0C10] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            <span>New Feature</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            ZIP Archive Compressor
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Shrink heavy ZIP files by intelligently re-compressing the inner contents. Save storage space without losing a single file.
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Zone */}
          <div className="border-2 border-dashed border-[#24283B] bg-[#12141D] rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-emerald-500/50 hover:bg-[#1A1D2A] transition-all cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-[#0B0C10] border border-[#24283B] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all shadow-xl">
              <FileArchive className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">Drop your .ZIP file here</h3>
            <p className="text-slate-500 mb-6">Or click to browse your computer</p>
            <Button className="bg-emerald-600! hover:bg-emerald-500! shadow-emerald-500/20">
              Select ZIP Archive
            </Button>
          </div>

          {/* Right: Info/Features */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-[#12141D] border border-[#24283B] p-6 rounded-2xl flex gap-4 items-start">
              <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0">
                <Box className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 mb-1">Smart Re-packing</h4>
                <p className="text-sm text-slate-500 leading-relaxed">We unzip your archive locally, apply optimal compression algorithms to the files inside, and securely repackage it.</p>
              </div>
            </div>

            <div className="bg-[#12141D] border border-[#24283B] p-6 rounded-2xl flex gap-4 items-start">
              <div className="p-3 bg-indigo-500/10 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 mb-1">100% Local Processing</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Just like our image tool, your private files never leave your device. Everything happens right inside your browser.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};