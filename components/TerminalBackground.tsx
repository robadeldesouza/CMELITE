import React, { useEffect, useRef } from 'react';

interface TerminalBackgroundProps {
  paused?: boolean;
}

export const TerminalBackground: React.FC<TerminalBackgroundProps> = ({ paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; text: string; speed: number; opacity: number }[]>([]);
  const rgbRef = useRef<[number, number, number]>([34, 197, 94]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Se estiver pausado (Light Mode), limpa o canvas e para tudo para economizar RAM/GPU
    if (paused) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateThemeColors = () => {
        const style = getComputedStyle(document.documentElement);
        const brandRgbStr = style.getPropertyValue('--brand-rgb').trim() || '34, 197, 94';
        const parts = brandRgbStr.split(',').map(s => parseInt(s.trim()));
        if (parts.length === 3) rgbRef.current = parts as [number, number, number];
    };

    const observer = new MutationObserver(() => updateThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    updateThemeColors();

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      // Otimização: No modo normal, limitamos o canvas para não estourar memória em telas HiDPI
      canvas.width = width * Math.min(dpr, 1.5);
      canvas.height = height * Math.min(dpr, 1.5);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(Math.min(dpr, 1.5), Math.min(dpr, 1.5));
      initParticles(); 
    };

    const commands = [
      "INJECTING_PAYLOAD...",
      "BYPASSING_SECURITY...",
      "ACCESS_GRANTED...",
      "SEARCHING_VULNERABILITIES...",
      "OPTIMIZING_RNG...",
      "SPOOFING_ID...",
      "ANTI_BAN: ACTIVE",
      "SYNCING_MAINFRAME...",
      "MEMORY_WRITE...",
      "HOOKING_PROCESS..."
    ];

    const initParticles = () => {
      particlesRef.current = [];
      // Otimização de Memória: Reduzido de (width/40) para (width/80)
      const columnCount = Math.floor(width / 80); 
      const count = Math.min(Math.max(columnCount, 5), 40);

      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          text: commands[Math.floor(Math.random() * commands.length)],
          speed: 0.3 + Math.random() * 0.7, // Velocidade reduzida para menos stress de CPU
          opacity: 0.1 + Math.random() * 0.2
        });
      }
    };

    handleResize();

    const draw = () => {
      const style = getComputedStyle(document.documentElement);
      const fontMono = style.getPropertyValue('--font-mono').trim().replace(/"/g, '') || 'monospace';
      const [r, g, b] = rgbRef.current;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `9px "${fontMono}", monospace`;

      particlesRef.current.forEach((p) => {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fillText(p.text, p.x, p.y);
        p.y -= p.speed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
          p.text = commands[Math.floor(Math.random() * commands.length)];
        }
      });

      animFrameIdRef.current = requestAnimationFrame(draw);
    };

    animFrameIdRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [paused]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 mix-blend-screen ${paused ? 'opacity-0' : 'opacity-40'}`}
    />
  );
};