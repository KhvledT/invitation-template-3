import { useRef, useEffect, useState, useCallback } from "react";
import scratchOverlay from "@/assets/scratch-overlay.jpg";

interface ScratchCardProps {
  onReveal: () => void;
  onReady?: () => void;
}

const ScratchCard = ({ onReveal, onReady }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scratchedRef = useRef(0);

  const getPos = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const scratch = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !isScratching || revealed) return;

      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      scratchedRef.current += 1;

      // Check percentage scratched every 5 scratch movements to optimize performance
      if (scratchedRef.current % 5 === 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparentPixels = 0;
        // Alpha channel is at index i + 3
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 128) {
            transparentPixels++;
          }
        }
        const percentScratched =
          transparentPixels / (canvas.width * canvas.height);

        if (percentScratched >= 0.7) {
          setRevealed(true);
          setTimeout(onReveal, 3000);
        }
      }
    },
    [isScratching, getPos, onReveal, revealed],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Add text on scratch surface
      ctx.fillStyle = "#8B7355";
      ctx.font = "bold 20px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✨ Scratch Here ✨", canvas.width / 2, canvas.height / 2);
      if (onReady) onReady();
    };
    img.src = scratchOverlay;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startScratch = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsScratching(true);
      scratch(e);
    };
    const doScratch = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      scratch(e);
    };
    const endScratch = () => setIsScratching(false);

    canvas.addEventListener("mousedown", startScratch);
    canvas.addEventListener("mousemove", doScratch);
    canvas.addEventListener("mouseup", endScratch);
    canvas.addEventListener("touchstart", startScratch, { passive: false });
    canvas.addEventListener("touchmove", doScratch, { passive: false });
    canvas.addEventListener("touchend", endScratch);

    return () => {
      canvas.removeEventListener("mousedown", startScratch);
      canvas.removeEventListener("mousemove", doScratch);
      canvas.removeEventListener("mouseup", endScratch);
      canvas.removeEventListener("touchstart", startScratch);
      canvas.removeEventListener("touchmove", doScratch);
      canvas.removeEventListener("touchend", endScratch);
    };
  }, [scratch]);

  return (
    <div className="relative w-72 h-48 md:w-96 md:h-60 rounded-lg overflow-hidden shadow-2xl">
      {/* Reveal content underneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-wedding-cream text-wedding-dark">
        <p className="font-accent text-lg tracking-[0.2em] uppercase mb-2 text-wedding-dark/60">
          Save The Date
        </p>
        <p className="font-serif text-3xl md:text-4xl font-bold text-wedding-dark">
          10 December 2024
        </p>
        <div className="gold-divider mt-4" />
        <p className="font-accent text-sm tracking-[0.3em] uppercase mt-3 text-wedding-dark/50">
          Murad & Juliana
        </p>
      </div>

      {/* Scratch canvas overlay */}
      <canvas
        ref={canvasRef}
        width={384}
        height={240}
        className={`scratch-canvas absolute inset-0 w-full h-full transition-opacity duration-700 ${revealed ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
};

export default ScratchCard;
