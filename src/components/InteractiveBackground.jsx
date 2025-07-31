import { useEffect, useRef, useState } from 'react';
import './InteractiveBackground.css';

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let newX = particle.x;
          let newY = particle.y;
          
          // React to mouse proximity
          if (distance < 15) {
            const force = (15 - distance) / 15;
            newX = particle.x - (dx * force * 0.02);
            newY = particle.y - (dy * force * 0.02);
          } else {
            // Slowly return to base position
            newX += (particle.baseX - particle.x) * 0.001;
            newY += (particle.baseY - particle.y) * 0.001;
          }
          
          // Keep particles in bounds
          newX = Math.max(0, Math.min(100, newX));
          newY = Math.max(0, Math.min(100, newY));
          
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div ref={containerRef} className="interactive-bg-new">
      <div className="particles-container">
        {particles.map(particle => {
          const distance = Math.sqrt(
            Math.pow(mousePos.x - particle.x, 2) + 
            Math.pow(mousePos.y - particle.y, 2)
          );
          const isNearMouse = distance < 15;
          
          return (
            <div
              key={particle.id}
              className={`particle-reactive ${isNearMouse ? 'particle-active' : ''}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: isNearMouse ? 1 : particle.opacity,
                transform: isNearMouse ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
      
      {/* Floating background shapes */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default InteractiveBackground;
