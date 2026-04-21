// import React, { useState, useRef } from 'react';
// import { UploadCloud, X, MousePointerClick, ImageIcon } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { cn } from '../lib/utils';

// interface DropzoneProps {
//   onFileSelect: (file: File) => void;
//   selectedFile: File | null;
//   onClear: () => void;
// }

// export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, selectedFile, onClear }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) {
//       onFileSelect(file);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onFileSelect(file);
//     }
//   };

//   return (
//     <div className="w-full">
//       <AnimatePresence mode="wait">
//         {!selectedFile ? (
//           <motion.div
//             key="dropzone"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//             className={cn(
//               "relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center overflow-hidden",
//               isDragging 
//                 ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" 
//                 : "border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/40 hover:bg-zinc-900/80"
//             )}
//           >
//             {/* Hidden Input */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/jpeg,image/png,image/webp"
//               className="hidden"
//             />
            
//             {/* Animated Icon Circle */}
//             <div className={cn(
//               "p-4 rounded-full bg-zinc-900 shadow-xl border border-zinc-800 transition-all duration-500 group-hover:scale-110 group-hover:border-indigo-500/30",
//               isDragging && "bg-indigo-500 text-white border-indigo-400 shadow-indigo-500/20"
//             )}>
//               <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
//             </div>
            
//             {/* Humanized Copy */}
//             <div>
//               <p className="text-lg font-semibold text-zinc-200">
//                 Toss a heavy image here
//               </p>
//               <div className="flex items-center justify-center gap-2 mt-2 text-sm text-zinc-500">
//                 <MousePointerClick className="w-4 h-4" />
//                 <span>Or click to browse your files</span>
//               </div>
//             </div>

//             <div className="mt-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
//               We accept JPG, PNG & WEBP
//             </div>

//             {/* Subtle corner accents for a "tech tool" feel */}
//             <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors rounded-tl-sm" />
//             <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors rounded-tr-sm" />
//             <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors rounded-bl-sm" />
//             <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors rounded-br-sm" />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="selected"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="relative p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-4 hover:border-zinc-700 transition-colors group"
//           >
//             {/* Image Thumbnail */}
//             <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
//               <img 
//                 src={URL.createObjectURL(selectedFile)} 
//                 alt="Preview" 
//                 className="w-full h-full object-cover"
//                 onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
//               />
//             </div>
            
//             {/* File Details */}
//             <div className="flex-1 min-w-0 py-1">
//               <p className="text-sm font-semibold text-zinc-200 truncate pr-4">
//                 {selectedFile.name}
//               </p>
//               <p className="text-xs text-zinc-500 font-medium mt-0.5">
//                 Original size: {(selectedFile.size / 1024).toFixed(1)} KB
//               </p>
//             </div>
            
//             {/* Clear Button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onClear();
//               }}
//               className=" p-2.5 mr-1 rounded-full bg-zinc-950/50 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-900/30 transition-all"
//               title="Remove image"
//             >
//               <X className="w-4 h-4 cursor-pointer" />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

















import React, { useState, useRef } from 'react';
import { UploadCloud, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (droppedFiles.length > 0) {
      onFilesSelect(droppedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (selectedFiles.length > 0) {
        onFilesSelect(selectedFiles);
      }
    }
    // Reset input so the same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center overflow-hidden shrink-0",
        isDragging 
          ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" 
          : "border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/40 hover:bg-zinc-900/80"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />
      
      <div className={cn(
        "p-3 rounded-full bg-zinc-900 shadow-xl border border-zinc-800 transition-all duration-500 group-hover:scale-110 group-hover:border-indigo-500/30",
        isDragging && "bg-indigo-500 text-white border-indigo-400 shadow-indigo-500/20"
      )}>
        <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      
      <div>
        <p className="text-base font-semibold text-zinc-200">
          Drop multiple images here
        </p>
        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-zinc-500">
          <MousePointerClick className="w-3 h-3" />
          <span>Or click to browse files</span>
        </div>
      </div>
    </motion.div>
  );
};