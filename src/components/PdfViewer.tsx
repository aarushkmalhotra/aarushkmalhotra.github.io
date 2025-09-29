"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// We'll lazy-load react-pdf on the client to avoid SSR issues

type PDFModule = {
  Document: any;
  Page: any;
  pdfjs: any;
};

export function PdfThumbnail({ file, onClick }: { file: string; onClick: () => void }) {
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const [pdf, setPdf] = useState<PDFModule | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || el.getBoundingClientRect().width || 0;
      if (w > 0) setWidth(Math.floor(w));
    };
    // Measure on next paint to avoid 0-width during initial layout
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("react-pdf");
        if (!mounted) return;
        // Configure worker (CDN path works well on static hosting like GitHub Pages)
        if (typeof window !== "undefined") {
          const v = (mod.pdfjs && mod.pdfjs.version) || "5.3.93";
          mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${v}/build/pdf.worker.min.mjs`;
        }
        setPdf({ Document: mod.Document, Page: mod.Page, pdfjs: mod.pdfjs });
      } catch {
        setFailed(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (failed) {
    return (
      <div className="w-full h-full bg-muted rounded-lg grid place-items-center">
        <button onClick={onClick} className="text-sm text-muted-foreground underline">Open PDF</button>
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-muted rounded-lg overflow-hidden cursor-pointer select-none"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {width > 8 && pdf ? (
        <pdf.Document 
          file={file} 
          loading={<div className="absolute inset-0 grid place-items-center text-muted-foreground">Loading PDF…</div>}
          onLoadError={() => setFailed(true)}
        >
          <pdf.Page pageNumber={1} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
        </pdf.Document>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">Loading PDF…</div>
      )}
    </div>
  );
}

export function PdfLightbox({ open, onOpenChange, file }: { open: boolean; onOpenChange: (v: boolean) => void; file: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [pdf, setPdf] = useState<PDFModule | null>(null);

  useEffect(() => {
    if (!open) setPage(1);
  }, [open]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("react-pdf");
        if (!mounted) return;
        if (typeof window !== "undefined") {
          const v = (mod.pdfjs && mod.pdfjs.version) || "5.3.93";
          mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${v}/build/pdf.worker.min.mjs`;
        }
        setPdf({ Document: mod.Document, Page: mod.Page, pdfjs: mod.pdfjs });
      } catch (e) {
        setError((e as Error)?.message || "Failed to load PDF module");
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border-0 w-screen h-[100dvh] max-w-none max-h-none rounded-none p-4 md:p-8 flex flex-col">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/20 hover:text-white">
            <X />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-auto">
          {error ? (
            <div className="text-center space-y-4">
              <div className="text-white/80">Couldn't render PDF in the browser.</div>
              <a href={file} target="_blank" rel="noopener noreferrer" className="underline text-white">Open in new tab</a>
            </div>
          ) : pdf ? (
            <pdf.Document
              file={file}
              onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
              onLoadError={(e: any) => setError((e as Error).message || 'Failed to load PDF')}
              loading={<div className="text-white/80">Loading PDF…</div>}
            >
              <pdf.Page pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} width={Math.min(1200, typeof window !== 'undefined' ? window.innerWidth - 64 : 800)} />
            </pdf.Document>
          ) : (
            <div className="text-white/80">Loading PDF…</div>
          )}
        </div>
        {numPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4 text-white">
            <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} className="bg-white/10 hover:bg-white/20 text-white">
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev
            </Button>
            <span className="text-white/80">{page} / {numPages}</span>
            <Button variant="secondary" onClick={() => setPage(p => Math.min(numPages, p + 1))} className="bg-white/10 hover:bg-white/20 text-white">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function PdfPreview({ file, title }: { file: string; title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2 h-full flex flex-col">
      {title && <div className="text-sm text-muted-foreground">{title}</div>}
      <div className="flex-1 min-h-0">
        <PdfThumbnail file={file} onClick={() => setOpen(true)} />
      </div>
      <PdfLightbox open={open} onOpenChange={setOpen} file={file} />
    </div>
  );
}
