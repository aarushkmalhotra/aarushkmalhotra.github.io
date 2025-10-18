"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  connections: number;
}

interface ParticleBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function ParticleBackground({ className = '', intensity = 'medium' }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const lastResizeRef = useRef({ width: 0, height: 0 });
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Store old dimensions for particle scaling
      const oldWidth = canvas.width || newWidth;
      const oldHeight = canvas.height || newHeight;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      return { oldWidth, oldHeight, newWidth, newHeight };
    };

    const getIntensitySettings = () => {
      switch (intensity) {
        case 'low':
          return { particleCount: 50, connectionDistance: 100, baseSpeed: 0.2 };
        case 'high':
          return { particleCount: 150, connectionDistance: 150, baseSpeed: 0.8 };
        default:
          return { particleCount: 80, connectionDistance: 120, baseSpeed: 0.5 };
      }
    };

    const settings = getIntensitySettings();
    
    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < settings.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * settings.baseSpeed,
          vy: (Math.random() - 0.5) * settings.baseSpeed,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 50,
          connections: 0
        });
      }
    };
    
    // Scale existing particles instead of recreating them
    const scaleParticles = (oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) => {
      const scaleX = newWidth / oldWidth;
      const scaleY = newHeight / oldHeight;
      
      particlesRef.current.forEach(particle => {
        particle.x *= scaleX;
        particle.y *= scaleY;
        // Keep velocities unchanged to maintain motion feel
      });
    };

    const getThemeColors = () => {
      if (theme === 'dark') {
        return {
          particle: 'rgba(156, 163, 175, 0.6)', // gray-400 with opacity
          connection: 'rgba(75, 85, 99, 0.3)', // gray-600 with opacity
          mouseGlow: 'rgba(59, 130, 246, 0.4)' // blue-500 with opacity
        };
      }
      return {
        particle: 'rgba(107, 114, 128, 0.4)', // gray-500 with opacity
        connection: 'rgba(156, 163, 175, 0.2)', // gray-400 with opacity
        mouseGlow: 'rgba(37, 99, 235, 0.3)' // blue-600 with opacity
      };
    };

    const drawParticle = (particle: Particle, colors: ReturnType<typeof getThemeColors>) => {
      // Breathing effect
      const breathe = Math.sin(particle.life * 0.05) * 0.5 + 0.5;
      const size = 1 + breathe * 1.5;
      
      // Distance from mouse for interaction
      const mouseDistance = Math.sqrt(
        (particle.x - mouseRef.current.x) ** 2 + (particle.y - mouseRef.current.y) ** 2
      );
      
      // Mouse influence
      const mouseInfluence = Math.max(0, (150 - mouseDistance) / 150);
      const finalSize = size + mouseInfluence * 2;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, finalSize, 0, Math.PI * 2);
      
      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, finalSize * 3
      );
      
      if (mouseInfluence > 0.1) {
        gradient.addColorStop(0, colors.mouseGlow);
        gradient.addColorStop(0.5, colors.particle);
        gradient.addColorStop(1, 'transparent');
      } else {
        gradient.addColorStop(0, colors.particle);
        gradient.addColorStop(1, 'transparent');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawConnection = (p1: Particle, p2: Particle, distance: number, colors: ReturnType<typeof getThemeColors>) => {
      const opacity = (1 - distance / settings.connectionDistance) * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = colors.connection.replace(/[\d\.]+\)$/g, `${opacity})`);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Mouse attraction
        if (mouseRef.current.isMoving) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);
          
          if (distance < 200) {
            const force = (200 - distance) / 200 * 0.01;
            particle.vx += dx * force;
            particle.vy += dy * force;
          }
        }
        
        // Boundary bouncing with damping
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
        
        // Apply friction
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Update life
        particle.life += 1;
        if (particle.life >= particle.maxLife) {
          particle.life = 0;
          particle.maxLife = 100 + Math.random() * 50;
        }
        
        // Reset connection count
        particle.connections = 0;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const colors = getThemeColors();
      const particles = particlesRef.current;
      
      updateParticles();
      
      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);
          
          if (distance < settings.connectionDistance && particles[i].connections < 3 && particles[j].connections < 3) {
            drawConnection(particles[i], particles[j], distance, colors);
            particles[i].connections++;
            particles[j].connections++;
          }
        }
      }
      
      // Draw particles on top
      particles.forEach(particle => drawParticle(particle, colors));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isMoving = true;
      
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Ignore very small height changes (common on mobile when browser UI shows/hides)
      const heightDiff = Math.abs(newHeight - lastResizeRef.current.height);
      const widthDiff = Math.abs(newWidth - lastResizeRef.current.width);
      
      // If only height changed and it's a small change (< 150px), it's likely mobile browser UI
      // Scale particles instead of reinitializing
      if (widthDiff < 10 && heightDiff > 0 && heightDiff < 150) {
        const { oldWidth, oldHeight, newWidth: canvasNewWidth, newHeight: canvasNewHeight } = resizeCanvas();
        scaleParticles(oldWidth, oldHeight, canvasNewWidth, canvasNewHeight);
        lastResizeRef.current = { width: newWidth, height: newHeight };
        return;
      }
      
      // Debounce significant resizes
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        resizeCanvas();
        initParticles();
        lastResizeRef.current = { width: newWidth, height: newHeight };
      }, 150);
    };

    // Setup
    resizeCanvas();
    initParticles();
    lastResizeRef.current = { width: canvas.width, height: canvas.height };
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, intensity, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}