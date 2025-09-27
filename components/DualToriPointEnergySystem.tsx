'use client'

import React, { useRef, useEffect, useState } from 'react';

const DualToriPointEnergySystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVectorField, setShowVectorField] = useState(true);
  const [showProbabilityField, setShowProbabilityField] = useState(true);
  
  // Camera controls
  const [cameraRotationX, setCameraRotationX] = useState(0.3);
  const [cameraRotationY, setCameraRotationY] = useState(0.5);
  const [cameraDistance, setCameraDistance] = useState(1.0);
  
  // System separation
  const [systemSeparation, setSystemSeparation] = useState(300);
  
  // Torus parameters
  const [torus1Twist, setTorus1Twist] = useState(1.0);
  const [torus2Twist, setTorus2Twist] = useState(1.2);
  
  // Object 1 controls
  const [obj1VibrationStrength, setObj1VibrationStrength] = useState(0.5);
  const [obj1Direction, setObj1Direction] = useState(1);
  const [obj1Speed, setObj1Speed] = useState(0.02);
  
  // Object 2 controls
  const [obj2VibrationStrength, setObj2VibrationStrength] = useState(0.7);
  const [obj2Direction, setObj2Direction] = useState(-1);
  const [obj2Speed, setObj2Speed] = useState(0.015);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 900;
    canvas.height = 700;
    
    // Torus parameters
    const R = 120; // Major radius
    const r = 40;  // Minor radius
    const centerX = 450;
    const centerY = 350;
    
    // System state
    let repulsionForce = { x: 0, y: 0, z: 0 };
    let torus1Offset = { x: -systemSeparation/2, y: 0, z: 0 };
    let torus2Offset = { x: systemSeparation/2, y: 0, z: 0 };
    
    // Point-energy objects
    const pointEnergy1 = {
      phi: 0,
      theta: 0,
      r_center: r,
      vib_phi: Math.random() * 2 * Math.PI,
      vib_theta: Math.random() * 2 * Math.PI,
      vib_r: Math.random() * 2 * Math.PI,
      omega_phi: 0.12 + Math.random() * 0.08,
      omega_theta: 0.15 + Math.random() * 0.1,
      omega_r: 0.25 + Math.random() * 0.15,
      trail: [],
      color: 'blue'
    };
    
    const pointEnergy2 = {
      phi: Math.PI,
      theta: Math.PI,
      r_center: r,
      vib_phi: Math.random() * 2 * Math.PI,
      vib_theta: Math.random() * 2 * Math.PI,
      vib_r: Math.random() * 2 * Math.PI,
      omega_phi: 0.08 + Math.random() * 0.06,
      omega_theta: 0.18 + Math.random() * 0.12,
      omega_r: 0.22 + Math.random() * 0.18,
      trail: [],
      color: 'red'
    };
    
    let time = 0;
    
    // 3D rotation and projection functions
    const rotateX = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x,
      y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
      z: point.y * Math.sin(angle) + point.z * Math.cos(angle)
    });
    
    const rotateY = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) + point.z * Math.sin(angle),
      y: point.y,
      z: -point.x * Math.sin(angle) + point.z * Math.cos(angle)
    });
    
    const project3DTo2D = (point3d: { x: number; y: number; z: number }) => {
      const distance = 800 * cameraDistance;
      const scale = distance / (distance + point3d.z);
      return {
        x: centerX + point3d.x * scale,
        y: centerY + point3d.y * scale,
        z: point3d.z,
        scale: scale
      };
    };
    
    const twistedTorusTo3D = (phi: number, theta: number, r_minor: number, twist: number, offset: { x: number; y: number; z: number }) => {
      // Standard torus at twist = 0, Möbius torus with twist > 0
      const twist_angle = twist * phi / 2;
      
      // Center ring (major radius) - always circular
      const center_x = R * Math.cos(phi);
      const center_y = R * Math.sin(phi);
      const center_z = 0;
      
      // Tube cross-section with twist applied
      if (twist === 0) {
        // Standard 3D torus - no twist
        const tube_x = r_minor * Math.cos(theta);
        const tube_y = 0;
        const tube_z = r_minor * Math.sin(theta);
        
        let pos3d = {
          x: center_x + tube_x + offset.x,
          y: center_y + tube_y + offset.y,
          z: center_z + tube_z + offset.z
        };
        
        // Apply camera rotation
        pos3d = rotateX(pos3d, cameraRotationX);
        pos3d = rotateY(pos3d, cameraRotationY);
        
        return pos3d;
      } else {
        // Möbius torus - twist the tube orientation
        const tube_x = r_minor * Math.cos(theta);
        const tube_y = r_minor * Math.sin(theta) * Math.cos(twist_angle);
        const tube_z = r_minor * Math.sin(theta) * Math.sin(twist_angle);
        
        let pos3d = {
          x: center_x + tube_x + offset.x,
          y: center_y + tube_y + offset.y,
          z: center_z + tube_z + offset.z
        };
        
        // Apply camera rotation
        pos3d = rotateX(pos3d, cameraRotationX);
        pos3d = rotateY(pos3d, cameraRotationY);
        
        return pos3d;
      }
    };
    
    const calculateDistance3D = (pos1: { x: number; y: number; z: number }, pos2: { x: number; y: number; z: number }) => {
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const dz = pos1.z - pos2.z;
      return Math.sqrt(dx*dx + dy*dy + dz*dz);
    };
    
    const calculateRepulsion = () => {
      // Get current positions of both point-energies
      const pos1_3d = twistedTorusTo3D(pointEnergy1.phi, pointEnergy1.theta, pointEnergy1.r_center, torus1Twist, torus1Offset);
      const pos2_3d = twistedTorusTo3D(pointEnergy2.phi, pointEnergy2.theta, pointEnergy2.r_center, torus2Twist, torus2Offset);
      
      const distance = calculateDistance3D(pos1_3d, pos2_3d);
      const repulsionThreshold = 80; // Distance at which repulsion starts
      
      if (distance < repulsionThreshold) {
        const repulsionStrength = Math.pow((repulsionThreshold - distance) / repulsionThreshold, 2) * 50;
        
        const dx = pos2_3d.x - pos1_3d.x;
        const dy = pos2_3d.y - pos1_3d.y;
        const dz = pos2_3d.z - pos1_3d.z;
        
        const norm = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (norm > 0) {
          repulsionForce = {
            x: (dx / norm) * repulsionStrength,
            y: (dy / norm) * repulsionStrength,
            z: (dz / norm) * repulsionStrength
          };
          
          // Apply repulsion to torus positions
          torus1Offset.x -= repulsionForce.x * 0.1;
          torus1Offset.y -= repulsionForce.y * 0.1;
          torus1Offset.z -= repulsionForce.z * 0.1;
          
          torus2Offset.x += repulsionForce.x * 0.1;
          torus2Offset.y += repulsionForce.y * 0.1;
          torus2Offset.z += repulsionForce.z * 0.1;
          
          return true; // Collision detected
        }
      } else {
        // Gradually return to original positions
        const returnRate = 0.05;
        torus1Offset.x += (-systemSeparation/2 - torus1Offset.x) * returnRate;
        torus1Offset.y += (0 - torus1Offset.y) * returnRate;
        torus1Offset.z += (0 - torus1Offset.z) * returnRate;
        
        torus2Offset.x += (systemSeparation/2 - torus2Offset.x) * returnRate;
        torus2Offset.y += (0 - torus2Offset.y) * returnRate;
        torus2Offset.z += (0 - torus2Offset.z) * returnRate;
        
        repulsionForce = { x: 0, y: 0, z: 0 };
      }
      
      return false;
    };
    
    const drawTorus = (twist: number, offset: { x: number; y: number; z: number }, color: string, alpha: number = 0.3) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alpha;
      
      // Draw torus wireframe
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 6) {
        ctx.beginPath();
        let first = true;
        const points = [];
        
        for (let phi = 0; phi <= 2 * Math.PI + 0.1; phi += 0.1) {
          const pos3d = twistedTorusTo3D(phi, theta, r, twist, offset);
          const pos2d = project3DTo2D(pos3d);
          points.push({ pos2d, z: pos3d.z });
        }
        
        // Sort by z-depth and draw with depth-based alpha
        points.sort((a, b) => b.z - a.z);
        
        points.forEach((point, i) => {
          const depthAlpha = Math.max(0.1, alpha * (1 + point.z / 500));
          ctx.globalAlpha = depthAlpha;
          
          if (first) {
            ctx.moveTo(point.pos2d.x, point.pos2d.y);
            first = false;
          } else {
            ctx.lineTo(point.pos2d.x, point.pos2d.y);
          }
        });
        ctx.stroke();
      }
      
      // Poloidal lines
      for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 8) {
        ctx.beginPath();
        let first = true;
        const points = [];
        
        for (let theta = 0; theta <= 2 * Math.PI + 0.1; theta += 0.1) {
          const pos3d = twistedTorusTo3D(phi, theta, r, twist, offset);
          const pos2d = project3DTo2D(pos3d);
          points.push({ pos2d, z: pos3d.z });
        }
        
        points.sort((a, b) => b.z - a.z);
        
        points.forEach((point, i) => {
          const depthAlpha = Math.max(0.1, alpha * (1 + point.z / 500));
          ctx.globalAlpha = depthAlpha;
          
          if (first) {
            ctx.moveTo(point.pos2d.x, point.pos2d.y);
            first = false;
          } else {
            ctx.lineTo(point.pos2d.x, point.pos2d.y);
          }
        });
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    };
    
    const drawProbabilityField = () => {
      if (!showProbabilityField) return;
      
      ctx.globalAlpha = 0.15;
      
      // Sample points around both tori
      const samplePoints = [];
      
      for (let phi = 0; phi < 2 * Math.PI; phi += 0.4) {
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.5) {
          for (let rSample = r - 20; rSample <= r + 20; rSample += 12) {
            // Torus 1
            const pos1_3d = twistedTorusTo3D(phi, theta, rSample, torus1Twist, torus1Offset);
            const pos1_2d = project3DTo2D(pos1_3d);
            const center1_3d = twistedTorusTo3D(pointEnergy1.phi, pointEnergy1.theta, pointEnergy1.r_center, torus1Twist, torus1Offset);
            const dist1 = calculateDistance3D(pos1_3d, center1_3d);
            const prob1 = Math.exp(-(dist1*dist1) / (70*70));
            
            // Torus 2
            const pos2_3d = twistedTorusTo3D(phi, theta, rSample, torus2Twist, torus2Offset);
            const pos2_2d = project3DTo2D(pos2_3d);
            const center2_3d = twistedTorusTo3D(pointEnergy2.phi, pointEnergy2.theta, pointEnergy2.r_center, torus2Twist, torus2Offset);
            const dist2 = calculateDistance3D(pos2_3d, center2_3d);
            const prob2 = Math.exp(-(dist2*dist2) / (70*70));
            
            samplePoints.push({ pos1_3d, pos1_2d, prob1, torus: 1 });
            samplePoints.push({ pos2_3d, pos2_2d, prob2, torus: 2 });
          }
        }
      }
      
      // Sort by z-depth
      samplePoints.sort((a, b) => {
        const zA = a.pos1_3d ? a.pos1_3d.z : a.pos2_3d.z;
        const zB = b.pos1_3d ? b.pos1_3d.z : b.pos2_3d.z;
        return zB - zA;
      });
      
      samplePoints.forEach(point => {
        const prob = point.prob1 || point.prob2;
        if (prob && prob > 0.05) {
          const pos2d = point.pos1_2d || point.pos2_2d;
          const pos3d = point.pos1_3d || point.pos2_3d;
          
          const hue = point.torus === 1 ? 220 : 20; // Blue for torus 1, red for torus 2
          const depthAlpha = Math.max(0.1, prob * (1 + pos3d.z / 800));
          
          ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${depthAlpha})`;
          
          const size = (2 + prob * 6) * pos2d.scale;
          ctx.beginPath();
          ctx.arc(pos2d.x, pos2d.y, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1;
    };
    
    const drawVectorField = () => {
      if (!showVectorField) return;
      
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.5;
      
      const arrows = [];
      
      for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 3) {
        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 2) {
          // Torus 1 vectors
          const pos1_3d = twistedTorusTo3D(phi, theta, r, torus1Twist, torus1Offset);
          const pos1_2d = project3DTo2D(pos1_3d);
          const center1_3d = twistedTorusTo3D(pointEnergy1.phi, pointEnergy1.theta, pointEnergy1.r_center, torus1Twist, torus1Offset);
          const dist1 = calculateDistance3D(pos1_3d, center1_3d);
          const strength1 = Math.exp(-(dist1*dist1) / (80*80));
          
          // Torus 2 vectors
          const pos2_3d = twistedTorusTo3D(phi, theta, r, torus2Twist, torus2Offset);
          const pos2_2d = project3DTo2D(pos2_3d);
          const center2_3d = twistedTorusTo3D(pointEnergy2.phi, pointEnergy2.theta, pointEnergy2.r_center, torus2Twist, torus2Offset);
          const dist2 = calculateDistance3D(pos2_3d, center2_3d);
          const strength2 = Math.exp(-(dist2*dist2) / (80*80));
          
          arrows.push({ pos3d: pos1_3d, pos2d: pos1_2d, strength: strength1, torus: 1, phi, theta });
          arrows.push({ pos3d: pos2_3d, pos2d: pos2_2d, strength: strength2, torus: 2, phi, theta });
        }
      }
      
      // Sort by z-depth
      arrows.sort((a, b) => b.pos3d.z - a.pos3d.z);
      
      arrows.forEach(arrow => {
        if (arrow.strength > 0.1) {
          const flowStrength = arrow.strength * 30;
          const direction = arrow.torus === 1 ? obj1Direction : obj2Direction;
          
          // Calculate flow direction around torus
          const vx = -Math.sin(arrow.phi) * flowStrength * direction * arrow.pos2d.scale;
          const vy = Math.cos(arrow.phi) * flowStrength * direction * arrow.pos2d.scale * 0.5;
          
          const hue = arrow.torus === 1 ? 200 : 0;
          const depthAlpha = Math.max(0.3, arrow.strength * (1 + arrow.pos3d.z / 600));
          
          ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${depthAlpha})`;
          
          const endX = arrow.pos2d.x + vx;
          const endY = arrow.pos2d.y + vy;
          
          ctx.beginPath();
          ctx.moveTo(arrow.pos2d.x, arrow.pos2d.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Arrowhead
          const angle = Math.atan2(vy, vx);
          const headLength = 8 * arrow.pos2d.scale;
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      });
      
      ctx.globalAlpha = 1;
    };
    
    const updatePointEnergy = (obj: any, direction: number, speed: number, vibrationStrength: number, twist: number, offset: { x: number; y: number; z: number }) => {
      obj.vib_phi += obj.omega_phi;
      obj.vib_theta += obj.omega_theta;
      obj.vib_r += obj.omega_r;
      
      obj.phi += direction * speed;
      obj.theta += twist * speed * 0.05 * direction * Math.sin(obj.phi);
      
      if (obj.phi > 2 * Math.PI) obj.phi -= 2 * Math.PI;
      if (obj.phi < 0) obj.phi += 2 * Math.PI;
      if (obj.theta > 2 * Math.PI) obj.theta -= 2 * Math.PI;
      if (obj.theta < 0) obj.theta += 2 * Math.PI;
      
      const vib_amplitude_phi = vibrationStrength * 0.25;
      const vib_amplitude_theta = vibrationStrength * 0.5;
      const vib_amplitude_r = vibrationStrength * 10;
      
      const current_phi = obj.phi + vib_amplitude_phi * Math.sin(obj.vib_phi);
      const current_theta = obj.theta + vib_amplitude_theta * Math.sin(obj.vib_theta);
      const current_r = obj.r_center + vib_amplitude_r * Math.sin(obj.vib_r);
      
      return { phi: current_phi, theta: current_theta, r: current_r };
    };
    
    const drawPointEnergy = (obj: any, direction: number, speed: number, vibrationStrength: number, twist: number, offset: { x: number; y: number; z: number }, isPrimary: boolean = true) => {
      const currentState = updatePointEnergy(obj, direction, speed, vibrationStrength, twist, offset);
      const pos3d = twistedTorusTo3D(currentState.phi, currentState.theta, currentState.r, twist, offset);
      const pos2d = project3DTo2D(pos3d);
      
      obj.trail.push({ pos2d: pos2d, pos3d: pos3d });
      if (obj.trail.length > 100) {
        obj.trail.shift();
      }
      
      // Sort trail by z-depth
      const sortedTrail = [...obj.trail].sort((a, b) => b.pos3d.z - a.pos3d.z);
      
      // Draw trail
      if (sortedTrail.length > 1) {
        sortedTrail.forEach((point, i) => {
          if (i < sortedTrail.length - 1) {
            const alpha = (i / sortedTrail.length) * 0.9;
            const depthAlpha = Math.max(0.1, alpha * (1 + point.pos3d.z / 600));
            const hue = obj.color === 'blue' ? 220 : 20;
            
            ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${depthAlpha})`;
            ctx.lineWidth = (isPrimary ? 3 : 2.5) * point.pos2d.scale;
            
            ctx.beginPath();
            ctx.moveTo(point.pos2d.x, point.pos2d.y);
            ctx.lineTo(sortedTrail[i + 1].pos2d.x, sortedTrail[i + 1].pos2d.y);
            ctx.stroke();
          }
        });
      }
      
      // Draw main object
      const size = (isPrimary ? 12 : 10) * pos2d.scale + 4 * Math.sin(obj.vib_r * 2) * pos2d.scale;
      const hue = obj.color === 'blue' ? 220 : 20;
      
      ctx.fillStyle = `hsl(${hue}, 90%, 75%)`;
      ctx.strokeStyle = `hsl(${(hue + 120) % 360}, 100%, 85%)`;
      ctx.lineWidth = (isPrimary ? 3 : 2) * pos2d.scale;
      
      ctx.beginPath();
      ctx.arc(pos2d.x, pos2d.y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Vibration indicators
      const vibLines = isPrimary ? 8 : 6;
      for (let i = 0; i < vibLines; i++) {
        const angle = (i / vibLines) * 2 * Math.PI + time * (isPrimary ? 2 : -1.5);
        const vibRadius = (isPrimary ? 8 : 6) * pos2d.scale + (isPrimary ? 4 : 3) * Math.sin(obj.vib_phi + i) * pos2d.scale;
        
        ctx.strokeStyle = `hsla(${(hue + 120) % 360}, 100%, 85%, 0.9)`;
        ctx.lineWidth = (isPrimary ? 2 : 1.5) * pos2d.scale;
        
        const x1 = pos2d.x + vibRadius * Math.cos(angle);
        const y1 = pos2d.y + vibRadius * Math.sin(angle);
        const x2 = pos2d.x + (vibRadius + 12 * pos2d.scale) * Math.cos(angle);
        const y2 = pos2d.y + (vibRadius + 12 * pos2d.scale) * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };
    
    const animate = () => {
      if (!isPlaying) return;
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Check for repulsion
      const isRepelling = calculateRepulsion();
      
      // Draw tori (back to front based on camera view)
      const torus1Center = rotateY(rotateX(torus1Offset, cameraRotationX), cameraRotationY);
      const torus2Center = rotateY(rotateX(torus2Offset, cameraRotationX), cameraRotationY);
      
      if (torus1Center.z > torus2Center.z) {
        drawTorus(torus2Twist, torus2Offset, '#662222', 0.25);
        drawTorus(torus1Twist, torus1Offset, '#223366', 0.35);
      } else {
        drawTorus(torus1Twist, torus1Offset, '#223366', 0.35);
        drawTorus(torus2Twist, torus2Offset, '#662222', 0.25);
      }
      
      drawProbabilityField();
      drawVectorField();
      
      // Draw point energies
      drawPointEnergy(pointEnergy1, obj1Direction, obj1Speed, obj1VibrationStrength, torus1Twist, torus1Offset, true);
      drawPointEnergy(pointEnergy2, obj2Direction, obj2Speed, obj2VibrationStrength, torus2Twist, torus2Offset, false);
      
      time += 0.02;
      
      // UI Info
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText(`Time: ${time.toFixed(2)}`, 10, 25);
      ctx.fillText(`Separation: ${systemSeparation.toFixed(0)}`, 10, 45);
      ctx.fillText(`Camera: X:${cameraRotationX.toFixed(2)} Y:${cameraRotationY.toFixed(2)}`, 10, 65);
      
      if (isRepelling) {
        ctx.fillStyle = '#ff6666';
        ctx.font = '16px monospace';
        ctx.fillText('REPULSION ACTIVE!', 10, 90);
      }
      
      ctx.fillStyle = '#88ccff';
      ctx.font = '12px monospace';
      ctx.fillText(`Blue Torus: Twist ${torus1Twist.toFixed(1)}, Speed ${obj1Speed.toFixed(3)}, Dir ${obj1Direction > 0 ? '+' : '-'}`, 10, 120);
      ctx.fillStyle = '#ffaa88';
      ctx.fillText(`Red Torus: Twist ${torus2Twist.toFixed(1)}, Speed ${obj2Speed.toFixed(3)}, Dir ${obj2Direction > 0 ? '+' : '-'}`, 10, 135);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, showVectorField, showProbabilityField, cameraRotationX, cameraRotationY, cameraDistance,
      systemSeparation, torus1Twist, torus2Twist,
      obj1VibrationStrength, obj1Direction, obj1Speed,
      obj2VibrationStrength, obj2Direction, obj2Speed]);
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Dual 3D Möbius Tori with Repulsion Physics</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={() => setShowVectorField(!showVectorField)}
            className={`px-4 py-2 rounded ${showVectorField ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
          >
            Vector Field: {showVectorField ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => setShowProbabilityField(!showProbabilityField)}
            className={`px-4 py-2 rounded ${showProbabilityField ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
          >
            Probability: {showProbabilityField ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Camera Controls */}
        <div className="bg-gray-800 rounded p-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">3D Camera Controls</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white">
              <label>Rotation X:</label>
              <input
                type="range"
                min="-1.57"
                max="1.57"
                step="0.1"
                value={cameraRotationX}
                onChange={(e) => setCameraRotationX(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>{cameraRotationX.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Rotation Y:</label>
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.1"
                value={cameraRotationY}
                onChange={(e) => setCameraRotationY(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>{cameraRotationY.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Distance:</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={cameraDistance}
                onChange={(e) => setCameraDistance(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{cameraDistance.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {/* System Separation Control */}
        <div className="bg-purple-900 rounded p-3 mb-3">
          <h3 className="text-lg font-semibold text-purple-200 mb-2">System Separation & Repulsion</h3>
          <div className="flex items-center gap-2 text-white">
            <label>Separation Distance:</label>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={systemSeparation}
              onChange={(e) => setSystemSeparation(parseFloat(e.target.value))}
              className="w-32"
            />
            <span>{systemSeparation.toFixed(0)} units</span>
          </div>
          <p className="text-sm text-purple-300 mt-2">
            When objects get close (&lt; 80 units), repulsion pushes the tori apart
          </p>
        </div>
        
        {/* Blue Torus System Controls */}
        <div className="bg-blue-900 rounded p-3 mb-3">
          <h3 className="text-lg font-semibold text-blue-200 mb-2">Blue Torus System</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white">
              <label>Twist:</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={torus1Twist}
                onChange={(e) => setTorus1Twist(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{torus1Twist.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Direction:</label>
              <select
                value={obj1Direction}
                onChange={(e) => setObj1Direction(parseInt(e.target.value))}
                className="bg-gray-700 text-white px-2 py-1 rounded"
              >
                <option value={1}>Forward (+)</option>
                <option value={-1}>Reverse (-)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Speed:</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={obj1Speed}
                onChange={(e) => setObj1Speed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{obj1Speed.toFixed(3)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Vibration:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={obj1VibrationStrength}
                onChange={(e) => setObj1VibrationStrength(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{obj1VibrationStrength.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {/* Red Torus System Controls */}
        <div className="bg-red-900 rounded p-3 mb-4">
          <h3 className="text-lg font-semibold text-red-200 mb-2">Red Torus System</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white">
              <label>Twist:</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={torus2Twist}
                onChange={(e) => setTorus2Twist(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{torus2Twist.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Direction:</label>
              <select
                value={obj2Direction}
                onChange={(e) => setObj2Direction(parseInt(e.target.value))}
                className="bg-gray-700 text-white px-2 py-1 rounded"
              >
                <option value={1}>Forward (+)</option>
                <option value={-1}>Reverse (-)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Speed:</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={obj2Speed}
                onChange={(e) => setObj2Speed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{obj2Speed.toFixed(3)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Vibration:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={obj2VibrationStrength}
                onChange={(e) => setObj2VibrationStrength(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{obj2VibrationStrength.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black rounded border">
          <canvas 
            ref={canvasRef}
            className="w-full h-auto max-w-full"
            style={{ maxHeight: '700px' }}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-300 space-y-2">
          <p><strong>🔵 Blue Torus:</strong> Independent 3D Möbius torus with its own point-energy object</p>
          <p><strong>🔴 Red Torus:</strong> Second independent 3D Möbius torus system</p>
          <p><strong>🎥 3D Camera:</strong> Rotate and zoom to see the full 3D interaction</p>
          <p><strong>📏 Separation Control:</strong> Move the torus systems closer or farther apart</p>
          <p><strong>💥 Repulsion Physics:</strong> When point-energies get within 80 units, tori are pushed apart</p>
          <p><strong>🌊 Probability Fields:</strong> Blue and red clouds show each object's quantum field</p>
          <p><strong>⚡ Vector Fields:</strong> Arrows show flow patterns around each torus</p>
          <p><strong>🌀 Independent Twists:</strong> Each torus has its own Möbius twist parameter</p>
          <p><strong>Depth Rendering:</strong> Objects fade and scale based on 3D depth</p>
          <p><strong>Physics:</strong> Full 3D collision detection with realistic repulsion forces</p>
        </div>
      </div>
    </div>
  );
};

export default DualToriPointEnergySystem;
