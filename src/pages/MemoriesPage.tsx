import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import FloralDecorations from "@/components/FloralDecorations";
import Particles from "@/components/Particles";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import venue1 from "@/assets/venue-1.jpg";
import venue2 from "@/assets/venue-2.jpg";
import floralCorner from "@/assets/floral-corner.png";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: gallery1, alt: "Garden walk", span: "md:col-span-1 md:row-span-2" },
  { src: gallery2, alt: "Together", span: "md:col-span-1" },
  { src: gallery3, alt: "Dancing", span: "md:col-span-1 md:row-span-2" },
  { src: gallery4, alt: "Laughter", span: "md:col-span-1" },
];

const messages = [
  {
    from: "Sarah & James",
    text: '"Your love story is the most beautiful we\'ve ever witnessed. Wishing you eternal happiness!"',
    icon: "💕",
  },
  {
    from: "Mom & Dad",
    text: '"From the moment you two met, we knew this was forever. We couldn\'t be prouder."',
    icon: "🤍",
  },
  {
    from: "Best Man - Alex",
    text: '"Two amazing souls finding each other. Here\'s to a lifetime of adventures together!"',
    icon: "🥂",
  },
  {
    from: "Auntie Rose",
    text: '"Love is patient, love is kind — and you two embody that perfectly. Congratulations!"',
    icon: "🌹",
  },
];

const MemoriesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    const ctx = gsap.context(() => {
      // === HEADER ENTRANCE ===
      const headerEls = containerRef.current?.querySelectorAll(".header-anim");
      headerEls?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, clipPath: "inset(100% 0 0 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            delay: 0.2 + i * 0.2,
            ease: "power3.out",
          },
        );
      });

      // === GALLERY ===
      const galleryItems =
        containerRef.current?.querySelectorAll(".gallery-item");
      galleryItems?.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 60, scale: 0.9, rotateX: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
            delay: i * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Gallery image parallax inside containers
      const galleryImgs =
        containerRef.current?.querySelectorAll(".gallery-img");
      galleryImgs?.forEach((img) => {
        gsap.to(img, {
          y: -30,
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // === SECTIONS ===
      containerRef.current
        ?.querySelectorAll(".anim-section")
        .forEach((section) => {
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
                toggleActions: "play none none reverse",
              },
            },
          );

          const children = section.querySelectorAll(".anim-child");
          if (children.length > 0) {
            gsap.fromTo(
              children,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          // Dividers
          section
            .querySelectorAll(".gold-divider, .gold-divider-wide")
            .forEach((d) => {
              gsap.fromTo(
                d,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 1.2,
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

      // === VENUE PARALLAX ===
      containerRef.current?.querySelectorAll(".venue-img").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );
      });

      // === MESSAGE CARDS ===
      containerRef.current?.querySelectorAll(".msg-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
            x: i % 2 === 0 ? -40 : 40,
            rotateY: i % 2 === 0 ? 5 : -5,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

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

      // Parallax orbs
      gsap.utils.toArray(".parallax-orb").forEach((orb: any) => {
        gsap.to(orb, {
          y: -80,
          scrollTrigger: {
            trigger: orb,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-romantic overflow-hidden"
    >
      {/* <FloralDecorations />
      <Particles count={12} /> */}

      {/* Background orbs */}
      <div className="parallax-orb absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-wedding-gold/5 blur-[100px] pointer-events-none" />
      <div className="parallax-orb absolute top-[50%] left-[5%] w-80 h-80 rounded-full bg-secondary/8 blur-[120px] pointer-events-none" />

      {/* ===== HEADER ===== */}
      <section className="pt-28 pb-20 px-8 text-center relative">
        <p className="header-anim font-accent text-sm tracking-[0.5em] uppercase text-wedding-gold/60 mb-6">
          Murad & Juliana
        </p>
        <h1 className="header-anim font-serif text-5xl md:text-7xl text-foreground mb-6 text-shadow-soft">
          Our Memories
        </h1>
        <div className="header-anim gold-divider-wide" />
        <p className="header-anim font-accent text-base tracking-[0.2em] text-foreground/40 mt-6 uppercase">
          A collection of moments we treasure
        </p>
      </section>

      {/* ===== GALLERY GRID ===== */}
      <section className="px-8 md:px-16 lg:px-24 pb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery-item group relative overflow-hidden rounded-xl cursor-pointer ${img.span}`}
              style={{ boxShadow: "var(--shadow-romantic)" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="gallery-img w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wedding-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="font-accent text-sm tracking-[0.2em] text-foreground uppercase">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VENUE SHOWCASE ===== */}
      <section className="anim-section py-28 px-8 text-center section-bg-gradient">
        <p className="anim-child font-accent text-sm tracking-[0.4em] uppercase text-wedding-gold/70 mb-3">
          Where Dreams Come True
        </p>
        <h2 className="anim-child font-serif text-3xl md:text-5xl text-foreground mb-6 text-shadow-soft">
          The Venue
        </h2>
        <p className="anim-child font-accent text-base tracking-[0.3em] uppercase text-foreground/40 mb-12">
          Fauget Hotel
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div
            className="anim-child overflow-hidden rounded-xl"
            style={{ boxShadow: "var(--shadow-romantic)" }}
          >
            <img
              src={venue1}
              alt="Venue interior"
              loading="lazy"
              className="venue-img w-full h-72 md:h-96 object-cover"
            />
          </div>
          <div
            className="anim-child overflow-hidden rounded-xl"
            style={{ boxShadow: "var(--shadow-romantic)" }}
          >
            <img
              src={venue2}
              alt="Venue exterior"
              loading="lazy"
              className="venue-img w-full h-72 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== MESSAGES ===== */}
      <section className="anim-section py-28 px-8">
        <div className="text-center mb-16">
          <img
            src={floralCorner}
            alt=""
            className="w-16 h-16 opacity-25 mx-auto mb-6 float-element"
          />
          <p className="anim-child font-accent text-sm tracking-[0.4em] uppercase text-wedding-gold/70 mb-3">
            Words From The Heart
          </p>
          <h2 className="anim-child font-serif text-3xl md:text-5xl text-foreground mb-6 text-shadow-soft">
            Messages of Love
          </h2>
          <div className="anim-child gold-divider" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className="msg-card wedding-card">
              <span className="text-2xl mb-4 block">{msg.icon}</span>
              <p className="font-accent text-base md:text-lg text-foreground/75 leading-relaxed italic mb-6">
                {msg.text}
              </p>
              <div className="gold-divider-wide mb-4" />
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-wedding-gold/80">
                {msg.from}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CLOSING SECTION ===== */}
      <section className="anim-section py-32 px-8 flex flex-col items-center relative section-bg-gradient">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="parallax-orb absolute top-1/3 left-1/3 w-48 h-48 rounded-full bg-wedding-gold/5 blur-[80px]" />
        </div>
        <img
          src={floralCorner}
          alt=""
          className="anim-child w-24 h-24 opacity-20 mb-8 animate-rotate-slow"
        />
        <p className="anim-child font-accent text-base tracking-[0.4em] uppercase text-wedding-gold/50 mb-4">
          With Gratitude
        </p>
        <h2 className="anim-child font-serif text-4xl md:text-6xl text-foreground text-shadow-soft">
          Thank You
        </h2>
        <div className="anim-child gold-divider-wide my-10" />
        <p className="anim-child font-serif text-2xl md:text-3xl text-foreground/60">
          Murad & Juliana
        </p>
        <p className="anim-child font-accent text-sm tracking-[0.3em] text-foreground/30 mt-4">
          10 · 12 · 2024
        </p>
        <div className="anim-child flex gap-4 mt-10">
          {["✦", "❤", "✦"].map((s, i) => (
            <span
              key={i}
              className="text-wedding-gold/40 text-sm animate-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MemoriesPage;
