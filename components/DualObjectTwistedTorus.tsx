'use client'

import React, { useRef, useEffect, useState } from 'react';

const DualMobiusTori = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef      = useRef<number | null>(null);
  const [play, setPlay] = useState(true);

  /* ----------  LEFT (blue) torus  ---------- */
  const [twistL, setTwistL] = useState(1.0);
  const [dirL, setDirL]     = useState(1);
  const [speedL, setSpeedL] = useState(0.02);
  const [vibL, setVibL]     = useState(0.5);
  const [showProbL, setShowProbL] = useState(true);
  const [showVecL, setShowVecL]   = useState(true);

  /* ----------  RIGHT (red) torus  ---------- */
  const [twistR, setTwistR] = useState(1.2);
  const [dirR, setDirR]     = useState(-1);
  const [speedR, setSpeedR] = useState(0.015);
  const [vibR, setVibR]     = useState(0.7);
  const [showProbR, setShowProbR] = useState(true);
  const [showVecR, setShowVecR]   = useState(true);

  /* ----------  VIEW CONTROLS  ---------- */
  const [separation, setSeparation] = useState(320); // Distance between tori centers
  const [viewRotation, setViewRotation] = useState(0); // Rotation angle for viewpoint

  /* ---------------------------------------------------------- */
  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    cv.width = 900; cv.height = 600;

    const g = {              // global drawing constants
      R: 100,                // major radius each torus
      r:  35,                // minor radius
      sep: separation,       // horizontal separation (centre to centre)
      yCtr: 300,
      sigma: 14,
      viewRot: viewRotation * Math.PI / 180 // Convert degrees to radians
    };

    /* ------------  build one torus + object descriptor  ------------ */
    const makeTorus = (side: 'L' | 'R') => ({
      side,
      centreX: side==='L' ? 450 - g.sep/2 : 450 + g.sep/2,
      twist: side==='L' ? twistL : twistR,
      // wire colours
      wCol: side==='L' ? '#4488ff' : '#ff4444',
      cCol: side==='L' ? '#66aaff' : '#ff6666',
      // probability / vector colours
      hueBase: side==='L' ? 210 : 0,
      // point-energy object
      obj: {
        phi: side==='L' ? 0 : Math.PI,
        theta: 0,
        rCtr: g.r,
        vibPhi: Math.random()*Math.PI*2,
        vibTheta: Math.random()*Math.PI*2,
        vibR: Math.random()*Math.PI*2,
        oPhi: 0.12 + Math.random()*0.08,
        oTheta: 0.15 + Math.random()*0.1,
        oR: 0.25 + Math.random()*0.15,
        trail: []
      }
    });

    const tori = [makeTorus('L'), makeTorus('R')];
    let time = 0;

    /* ------------  torus 3D -> 2D projection  ------------ */
    const torusTo2D = (phi: number, theta: number, rMinor: number, torus: any) => {
      const twistAngle = torus.twist * phi / 2;
      
      // Center ring position with twist
      const centerX = g.R * Math.cos(phi);
      const centerY = g.R * Math.sin(phi) * Math.cos(twistAngle);
      const centerZ = g.R * Math.sin(phi) * Math.sin(twistAngle);
      
      // Tube around twisted center ring
      const tubeX = rMinor * Math.cos(theta);
      const tubeY = rMinor * Math.sin(theta) * Math.cos(twistAngle);
      const tubeZ = rMinor * Math.sin(theta) * Math.sin(twistAngle);
      
      // Final 3D position
      const x3d = centerX + tubeX;
      const y3d = centerY + tubeY;
      const z3d = centerZ + tubeZ;
      
      // Apply view rotation
      const cosRot = Math.cos(g.viewRot);
      const sinRot = Math.sin(g.viewRot);
      const x3dRot = x3d * cosRot - z3d * sinRot;
      const z3dRot = x3d * sinRot + z3d * cosRot;
      
      // Isometric projection with rotation
      const x2d = torus.centreX + x3dRot * 0.8 - z3dRot * 0.4;
      const y2d = g.yCtr + y3d * 0.6 + z3dRot * 0.6;
      
      return { 
        x: x2d, 
        y: y2d, 
        z: z3d,
        twistAngle: twistAngle,
        x3d, y3d, z3d,
        centerX, centerY, centerZ
      };
    };

    /* ------------  probability calculation  ------------ */
    const calcProb = (phi: number, theta: number, rMinor: number, centerPhi: number, centerTheta: number, centerR: number, torus: any) => {
      const pos1 = torusTo2D(phi, theta, rMinor, torus);
      const pos2 = torusTo2D(centerPhi, centerTheta, centerR, torus);
      
      // 3D distance
      const dx = pos1.x3d - pos2.x3d;
      const dy = pos1.y3d - pos2.y3d;
      const dz = pos1.z3d - pos2.z3d;
      const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      // Angular separation
      let dphi = phi - centerPhi;
      if (Math.abs(dphi) > Math.PI) {
        dphi = dphi > 0 ? dphi - 2 * Math.PI : dphi + 2 * Math.PI;
      }
      
      let dtheta = theta - centerTheta;
      if (Math.abs(dtheta) > Math.PI) {
        dtheta = dtheta > 0 ? dtheta - 2 * Math.PI : dtheta + 2 * Math.PI;
      }
      
      const dr = rMinor - centerR;
      
      // Probability
      const prob = Math.exp(-(dist3d*dist3d) / (60*60)) * 
                   Math.exp(-(dr*dr) / (g.sigma*g.sigma)) * 
                   (1 + 0.2 * Math.cos(torus.twist * phi));
      
      return prob;
    };

    /* ------------  draw 3D torus as true 3D object  ------------ */
    const drawTorus = (torus: any) => {
      // 3D rendering parameters
      const resolution = 20;
      const cameraDistance = 400;
      const fov = 60; // field of view in degrees
      
      // Generate 3D mesh points
      const mesh = [];
      for (let phi = 0; phi < 2 * Math.PI; phi += 2 * Math.PI / resolution) {
        const phiRow = [];
        for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / resolution) {
          // Calculate 3D coordinates in world space
          const twistAngle = torus.twist * phi / 2;
          
          // Torus center position
          const centerX = g.R * Math.cos(phi);
          const centerY = g.R * Math.sin(phi) * Math.cos(twistAngle);
          const centerZ = g.R * Math.sin(phi) * Math.sin(twistAngle);
          
          // Tube position relative to center
          const tubeX = g.r * Math.cos(theta);
          const tubeY = g.r * Math.sin(theta) * Math.cos(twistAngle);
          const tubeZ = g.r * Math.sin(theta) * Math.sin(twistAngle);
          
          // Final 3D position
          const x3d = centerX + tubeX;
          const y3d = centerY + tubeY;
          const z3d = centerZ + tubeZ;
          
          // Apply view rotation
          const cosRot = Math.cos(g.viewRot);
          const sinRot = Math.sin(g.viewRot);
          const x3dRot = x3d * cosRot - z3d * sinRot;
          const z3dRot = x3d * sinRot + z3d * cosRot;
          
          // Perspective projection
          const scale = fov / (cameraDistance + z3dRot);
          const x2d = torus.centreX + x3dRot * scale;
          const y2d = g.yCtr + y3d * scale;
          
          phiRow.push({
            x: x2d,
            y: y2d,
            z: z3dRot,
            x3d: x3d,
            y3d: y3d,
            z3d: z3d,
            phi: phi,
            theta: theta
          });
        }
        mesh.push(phiRow);
      }
      
      // Create triangles and sort by depth
      const triangles = [];
      
      for (let i = 0; i < mesh.length - 1; i++) {
        for (let j = 0; j < mesh[i].length - 1; j++) {
          const p1 = mesh[i][j];
          const p2 = mesh[i + 1][j];
          const p3 = mesh[i][j + 1];
          const p4 = mesh[i + 1][j + 1];
          
          // Create two triangles per quad
          triangles.push({
            points: [p1, p2, p3],
            avgZ: (p1.z + p2.z + p3.z) / 3
          });
          triangles.push({
            points: [p2, p4, p3],
            avgZ: (p2.z + p4.z + p3.z) / 3
          });
        }
      }
      
      // Sort triangles by depth (back to front)
      triangles.sort((a, b) => b.avgZ - a.avgZ);
      
      // Draw triangles with 3D shading
      triangles.forEach(triangle => {
        const [p1, p2, p3] = triangle.points;
        
        // Calculate surface normal using 3D coordinates
        const v1 = { x: p2.x3d - p1.x3d, y: p2.y3d - p1.y3d, z: p2.z3d - p1.z3d };
        const v2 = { x: p3.x3d - p1.x3d, y: p3.y3d - p1.y3d, z: p3.z3d - p1.z3d };
        const normal = {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x
        };
        
        // Normalize normal
        const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
        if (length > 0) {
          normal.x /= length;
          normal.y /= length;
          normal.z /= length;
        }
        
        // 3D lighting calculation
        const lightDir = { x: 0.5, y: 0.5, z: 1 };
        const dot = Math.max(0, normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z);
        
        // Depth-based shading
        const depthFactor = Math.max(0.2, (triangle.avgZ + 200) / 400);
        const intensity = dot * depthFactor;
        
        // Color based on torus side
        const baseColor = torus.side === 'L' ? 
          { r: 68, g: 136, b: 255 } : 
          { r: 255, g: 68, b: 68 };
        
        const color = {
          r: Math.floor(baseColor.r * intensity),
          g: Math.floor(baseColor.g * intensity),
          b: Math.floor(baseColor.b * intensity)
        };
        
        // Draw triangle with 3D appearance
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
        
        // Draw triangle outline for 3D structure
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw center ring with 3D perspective
      ctx.strokeStyle = torus.cCol;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      let first = true;
      for (let phi = 0; phi <= 2 * Math.PI + 0.1; phi += 0.05) {
        const pos = torusTo2D(phi, 0, 0, torus);
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

    /* ------------  draw 3D probability field  ------------ */
    const drawProbField = (torus: any) => {
      if ((torus.side === 'L' && !showProbL) || (torus.side === 'R' && !showProbR)) return;
      
      ctx.globalAlpha = 0.2;
      
      // Draw probability field as 3D cloud around the object
      for (let phi = 0; phi < 2 * Math.PI; phi += 0.3) {
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.4) {
          for (let rSample = g.r - 15; rSample <= g.r + 15; rSample += 6) {
            const prob = calcProb(phi, theta, rSample, torus.obj.phi, torus.obj.theta, torus.obj.rCtr, torus);
            
            if (prob > 0.08) {
              const pos = torusTo2D(phi, theta, rSample, torus);
              
              const twistPhase = (pos.twistAngle % (2 * Math.PI)) / (2 * Math.PI);
              const zPhase = (pos.z3d + 150) / 300;
              const hue = (torus.hueBase + twistPhase * 120 + zPhase * 60) % 360;
              
              // Size based on probability and depth
              const depthFactor = Math.max(0.4, zPhase);
              const size = (2 + prob * 4) * depthFactor;
              
              // Create gradient for 3D effect
              const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
              gradient.addColorStop(0, `hsla(${hue}, 80%, 80%, ${prob * 0.8 * depthFactor})`);
              gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, ${prob * 0.4 * depthFactor})`);
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };

    /* ------------  draw vector field  ------------ */
    const drawVecField = (torus: any) => {
      if ((torus.side === 'L' && !showVecL) || (torus.side === 'R' && !showVecR)) return;
      
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      
      // Vector field sample points
      for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 4) {
        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 3) {
          const pos = torusTo2D(phi, theta, g.r, torus);
          const prob = calcProb(phi, theta, g.r, torus.obj.phi, torus.obj.theta, torus.obj.rCtr, torus);
          
          if (prob < 0.05) continue;
          
          const twistAngle = torus.twist * phi / 2;
          const twistRate = torus.twist / 2;
          
          const F_phi = prob * (1 + 0.3 * Math.cos(2 * phi - 2 * time)) * 0.7;
          const F_twist = prob * twistRate * 0.4 * Math.sin(phi - time * 0.5);
          const F_theta = prob * 0.15 * Math.sin(theta - time);
          
          // Calculate 3D tangent vectors
          const dphi_x = -g.R * Math.sin(phi);
          const dphi_y = g.R * Math.cos(phi) * Math.cos(twistAngle) - g.R * Math.sin(phi) * Math.sin(twistAngle) * twistRate;
          const dphi_z = g.R * Math.cos(phi) * Math.sin(twistAngle) + g.R * Math.sin(phi) * Math.cos(twistAngle) * twistRate;
          
          const dtheta_x = -g.r * Math.sin(theta);
          const dtheta_y = g.r * Math.cos(theta) * Math.cos(twistAngle);
          const dtheta_z = g.r * Math.cos(theta) * Math.sin(twistAngle);
          
          // Cross product
          const cross_x = dphi_y * dtheta_z - dphi_z * dtheta_y;
          const cross_y = dphi_z * dtheta_x - dphi_x * dtheta_z;
          const cross_z = dphi_x * dtheta_y - dphi_y * dtheta_x;
          const cross_mag = Math.sqrt(cross_x*cross_x + cross_y*cross_y + cross_z*cross_z);
          
          // Total 3D vector
          let v3d_x = F_phi * dphi_x + F_theta * dtheta_x;
          let v3d_y = F_phi * dphi_y + F_theta * dtheta_y;
          let v3d_z = F_phi * dphi_z + F_theta * dtheta_z;
          
          if (cross_mag > 0) {
            v3d_x += F_twist * cross_x / cross_mag;
            v3d_y += F_twist * cross_y / cross_mag;
            v3d_z += F_twist * cross_z / cross_mag;
          }
          
          // Apply view rotation to vector
          const cosRot = Math.cos(g.viewRot);
          const sinRot = Math.sin(g.viewRot);
          const v3d_x_rot = v3d_x * cosRot - v3d_z * sinRot;
          const v3d_z_rot = v3d_x * sinRot + v3d_z * cosRot;
          
          // 3D perspective projection
          const cameraDistance = 400;
          const fov = 60;
          const scale = fov / (cameraDistance + pos.z3d);
          const vx = v3d_x_rot * scale * 0.03;
          const vy = v3d_y * scale * 0.03;
          
          if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
            const twistPhase = (pos.twistAngle % (2 * Math.PI)) / (2 * Math.PI);
            const hue = (torus.hueBase + twistPhase * 120) % 360;
            ctx.strokeStyle = `hsl(${hue}, 85%, 70%)`;
            
            const arrowLength = Math.min(25, Math.sqrt(vx*vx + vy*vy) * 500);
            const endX = pos.x + vx * arrowLength;
            const endY = pos.y + vy * arrowLength;
            
            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Arrowhead
            const angle = Math.atan2(vy, vx);
            const headLength = 4;
            
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
        }
      }
      
      ctx.globalAlpha = 1;
    };

    /* ------------  update point energy object  ------------ */
    const updateObj = (torus: any) => {
      const obj = torus.obj;
      const dir = torus.side === 'L' ? dirL : dirR;
      const speed = torus.side === 'L' ? speedL : speedR;
      const vib = torus.side === 'L' ? vibL : vibR;
      
      // Update vibrations
      obj.vibPhi += obj.oPhi;
      obj.vibTheta += obj.oTheta;
      obj.vibR += obj.oR;
      
      // Primary flow
      obj.phi += dir * speed;
      
      // Twist influence
      const twistInfluence = torus.twist * speed * 0.05 * dir;
      obj.theta += twistInfluence * Math.sin(obj.phi);
      
      // Wrap angles
      if (obj.phi > 2 * Math.PI) obj.phi -= 2 * Math.PI;
      if (obj.phi < 0) obj.phi += 2 * Math.PI;
      if (obj.theta > 2 * Math.PI) obj.theta -= 2 * Math.PI;
      if (obj.theta < 0) obj.theta += 2 * Math.PI;
      
      // Current position with vibrations
      const vibAmplitudePhi = vib * 0.25;
      const vibAmplitudeTheta = vib * 0.5;
      const vibAmplitudeR = vib * 8;
      
      const twistCoupling = Math.cos(torus.twist * obj.phi / 2);
      
      const currentPhi = obj.phi + vibAmplitudePhi * Math.sin(obj.vibPhi);
      const currentTheta = obj.theta + vibAmplitudeTheta * Math.sin(obj.vibTheta + twistCoupling);
      const currentR = obj.rCtr + vibAmplitudeR * Math.sin(obj.vibR);
      
      return { phi: currentPhi, theta: currentTheta, r: currentR, twistCoupling };
    };

    /* ------------  draw point energy object with 3D vector  ------------ */
    const drawObj = (torus: any) => {
      const currentState = updateObj(torus);
      const pos = torusTo2D(currentState.phi, currentState.theta, currentState.r, torus);
      
      // Add to trail
      torus.obj.trail.push({ 
        x: pos.x, 
        y: pos.y, 
        twist: pos.twistAngle,
        z: pos.z3d
      });
      if (torus.obj.trail.length > 100) {
        torus.obj.trail.shift();
      }
      
      // Draw trail
      if (torus.obj.trail.length > 1) {
        for (let i = 1; i < torus.obj.trail.length; i++) {
          const alpha = (i / torus.obj.trail.length) * 0.9;
          const twistPhase = (torus.obj.trail[i].twist % (2 * Math.PI)) / (2 * Math.PI);
          const zPhase = (torus.obj.trail[i].z + 100) / 200;
          const hue = (torus.hueBase + twistPhase * 120 + zPhase * 60) % 360;
          
          ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
          ctx.lineWidth = 2.5;
          
          ctx.beginPath();
          ctx.moveTo(torus.obj.trail[i-1].x, torus.obj.trail[i-1].y);
          ctx.lineTo(torus.obj.trail[i].x, torus.obj.trail[i].y);
          ctx.stroke();
        }
      }
      
      // Draw 3D point object with perspective
      const baseSize = 6;
      const cameraDistance = 400;
      const fov = 60;
      
      // Apply perspective scaling
      const scale = fov / (cameraDistance + pos.z3d);
      const size = baseSize * scale;
      
      const twistPhase = (pos.twistAngle % (2 * Math.PI)) / (2 * Math.PI);
      const zPhase = (pos.z3d + 200) / 400;
      const hue = (torus.hueBase + twistPhase * 120 + zPhase * 60) % 360;
      
      // 3D depth-based brightness
      const depthFactor = Math.max(0.4, (pos.z3d + 200) / 400);
      const brightness = 0.7 + 0.3 * depthFactor;
      
      // Draw 3D point with perspective
      ctx.fillStyle = `hsl(${hue}, 95%, ${brightness * 100}%)`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // 3D outline
      ctx.strokeStyle = `hsl(${(hue + 120) % 360}, 100%, 85%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw 3D velocity vector
      const dir = torus.side === 'L' ? dirL : dirR;
      const speed = torus.side === 'L' ? speedL : speedR;
      const vib = torus.side === 'L' ? vibL : vibR;
      
      // Calculate 3D velocity components
      const twistAngle = pos.twistAngle;
      const twistRate = torus.twist / 2;
      
      // Primary flow velocity
      const v_phi = dir * speed * 100; // Scale for visibility
      const v_theta = currentState.twistCoupling * vib * 20;
      const v_r = vib * 15 * Math.sin(torus.obj.vibR);
      
      // 3D velocity vector in torus coordinates
      const v3d_x = v_phi * (-Math.sin(currentState.phi)) + v_theta * Math.cos(currentState.theta);
      const v3d_y = v_phi * (Math.cos(currentState.phi) * Math.cos(twistAngle)) + v_theta * Math.sin(currentState.theta) * Math.cos(twistAngle);
      const v3d_z = v_phi * (Math.cos(currentState.phi) * Math.sin(twistAngle)) + v_theta * Math.sin(currentState.theta) * Math.sin(twistAngle) + v_r;
      
      // Apply view rotation to velocity vector
      const cosRot = Math.cos(g.viewRot);
      const sinRot = Math.sin(g.viewRot);
      const v3d_x_rot = v3d_x * cosRot - v3d_z * sinRot;
      const v3d_z_rot = v3d_x * sinRot + v3d_z * cosRot;
      
      // Project 3D velocity to 2D
      const vx = v3d_x_rot * 0.8 - v3d_z_rot * 0.4;
      const vy = v3d_y * 0.6 + v3d_z_rot * 0.6;
      
      // Draw velocity vector if significant
      if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
        ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 80%)`;
        ctx.lineWidth = 4;
        
        const endX = pos.x + vx * 0.8;
        const endY = pos.y + vy * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // 3D arrowhead
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
      
      // Simple vibration indicators
      const vibLines = 4;
      for (let i = 0; i < vibLines; i++) {
        const baseAngle = (i / vibLines) * 2 * Math.PI + time * 1.5;
        const twistInfluence = pos.twistAngle * 0.5;
        const angle = baseAngle + twistInfluence;
        const vibRadius = 2 + Math.sin(torus.obj.vibPhi + i + twistInfluence);
        
        ctx.strokeStyle = `hsla(${(hue + 120) % 360}, 100%, 85%, 0.7)`;
        ctx.lineWidth = 1;
        
        const x1 = pos.x + vibRadius * Math.cos(angle);
        const y1 = pos.y + vibRadius * Math.sin(angle);
        const x2 = pos.x + (vibRadius + 4) * Math.cos(angle);
        const y2 = pos.y + (vibRadius + 4) * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    /* ------------  animation loop  ------------ */
    const animate = () => {
      if (!play) return;
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, cv.width, cv.height);
      
      // Draw both tori
      tori.forEach(torus => {
        drawTorus(torus);
        drawProbField(torus);
        drawVecField(torus);
        drawObj(torus);
      });
      
      // Update time
      time += 0.02;
      
      // Draw info
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText(`Time: ${time.toFixed(2)}`, 10, 25);
      
      // Left torus info
      ctx.fillStyle = '#88ccff';
      ctx.fillText(`Left (Blue): Twist ${twistL.toFixed(1)}, Dir ${dirL > 0 ? '+' : '-'}, Speed ${speedL.toFixed(3)}, Vib ${vibL.toFixed(1)}`, 10, 45);
      
      // Right torus info
      ctx.fillStyle = '#ffaa88';
      ctx.fillText(`Right (Red): Twist ${twistR.toFixed(1)}, Dir ${dirR > 0 ? '+' : '-'}, Speed ${speedR.toFixed(3)}, Vib ${vibR.toFixed(1)}`, 10, 65);
      
      // View info
      ctx.fillStyle = '#aaffaa';
      ctx.fillText(`Separation: ${separation}px | View Rotation: ${viewRotation}°`, 10, 85);
      
      // Physics info
      ctx.fillStyle = '#cccccc';
      ctx.fillText(`L φ: ${(tori[0].obj.phi % (2*Math.PI)).toFixed(2)} | R φ: ${(tori[1].obj.phi % (2*Math.PI)).toFixed(2)}`, 10, 105);
      
      animRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [play, twistL, dirL, speedL, vibL, showProbL, showVecL,
      twistR, dirR, speedR, vibR, showProbR, showVecR,
      separation, viewRotation]);
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Dual Möbius Tori - Independent 3D Twisted Surfaces</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setPlay(!play)}
            className={`px-4 py-2 rounded ${play ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
          >
            {play ? 'Pause' : 'Play'}
          </button>
        </div>
        
        {/* View Controls */}
        <div className="bg-gray-800 bg-opacity-50 rounded p-3 mb-4">
          <h3 className="text-white font-semibold mb-2">View Controls</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-white">
              <label>Separation:</label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={separation}
                onChange={(e) => setSeparation(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>{separation}px</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>View Rotation:</label>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={viewRotation}
                onChange={(e) => setViewRotation(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>{viewRotation}°</span>
            </div>
          </div>
        </div>
        
        {/* Left Torus Controls */}
        <div className="bg-blue-900 bg-opacity-30 rounded p-3 mb-3">
          <h3 className="text-white font-semibold mb-2">Left Torus (Blue)</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-white">
              <label>Twist:</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={twistL}
                onChange={(e) => setTwistL(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{twistL.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Direction:</label>
              <button
                onClick={() => setDirL(dirL * -1)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                {dirL > 0 ? '+' : '-'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Speed:</label>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.001"
                value={speedL}
                onChange={(e) => setSpeedL(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{speedL.toFixed(3)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Vibration:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={vibL}
                onChange={(e) => setVibL(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{vibL.toFixed(1)}</span>
            </div>
            
            <button
              onClick={() => setShowProbL(!showProbL)}
              className={`px-3 py-1 rounded text-sm ${showProbL ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
            >
              Prob: {showProbL ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={() => setShowVecL(!showVecL)}
              className={`px-3 py-1 rounded text-sm ${showVecL ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
            >
              Vec: {showVecL ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        
        {/* Right Torus Controls */}
        <div className="bg-red-900 bg-opacity-30 rounded p-3 mb-4">
          <h3 className="text-white font-semibold mb-2">Right Torus (Red)</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-white">
              <label>Twist:</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={twistR}
                onChange={(e) => setTwistR(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{twistR.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Direction:</label>
              <button
                onClick={() => setDirR(dirR * -1)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                {dirR > 0 ? '+' : '-'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Speed:</label>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.001"
                value={speedR}
                onChange={(e) => setSpeedR(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{speedR.toFixed(3)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <label>Vibration:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={vibR}
                onChange={(e) => setVibR(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{vibR.toFixed(1)}</span>
            </div>
            
            <button
              onClick={() => setShowProbR(!showProbR)}
              className={`px-3 py-1 rounded text-sm ${showProbR ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
            >
              Prob: {showProbR ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={() => setShowVecR(!showVecR)}
              className={`px-3 py-1 rounded text-sm ${showVecR ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
            >
              Vec: {showVecR ? 'ON' : 'OFF'}
            </button>
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
          <p><strong>Two Independent Möbius Tori:</strong> Separate 3D twisted surfaces with independent point-energy objects</p>
          <p><strong>Left Torus (Blue):</strong> Blue-cyan color scheme with independent controls</p>
          <p><strong>Right Torus (Red):</strong> Red-orange color scheme with independent controls</p>
          <p><strong>Independent Controls:</strong> Each torus has separate twist, direction, speed, vibration, and visualization toggles</p>
          <p><strong>View Controls:</strong> Adjust separation distance (100-500px) and view rotation (0-360°)</p>
          <p><strong>3D Möbius Topology:</strong> Each torus has its own center ring twist creating single-sided surfaces</p>
          <p><strong>Physics:</strong> Objects move independently through their respective twisted 3D spaces</p>
          <p><strong>Visualization:</strong> Probability fields and vector fields can be toggled independently for each torus</p>
        </div>
      </div>
    </div>
  );
};

export default DualMobiusTori;