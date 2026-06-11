import { useEffect, useRef } from 'react';

export default function InteractiveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    const mouse = {
      x: null,
      y: null,
      radius: 160, // area of interaction
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Store base position to allow returning back or organic movement
        this.baseX = x;
        this.baseY = y;
        
        // Speed
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        
        // Size
        this.radius = Math.random() * 1.5 + 0.8;
        
        // Color alpha
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        // Normal drift
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off bounds
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (deflection)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Push force
            const force = (mouse.radius - distance) / mouse.radius;
            // Angle
            const angle = Math.atan2(dy, dx);
            const forceX = Math.cos(angle) * force * 2.2;
            const forceY = Math.sin(angle) * force * 2.2;

            // Move away from mouse
            this.x -= forceX;
            this.y -= forceY;
          } else {
            // Slowly return to drift path
            const dxBase = this.baseX - this.x;
            const dyBase = this.baseY - this.y;
            this.x += dxBase * 0.01;
            this.y += dyBase * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13, 74, 57, ${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = [];
    const initParticles = () => {
      particles = [];
      // Calculate particle density based on screen size
      const density = Math.floor((width * height) / 13000);
      const limit = Math.min(density, 120); // Cap at 120 for performance
      for (let i = 0; i < limit; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push(new Particle(x, y));
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            // Connection opacity based on distance
            const alpha = (125 - dist) / 125 * 0.09;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(13, 74, 57, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}
