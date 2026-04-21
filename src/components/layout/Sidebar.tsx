// components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Settings, FileText, FileArchive, FileType2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export type TabType = 'image' | 'pdf' | 'zip' | 'word' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isToolsHovered, setIsToolsHovered] = useState(false);

  return (
    <aside className="w-20 lg:w-64 border-r border-[#24283B] bg-[#12141D] flex flex-col justify-between py-6 z-50 shadow-2xl relative">
      <div className="px-4 lg:px-6 space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3 lg:px-2 cursor-pointer">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-black tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent hidden lg:block">
            OptiPic
          </span>
        </div>

        <nav className="space-y-2">
          {/* Core Image Tool */}
          <button 
            onClick={() => setActiveTab('image')}
            className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer", activeTab === 'image' ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-slate-500 hover:bg-[#1A1D2A] hover:text-slate-300")}
          >
            <ImageIcon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block">Image Compressor</span>
          </button>
          
          {/* Hoverable File Tools Group */}
          <div 
            className="relative"
            onMouseEnter={() => setIsToolsHovered(true)}
            onMouseLeave={() => setIsToolsHovered(false)}
          >
            <button 
              className={cn(
                "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all cursor-default", 
                ['pdf', 'zip', 'word'].includes(activeTab) ? "bg-[#1A1D2A] text-slate-200 font-bold" : "text-slate-500 hover:bg-[#1A1D2A] hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block">File Tools</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 hidden lg:block transition-transform duration-300", isToolsHovered ? "rotate-90 text-indigo-400" : "")} />
            </button>

            {/* The Animated Dropdown Menu */}
            <AnimatePresence>
              {isToolsHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden lg:pl-4 mt-1 space-y-1"
                >
                  <button 
                    onClick={() => setActiveTab('zip')}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm", activeTab === 'zip' ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-300 hover:bg-[#1A1D2A]")}
                  >
                    <FileArchive className="w-4 h-4 shrink-0" />
                    <span className="hidden lg:block">PDF Compressor</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('pdf')}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm", activeTab === 'pdf' ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-300 hover:bg-[#1A1D2A]")}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="hidden lg:block">PDF Tools</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('word')}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm", activeTab === 'word' ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-300 hover:bg-[#1A1D2A]")}
                  >
                    <FileType2 className="w-4 h-4 shrink-0" />
                    <span className="hidden lg:block">Word Compressor</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      <div className="px-4 lg:px-6">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer", activeTab === 'settings' ? "bg-indigo-500/10 text-indigo-400 font-bold" : "text-slate-500 hover:bg-[#1A1D2A] hover:text-slate-300")}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block">Settings</span>
        </button>
      </div>
    </aside>
  );
};