// utils/pdfCompressor.ts
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// 1. Tell TypeScript to ignore the Vite-specific '?url' suffix
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PdfCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
}

export const compressPdfClientSide = async (
  file: File,
  quality: number = 0.7, //
  scale: number = 1.5,
  onProgress?: (progress: number) => void
): Promise<PdfCompressionResult> => {
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4'
  });

  const a4Width = doc.internal.pageSize.getWidth();
  const a4Height = doc.internal.pageSize.getHeight();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Render the page to a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 2. Bypass the strict pdfjs-dist type mismatch by casting to 'any'
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    } as any).promise;

    // Compress the canvas to a JPEG
    const imgData = canvas.toDataURL('image/jpeg', quality);

    if (pageNum > 1) {
      doc.addPage();
    }

    doc.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);

    // Update progress UI
    if (onProgress) {
      onProgress(Math.round((pageNum / numPages) * 100));
    }
  }

  // Generate the final compressed blob
  const compressedBlob = doc.output('blob');

  return {
    blob: compressedBlob,
    originalSize: file.size,
    compressedSize: compressedBlob.size,
  };
};