/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate, spring, createScope } from "animejs";
import { playlist, Track } from "@/lib/tracks";

export default function MusicPlayer() {
  const root = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const currentTrack: Track = playlist[currentIndex];

  const setupAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barCount = 32;
      const barWidth = w / barCount - 1;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const secondary = getComputedStyle(document.documentElement).getPropertyValue("--accent-secondary").trim();

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = value * h * 0.85;
        const x = i * (barWidth + 1);

        const gradient = ctx.createLinearGradient(x, h, x, h - barHeight);
        gradient.addColorStop(0, accent || "#00e5ff");
        gradient.addColorStop(1, secondary || "#ff9100");
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.roundRect(x, h - barHeight, barWidth, barHeight, 2);
        ctx.fill();
      }
    };
    draw();
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    setupAudioContext();
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }
    await audioRef.current.play();
    setIsPlaying(true);
    drawVisualizer();
  }, [setupAudioContext, drawVisualizer]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const togglePlay = () => (isPlaying ? pause() : play());

  const nextTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, []);

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const selectTrack = (index: number) => {
    setCurrentIndex(index);
    setShowPlaylist(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.file;
    audioRef.current.volume = volume;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
      drawVisualizer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [nextTrack]);

  useEffect(() => {
    if (!root.current) return;
    const scope = createScope({ root }).add(() => {
      animate(".player-container", {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 600,
        delay: 2000,
        ease: "easeOutQuart",
      });
    });
    return () => scope.revert();
  }, []);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
    setShowPlaylist(false);
    if (root.current) {
      animate(root.current.querySelector(".player-container")!, {
        scale: [0.95, 1],
        duration: 300,
        ease: spring({ stiffness: 400, damping: 20 }),
      });
    }
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  return (
    <div ref={root} className="fixed bottom-4 left-4 z-[100]">
      <audio ref={audioRef} preload="metadata" />

      <div className="player-container opacity-0">
        {!isExpanded ? (
          /* Minimized: compact pill */
          <button
            onClick={handleExpandToggle}
            className="flex items-center gap-3 px-4 py-2.5 glass-card glow-accent rounded-full cursor-pointer hover:border-[var(--accent)]/40 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--muted)] shrink-0">
              <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="text-left max-w-[120px]">
              <div className="text-xs font-medium text-[var(--foreground)] truncate">{currentTrack.title}</div>
              <div className="text-[10px] text-[var(--muted-foreground)] truncate">{currentTrack.artist}</div>
            </div>
            {isPlaying && (
              <div className="flex items-end gap-px h-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-[var(--accent)] rounded-full animate-pulse"
                    style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </button>
        ) : (
          /* Expanded player */
          <div className="glass-card glow-accent rounded-2xl overflow-hidden" style={{ width: 320 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                Now Playing
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Toggle playlist"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                </button>
                <button
                  onClick={handleExpandToggle}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Minimize"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {showPlaylist ? (
              /* Playlist view */
              <div className="max-h-[300px] overflow-y-auto">
                {playlist.map((track, i) => (
                  <button
                    key={i}
                    onClick={() => selectTrack(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--muted)] transition-colors text-left ${
                      i === currentIndex ? "bg-[var(--muted)]" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden bg-[var(--muted)] shrink-0">
                      <img src={track.cover} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium truncate ${i === currentIndex ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                        {track.title}
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)] truncate">{track.artist}</div>
                    </div>
                    {i === currentIndex && isPlaying && (
                      <div className="flex items-end gap-px h-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="w-[2px] bg-[var(--accent)] rounded-full animate-pulse" style={{ height: `${4 + j * 3}px`, animationDelay: `${j * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <>
                {/* Cover art + Visualizer */}
                <div className="relative px-4 pt-4">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--muted)] mb-3">
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={70}
                      className="absolute bottom-0 left-0 right-0 w-full"
                      style={{ height: 70 }}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <svg viewBox="0 0 24 24" fill="var(--accent)" className="w-12 h-12 opacity-80"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track info */}
                <div className="px-4 pb-2">
                  <div className="text-sm font-medium text-[var(--foreground)] truncate">{currentTrack.title}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate">{currentTrack.artist}</div>
                </div>

                {/* Progress */}
                <div className="px-4 pb-2">
                  <div className="w-full h-1 bg-[var(--muted)] rounded-full cursor-pointer group" onClick={seek}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] relative"
                      style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_6px_var(--accent)]" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-[var(--muted-foreground)]">{formatTime(progress)}</span>
                    <span className="font-mono text-[9px] text-[var(--muted-foreground)]">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 px-4 pb-3">
                  <button onClick={prevTrack} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--background)] flex items-center justify-center hover:bg-[var(--accent-secondary)] transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                  </button>
                  <button onClick={nextTrack} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 px-4 pb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" className="w-3 h-3 shrink-0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 appearance-none bg-[var(--muted)] rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
