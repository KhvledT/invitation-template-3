import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Particles = ({ count = 20 }: { count?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const particles = containerRef.current.querySelectorAll('.particle-el');
    
    particles.forEach((p, i) => {
      const el = p as HTMLElement;
      const delay = Math.random() * 8;
      const duration = 12 + Math.random() * 15;
      const x = Math.random() * 100;
      const size = 2 + Math.random() * 4;
      
      el.style.left = `${x}%`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.bottom = '-10px';

      gsap.to(el, {
        y: -(window.innerHeight + 50),
        x: `+=${Math.random() * 100 - 50}`,
        opacity: 0,
        duration,
        delay,
        repeat: -1,
        ease: 'none',
        onRepeat: () => {
          gsap.set(el, { 
            x: 0, 
            y: 0, 
            left: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.4
          });
        },
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="particle-el absolute rounded-full opacity-30"
          style={{
            background: i % 3 === 0
              ? `hsl(var(--wedding-gold) / ${0.3 + Math.random() * 0.3})`
              : `hsl(var(--foreground) / ${0.08 + Math.random() * 0.12})`,
            filter: `blur(${Math.random() > 0.5 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
