
"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';

interface CustomVideoPlayerProps {
    src: string;
    themeColor: string;
}

const formatTime = (time: number) => {
    if (isNaN(time) || time <= 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function CustomVideoPlayer({ src, themeColor }: CustomVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const scrubContainerRef = useRef<HTMLDivElement>(null);
    let controlsTimeout: NodeJS.Timeout;

    const togglePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handleContainerClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        if (isPlaying) {
            controlsTimeout = setTimeout(() => setShowControls(false), 3000);
        }
    };
    
    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const toggleFullScreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        const player = playerContainerRef.current;
        if (!player) return;

        if (!document.fullscreenElement) {
            player.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => !isScrubbing && setCurrentTime(video.currentTime);
        const handleDurationChange = () => setDuration(video.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
            clearTimeout(controlsTimeout);
        };
    }, [isScrubbing]);
    
    useEffect(() => {
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
        }
    }, [currentTime, duration]);


    const handleScrub = (e: MouseEvent) => {
        if (!scrubContainerRef.current || !videoRef.current || duration === 0) return;
        const scrubRect = scrubContainerRef.current.getBoundingClientRect();
        const clickRatio = (e.clientX - scrubRect.left) / scrubRect.width;
        const newTime = Math.max(0, Math.min(clickRatio, 1)) * duration;
        
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsScrubbing(true);
        handleScrub(e.nativeEvent);
    };

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (isScrubbing) {
                setIsScrubbing(false);
                handleScrub(e);
            }
        };

        const handleMouseMoveScrub = (e: MouseEvent) => {
            if (isScrubbing) {
                handleScrub(e);
            }
        };

        document.addEventListener('mousemove', handleMouseMoveScrub);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMoveScrub);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isScrubbing, duration]);


    return (
        <div 
            ref={playerContainerRef}
            className="relative w-full h-full bg-black group cursor-pointer" 
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { if (isPlaying) setShowControls(false) }}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain"
                playsInline
                preload="metadata"
            />
            
            <div className={cn("absolute inset-0 bg-black/30 transition-opacity duration-300", isPlaying && !showControls ? "opacity-0" : "opacity-100", "pointer-events-none")}>
                {!isPlaying && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                         <Button
                            onClick={togglePlayPause}
                            size="icon"
                            className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
                        >
                            <Play className="w-8 h-8 fill-current" />
                        </Button>
                    </div>
                )}
                
                <div 
                    className={cn(
                        "absolute bottom-0 left-0 right-0 p-2 md:p-4 transition-transform duration-300 pointer-events-auto", 
                        showControls ? "translate-y-0" : "translate-y-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-2 md:gap-4 text-white">
                        <Button
                            onClick={togglePlayPause}
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 hover:bg-white/20"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </Button>
                        <span className="text-xs w-10 text-center">{formatTime(currentTime)}</span>
                        <div
                            ref={scrubContainerRef}
                            className="flex-grow bg-white/30 rounded-full h-1.5 cursor-pointer"
                            onMouseDown={handleMouseDown}
                        >
                            <div ref={progressBarRef} className="h-full rounded-full pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                        </div>
                        <span className="text-xs w-10 text-center">{formatTime(duration)}</span>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/20">
                                    <Volume2 className="w-5 h-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2 bg-black/60 border-none">
                                <Slider
                                    defaultValue={[1]}
                                    max={1}
                                    step={0.05}
                                    onValueChange={handleVolumeChange}
                                    className="w-20"
                                />
                            </PopoverContent>
                        </Popover>

                        <Button onClick={toggleFullScreen} size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/20">
                            <Maximize className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

    