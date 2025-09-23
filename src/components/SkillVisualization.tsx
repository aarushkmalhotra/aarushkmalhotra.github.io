"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects, type Project } from '@/lib/projects';

interface SkillData {
  name: string;
  category: string;
  count: number;
  projects: Project[];
  confidence: number;
  trend: 'up' | 'stable' | 'down';
  recentUsage: boolean;
}

const skillCategories = {
  'Programming': { color: '#3B82F6', emoji: '⚡' },
  'Framework': { color: '#10B981', emoji: '🚀' },
  'AI/ML': { color: '#8B5CF6', emoji: '🧠' },
  'Design': { color: '#F59E0B', emoji: '🎨' },
  'Cloud': { color: '#EF4444', emoji: '☁️' },
  'Other': { color: '#6B7280', emoji: '🔧' }
};

const categorizeSkill = (skill: string): keyof typeof skillCategories => {
  const skillLower = skill.toLowerCase();
  
  if (['javascript', 'typescript', 'python', 'php', 'html', 'css'].includes(skillLower)) {
    return 'Programming';
  }
  if (['react', 'next.js', 'tailwind css', 'wordpress', 'discord api'].includes(skillLower)) {
    return 'Framework';
  }
  if (['ai', 'machine learning', 'google gemini', 'genkit'].some(term => skillLower.includes(term))) {
    return 'AI/ML';
  }
  if (['figma', 'canva', 'ui/ux'].some(term => skillLower.includes(term))) {
    return 'Design';
  }
  if (['firebase', 'aws', 'azure', 'google cloud', 'vercel'].includes(skillLower)) {
    return 'Cloud';
  }
  return 'Other';
};

const getConfidenceFromProjectCount = (count: number, recentProjects: number): number => {
  const base = Math.min(count * 20, 85);
  const recency = recentProjects * 5;
  return Math.min(base + recency, 100);
};

export function SkillVisualization() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [sortBy, setSortBy] = useState<'count' | 'confidence' | 'alphabetical'>('count');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const projects = getProjects();
    const skillMap = new Map<string, { count: number; projects: Project[]; recent: number }>();
    
    // Extract and count skills
    projects.forEach(project => {
      const techStack = project.techStack.split(',').map(s => s.trim());
      const isRecent = new Date(project.startDate) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      
      techStack.forEach(skill => {
        if (!skillMap.has(skill)) {
          skillMap.set(skill, { count: 0, projects: [], recent: 0 });
        }
        const data = skillMap.get(skill)!;
        data.count++;
        data.projects.push(project);
        if (isRecent) data.recent++;
      });
    });

    // Convert to SkillData array
    const skillsArray: SkillData[] = Array.from(skillMap.entries()).map(([name, data]) => {
      const category = categorizeSkill(name);
      return {
        name,
        category,
        count: data.count,
        projects: data.projects,
        confidence: getConfidenceFromProjectCount(data.count, data.recent),
        trend: data.recent > 0 ? 'up' : data.count > 2 ? 'stable' : 'down',
        recentUsage: data.recent > 0
      };
    });

    setSkills(skillsArray);
  }, []);

  const filteredSkills = skills.filter(skill => 
    selectedCategory === 'All' || skill.category === selectedCategory
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.confidence - a.confidence;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return b.count - a.count;
    }
  });

  const categories = ['All', ...new Set(skills.map(s => s.category))];

    // Interactive canvas-based skill visualization
  useEffect(() => {
    if (!canvasRef.current || sortedSkills.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Retina support
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Create skill bubbles with physics
    const bubbles = sortedSkills.slice(0, 12).map((skill, i) => {
      const categoryData = skillCategories[skill.category as keyof typeof skillCategories];
      const angle = (i / sortedSkills.length) * Math.PI * 2;
      const radius = Math.max(25, Math.min(50, skill.count * 6 + 20));
      
      return {
        skill,
        x: width / 2 + Math.cos(angle) * (width / 4),
        y: height / 2 + Math.sin(angle) * (height / 4),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        targetRadius: radius,
        color: categoryData?.color || '#6366f1',
        emoji: categoryData?.emoji || '💻',
        hovered: false
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update bubble physics
      bubbles.forEach((bubble, i) => {
        // Mouse interaction
        const dx = mouseX - bubble.x;
        const dy = mouseY - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bubble.radius + 20) {
          bubble.hovered = true;
          bubble.targetRadius = Math.max(25, Math.min(50, bubble.skill.count * 6 + 20)) * 1.2;
          // Gentle repulsion from mouse
          if (distance > 0) {
            bubble.vx -= (dx / distance) * 0.3;
            bubble.vy -= (dy / distance) * 0.3;
          }
        } else {
          bubble.hovered = false;
          bubble.targetRadius = Math.max(25, Math.min(50, bubble.skill.count * 6 + 20));
        }

        // Smooth radius transition
        bubble.radius += (bubble.targetRadius - bubble.radius) * 0.1;

        // Center attraction
        const centerDx = width / 2 - bubble.x;
        const centerDy = height / 2 - bubble.y;
        bubble.vx += centerDx * 0.001;
        bubble.vy += centerDy * 0.001;

        // Bubble collisions
        bubbles.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - bubble.x;
          const dy = other.y - bubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = bubble.radius + other.radius + 5;
          
          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) / distance * 0.02;
            bubble.vx -= dx * force;
            bubble.vy -= dy * force;
          }
        });

        // Apply friction and update position
        bubble.vx *= 0.95;
        bubble.vy *= 0.95;
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Boundary constraints
        bubble.x = Math.max(bubble.radius, Math.min(width - bubble.radius, bubble.x));
        bubble.y = Math.max(bubble.radius, Math.min(height - bubble.radius, bubble.y));
      });

      // Draw connection lines for related skills
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      bubbles.forEach((bubble, i) => {
        bubbles.slice(i + 1).forEach(other => {
          if (bubble.skill.category === other.skill.category) {
            ctx.beginPath();
            ctx.moveTo(bubble.x, bubble.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw bubbles
      bubbles.forEach(bubble => {
        const { skill } = bubble;
        
        // Outer glow effect
        if (bubble.hovered) {
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius + 8, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(
            bubble.x, bubble.y, bubble.radius,
            bubble.x, bubble.y, bubble.radius + 8
          );
          glowGradient.addColorStop(0, bubble.color + '40');
          glowGradient.addColorStop(1, bubble.color + '00');
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Main bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, 0,
          bubble.x, bubble.y, bubble.radius
        );
        gradient.addColorStop(0, bubble.color + 'dd');
        gradient.addColorStop(1, bubble.color + '99');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Border
        ctx.strokeStyle = bubble.color;
        ctx.lineWidth = bubble.hovered ? 3 : 2;
        ctx.stroke();

        // Category emoji
        ctx.font = `${bubble.radius * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.emoji, bubble.x, bubble.y - bubble.radius * 0.2);

        // Skill name
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.min(12, bubble.radius * 0.25)}px Inter, sans-serif`;
        
        const maxChars = Math.floor(bubble.radius * 0.3);
        const displayName = skill.name.length > maxChars 
          ? skill.name.substring(0, maxChars - 1) + '…'
          : skill.name;
          
        ctx.fillText(displayName, bubble.x, bubble.y + bubble.radius * 0.15);
        
        // Project count
        ctx.font = `${Math.min(10, bubble.radius * 0.2)}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(`${skill.count} projects`, bubble.x, bubble.y + bubble.radius * 0.35);

        // Confidence indicator
        const confidenceAngle = (skill.confidence / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius - 3, -Math.PI / 2, -Math.PI / 2 + confidenceAngle);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [sortedSkills]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Skills Constellation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          An interactive visualization of my technical expertise. Hover over bubbles to explore skills, 
          with size indicating usage frequency and arc showing confidence level.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => {
          const categoryData = category !== 'All' ? skillCategories[category as keyof typeof skillCategories] : null;
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={isSelected && categoryData ? { 
                backgroundColor: categoryData.color + '20',
                borderColor: categoryData.color,
                borderWidth: '2px'
              } : {}}
            >
              {categoryData && <span className="text-lg">{categoryData.emoji}</span>}
              {category}
              <span className="text-xs opacity-75">
                ({category === 'All' ? skills.length : filteredSkills.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Options */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { value: 'count', label: 'Usage', icon: '📊' },
            { value: 'confidence', label: 'Confidence', icon: '🎯' },
            { value: 'alphabetical', label: 'A-Z', icon: '🔤' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as any)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                sortBy === option.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualization */}
      <div className="relative">
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <canvas
            ref={canvasRef}
            className="w-full h-96 cursor-pointer rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}
          />
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200">Legend</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Confidence Arc</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Bubble Size = Usage</span>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSkills.slice(0, 12).map(skill => {
          const categoryData = skillCategories[skill.category as keyof typeof skillCategories];
          
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: categoryData?.color + '20' }}
                  >
                    {categoryData?.emoji || '💻'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {skill.recentUsage && (
                    <span className="inline-flex items-center justify-center w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                  <span className="font-medium">{skill.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: categoryData?.color || '#6366f1' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Used in {skill.count} project{skill.count !== 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}