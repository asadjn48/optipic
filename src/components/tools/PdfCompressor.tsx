// components/tools/PdfCompressor.tsx
import React, { useState, useRef } from 'react';
import { FileText, Sparkles, FileDown, Layers, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { compressPdfClientSide, PdfCompressionResult } from '../../utils/pdfCompressor';
import { formatBytes } from '../../utils/compressor';
import { motion, AnimatePresence } from 'motion/react';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PdfCompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult(null);
      setProgress(0);
    } else {
      toast.error('Please select a valid PDF file.');
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setProgress(0);
    const toastId = toast.loading('Flattening & Compressing PDF...');

    try {
      // 0.6 quality and 1.5 scale is the "magic ratio" for web-friendly PDFs
      const res = await compressPdfClientSide(file, 0.6, 1.5, (p) => {
        setProgress(p);
      });
      
      setResult(res);
      toast.success('PDF Compressed Successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to compress PDF. It might be encrypted or corrupted.', { id: toastId });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OptiPic_Compressed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0C10] relative overflow-hidden overflow-y-auto">
      <div className="absolute top-0 right-0 w-150 h-150 bg-rose-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            <span>PDF Engine</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            PDF Compressor
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Shrink heavy PDF documents entirely in your browser. Perfect for large scanned documents and image-heavy presentations.
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Action Panel */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#24283B] bg-[#12141D] rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-rose-500/50 hover:bg-[#1A1D2A] transition-all cursor-pointer shadow-xl min-h-75"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <div className="w-20 h-20 rounded-full bg-[#0B0C10] border border-[#24283B] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-rose-500/30 transition-all shadow-xl">
                    <FileText className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Select a .PDF file</h3>
                  <p className="text-slate-500 mb-6">Max recommended size: 50MB</p>
                  <Button className="bg-rose-600! hover:bg-rose-500! shadow-rose-500/20 text-white pointer-events-none">
                    Browse Files
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#12141D] border border-[#24283B] rounded-3xl p-8 shadow-xl"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-8 h-8 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 truncate max-w-50" title={file.name}>
                          {file.name}
                        </h3>
                        <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={handleClear} disabled={isCompressing} className="p-2 text-slate-500 hover:text-red-400 bg-[#0B0C10] rounded-full border border-[#24283B] transition-colors disabled:opacity-50">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {!result ? (
                    <div className="space-y-4">
                      <Button 
                        onClick={handleCompress} 
                        disabled={isCompressing}
                        className="w-full bg-rose-600! hover:bg-rose-500! shadow-rose-500/20 text-white py-4!"
                      >
                        {isCompressing ? 'Compressing Document...' : 'Start PDF Compression'}
                      </Button>
                      
                      {isCompressing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400 font-bold">
                            <span>Processing Pages</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#0B0C10] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#24283B]">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Original</p>
                          <p className="text-lg font-mono font-bold text-slate-300">{formatBytes(result.originalSize)}</p>
                        </div>
                        <div className="bg-[#0B0C10] p-4 rounded-xl border border-rose-500/30 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]">
                          <p className="text-[10px] uppercase tracking-wider text-rose-500 mb-1">Compressed</p>
                          <p className="text-lg font-mono font-bold text-rose-400">{formatBytes(result.compressedSize)}</p>
                        </div>
                      </div>
                      
                      <Button onClick={handleDownload} className="w-full bg-emerald-600! hover:bg-emerald-500! shadow-emerald-500/20 text-white py-4!">
                        <Download className="w-5 h-5" /> Download Compressed PDF
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Info/Features */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-[#12141D] border border-[#24283B] p-6 rounded-2xl flex gap-4 items-start shadow-lg">
              <div className="p-3 bg-rose-500/10 rounded-xl shrink-0">
                <FileDown className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 mb-1">Smart Rasterization</h4>
                <p className="text-sm text-slate-500 leading-relaxed">We convert heavy, unoptimized PDFs into highly efficient compressed layers. This removes bloated metadata and hidden high-res image data.</p>
              </div>
            </div>

            <div className="bg-[#12141D] border border-[#24283B] p-6 rounded-2xl flex gap-4 items-start shadow-lg">
              <div className="p-3 bg-indigo-500/10 rounded-xl shrink-0">
                <Layers className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 mb-1">100% Privacy Intact</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Most PDF tools upload your sensitive documents to a server. OptiPic processes the PDF using your device's memory, ensuring absolute privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};