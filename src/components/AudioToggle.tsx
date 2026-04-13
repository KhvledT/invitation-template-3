import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

const AudioToggle = () => {
  const { isPlaying, isMuted, toggleMute } = useAudio();

  if (!isPlaying) return null;

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm border border-foreground/20 flex items-center justify-center transition-all duration-300 hover:bg-wedding-gold/20 hover:border-wedding-gold"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-foreground" />
      ) : (
        <Volume2 className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};

export default AudioToggle;
