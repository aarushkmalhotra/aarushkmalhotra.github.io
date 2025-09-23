
"use client";

import { AudioFile } from "@/lib/projects";
import { Badge } from "./ui/badge";
import { Play, Music4, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface AudioPlayerProps {
    audioFile: AudioFile;
    themeColor: string;
}

const Waveform = ({ color }: { color: string }) => (
    <div className="flex items-center justify-center gap-0.5 h-full w-[120px]">
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className="w-0.5 h-2 bg-current animate-wave"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${Math.random() * (1.5 - 0.5) + 0.5}s`,
          }}
        />
      ))}
    </div>
);

export function AudioPlayer({ audioFile, themeColor }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const scrubContainerRef = useRef<HTMLDivElement>(null);

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time <= 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
            }
    
            const setAudioTime = () => {
                if (!isScrubbing) {
                    setCurrentTime(audio.currentTime);
                }
            };
    
            audio.addEventListener('loadedmetadata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
    
            return () => {
                audio.removeEventListener('loadedmetadata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            }
        }
    }, [isScrubbing]);

    useEffect(() => {
        const progressBar = progressBarRef.current;
        if(progressBar) {
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
    }, [currentTime, duration]);

    const handleScrub = (e: MouseEvent) => {
        if (!scrubContainerRef.current || duration === 0) return;

        const scrubRect = scrubContainerRef.current.getBoundingClientRect();
        const clickPositionX = e.clientX - scrubRect.left;
        const clickRatio = Math.max(0, Math.min(1, clickPositionX / scrubRect.width));
        const time = duration * clickRatio;

        setCurrentTime(time);
        if (progressBarRef.current) {
            progressBarRef.current.style.width = `${clickRatio * 100}%`;
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsScrubbing(true);
        handleScrub(e.nativeEvent);
    };

    const handleMouseUp = () => {
        if (isScrubbing && audioRef.current) {
            audioRef.current.currentTime = currentTime;
            if(isPlaying) {
                audioRef.current.play();
            }
        }
        setIsScrubbing(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isScrubbing) {
            handleScrub(e);
        }
    };
    
    useEffect(() => {
        const handleMouseUpGlobal = () => handleMouseUp();
        const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
        
        if (isScrubbing) {
            document.addEventListener('mousemove', handleMouseMoveGlobal);
            document.addEventListener('mouseup', handleMouseUpGlobal);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMoveGlobal);
            document.removeEventListener('mouseup', handleMouseUpGlobal);
        };
    }, [isScrubbing]);


    const getCreditText = () => {
        if (audioFile.id === 'ajab-si') {
            return `Licensed to YouTube by ${audioFile.originalLabel} (on behalf of composer/lyricist ${audioFile.originalLyricist} & music director duo ${audioFile.originalComposer}; original artist ${audioFile.originalArtist}); [Publishing Rights: Placeholder] and [Indian music rights societies].`
        }
        if (audioFile.id === 'yetu-ne-kya-kiya') {
            return `Licensed to YouTube by ${audioFile.originalLabel} (on behalf of composer ${audioFile.originalComposer} & lyricist ${audioFile.originalLyricist}; original artist ${audioFile.originalArtist}); [Publishing Rights: Placeholder] and [Indian music rights societies].`
        }
        return `Licensed to YouTube by ${audioFile.originalLabel} (on behalf of ${audioFile.originalArtist}); [Placeholder for Publishing Rights] and [X] music rights societies.`
    }


    return (
        <div className="border bg-card rounded-lg p-4 sm:p-6 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button 
                    onClick={togglePlayPause} 
                    size="icon"
                    variant="outline"
                    className="flex-shrink-0 w-16 h-16 rounded-full text-foreground relative overflow-hidden"
                    style={{
                        borderColor: themeColor,
                        color: themeColor
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        {!isPlaying && <Play className="w-8 h-8" />}
                    </div>
                    {isPlaying && <Waveform color={themeColor} />}
                    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                </Button>

                <div className="flex-grow w-full">
                    <div className="flex items-center justify-between">
                        <h4 className="font-headline text-lg sm:text-xl font-semibold" style={{ color: themeColor }}>{audioFile.title}</h4>
                        <Badge variant="destructive" className="flex-shrink-0 items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Generated
                        </Badge>
                    </div>

                    <div className="mt-3">
                        <div 
                            ref={scrubContainerRef}
                            className="w-full bg-muted rounded-full h-2 cursor-pointer" 
                            onMouseDown={handleMouseDown}
                        >
                            <div ref={progressBarRef} className="h-2 rounded-full pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-xs text-muted-foreground mt-4 border-t pt-3">
                <p>
                    <strong>Original Song Credits:</strong> {getCreditText()}
                </p>
            </div>
            
            <Music4 className="absolute -right-4 -bottom-8 w-32 h-32 text-foreground/5 opacity-50 -rotate-12" style={{ color: themeColor, opacity: 0.05 }} />

            <audio ref={audioRef} src={audioFile.file} preload="metadata" onEnded={() => setIsPlaying(false)} />
        </div>
    );
}
