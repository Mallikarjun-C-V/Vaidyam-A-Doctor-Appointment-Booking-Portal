import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const trail = useRef([]);
  const particles = useRef([]);
  const isPointer = useRef(false);
  const inInput = useRef(false);
  const inputRect = useRef(null);
  const trailPaused = useRef(false);
  const animationId = useRef(null);

  const trailLength = 10;
  const followSpeed = 0.4;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const initialPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    trail.current = Array(trailLength).fill().map(() => ({ ...initialPos }));

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createExplosion = (x, y, count = 30) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 3 + Math.random() * 4;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          size: 2 + Math.random() * 2,
        });
      }
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const cursor = window.getComputedStyle(element).cursor;
      const wasPointer = isPointer.current;
      const nowPointer = cursor === 'pointer';

      // --- Pointer explosion ---
      if (!wasPointer && nowPointer) createExplosion(e.clientX, e.clientY);

      // --- Input / Textarea behavior ---
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (!inInput.current) {
          createExplosion(e.clientX, e.clientY, 40);
          inInput.current = true;
          trailPaused.current = true;

          // Save bounding rectangle of input
          inputRect.current = element.getBoundingClientRect();
        }
      } else {
        inInput.current = false;
        trailPaused.current = false;
        inputRect.current = null;
      }

      isPointer.current = nowPointer;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw trail ---
      if (!isPointer.current) {
        trail.current.forEach((point, i) => {
          const leader = i === 0 ? mousePos.current : trail.current[i - 1];
          point.x += (leader.x - point.x) * followSpeed;
          point.y += (leader.y - point.y) * followSpeed;

          // --- Clamp trail outside input rectangle if paused ---
          if (trailPaused.current && inputRect.current) {
            const rect = inputRect.current;
            if (point.x > rect.left && point.x < rect.right) {
              if (point.x - rect.left < rect.right - point.x) {
                point.x = rect.left - 10; // stay left
              } else {
                point.x = rect.right + 10; // stay right
              }
            }
            if (point.y > rect.top && point.y < rect.bottom) {
              if (point.y - rect.top < rect.bottom - point.y) {
                point.y = rect.top - 10; // stay above
              } else {
                point.y = rect.bottom + 10; // stay below
              }
            }
          }

          const size = 20 * (1 - i / trailLength);
          const opacity = 1 - i / trailLength;

          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(0, size / 2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 179, 255, ${opacity})`;
          ctx.fill();
        });
      }

      // --- Draw explosion particles ---
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 179, 255, ${particle.life})`;
          ctx.fill();
          return true;
        }
        return false;
      });

      animationId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default CursorTrail;
