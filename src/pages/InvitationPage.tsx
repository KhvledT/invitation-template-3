import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import FloralDecorations from "@/components/FloralDecorations";
import Particles from "@/components/Particles";
import { usePageTransition } from "@/components/PageTransition";
import heroCouple from "@/assets/hero-couple.jpg";
import floralCorner from "@/assets/floral-corner.png";

gsap.registerPlugin(ScrollTrigger);

const InvitationPage = () => {
  const { transitionTo } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Random Live countdown
  useEffect(() => {
    // Generate a random future date
    const randomOffset =
      (Math.floor(Math.random() * 35) + 10) * 86400000 + // 10-45 days
      Math.floor(Math.random() * 24) * 3600000 + // 0-23 hours
      Math.floor(Math.random() * 60) * 60000 + // 0-59 minutes
      Math.floor(Math.random() * 60) * 1000; // 0-59 seconds

    const target = Date.now() + randomOffset;

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // === HERO ENTRANCE ===

      // Hero text lines stagger in
      const heroLines = heroTextRef.current?.querySelectorAll(".hero-line");
      heroLines?.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay: 0.8 + i * 0.2,
            ease: "power3.out",
          },
        );
      });

      // Hero image parallax on scroll
      gsap.to(heroImgRef.current, {
        opacity: 0,
        y: 100,
        scrollTrigger: {
          trigger: heroImgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // === SCROLL-TRIGGERED SECTIONS ===
      const sections = containerRef.current?.querySelectorAll(".anim-section");
      sections?.forEach((section) => {
        // Section container
        gsap.fromTo(
          section,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Animate children with stagger
        const children = section.querySelectorAll(".anim-child");
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        // Gold dividers animate width
        const dividers = section.querySelectorAll(
          ".gold-divider, .gold-divider-wide",
        );
        dividers.forEach((d) => {
          gsap.fromTo(
            d,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: d,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      });

      // Map zoom effect
      const mapEl = containerRef.current?.querySelector(".map-container");
      if (mapEl) {
        gsap.fromTo(
          mapEl,
          { scale: 0.85, opacity: 0, borderRadius: "20px" },
          {
            scale: 1,
            opacity: 1,
            borderRadius: "12px",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapEl,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Floating elements
      gsap.utils.toArray(".float-element").forEach((el: any) => {
        gsap.to(el, {
          y: -20,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });

      // Parallax background orbs
      gsap.utils.toArray(".parallax-orb").forEach((orb: any) => {
        gsap.to(orb, {
          y: -100,
          scrollTrigger: {
            trigger: orb,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // Horizontal text scroll
      const scrollText = containerRef.current?.querySelector(".scroll-marquee");
      if (scrollText) {
        gsap.to(scrollText, {
          x: "-50%",
          scrollTrigger: {
            trigger: scrollText,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const goToMemories = () => {
    transitionTo("/memories");
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-romantic overflow-hidden"
    >
      {/* <FloralDecorations /> */}
      {/* <Particles count={15} /> */}

      {/* Ambient background orbs */}
      <div className="parallax-orb absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-wedding-gold/5 blur-[100px] pointer-events-none" />
      <div className="parallax-orb absolute top-[60%] right-[15%] w-96 h-96 rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
      <div className="parallax-orb absolute top-[120%] left-[30%] w-80 h-80 rounded-full bg-wedding-gold/3 blur-[100px] pointer-events-none" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-8 md:pt-12">
        {/* Hero Image with diamond clip */}
        <div
          ref={heroImgRef}
          className="relative w-full max-w-lg md:max-w-2xl mx-auto overflow-hidden"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
          }}
        >
          <img
            src={heroCouple}
            alt="Murad & Juliana"
            className="w-full aspect-square object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/40" />
        </div>

        {/* Invitation Text */}
        <div
          ref={heroTextRef}
          className="text-center px-8 mt-10 md:mt-14 max-w-xl mx-auto relative z-20"
        >
          <p className="hero-line font-accent text-lg md:text-xl tracking-[0.5em] uppercase mb-6 text-foreground/60">
            Save The Date
          </p>
          <h1 className="hero-line font-serif text-5xl md:text-8xl font-bold mb-3 text-foreground tracking-wide text-shadow-soft">
            Murad
          </h1>
          <p className="hero-line font-accent text-4xl md:text-5xl text-wedding-gold italic text-shadow-glow">
            &
          </p>
          <h1 className="hero-line font-serif text-5xl md:text-8xl font-bold mt-3 text-foreground tracking-wide text-shadow-soft">
            Juliana
          </h1>
          <div className="hero-line gold-divider-wide my-10" />
          <p className="hero-line font-accent text-base md:text-lg tracking-[0.15em] leading-relaxed text-foreground/70 uppercase">
            Together with their families invite you
            <br />
            to celebrate their marriage on
          </p>
          <p className="hero-line font-serif text-3xl md:text-4xl font-bold mt-8 mb-3 text-foreground tracking-wider text-shadow-soft">
            10 December 2024
          </p>
          <div className="hero-line gold-divider my-8" />
          <p className="hero-line font-serif text-xl md:text-2xl text-foreground mt-3">
            Fauget Hotel
          </p>
          <p className="hero-line font-accent text-sm tracking-[0.25em] uppercase text-foreground/50 mt-2">
            123 Anywhere St., Any City
          </p>
        </div>
      </section>

      {/* ===== SCROLL MARQUEE ===== */}
      <div className="overflow-hidden py-12 opacity-10 pointer-events-none">
        <div className="scroll-marquee whitespace-nowrap">
          <span className="font-serif text-8xl tracking-[0.2em]">
            MURAD & JULIANA · MURAD & JULIANA · MURAD & JULIANA · MURAD &
            JULIANA ·&nbsp;
          </span>
        </div>
      </div>

      {/* ===== LOCATION MAP ===== */}
      <section className="anim-section py-28 px-8 flex flex-col items-center section-bg-gradient">
        <p className="anim-child font-accent text-sm tracking-[0.4em] uppercase text-wedding-gold mb-3">
          Where We Celebrate
        </p>
        <h2 className="anim-child font-serif text-3xl md:text-5xl text-foreground mb-6">
          Location
        </h2>
        <div className="anim-child gold-divider mb-12" />
        <div
          className="map-container w-full max-w-4xl h-72 md:h-[28rem] rounded-xl overflow-hidden border border-foreground/10"
          style={{ boxShadow: "var(--shadow-romantic)" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837360866272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1612345678901!5m2!1sen!2sfr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Wedding venue location"
          />
        </div>
      </section>

      {/* ===== QUOTE SECTION ===== */}
      <section className="anim-section py-32 px-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="parallax-orb absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-wedding-gold/8 blur-[80px]" />
          <div className="parallax-orb absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-secondary/10 blur-[100px]" />
        </div>
        <img
          src={floralCorner}
          alt=""
          className="anim-child w-20 h-20 opacity-30 float-element mb-8 animate-rotate-slow"
        />
        <p className="anim-child font-accent text-base tracking-[0.4em] uppercase text-wedding-gold/70 mb-4">
          With Love & Joy
        </p>
        <h2 className="anim-child font-serif text-4xl md:text-7xl text-foreground text-center leading-tight text-shadow-soft">
          Two Hearts,
          <br />
          One Journey
        </h2>
        <div className="anim-child gold-divider-wide my-12" />
        <p className="anim-child font-accent text-lg md:text-xl text-foreground/60 text-center max-w-lg tracking-wider leading-relaxed italic">
          "In all the world, there is no heart for me like yours. In all the
          world, there is no love for you like mine."
        </p>
        <p className="anim-child font-body text-[10px] text-foreground/30 mt-6 tracking-[0.4em] uppercase">
          — Maya Angelou
        </p>
      </section>

      {/* ===== EXPLORE MEMORIES ===== */}
      <section className="anim-section py-28 px-8 flex flex-col items-center section-bg-gradient">
        <img
          src={floralCorner}
          alt=""
          className="anim-child w-16 h-16 opacity-30 float-element mb-8"
        />
        <p className="anim-child font-accent text-sm tracking-[0.4em] uppercase text-wedding-gold/70 mb-3">
          Continue The Journey
        </p>
        <h2 className="anim-child font-serif text-3xl md:text-5xl text-foreground mb-6 text-shadow-soft">
          Our Story Continues
        </h2>
        <p className="anim-child font-accent text-base tracking-[0.2em] text-foreground/50 uppercase mb-12 text-center">
          Explore the moments that led us here
        </p>
        <button
          onClick={goToMemories}
          className="anim-child wedding-btn animate-pulse-glow text-foreground"
        >
          <span className="relative z-10">Explore Our Memories</span>
        </button>
      </section>

      {/* ===== COUNTDOWN ===== */}
      <section className="anim-section py-28 px-8 flex flex-col items-center">
        <p className="anim-child font-accent text-sm tracking-[0.4em] uppercase text-wedding-gold/70 mb-8">
          Counting Down
        </p>
        <div className="flex gap-2 md:gap-12">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Minutes", value: countdown.minutes },
            { label: "Seconds", value: countdown.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="anim-child flex flex-col items-center"
            >
              <div className="wedding-card px-5 py-4 md:px-8 md:py-6 mb-3">
                <span className="font-serif text-3xl md:text-5xl text-wedding-gold tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
              <span className="font-accent text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/40">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="gold-divider-wide mt-12 mb-6" />
        <p className="anim-child font-accent text-sm tracking-[0.25em] uppercase text-foreground/30">
          Until We Say "I Do"
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <section className="anim-section py-20 px-8 flex flex-col items-center">
        <p className="font-accent text-xs tracking-[0.4em] uppercase text-foreground/25">
          With All Our Love
        </p>
        <p className="font-serif text-2xl text-foreground/40 mt-2">M & J</p>
      </section>
    </div>
  );
};

export default InvitationPage;
