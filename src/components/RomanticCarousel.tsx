'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Music, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// Import all the romantic images
import photo1 from "./photos/1.jpeg";
import photo2 from "./photos/2.jpeg";
import photo3 from "./photos/3.jpeg";
import photo4 from "./photos/4.jpeg";
import photo5 from "./photos/5.jpeg";
import photo6 from "./photos/6.jpeg";
import photo7 from "./photos/7.jpeg";
import photo8 from "./photos/8.jpeg";
import photo9 from "./photos/9.jpeg";
import photo10 from "./photos/10.jpeg";
import photo11 from "./photos/11.jpeg";
import photo12 from "./photos/12.png";
import photo13 from "./photos/13.png";
import photo14 from "./photos/14.png";
import photo15 from "./photos/15.png";
// import photo16 from "./photos/16.png";
import musicFile from "./music/music.m4a";

const photos = [
    photo1, photo2, photo3, photo4, photo5,
    photo6, photo7, photo8, photo9, photo10,
    photo11
    , photo12
    , photo13
    , photo14
    , photo15
    // , photo16
];

// Romantic message broken into parts for progressive reveal
const messageSegments = [
    "24 years…",
    "and I'm still completely crazy about you.",
    "You're my best friend,",
    "my forever crush,",
    "and the most beautiful part of my life.",
    "You are the world to me!!",
    "",
    "Here's to us—",
    "still making sparks",
    "after all these years.",
    "I love you no matter what life throws at us ❤️"
];

// Function to shuffle array randomly
const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const RomanticCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledPhotos, setShuffledPhotos] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [revealedSegments, setRevealedSegments] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Shuffle photos on component mount
    useEffect(() => {
        setShuffledPhotos(shuffleArray(photos));
    }, []);

        // Auto-play functionality
        useEffect(() => {
            if (isPlaying && shuffledPhotos.length > 0) {
                const interval = setInterval(() => {
                    setCurrentIndex((prev) => {
                        const next = (prev + 1) % shuffledPhotos.length;
                        // Reveal more message segments as we progress
                        setRevealedSegments(Math.min(messageSegments.length, Math.floor((next + 1) * messageSegments.length / shuffledPhotos.length)));
                        return next;
                    });
                }, 3000);
                return () => clearInterval(interval);
            }
        }, [isPlaying, shuffledPhotos.length]);
    
        // Handle play/pause for both slideshow and music
        const togglePlayPause = () => {
            const newIsPlaying = !isPlaying;
            setIsPlaying(newIsPlaying);
    
            if (audioRef.current) {
                if (newIsPlaying) {
                    audioRef.current.play().catch(error => {
                        console.log("Audio play failed:", error);
                    });
                } else {
                    audioRef.current.pause();
                }
            }
        };

    // Initialize audio and handle play/pause
    useEffect(() => {
        // Create audio element
        const audio = new Audio(musicFile);
        audioRef.current = audio;

        // Play audio when component mounts
        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.log("Audio play failed:", error);
            }
        };

        playAudio();

        // Cleanup function
        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, []);


    const goToNext = () => {
        const next = (currentIndex + 1) % shuffledPhotos.length;
        setCurrentIndex(next);
        // Reveal more message segments
        setRevealedSegments(Math.min(messageSegments.length, Math.floor((next + 1) * messageSegments.length / shuffledPhotos.length)));
    };

    const goToPrevious = () => {
        const prev = (currentIndex - 1 + shuffledPhotos.length) % shuffledPhotos.length;
        setCurrentIndex(prev);
        // Adjust revealed segments
        setRevealedSegments(Math.min(messageSegments.length, Math.floor((prev + 1) * messageSegments.length / shuffledPhotos.length)));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setRevealedSegments(Math.min(messageSegments.length, Math.floor((index + 1) * messageSegments.length / shuffledPhotos.length)));
    };

    if (shuffledPhotos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--deep-charcoal))] to-[hsl(20_14%_8%)]">
                <div className="text-center">
                    <Heart className="w-16 h-16 text-[hsl(var(--romantic-pink))] mx-auto mb-4 heart-beat" />
                    <p className="text-[hsl(var(--warm-cream))] text-xl">Loading our memories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--deep-charcoal))] to-[hsl(20_14%_8%)] flex flex-col">
            {/* Header with Music Controls */}
            <header className="p-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Music className="w-6 h-6 text-[hsl(var(--music-note))] music-note" />
                    <h1 className="text-3xl md:text-4xl font-serif gradient-text">Our Song</h1>
                    <Music className="w-6 h-6 text-[hsl(var(--rhythm-blue))] music-note" />
                </div>
                <Button
                    variant="music"
                    onClick={togglePlayPause}
                    className="gap-2"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"} Slideshow
                </Button>
            </header>

            {/* Main Carousel Container */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6">
                {/* Photo Carousel */}
                <div className="relative w-full max-w-2xl">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden romantic-glow">
                        <img
                            src={shuffledPhotos[currentIndex]}
                            alt={`Memory ${currentIndex + 1}`}
                            className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
                        />

                        {/* Navigation Buttons */}
                        <Button
                            variant="romantic"
                            size="icon"
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="romantic"
                            size="icon"
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>

                        {/* Photo Counter */}
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                            <span className="text-white text-sm font-medium">
                                {currentIndex + 1} / {shuffledPhotos.length}
                            </span>
                        </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="flex justify-center gap-2 mt-6 flex-wrap">
                        {shuffledPhotos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                    index === currentIndex
                                        ? "border-[hsl(var(--romantic-pink))] scale-110 golden-glow"
                                        : "border-transparent opacity-60 hover:opacity-100 hover:border-[hsl(var(--rose-gold))]"
                                )}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message Display */}
                <div className="w-full max-w-lg">
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 romantic-glow">
                        <div className="text-center mb-6">
                            <Heart className="w-12 h-12 text-[hsl(var(--romantic-pink))] mx-auto mb-4 heart-beat" />
                            <h2 className="text-2xl font-serif gradient-text mb-2">A Message From My Heart</h2>
                            <p className="text-[hsl(var(--soft-gray))] text-sm">
                                Revealed through our journey: {revealedSegments} / {messageSegments.length} parts
                            </p>
                        </div>

                        <div className="space-y-3 min-h-[300px] flex flex-col justify-center">
                            {messageSegments.slice(0, revealedSegments).map((segment, index) => (
                                <p
                                    key={index}
                                    className={cn(
                                        "text-[hsl(var(--warm-cream))] text-lg leading-relaxed fade-in-up",
                                        segment.includes("❤️") && "text-center text-xl font-semibold gradient-text",
                                        segment === "" && "h-4"
                                    )}
                                    style={{
                                        animationDelay: `${index * 0.2}s`
                                    }}
                                >
                                    {segment}
                                </p>
                            ))}

                            {revealedSegments < messageSegments.length && (
                                <div className="text-center mt-6">
                                    <p className="text-[hsl(var(--soft-gray))] text-sm mb-4">
                                        Continue clicking through our photos to reveal more...
                                    </p>
                                    <div className="flex justify-center gap-1">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-2 h-2 rounded-full bg-[hsl(var(--romantic-pink))] opacity-60",
                                                    "animate-pulse"
                                                )}
                                                style={{
                                                    animationDelay: `${i * 0.3}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[hsl(var(--romantic-pink))] to-[hsl(var(--rose-gold))] transition-all duration-700 golden-glow"
                            style={{
                                width: `${((currentIndex + 1) / shuffledPhotos.length) * 100}%`
                            }}
                        />
                    </div>
                    <p className="text-center text-[hsl(var(--soft-gray))] text-sm mt-2">
                        Journey Progress: {Math.round(((currentIndex + 1) / shuffledPhotos.length) * 100)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RomanticCarousel;