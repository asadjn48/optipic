import { useState, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import JSZip from 'jszip';
import { Download, Trash2, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { Sidebar, TabType } from './components/layout/Sidebar';
import { PdfCompressor } from './components/tools/PdfCompressor';
import { Dropzone } from './components/Dropzone';
import { ControlPanel } from './components/ControlPanel';
import { ImageSlider } from './components/ImageSlider';
import { StatsDisplay } from './components/StatsDisplay';
import { Button } from './components/ui/Button';

// Utilities
import { compressToTargetSize, CompressionResult } from './utils/compressor';
import { cn } from './lib/utils';

export type QueueStatus = 'pending' | 'compressing' | 'done' | 'error';

export interface QueueItem {
  id: string;
  file: File;
  originalUrl: string;
  status: QueueStatus;
  result?: CompressionResult;
  compressedUrl?: string;
}

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [targetSize, setTargetSize] = useState<number>(150);
  const [isCompressing, setIsCompressing] = useState(false);

  const activeItem = queue.find(item => item.id === activeItemId);

  // --- HANDLERS ---
  const handleFilesSelect = useCallback((files: File[]) => {
    const newItems: QueueItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      originalUrl: URL.createObjectURL(file),
      status: 'pending'
    }));
    setQueue(prev => [...prev, ...newItems]);
    if (!activeItemId && newItems.length > 0) setActiveItemId(newItems[0].id);
  }, [activeItemId]);

  const handleRemoveItem = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue(prev => {
      const newQueue = prev.filter(item => item.id !== idToRemove);
      const itemToDrop = prev.find(i => i.id === idToRemove);
      if (itemToDrop) {
        URL.revokeObjectURL(itemToDrop.originalUrl);
        if (itemToDrop.compressedUrl) URL.revokeObjectURL(itemToDrop.compressedUrl);
      }
      if (activeItemId === idToRemove) {
        setActiveItemId(newQueue.length > 0 ? newQueue[0].id : null);
      }
      return newQueue;
    });
  };

  const handleClearAll = () => {
    queue.forEach(item => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setQueue([]);
    setActiveItemId(null);
  };

  const handleCompressAll = async () => {
    const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'error');
    if (pendingItems.length === 0) return;

    setIsCompressing(true);
    const toastId = toast.loading(`Compressing ${pendingItems.length} images...`);

    for (const item of pendingItems) {
      setQueue(prev => prev.map(qItem => qItem.id === item.id ? { ...qItem, status: 'compressing' } : qItem));
      setActiveItemId(item.id);

      try {
        const compressionResult = await compressToTargetSize(item.file, targetSize);
        const compressedUrl = URL.createObjectURL(compressionResult.blob);
        setQueue(prev => prev.map(qItem => 
          qItem.id === item.id ? { ...qItem, status: 'done', result: compressionResult, compressedUrl } : qItem
        ));
      } catch (error) {
        setQueue(prev => prev.map(qItem => qItem.id === item.id ? { ...qItem, status: 'error' } : qItem));
      }
    }
    toast.success('Batch compression complete!', { id: toastId });
    setIsCompressing(false);
  };

  const handleDownloadSingle = (item: QueueItem) => {
    if (!item.result || !item.compressedUrl) return;
    const link = document.createElement('a');
    link.href = item.compressedUrl;
    const extension = item.result.blob.type.split('/')[1] || 'webp';
    link.download = `OptiPic_${item.file.name.split('.')[0]}_${targetSize}kb.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const doneItems = queue.filter(item => item.status === 'done');
    if (doneItems.length < 2) {
      doneItems.forEach(item => handleDownloadSingle(item));
      return;
    }

    const toastId = toast.loading("Packaging your images into a ZIP...");
    const zip = new JSZip();

    try {
      for (const item of doneItems) {
        if (!item.compressedUrl || !item.result) continue;
        const response = await fetch(item.compressedUrl);
        const blob = await response.blob();
        const extension = blob.type.split('/')[1] || 'webp';
        zip.file(`OptiPic_${item.file.name.split('.')[0]}_${targetSize}kb.${extension}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'OptiPic_Batch.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      toast.success('ZIP downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create ZIP file.', { id: toastId });
    }
  };

  // --- RENDERERS ---
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'zip':
        return <PdfCompressor />;
      case 'pdf':
      case 'word':
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#0B0C10]">
            <p className="text-slate-500 text-lg font-medium">This tool is currently under development.</p>
          </div>
        );
      case 'image':
      default:
        return (
          <main className="flex-1 flex flex-col lg:flex-row min-w-0 z-10">
            {/* Left Pane */}
            <section className="w-full lg:w-112.5 border-r border-[#24283B] bg-[#0B0C10] flex flex-col h-full shadow-2xl relative z-20">
              <div className="p-6 border-b border-[#24283B] bg-[#12141D]">
                <ControlPanel 
                  targetSize={targetSize}
                  setTargetSize={setTargetSize}
                  onCompress={handleCompressAll}
                  isCompressing={isCompressing}
                  disabled={queue.length === 0}
                  fileCount={queue.length}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <Dropzone onFilesSelect={handleFilesSelect} />

                {queue.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Queue ({queue.length})</span>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleClearAll} className="px-2! py-1! text-xs hover:text-red-400 hover:bg-red-500/10 text-slate-400">
                          <Trash2 className="w-3 h-3" /> Clear All
                        </Button>
                        
                        {queue.filter(q => q.status === 'done').length > 0 && (
                          <Button variant="ghost" onClick={handleDownloadAll} className="px-2! py-1! text-xs text-indigo-400">
                            <Download className="w-3 h-3" /> 
                            {queue.filter(q => q.status === 'done').length > 1 ? "ZIP" : "Save"}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {queue.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setActiveItemId(item.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-200",
                            activeItemId === item.id 
                              ? "bg-[#1A1D2A] border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50" 
                              : "bg-[#12141D] border-[#24283B] hover:bg-[#1A1D2A]"
                          )}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B0C10] shrink-0 border border-[#24283B]">
                            <img src={item.originalUrl} alt="thumbnail" className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">{item.file.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500">{(item.file.size / 1024).toFixed(0)} KB</span>
                              {item.status === 'done' && item.result && (
                                <>
                                  <span className="text-xs text-slate-700">•</span>
                                  <span className="text-xs font-bold text-emerald-400">{(item.result.blob.size / 1024).toFixed(0)} KB</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {item.status === 'pending' && (
                              <button onClick={(e) => handleRemoveItem(item.id, e)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {item.status === 'compressing' && <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />}
                            {item.status === 'done' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            {item.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </section>

            {/* Right Pane */}
            <section className="flex-1 bg-[#0B0C10] flex flex-col relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

              {activeItem ? (
                <div className="h-full flex flex-col p-6 lg:p-10 max-w-5xl mx-auto w-full relative z-10">
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100 truncate pr-4">{activeItem.file.name}</h3>
                      <p className="text-slate-500 mt-1">Previewing selection</p>
                    </div>
                    {activeItem.status === 'done' && (
                      <Button onClick={() => handleDownloadSingle(activeItem)}>
                        <Download className="w-4 h-4" /> Save
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 min-h-0 flex flex-col justify-center gap-8 relative">
                    <div className="w-full relative group shadow-2xl rounded-3xl">
                      {activeItem.status === 'compressing' && (
                        <div className="absolute inset-0 z-20 bg-[#0B0C10]/80 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl border border-[#24283B]">
                          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                          <p className="font-bold text-slate-300 animate-pulse">Compressing...</p>
                        </div>
                      )}
                      
                      {activeItem.status === 'done' && activeItem.compressedUrl ? (
                        <ImageSlider before={activeItem.originalUrl} after={activeItem.compressedUrl} className="max-h-[50vh]" />
                      ) : (
                        <div className="w-full aspect-video max-h-[50vh] rounded-3xl overflow-hidden border border-[#24283B] bg-[#12141D] flex items-center justify-center shadow-2xl">
                          <img src={activeItem.originalUrl} alt="original" className="w-full h-full object-contain opacity-40" />
                        </div>
                      )}
                    </div>

                    {activeItem.status === 'done' && activeItem.result && (
                      <StatsDisplay 
                        originalSize={activeItem.file.size} 
                        compressedSize={activeItem.result.blob.size} 
                        onDownload={() => handleDownloadSingle(activeItem)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-[#12141D] border border-[#24283B] flex items-center justify-center mb-6 shadow-2xl shadow-black/50">
                    <Sparkles className="w-10 h-10 text-indigo-500/50" />
                  </div>
                  <p className="text-xl font-bold text-slate-300">Workspace Ready</p>
                  <p className="text-sm mt-2">Add images to the queue to begin compression.</p>
                </div>
              )}
            </section>
          </main>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0C10] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveTab()}
    </div>
  );
}