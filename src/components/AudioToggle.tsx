import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AudioControl = () => {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/Audio.mp3"); // المسار الحقيقي
    audio.loop = true;
    audio.volume = 0.3;

    audioRef.current = audio;

    // محاولة تشغيل أوتوماتك
    audio
      .play()
      .then(() => {
        setMuted(false);
      })
      .catch(() => {
        // المتصفح منع التشغيل → هيفضل مستني أول click
        setMuted(true);
      });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (audio.paused) {
      audio.play();
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm border border-foreground/20 flex items-center justify-center transition-all duration-300 hover:bg-wedding-gold/20 hover:border-wedding-gold"
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-cream" />
      ) : (
        <Volume2 className="w-4 h-4 text-cream" />
      )}
    </button>
  );
};

export default AudioControl;
