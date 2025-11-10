"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Project } from '@/lib/projects';
import { ExternalLink } from 'lucide-react';
// Helper to fetch OG image for a link (fallback to main image if not available)
async function fetchOgImage(url: string): Promise<string | null> {
    try {
        const res = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.ogImage || null;
    } catch {
        return null;
    }
}
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import PdfPreview from '@/components/PdfViewer';

interface ProjectGalleryProps {
  project: Project;
}

type GalleryItem = (ImagePlaceholder & { type: 'image' }) | { type: 'video'; url: string } | { type: 'iframe'; url: string } | { type: 'pdf'; url: string; title?: string };

function isImage(item: GalleryItem): item is (ImagePlaceholder & { type: 'image' }) {
    return item.type === 'image';
}

function Lightbox({ open, onOpenChange, items, startIndex }: { open: boolean, onOpenChange: (open: boolean) => void, items: GalleryItem[], startIndex: number }) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [zoom, setZoom] = useState(1);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setZoom(1);
    }, [items.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setZoom(1);
    }, [items.length]);

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
    
    const currentItem = items[currentIndex];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black/80 border-0 w-screen h-[100dvh] max-w-none max-h-none rounded-none p-4 md:p-8 flex flex-col focus:outline-none">
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    {isImage(currentItem) && (
                        <>
                            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="text-white hover:bg-white/20 hover:text-white"><ZoomIn/></Button>
                            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="text-white hover:bg-white/20 hover:text-white"><ZoomOut/></Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/20 hover:text-white"><X /></Button>
                </div>

                <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                    {isImage(currentItem) ? (
                        <div className="relative w-full h-[100dvh] flex items-center justify-center">
                            <Image
                                src={currentItem.imageUrl}
                                alt={currentItem.description}
                                fill
                                className="object-contain transition-transform duration-300"
                                style={{ transform: `scale(${zoom})` }}
                            />
                        </div>
                    ) : (
                        <p className="text-white">Unsupported media type</p>
                    )}
                </div>
                
                {items.length > 1 && (
                    <>
                        <Button variant="ghost" size="icon" onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"><ChevronLeft size={32} /></Button>
                        <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"><ChevronRight size={32} /></Button>
                    </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {items.length}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
        const [isLightboxOpen, setLightboxOpen] = useState(false);
        const [startIndex, setStartIndex] = useState(0);
        const [galleryLinks, setGalleryLinks] = useState<Array<{ url: string; title: string; ogImage: string }>>([]);

        useEffect(() => {
            async function loadLinks() {
                if (!project.galleryLinks) return;
                const results = await Promise.all(
                    project.galleryLinks.map(async (link) => {
                        let ogImage = link.ogImage;
                        if (!ogImage) {
                            // fallback to main image
                            const mainImg = PlaceHolderImages.find(img => img.id === project.images[0]);
                            ogImage = mainImg?.imageUrl || '';
                        }
                        return { ...link, ogImage };
                    })
                );
                setGalleryLinks(results);
            }
            loadLinks();
        }, [project.galleryLinks, project.images]);

    const imageIds = (project.id === 'album-tracks' || project.id === 'imdb-top-1000')
        ? project.images.filter(id => id !== 'album-tracks-1' && id !== 'imdb-top-1000-1') 
        : project.images;

    const imageItems = imageIds
        .map(id => PlaceHolderImages.find(img => img.id === id))
        .filter((img): img is ImagePlaceholder => !!img)
        .map(img => ({ ...img, type: 'image' as const }));
    
    const videoItem = project.videoPreview ? (project.videoPreview.includes('youtube.com') || project.videoPreview.includes('youtu.be')
        ? { type: 'iframe' as const, url: project.videoPreview.replace('youtu.be/', 'www.youtube.com/embed/') }
        : { type: 'video' as const, url: project.videoPreview }) 
        : null;

    const docItems: GalleryItem[] = (project.documents || []).map(doc => ({ type: 'pdf', url: doc.file, title: doc.title }));

    const galleryItems: GalleryItem[] = [
        ...(videoItem ? [videoItem] : []),
        ...docItems,
        ...imageItems
    ];
    
    const imageOnlyItems = galleryItems.filter(isImage);
    const pdfItems = galleryItems.filter(i => (i as any).type === 'pdf') as { type: 'pdf'; url: string; title?: string }[];

    if (galleryItems.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => {
        setStartIndex(index);
        setLightboxOpen(true);
    };

        return (
                <div id="gallery">
                        <h2 className="font-headline text-3xl mb-6 prose prose-lg dark:prose-invert max-w-none">Gallery</h2>
                        <div className="space-y-8">
                            {galleryLinks.length > 0 && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {galleryLinks.map((link, idx) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
                                        >
                                            <div className="aspect-video relative w-full bg-muted">
                                                {link.ogImage && (
                                                    <Image
                                                        src={link.ogImage}
                                                        alt={link.title || link.url}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ExternalLink className="text-white w-10 h-10" />
                                                </div>
                                            </div>
                                            <div className="p-4 flex items-center">
                                                <span className="font-semibold text-base text-primary group-hover:underline">{link.title || link.url}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                {videoItem && (
                    <div className="aspect-video relative overflow-hidden rounded-lg shadow-md bg-black">
                        {videoItem.type === 'iframe' ? (
                             <iframe
                                src={videoItem.url}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                             <CustomVideoPlayer src={videoItem.url} themeColor={project.theme.primary} />
                        )}
                    </div>
                )}
                
                {pdfItems.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {pdfItems.map((pdf, idx) => {
                            const isCifarCert = project.id === 'cifar-10-cnn' && (pdf.url?.includes('veritasai-certificate-11-2024.pdf') || pdf.title?.toLowerCase().includes('veritas'));
                            const aspectClass = isCifarCert ? 'aspect-[1200/849]' : 'aspect-video';
                            return (
                            <div key={`pdf-${idx}`} className="space-y-3 p-4 rounded-lg border bg-card">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="w-4 h-4" />
                                    <span>{pdf.title || 'Document'}</span>
                                </div>
                                <div
                                  className={`${aspectClass} relative overflow-hidden rounded bg-muted select-none`}
                                  onContextMenu={(e) => e.preventDefault()}
                                >
                                  <PdfPreview file={pdf.url} title="" />
                                </div>
                                <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-accent underline">Open PDF in new tab</a>
                            </div>
                        );})}
                    </div>
                )}

                {imageOnlyItems.length > 0 && (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: imageOnlyItems.length > 2,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {imageOnlyItems.map((image, index) => (
                                <CarouselItem key={image.id} className="md:basis-1/2 cursor-pointer" onClick={() => openLightbox(index)}>
                                    <div className="aspect-video relative overflow-hidden rounded-lg shadow-md group">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ZoomIn className="text-white w-12 h-12" />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         {imageOnlyItems.length > 2 && (
                            <>
                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                            </>
                        )}
                    </Carousel>
                )}
            </div>

            {isLightboxOpen && (
                 <Lightbox
                    open={isLightboxOpen}
                    onOpenChange={setLightboxOpen}
                    items={imageOnlyItems}
                    startIndex={startIndex}
                />
            )}
        </div>
    );
}
