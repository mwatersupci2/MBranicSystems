'use client'

import React, { useRef, useEffect, useState } from 'react';

const TwistedCenterTorusVectorField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVectorField, setShowVectorField] = useState(true);
  const [showProbabilityField, setShowProbabilityField] = useState(true);
  const [vibrationStrength, setVibrationStrength] = useState(0.5);
  const [centerTwist, setCenterTwist] = useState(1.0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 800;
    canvas.height = 600;
    
    // Torus with center twist parameters
    const R = 120; // Major radius (gets twisted)
    const r = 40;  // Minor radius (tube thickness)
    const centerX = 400;
    const centerY = 300;
    const sigma_r = 15; // Radial probability spread
    
    // Single point-energy object
    const pointEnergy = {
      phi: 0, // Toroidal angle (around the twisted center ring)
      theta: 0, // Poloidal angle (around the tube)
      r_center: r, // Center tube radius
      
      // Internal vibration state
      vib_phi: Math.random() * 2 * Math.PI,
      vib_theta: Math.random() * 2 * Math.PI,
      vib_r: Math.random() * 2 * Math.PI,
      
      // Vibration frequencies
      omega_phi: 0.12 + Math.random() * 0.08,
      omega_theta: 0.15 + Math.random() * 0.1,
      omega_r: 0.25 + Math.random() * 0.15,
      
      // Flow parameters
      flow_speed: 0.02,
      trail: [] as { x: number; y: number; twist: number; z: number }[]
    };
    
    // Vector field sample points
    const fieldArrows: { phi: number; theta: number }[] = [];
    for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 4) {
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 3) {
        fieldArrows.push({ phi, theta });
      }
    }
    
    let time = 0;
    
    const centerTwistedTorusTo2D = (phi: number, theta: number, r_minor: number, twist: number = centerTwist) => {
      // 3D torus with center ring twist (creates 3D Möbius topology)
      // The twist is applied to the center ring position, not the tube orientation
      
      // For a 3D Möbius, we twist the center ring in 3D space
      // As phi goes from 0 to 2π, the center ring rotates around an axis
      
      // Center ring position with twist
      const twist_angle = twist * phi / 2; // Half twist for Möbius (full twist = 2π gives back to start)
      
      // The center ring itself gets rotated in 3D space
      const center_x = R * Math.cos(phi);
      const center_y = R * Math.sin(phi) * Math.cos(twist_angle);
      const center_z = R * Math.sin(phi) * Math.sin(twist_angle);
      
      // Now add the tube around this twisted center ring
      // The tube orientation follows the twisted center ring
      const tube_x = r_minor * Math.cos(theta);
      const tube_y = r_minor * Math.sin(theta) * Math.cos(twist_angle);
      const tube_z = r_minor * Math.sin(theta) * Math.sin(twist_angle);
      
      // Final 3D position
      const x3d = center_x + tube_x;
      const y3d = center_y + tube_y;
      const z3d = center_z + tube_z;
      
      // Isometric projection
      const x2d = centerX + x3d * 0.8 - z3d * 0.4;
      const y2d = centerY + y3d * 0.6 + z3d * 0.6;
      
      return { 
        x: x2d, 
        y: y2d, 
        z: z3d,
        twist_angle: twist_angle,
        x3d, y3d, z3d,
        center_x, center_y, center_z
      };
    };
    
    const calculateCenterTwistedProbability = (phi: number, theta: number, r_minor: number, centerPhi: number, centerTheta: number, centerR: number) => {
      // Probability on center-twisted torus (3D Möbius)
      
      // Account for the 3D Möbius topology - points that are close in 3D space
      const pos1 = centerTwistedTorusTo2D(phi, theta, r_minor);
      const pos2 = centerTwistedTorusTo2D(centerPhi, centerTheta, centerR);
      
      // 3D distance between actual positions
      const dx = pos1.x3d - pos2.x3d;
      const dy = pos1.y3d - pos2.y3d;
      const dz = pos1.z3d - pos2.z3d;
      const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      // Also consider angular separation with twist
      let dphi = phi - centerPhi;
      if (Math.abs(dphi) > Math.PI) {
        dphi = dphi > 0 ? dphi - 2 * Math.PI : dphi + 2 * Math.PI;
      }
      
      let dtheta = theta - centerTheta;
      if (Math.abs(dtheta) > Math.PI) {
        dtheta = dtheta > 0 ? dtheta - 2 * Math.PI : dtheta + 2 * Math.PI;
      }
      
      const dr = r_minor - centerR;
      
      // Probability based on both 3D distance and parameter space
      const prob = Math.exp(-(dist3d**2) / (60**2)) * 
                   Math.exp(-(dr**2) / (sigma_r**2)) * 
                   (1 + 0.2 * Math.cos(centerTwist * phi));
      
      return prob;
    };
    
    const drawCenterTwistedTorus = () => {
      if (!ctx) return;
      // Draw the center-twisted torus wireframe
      ctx.strokeStyle = '#444477';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.25;
      
      // Toroidal lines (following the twisted center ring)
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 4) {
        ctx.beginPath();
        let first = true;
        for (let phi = 0; phi <= 2 * Math.PI + 0.1; phi += 0.08) {
          const pos = centerTwistedTorusTo2D(phi, theta, r);
          if (first) {
            ctx.moveTo(pos.x, pos.y);
            first = false;
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
        }
        ctx.stroke();
      }
      
      // Poloidal lines (around the tube at different phi positions)
      for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 6) {
        ctx.beginPath();
        let first = true;
        for (let theta = 0; theta <= 2 * Math.PI + 0.1; theta += 0.1) {
          const pos = centerTwistedTorusTo2D(phi, theta, r);
          if (first) {
            ctx.moveTo(pos.x, pos.y);
            first = false;
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
        }
        ctx.stroke();
      }
      
      // Draw the center ring to show the twist
      ctx.strokeStyle = '#666699';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let first = true;
      for (let phi = 0; phi <= 2 * Math.PI + 0.1; phi += 0.05) {
        const pos = centerTwistedTorusTo2D(phi, 0, 0); // Center ring
        if (first) {
          ctx.moveTo(pos.x, pos.y);
          first = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.stroke();
      
      ctx.globalAlpha = 1;
    };
    
    const drawProbabilityField = () => {
      if (!showProbabilityField) return;
      
      const { phi: centerPhi, theta: centerTheta, r_center } = pointEnergy;
      
      // Draw 3D probability density for center-twisted torus
      ctx.globalAlpha = 0.12;
      
      for (let phi = 0; phi < 2 * Math.PI; phi += 0.3) {
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.4) {
          for (let rSample = r - 18; rSample <= r + 18; rSample += 8) {
            const prob = calculateCenterTwistedProbability(phi, theta, rSample, centerPhi, centerTheta, r_center);
            
            if (prob > 0.08) {
              const pos = centerTwistedTorusTo2D(phi, theta, rSample);
              
              // Color based on center twist angle and 3D position
              const twist_phase = (pos.twist_angle % (2 * Math.PI)) / (2 * Math.PI);
              const z_phase = (pos.z3d + 100) / 200; // Normalize z position
              const hue = (twist_phase * 300 + z_phase * 120) % 360;
              
              ctx.fillStyle = `hsla(${hue}, 75%, 65%, ${prob * 0.6})`;
              
              const size = 2 + prob * 4;
              ctx.beginPath();
              ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };
    
    const drawVectorField = () => {
      if (!showVectorField) return;
      
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      
      fieldArrows.forEach(arrow => {
        const { phi, theta } = arrow;
        const pos = centerTwistedTorusTo2D(phi, theta, r);
        
        // Vector field in center-twisted torus
        const prob = calculateCenterTwistedProbability(phi, theta, r, pointEnergy.phi, pointEnergy.theta, pointEnergy.r_center);
        
        if (prob < 0.05) return; // Skip low probability regions
        
        // The center twist affects the flow direction
        const twist_angle = centerTwist * phi / 2;
        const twist_rate = centerTwist / 2; // How fast the twist changes with phi
        
        // Primary toroidal flow (around the twisted center ring)
        const F_phi = prob * (1 + 0.3 * Math.cos(2 * phi - 2 * time)) * 0.7;
        
        // Twist-induced cross-flow (perpendicular to main flow due to center twist)
        const F_twist = prob * twist_rate * 0.4 * Math.sin(phi - time * 0.5);
        
        // Small poloidal flow
        const F_theta = prob * 0.15 * Math.sin(theta - time);
        
        // Calculate 3D tangent vectors for the twisted center ring
        const dphi_x = -R * Math.sin(phi);
        const dphi_y = R * Math.cos(phi) * Math.cos(twist_angle) - R * Math.sin(phi) * Math.sin(twist_angle) * twist_rate;
        const dphi_z = R * Math.cos(phi) * Math.sin(twist_angle) + R * Math.sin(phi) * Math.cos(twist_angle) * twist_rate;
        
        // Tube tangent vectors
        const dtheta_x = -r * Math.sin(theta);
        const dtheta_y = r * Math.cos(theta) * Math.cos(twist_angle);
        const dtheta_z = r * Math.cos(theta) * Math.sin(twist_angle);
        
        // Cross product for twist direction
        const cross_x = dphi_y * dtheta_z - dphi_z * dtheta_y;
        const cross_y = dphi_z * dtheta_x - dphi_x * dtheta_z;
        const cross_z = dphi_x * dtheta_y - dphi_y * dtheta_x;
        const cross_mag = Math.sqrt(cross_x*cross_x + cross_y*cross_y + cross_z*cross_z);
        
        // Total 3D vector
        let v3d_x = F_phi * dphi_x + F_theta * dtheta_x;
        let v3d_y = F_phi * dphi_y + F_theta * dtheta_y;
        let v3d_z = F_phi * dphi_z + F_theta * dtheta_z;
        
        // Add twist component
        if (cross_mag > 0) {
          v3d_x += F_twist * cross_x / cross_mag;
          v3d_y += F_twist * cross_y / cross_mag;
          v3d_z += F_twist * cross_z / cross_mag;
        }
        
        // Project to 2D
        const vx = (v3d_x * 0.8 - v3d_z * 0.4) * 0.03;
        const vy = (v3d_y * 0.6 + v3d_z * 0.6) * 0.03;
        
        if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
          // Color based on twist phase
          const twist_phase = (pos.twist_angle % (2 * Math.PI)) / (2 * Math.PI);
          const hue = (180 + twist_phase * 180) % 360;
          ctx.strokeStyle = `hsl(${hue}, 85%, 70%)`;
          
          const arrowLength = Math.min(30, Math.sqrt(vx*vx + vy*vy) * 600);
          const endX = pos.x + vx * arrowLength;
          const endY = pos.y + vy * arrowLength;
          
          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Arrowhead
          const angle = Math.atan2(vy, vx);
          const headLength = 5;
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      });
      
      ctx.globalAlpha = 1;
    };
    
    const updatePointEnergy = () => {
      // Update internal vibration phases
      pointEnergy.vib_phi += pointEnergy.omega_phi;
      pointEnergy.vib_theta += pointEnergy.omega_theta;
      pointEnergy.vib_r += pointEnergy.omega_r;
      
      // Primary flow around the center-twisted torus
      pointEnergy.phi += pointEnergy.flow_speed;
      
      // The center twist affects theta evolution slightly
      const twist_influence = centerTwist * pointEnergy.flow_speed * 0.05;
      pointEnergy.theta += twist_influence * Math.sin(pointEnergy.phi);
      
      // Wrap angles
      if (pointEnergy.phi > 2 * Math.PI) pointEnergy.phi -= 2 * Math.PI;
      if (pointEnergy.theta > 2 * Math.PI) pointEnergy.theta -= 2 * Math.PI;
      
      // Internal vibrations with center twist coupling
      const vib_amplitude_phi = vibrationStrength * 0.25;
      const vib_amplitude_theta = vibrationStrength * 0.5;
      const vib_amplitude_r = vibrationStrength * 10;
      
      // Center twist creates complex coupling
      const twist_coupling = Math.cos(centerTwist * pointEnergy.phi / 2);
      
      // Current position
      const current_phi = pointEnergy.phi + vib_amplitude_phi * Math.sin(pointEnergy.vib_phi);
      const current_theta = pointEnergy.theta + 
                           vib_amplitude_theta * Math.sin(pointEnergy.vib_theta + twist_coupling);
      const current_r = pointEnergy.r_center + vib_amplitude_r * Math.sin(pointEnergy.vib_r);
      
      // Vector field strength
      const prob = calculateCenterTwistedProbability(current_phi, current_theta, current_r, 
                                                    pointEnergy.phi, pointEnergy.theta, pointEnergy.r_center);
      const F_phi = prob * (1 + 0.3 * Math.cos(2 * current_phi - 2 * time));
      
      return { phi: current_phi, theta: current_theta, r: current_r, F_phi, twist_coupling };
    };
    
    const drawPointEnergy = () => {
      const currentState = updatePointEnergy();
      const pos = centerTwistedTorusTo2D(currentState.phi, currentState.theta, currentState.r);
      
      // Add to trail
      pointEnergy.trail.push({ 
        x: pos.x, 
        y: pos.y, 
        twist: pos.twist_angle,
        z: pos.z3d
      });
      if (pointEnergy.trail.length > 150) {
        pointEnergy.trail.shift();
      }
      
      // Draw trail with center-twist coloring
      if (pointEnergy.trail.length > 1) {
        for (let i = 1; i < pointEnergy.trail.length; i++) {
          const alpha = (i / pointEnergy.trail.length) * 0.9;
          const twist_phase = (pointEnergy.trail[i].twist % (2 * Math.PI)) / (2 * Math.PI);
          const z_phase = (pointEnergy.trail[i].z + 100) / 200;
          const hue = (300 + twist_phase * 240 + z_phase * 120) % 360;
          
          ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
          ctx.lineWidth = 3;
          
          ctx.beginPath();
          ctx.moveTo(pointEnergy.trail[i-1].x, pointEnergy.trail[i-1].y);
          ctx.lineTo(pointEnergy.trail[i].x, pointEnergy.trail[i].y);
          ctx.stroke();
        }
      }
      
      // Draw main point-energy object
      const size = 8 + 3 * Math.sin(pointEnergy.vib_r * 2);
      const twist_phase = (pos.twist_angle % (2 * Math.PI)) / (2 * Math.PI);
      const z_phase = (pos.z3d + 100) / 200;
      const hue = (60 + twist_phase * 280 + z_phase * 80) % 360;
      
      ctx.fillStyle = `hsl(${hue}, 95%, 75%)`;
      ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 85%)`;
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Internal vibration indicators with center twist influence
      const vibLines = 8;
      for (let i = 0; i < vibLines; i++) {
        const base_angle = (i / vibLines) * 2 * Math.PI + time * 2;
        const twist_influence = pos.twist_angle * 0.5;
        const angle = base_angle + twist_influence;
        const vibRadius = 5 + 3 * Math.sin(pointEnergy.vib_phi + i + twist_influence);
        
        ctx.strokeStyle = `hsla(${(hue + 120) % 360}, 100%, 85%, 0.9)`;
        ctx.lineWidth = 2;
        
        const x1 = pos.x + vibRadius * Math.cos(angle);
        const y1 = pos.y + vibRadius * Math.sin(angle);
        const x2 = pos.x + (vibRadius + 8) * Math.cos(angle);
        const y2 = pos.y + (vibRadius + 8) * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Draw velocity vector
      const velocity_scale = 200;
      const twist_angle = pos.twist_angle;
      
      // Velocity components influenced by center twist
      const v_main = currentState.F_phi * velocity_scale;
      const v_twist = currentState.twist_coupling * vibrationStrength * 50;
      
      // Project 3D velocity to 2D
      const vx_component = v_main * (-Math.sin(currentState.phi)) + v_twist * Math.cos(twist_angle);
      const vy_component = v_main * (Math.cos(currentState.phi) * Math.cos(twist_angle)) + v_twist * Math.sin(twist_angle);
      
      const vx = vx_component * 0.8;
      const vy = vy_component * 0.6;
      
      if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
        ctx.strokeStyle = `hsl(${(hue + 240) % 360}, 100%, 80%)`;
        ctx.lineWidth = 4;
        
        const endX = pos.x + vx * 0.6;
        const endY = pos.y + vy * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Velocity arrowhead
        const angle = Math.atan2(vy, vx);
        const headLength = 12;
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    };
    
    const animate = () => {
      if (!isPlaying) return;
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw components
      drawCenterTwistedTorus();
      drawProbabilityField();
      drawVectorField();
      drawPointEnergy();
      
      // Update time
      time += 0.02;
      
      // Draw info
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText(`Time: ${time.toFixed(2)}`, 10, 25);
      ctx.fillText(`Vibration: ${vibrationStrength.toFixed(1)}`, 10, 45);
      ctx.fillText(`Center Twist: ${centerTwist.toFixed(1)}`, 10, 65);
      ctx.fillText(`Probability: ${showProbabilityField ? 'ON' : 'OFF'}`, 10, 85);
      ctx.fillText(`Vector Field: ${showVectorField ? 'ON' : 'OFF'}`, 10, 105);
      
      // Physics info
      ctx.font = '12px monospace';
      ctx.fillStyle = '#cccccc';
      ctx.fillText(`φ: ${(pointEnergy.phi % (2*Math.PI)).toFixed(2)} (around twisted center)`, 10, 130);
      ctx.fillText(`θ: ${(pointEnergy.theta % (2*Math.PI)).toFixed(2)} (around tube)`, 10, 145);
      ctx.fillText(`Twist Angle: ${((centerTwist * pointEnergy.phi / 2) % (2*Math.PI)).toFixed(2)}`, 10, 160);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, showVectorField, showProbabilityField, vibrationStrength, centerTwist]);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Point-Energy in 3D Möbius Torus (Center Ring Twisted)</h2>
        
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
          
          <div className="flex items-center gap-2 text-white">
            <label>Vibration:</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={vibrationStrength}
              onChange={(e) => setVibrationStrength(parseFloat(e.target.value))}
              className="w-20"
            />
            <span>{vibrationStrength.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <label>Center Twist:</label>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={centerTwist}
              onChange={(e) => setCenterTwist(parseFloat(e.target.value))}
              className="w-20"
            />
            <span>{centerTwist.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="bg-black rounded border">
          <canvas 
            ref={canvasRef}
            className="w-full h-auto max-w-full"
            style={{ maxHeight: '600px' }}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-300 space-y-2">
          <p><strong>Rainbow object:</strong> Point-energy in 3D Möbius torus with center ring twist</p>
          <p><strong>Purple center line:</strong> Shows the twisted center ring that creates the Möbius topology</p>
          <p><strong>Rainbow trail:</strong> Path through the 3D twisted space showing complex helical motion</p>
          <p><strong>Colored dots:</strong> 3D probability field following the center-twisted geometry</p>
          <p><strong>Colored arrows:</strong> Vector field with center-twist coupling and cross-flow</p>
          <p><strong>3D Möbius Topology:</strong> Center ring twists in 3D, creating single-sided surface</p>
          <p><strong>Physics:</strong> Center position = (R cos φ, R sin φ cos(twist·φ/2), R sin φ sin(twist·φ/2))</p>
          <p><strong>Vector Flow:</strong> Primary circulation + twist-induced perpendicular forces</p>
        </div>
      </div>
    </div>
  );
};

export default TwistedCenterTorusVectorField;

