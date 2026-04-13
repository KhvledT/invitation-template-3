import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAudio } from "@/contexts/AudioContext";
import ScratchCard from "@/components/ScratchCard";
import groomImg from "@/assets/groom.jpg";
import brideImg from "@/assets/bride.jpg";
import floralCorner from "@/assets/floral-corner.png";

const IntroPage = () => {
  const navigate = useNavigate();
  const { startMusic } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"images" | "scratch" | "transition">(
    "images",
  );
  const [isScratchReady, setIsScratchReady] = useState(false);
  const groomRef = useRef<HTMLDivElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);
  const ampersandRef = useRef<HTMLDivElement>(null);
  const scratchRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Container fade in with gradient
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power3.out" },
    );

    // Corner decorations animate in with rotation
    cornersRef.current.forEach((corner, i) => {
      if (!corner) return;
      tl.fromTo(
        corner,
        { opacity: 0, scale: 0, rotation: -90 + i * 45 },
        {
          opacity: 0.5,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(2)",
        },
        0.3 + i * 0.1,
      );
    });

    // Title text
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, letterSpacing: "0em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.4em",
          duration: 1.2,
          ease: "power3.out",
        },
        0.6,
      );
    }

    // Groom slides from right with rotation
    tl.fromTo(
      groomRef.current,
      { x: 300, opacity: 0, scale: 0.8, rotateY: 20 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1.6,
        ease: "expo.out",
      },
      0.8,
    );

    // Bride slides from left with rotation
    tl.fromTo(
      brideRef.current,
      { x: -300, opacity: 0, scale: 0.8, rotateY: -20 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1.6,
        ease: "expo.out",
      },
      1.0,
    );

    // Ampersand pop in
    tl.fromTo(
      ampersandRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(3)" },
      1.6,
    );

    // Hold, then fade portraits out elegantly
    tl.to([groomRef.current, brideRef.current], {
      opacity: 0,
      scale: 0.9,
      y: -50,
      rotateY: (i: number) => (i === 0 ? -15 : 15),
      duration: 1.2,
      ease: "power3.inOut",
      stagger: 0.1,
      delay: 2,
    });

    tl.to(
      [ampersandRef.current, titleRef.current],
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=0.8",
    );

    tl.call(() => setPhase("scratch"), [], "+=0.2");
  }, []);

  useEffect(() => {
    if (phase === "scratch" && scratchRef.current && isScratchReady) {
      const tl = gsap.timeline();
      tl.fromTo(
        scratchRef.current,
        { opacity: 0, scale: 0.6, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.8)" },
      );
      // Add sparkle effect around scratch card
      const sparkles = scratchRef.current.querySelectorAll(".sparkle");
      sparkles.forEach((s, i) => {
        gsap.to(s, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.5 + i * 0.15,
          ease: "back.out(3)",
        });
        gsap.to(s, {
          rotation: 360,
          duration: 4,
          repeat: -1,
          ease: "none",
        });
      });
    }
  }, [phase, isScratchReady]);

  const handleReveal = () => {
    setPhase("transition");
    startMusic();

    const tl = gsap.timeline();

    // Multi-layer flash
    tl.to(flashRef.current, {
      opacity: 0.8,
      duration: 0.15,
      ease: "power4.in",
    });
    tl.to(flashRef.current, {
      opacity: 0.3,
      duration: 0.1,
    });
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.in",
    });

    tl.to(
      containerRef.current,
      {
        scale: 1.15,
        filter: "blur(15px) brightness(1.5)",
        duration: 0.6,
        ease: "power3.in",
      },
      0.1,
    );

    tl.to(
      {},
      {
        duration: 0.2,
        onComplete: () => navigate("/invitation"),
      },
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-romantic"
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-wedding-gold/5 blur-[80px] animate-breath" />
      <div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-[60px] animate-breath"
        style={{ animationDelay: "2s" }}
      />

      {/* Decorative corners */}
      {[
        "top-4 left-4 rotate-0",
        "top-4 right-4 rotate-90",
        "bottom-4 left-4 -rotate-90",
        "bottom-4 right-4 rotate-180",
      ].map((cls, i) => (
        <img
          key={i}
          ref={(el) => {
            cornersRef.current[i] = el;
          }}
          src={floralCorner}
          alt=""
          className={`absolute w-24 h-24 md:w-28 md:h-28 opacity-0 ${cls}`}
        />
      ))}

      {/* Title above portraits */}
      <div ref={titleRef} className="absolute top-16 md:top-20 opacity-0">
        <p className="font-accent text-lg md:text-xl tracking-[0.4em] uppercase text-foreground/60">
          You Are Invited
        </p>
      </div>

      {/* Image phase */}
      {phase === "images" && (
        <div className="flex items-center gap-2 md:gap-14">
          <div
            ref={groomRef}
            className="w-44 h-44 md:w-80 md:h-80 rounded-full overflow-hidden opacity-0"
            style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
          >
            <img
              src={groomImg}
              alt="Groom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wedding-dark/30 to-transparent" />
          </div>
          <div
            ref={ampersandRef}
            className="font-accent text-5xl md:text-6xl text-wedding-gold opacity-0 text-shadow-glow"
          >
            &
          </div>
          <div
            ref={brideRef}
            className="w-44 h-44 md:w-80 md:h-80 rounded-full overflow-hidden opacity-0"
            style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
          >
            <img
              src={brideImg}
              alt="Bride"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wedding-dark/30 to-transparent" />
          </div>
        </div>
      )}

      {/* Scratch phase */}
      {phase === "scratch" && (
        <div
          ref={scratchRef}
          className="flex flex-col items-center gap-8 opacity-0 relative"
        >
          {/* Sparkle decorations */}
          {[
            "-top-6 -left-6",
            "-top-6 -right-6",
            "-bottom-6 -left-6",
            "-bottom-6 -right-6",
          ].map((pos, i) => (
            <span
              key={i}
              className={`sparkle absolute ${pos} text-wedding-gold text-xl opacity-0 scale-0`}
            >
              ✦
            </span>
          ))}
          <div className="text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 text-shadow-soft">
              A Special Moment Awaits
            </h2>
            <p className="font-accent text-base md:text-lg tracking-[0.3em] uppercase text-foreground/50">
              Scratch to Reveal
            </p>
          </div>
          <ScratchCard onReveal={handleReveal} onReady={() => setIsScratchReady(true)} />
          <p className="font-body text-[10px] tracking-[0.3em] text-foreground/30 uppercase">
            Use your finger or mouse to scratch
          </p>
        </div>
      )}

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 opacity-0 pointer-events-none z-50"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--wedding-cream)), hsl(var(--wedding-gold-light)))",
        }}
      />
    </div>
  );
};

export default IntroPage;
