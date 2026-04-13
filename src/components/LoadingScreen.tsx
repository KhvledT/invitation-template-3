import { useEffect, useRef } from "react";
import gsap from "gsap";
import floralCorner from "@/assets/floral-corner.png";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const floral1Ref = useRef<HTMLImageElement>(null);
  const floral2Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Entrance animations
    tl.fromTo(
      floral1Ref.current,
      { opacity: 0, scale: 0.5, rotation: -30 },
      {
        opacity: 0.6,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
      },
      0,
    );
    tl.fromTo(
      floral2Ref.current,
      { opacity: 0, scale: 0.5, rotation: 30 },
      {
        opacity: 0.4,
        scale: 0.8,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
      },
      0.2,
    );
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20, letterSpacing: "0.1em" },
      {
        opacity: 0.8,
        y: 0,
        letterSpacing: "0.3em",
        duration: 1,
        ease: "power3.out",
      },
      0.4,
    );

    // Progress bar
    tl.to(
      progressRef.current,
      {
        width: "100%",
        duration: 1.8,
        ease: "power2.inOut",
      },
      0.6,
    );

    // Exit animation
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power2.in",
        onComplete,
      },
      "+=0.3",
    );
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="flex flex-col items-center gap-8 relative">
        <div className="relative">
          <img
            ref={floral1Ref}
            src={floralCorner}
            alt=""
            className="w-28 h-28 opacity-0"
          />
          <img
            ref={floral2Ref}
            src={floralCorner}
            alt=""
            className="w-20 h-20 absolute -bottom-2 -right-4 opacity-0"
            style={{ filter: "hue-rotate(15deg)" }}
          />
        </div>
        <h2
          ref={textRef}
          className="font-accent text-2xl tracking-[0.3em] uppercase text-foreground/80 opacity-0 text-center"
        >
          Preparing Your Invitation
        </h2>
        <div className="w-56 h-[2px] bg-foreground/10 relative overflow-hidden rounded-full">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: "0%",
              background: "var(--gradient-gold)",
              boxShadow: "0 0 15px hsl(var(--wedding-gold) / 0.5)",
            }}
          />
        </div>
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-foreground/30">
          Murad & Juliana
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
