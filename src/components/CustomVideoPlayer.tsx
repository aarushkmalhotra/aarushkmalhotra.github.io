
"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize, VolumeX, Volume1 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
    const [lastVolume, setLastVolume] = useState(1);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
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
    
    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const volumeScrubber = e.currentTarget;
        const rect = volumeScrubber.getBoundingClientRect();
        const newVolume = (e.clientX - rect.left) / rect.width;
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        
        videoRef.current.volume = clampedVolume;
        setVolume(clampedVolume);
        setLastVolume(clampedVolume);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (volume > 0) {
            setLastVolume(volume);
            setVolume(0);
            videoRef.current.volume = 0;
        } else {
            setVolume(lastVolume);
            videoRef.current.volume = lastVolume;
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
        const handleTimelineUpdate = (e: MouseEvent) => {
            if (!timelineContainerRef.current || !videoRef.current) return;
            const rect = timelineContainerRef.current.getBoundingClientRect();
            const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
            videoRef.current.currentTime = percent * duration;
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (isScrubbing) {
                setIsScrubbing(false);
                handleTimelineUpdate(e);
            }
        };

        const handleMouseMoveScrub = (e: MouseEvent) => {
            if (isScrubbing) {
                handleTimelineUpdate(e);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMoveScrub);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMoveScrub);
        };
    }, [isScrubbing, duration]);


    return (
        <div 
            ref={playerContainerRef}
            className="relative w-full h-full bg-black group/player cursor-pointer" 
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
                     <div 
                        ref={timelineContainerRef}
                        onMouseDown={(e) => { e.stopPropagation(); setIsScrubbing(true); }}
                        className="h-3 -top-1 relative group/timeline"
                    >
                        <div className="bg-white/30 h-1 group-hover/timeline:h-1.5 absolute top-1/2 -translate-y-1/2 w-full rounded-full transition-all duration-200">
                             <div 
                                className="h-full rounded-full" 
                                style={{ 
                                    width: `${(currentTime / duration) * 100}%`,
                                    backgroundColor: themeColor
                                }}
                             />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 text-white">
                        <Button
                            onClick={togglePlayPause}
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 hover:bg-white/20"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </Button>
                        
                        <div className="flex items-center gap-2 group/volume">
                            <Button onClick={toggleMute} size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/20">
                                {volume === 0 ? <VolumeX className="w-5 h-5" /> : volume < 0.5 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>
                            <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden">
                                <div 
                                    className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        const scrubber = e.currentTarget;
                                        const handleVolumeDrag = (moveEvent: MouseEvent) => {
                                            const rect = scrubber.getBoundingClientRect();
                                            const newVolume = (moveEvent.clientX - rect.left) / rect.width;
                                            const clampedVolume = Math.max(0, Math.min(1, newVolume));
                                            if (videoRef.current) videoRef.current.volume = clampedVolume;
                                            setVolume(clampedVolume);
                                        };
                                        const handleMouseUp = () => {
                                            document.removeEventListener('mousemove', handleVolumeDrag);
                                            document.removeEventListener('mouseup', handleMouseUp);
                                        };
                                        handleVolumeDrag(e.nativeEvent);
                                        document.addEventListener('mousemove', handleVolumeDrag);
                                        document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                >
                                    <div className="h-full rounded-full" style={{ width: `${volume * 100}%`, backgroundColor: themeColor }}></div>
                                </div>
                            </div>
                        </div>

                        <span className="text-xs ml-auto">{formatTime(currentTime)} / {formatTime(duration)}</span>

                        <Button onClick={toggleFullScreen} size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/20">
                            <Maximize className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
