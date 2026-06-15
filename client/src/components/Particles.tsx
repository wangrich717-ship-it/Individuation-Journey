/**
 * Particle System Component
 * Design: Dark Alchemical Manuscript — particles shift with scene mood
 * Sand dust → Embers → Mist → Stardust
 */
import { useEffect, useRef } from 'react';

interface ParticleConfig {
  count: number;
  color: string;
  speed: number;
  size: [number, number];
  opacity: [number, number];
  drift: boolean;
  glow?: boolean;
}

const PARTICLE_PRESETS: Record<string, ParticleConfig> = {
  sand: {
    count: 40,
    color: '#C4A35A',
    speed: 0.8,
    size: [1, 3],
    opacity: [0.2, 0.5],
    drift: true,
  },
  embers: {
    count: 25,
    color: '#FF6B35',
    speed: 0.5,
    size: [1, 4],
    opacity: [0.3, 0.8],
    drift: false,
    glow: true,
  },
  mist: {
    count: 15,
    color: '#8BA4B8',
    speed: 0.2,
    size: [20, 60],
    opacity: [0.03, 0.08],
    drift: true,
  },
  stardust: {
    count: 24,
    color: '#C4A574',
    speed: 0.35,
    size: [1, 2.5],
    opacity: [0.25, 0.7],
    drift: false,
    glow: true,
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function Particles({ type = 'sand', count: countOverride }: { type?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = PARTICLE_PRESETS[type] || PARTICLE_PRESETS.sand;
    const count = countOverride ?? config.count;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => {
      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
      const maxLife = 200 + Math.random() * 300;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speed * (config.drift ? 2 : 0.5),
        vy: config.drift ? -config.speed * (0.3 + Math.random() * 0.7) : -(0.2 + Math.random() * 0.5) * config.speed,
        size,
        opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
        life: Math.random() * maxLife,
        maxLife,
      };
    };

    particlesRef.current = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.life++;
        if (p.life > p.maxLife) {
          particlesRef.current[i] = createParticle();
          return;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (config.drift) {
          p.x += Math.sin(p.life * 0.02) * 0.3;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) {
          p.y = Math.random() * (canvas.height + 20) - 10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }
        if (p.y > canvas.height + 10) {
          p.y = Math.random() * (canvas.height + 20) - 10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) / 0.2 : 1;
        const alpha = p.opacity * fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (config.glow) {
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = config.color;
        }

        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [type, countOverride]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
