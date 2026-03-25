/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { Sparkles, Image as ImageIcon, RotateCcw, Info, Heart } from 'lucide-react';
import { Dropzone } from './components/Dropzone';
import { ControlPanel } from './components/ControlPanel';
import { ImageSlider } from './components/ImageSlider';
import { StatsDisplay } from './components/StatsDisplay';
import { compressToTargetSize, CompressionResult } from './utils/compressor';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(100);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setCompressedUrl(null);
  }, [originalUrl, compressedUrl]);

  const handleClear = useCallback(() => {
    setFile(null);
    setResult(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(null);
    setCompressedUrl(null);
  }, [originalUrl, compressedUrl]);

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    // Humanized toast message
    const toastId = toast.loading('Squeezing those pixels... hang tight!');

    try {
      const compressionResult = await compressToTargetSize(file, targetSize);
      setResult(compressionResult);
      
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(compressionResult.blob));
      
      toast.success('Done! Your image is ready.', { id: toastId });

      if (compressionResult.quality < 0.3) {
        toast.warning('Just a heads up: To get the file this small, we had to lower the quality quite a bit.', {
          icon: <Info className="w-4 h-4 text-amber-500" />
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Whoops! Something went wrong while shrinking the image. Try another one.', { id: toastId });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const link = document.createElement('a');
    link.href = compressedUrl!;
    const extension = file.type.split('/')[1] || 'jpg';
    link.download = `OptiPic_${file.name.split('.')[0]}_${targetSize}kb.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
      <Toaster position="top-center" theme="dark" />
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          {/* <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            <span>100% Secure & Local</span>
          </motion.div> */}
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              OptiPic
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
              Drop your image & Compress Easily.
            </p>
          </div>
        </header>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Dropzone 
              onFileSelect={handleFileSelect} 
              selectedFile={file} 
              onClear={handleClear} 
            />
            
            <ControlPanel 
              targetSize={targetSize}
              setTargetSize={setTargetSize}
              onCompress={handleCompress}
              isCompressing={isCompressing}
              disabled={!file}
            />

            {result && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Compress Another Image
              </motion.button>
            )}
          </div>

          {/* Right Panel: Preview & Results */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {originalUrl && compressedUrl ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <ImageSlider before={originalUrl} after={compressedUrl} />
                  </div>

                  {result && (
                    <StatsDisplay 
                      originalSize={file?.size || 0} 
                      compressedSize={result.blob.size} 
                      onDownload={handleDownload}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center gap-4 text-zinc-600"
                >
                  <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Drop a heavy image here to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/50 bg-zinc-950/30 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* App Branding */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold tracking-wide text-zinc-200">OptiPic</span>
            <span className="text-sm text-zinc-600 hidden md:inline-block border-l border-zinc-800 pl-2 ml-1">
              Strictly local, browser-based compression
            </span>
          </div>
          
          {/* Personalized Portfolio Signature */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium">
            Built with <Heart className="w-4 h-4 text-violet-500 fill-current" /> by 
            <a 
              href="https://github.com/asadjn48" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-indigo-400 transition-colors ml-0.5 underline decoration-zinc-800 underline-offset-4 hover:decoration-indigo-400"
            >
              Asad Ullah
            </a>
          </div>
          
        </div>
      </footer>

    </div>
  );
}