
"use client";

import { AudioFile } from "@/lib/projects";
import { Badge } from "./ui/badge";
import { Play, Pause, Music4, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface AudioPlayerProps {
    audioFile: AudioFile;
    themeColor: string;
}

export function AudioPlayer({ audioFile, themeColor }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

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
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            }
    
            const setAudioTime = () => setCurrentTime(audio.currentTime);
    
            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
    
            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            }
        }
    }, []);

    useEffect(() => {
        const progressBar = progressBarRef.current;
        if(progressBar) {
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, [currentTime, duration]);

    const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
        const scrubContainer = e.currentTarget;
        const scrubRect = scrubContainer.getBoundingClientRect();
        const scrubWidth = scrubRect.width;
        const clickPositionX = e.clientX - scrubRect.left;
        const clickRatio = clickPositionX / scrubWidth;
        const time = duration * clickRatio;

        if(audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }

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
                    className="flex-shrink-0 w-16 h-16 rounded-full text-foreground"
                    style={{
                        borderColor: themeColor,
                        color: themeColor
                    }}
                >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
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
                        <div className="w-full bg-muted rounded-full h-2 cursor-pointer" onClick={onScrub}>
                            <div ref={progressBarRef} className="h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
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
