
"use client";

import { useState, useCallback } from 'react';
import type { Project } from '@/lib/projects';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface ProjectGalleryProps {
  project: Project;
}

type GalleryItem = (ImagePlaceholder & { type: 'image' }) | { type: 'video'; url: string } | { type: 'iframe'; url: string };

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
            <DialogContent className="bg-black/80 border-0 w-screen h-screen max-w-none max-h-none rounded-none p-4 md:p-8 flex flex-col focus:outline-none">
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
                        <div className="relative w-full h-full flex items-center justify-center">
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
                
                <Button variant="ghost" size="icon" onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"><ChevronLeft size={32} /></Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white hidden md:inline-flex"><ChevronRight size={32} /></Button>

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

    const imageItems = project.images
        .map(id => PlaceHolderImages.find(img => img.id === id))
        .filter((img): img is ImagePlaceholder => !!img)
        .map(img => ({ ...img, type: 'image' as const }));
    
    const videoItem = project.videoPreview ? (project.videoPreview.includes('youtube.com') 
        ? { type: 'iframe' as const, url: project.videoPreview }
        : { type: 'video' as const, url: project.videoPreview }) 
        : null;

    const galleryItems: GalleryItem[] = [
        ...(videoItem ? [videoItem] : []),
        ...imageItems
    ];
    
    const imageOnlyItems = galleryItems.filter(isImage);

    if (galleryItems.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => {
        setStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div>
            <h2 className="font-headline text-3xl mb-6 prose prose-lg dark:prose-invert max-w-none">Gallery</h2>
            <div className="space-y-8">
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
                             <video
                                src={videoItem.url}
                                controls
                                controlsList="nodownload"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                )}
                
                {imageOnlyItems.length > 0 && (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: imageOnlyItems.length > 1,
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
                        <div className={cn(imageOnlyItems.length <= 2 ? 'hidden' : 'block')}>
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                        </div>
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
