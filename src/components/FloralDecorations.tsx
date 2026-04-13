import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import floralLeft from '@/assets/floral-left.png';
import floralRight from '@/assets/floral-right.png';

const FloralDecorations = () => {
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Subtle breathing animation on florals
    gsap.to(leftRef.current, {
      scale: 1.03,
      y: -5,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to(rightRef.current, {
      scale: 1.03,
      y: 5,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <>
      <img
        ref={leftRef}
        src={floralLeft}
        alt=""
        className="floral-left opacity-60"
        aria-hidden="true"
      />
      <img
        ref={rightRef}
        src={floralRight}
        alt=""
        className="floral-right opacity-60"
        style={{ transform: 'scaleX(-1)' }}
        aria-hidden="true"
      />
    </>
  );
};

export default FloralDecorations;
