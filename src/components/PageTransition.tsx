import { useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const usePageTransition = () => {
  const navigate = useNavigate();

  const transitionTo = useCallback((path: string) => {
    const overlay = document.getElementById('page-transition-overlay');
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');
    const content = document.getElementById('page-content');

    if (!overlay || !curtainLeft || !curtainRight) {
      navigate(path);
      return;
    }

    const tl = gsap.timeline();

    // Fade out current content
    if (content) {
      tl.to(content, {
        opacity: 0,
        scale: 0.97,
        filter: 'blur(8px)',
        duration: 0.5,
        ease: 'power2.inOut',
      }, 0);
    }

    // Curtains close
    tl.to(curtainLeft, {
      x: '0%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.2);

    tl.to(curtainRight, {
      x: '0%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.2);

    // Navigate
    tl.call(() => navigate(path), [], 0.8);

    // Curtains open
    tl.to(curtainLeft, {
      x: '-100%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 1.0);

    tl.to(curtainRight, {
      x: '100%',
      duration: 0.7,
      ease: 'power3.inOut',
    }, 1.0);
  }, [navigate]);

  return { transitionTo };
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the very top immediately when the page changes
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    // Entrance animation for new page
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30, scale: 1, filter: 'blur(0px)' },
        { opacity: 1, y: 0, clearProps: 'all', duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [location.pathname]);

  return (
    <>
      {/* Curtain overlay */}
      <div id="page-transition-overlay" className="page-transition-overlay">
        <div
          id="curtain-left"
          className="absolute top-0 left-0 w-1/2 h-full"
          style={{
            transform: 'translateX(-100%)',
            background: 'linear-gradient(135deg, hsl(212 25% 38%), hsl(212 20% 45%))',
          }}
        />
        <div
          id="curtain-right"
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            transform: 'translateX(100%)',
            background: 'linear-gradient(225deg, hsl(212 25% 38%), hsl(212 20% 45%))',
          }}
        />
      </div>

      <div id="page-content" ref={contentRef}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
