import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  startMusic: () => void;
  toggleMute: () => void;
}

const AudioCtx = createContext<AudioContextType>({
  isPlaying: false,
  isMuted: false,
  startMusic: () => {},
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioCtx);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const startMusic = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    audio.play().then(() => {
      setIsPlaying(true);
      // Fade in
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, 0.4);
        audio.volume = vol;
        if (vol >= 0.4) clearInterval(fadeIn);
      }, 50);
    }).catch(() => {});
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!audioRef.current.muted ? false : true);
    }
  }, []);

  return (
    <AudioCtx.Provider value={{ isPlaying, isMuted, startMusic, toggleMute }}>
      {children}
    </AudioCtx.Provider>
  );
};
