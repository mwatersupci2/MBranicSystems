'use client'

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const DualMobiusTori3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [play, setPlay] = useState(true);

  /* ----------  LEFT (blue) torus  ---------- */
  const [twistL, setTwistL] = useState(1.0);
  const [dirL, setDirL] = useState(1);
  const [speedL, setSpeedL] = useState(0.02);
  const [vibL, setVibL] = useState(0.5);
  const [showProbL, setShowProbL] = useState(true);
  const [showVecL, setShowVecL] = useState(true);

  /* ----------  RIGHT (red) torus  ---------- */
  const [twistR, setTwistR] = useState(1.2);
  const [dirR, setDirR] = useState(-1);
  const [speedR, setSpeedR] = useState(0.015);
  const [vibR, setVibR] = useState(0.7);
  const [showProbR, setShowProbR] = useState(true);
  const [showVecR, setShowVecR] = useState(true);

  /* ----------  VIEW CONTROLS  ---------- */
  const [separation, setSeparation] = useState(320);
  const [viewRotation, setViewRotation] = useState(0);

  // Global constants
  const g = {
    R: 100,                // major radius each torus
    r: 35,                 // minor radius
    sep: separation,       // horizontal separation
    sigma: 14,
    viewRot: viewRotation * Math.PI / 180
  };

  // Create true 3D Möbius torus geometry
  const createMobiusTorusGeometry = (twist: number, resolution: number = 32) => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let phi = 0; phi < 2 * Math.PI; phi += 2 * Math.PI / resolution) {
      for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / resolution) {
        const twistAngle = twist * phi / 2;
        
        // True 3D Möbius torus coordinates
        // Center ring in 3D space with twist
        const centerX = g.R * Math.cos(phi);
        const centerY = g.R * Math.sin(phi) * Math.cos(twistAngle);
        const centerZ = g.R * Math.sin(phi) * Math.sin(twistAngle);
        
        // Tube cross-section with proper 3D orientation
        // The tube follows the twisted center ring
        const tubeX = g.r * Math.cos(theta);
        const tubeY = g.r * Math.sin(theta) * Math.cos(twistAngle);
        const tubeZ = g.r * Math.sin(theta) * Math.sin(twistAngle);
        
        // Final 3D position
        const x3d = centerX + tubeX;
        const y3d = centerY + tubeY;
        const z3d = centerZ + tubeZ;
        
        vertices.push(x3d, y3d, z3d);
        
        // Calculate proper surface normal
        const normal = new THREE.Vector3(x3d - centerX, y3d - centerY, z3d - centerZ).normalize();
        normals.push(normal.x, normal.y, normal.z);
      }
    }

    // Create faces with proper winding
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (resolution + 1) + j;
        const d = c + 1;

        // Two triangles per quad with proper orientation
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.computeVertexNormals();

    return geometry;
  };

  // Create probability field geometry
  const createProbabilityField = (torus: any, resolution: number = 20) => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    for (let phi = 0; phi < 2 * Math.PI; phi += 2 * Math.PI / resolution) {
      for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / resolution) {
        const twistAngle = torus.twist * phi / 2;
        
        // Center ring position with twist
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
        
        // Calculate probability
        const prob = calcProb(phi, theta, g.r, torus.obj.phi, torus.obj.theta, torus.obj.rCtr, torus);
        
        if (prob > 0.1) {
          vertices.push(x3d, y3d, z3d);
          
          // Color based on probability and torus side
          const baseColor = torus.side === 'L' ? 
            new THREE.Color(0x4488ff) : 
            new THREE.Color(0xff4444);
          
          const color = baseColor.clone().multiplyScalar(prob);
          colors.push(color.r, color.g, color.b);
          
          // Size based on probability
          sizes.push(prob * 4);
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return geometry;
  };

  // Probability calculation function
  const calcProb = (phi: number, theta: number, rMinor: number, centerPhi: number, centerTheta: number, centerR: number, torus: any) => {
    const pos1 = { phi, theta, r: rMinor };
    const pos2 = { phi: centerPhi, theta: centerTheta, r: centerR };
    
    // 3D distance calculation
    const twistAngle1 = torus.twist * phi / 2;
    const twistAngle2 = torus.twist * centerPhi / 2;
    
    const x1 = g.R * Math.cos(phi) + rMinor * Math.cos(theta);
    const y1 = g.R * Math.sin(phi) * Math.cos(twistAngle1) + rMinor * Math.sin(theta) * Math.cos(twistAngle1);
    const z1 = g.R * Math.sin(phi) * Math.sin(twistAngle1) + rMinor * Math.sin(theta) * Math.sin(twistAngle1);
    
    const x2 = g.R * Math.cos(centerPhi) + centerR * Math.cos(centerTheta);
    const y2 = g.R * Math.sin(centerPhi) * Math.cos(twistAngle2) + centerR * Math.sin(centerTheta) * Math.cos(twistAngle2);
    const z2 = g.R * Math.sin(centerPhi) * Math.sin(twistAngle2) + centerR * Math.sin(centerTheta) * Math.sin(twistAngle2);
    
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    const prob = Math.exp(-dist*dist / (2 * g.sigma * g.sigma)) * 
                 (1 + 0.2 * Math.cos(torus.twist * phi));
    
    return prob;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 900 / 600, 0.1, 1000);
    camera.position.set(0, 0, 400);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(900, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting for 3D effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(100, 100, 100);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-100, -100, 100);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 500);
    pointLight.position.set(0, 0, 200);
    scene.add(pointLight);

    // Create tori
    const leftTorus = {
      side: 'L',
      twist: twistL,
      obj: {
        phi: 0,
        theta: 0,
        rCtr: g.r,
        vibPhi: Math.random() * Math.PI * 2,
        vibTheta: Math.random() * Math.PI * 2,
        vibR: Math.random() * Math.PI * 2,
        oPhi: 0.12 + Math.random() * 0.08,
        oTheta: 0.15 + Math.random() * 0.1,
        oR: 0.25 + Math.random() * 0.15,
        trail: []
      }
    };

    const rightTorus = {
      side: 'R',
      twist: twistR,
      obj: {
        phi: Math.PI,
        theta: 0,
        rCtr: g.r,
        vibPhi: Math.random() * Math.PI * 2,
        vibTheta: Math.random() * Math.PI * 2,
        vibR: Math.random() * Math.PI * 2,
        oPhi: 0.12 + Math.random() * 0.08,
        oTheta: 0.15 + Math.random() * 0.1,
        oR: 0.25 + Math.random() * 0.15,
        trail: []
      }
    };

    // Create torus geometries
    const leftGeometry = createMobiusTorusGeometry(twistL);
    const rightGeometry = createMobiusTorusGeometry(twistR);

    // Create materials with solid surfaces
    const leftMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4488ff, 
      transparent: true, 
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const rightMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xff4444, 
      transparent: true, 
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    // Create meshes with proper 3D positioning
    const leftMesh = new THREE.Mesh(leftGeometry, leftMaterial);
    const rightMesh = new THREE.Mesh(rightGeometry, rightMaterial);
    
    leftMesh.position.set(-g.sep/2, 0, 0);
    rightMesh.position.set(g.sep/2, 0, 0);
    
    // Enable shadows for 3D effect
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    
    scene.add(leftMesh);
    scene.add(rightMesh);

    // Create probability fields
    const leftProbGeometry = createProbabilityField(leftTorus);
    const rightProbGeometry = createProbabilityField(rightTorus);

    const probMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const leftProbMesh = new THREE.Points(leftProbGeometry, probMaterial);
    const rightProbMesh = new THREE.Points(rightProbGeometry, probMaterial);
    
    leftProbMesh.position.set(-g.sep/2, 0, 0);
    rightProbMesh.position.set(g.sep/2, 0, 0);
    
    scene.add(leftProbMesh);
    scene.add(rightProbMesh);

    // Create point particles
    const leftParticleGeometry = new THREE.SphereGeometry(2, 8, 6);
    const rightParticleGeometry = new THREE.SphereGeometry(2, 8, 6);
    
    const leftParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const rightParticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const leftParticle = new THREE.Mesh(leftParticleGeometry, leftParticleMaterial);
    const rightParticle = new THREE.Mesh(rightParticleGeometry, rightParticleMaterial);
    
    scene.add(leftParticle);
    scene.add(rightParticle);

    // Animation loop
    let time = 0;
    const animate = () => {
      if (!play) return;
      
      time += 0.016; // ~60fps
      
      // Update camera rotation
      camera.position.x = Math.cos(g.viewRot) * 400;
      camera.position.z = Math.sin(g.viewRot) * 400;
      camera.lookAt(0, 0, 0);
      
      // Update particle positions
      const leftPos = updateParticlePosition(leftTorus, time);
      const rightPos = updateParticlePosition(rightTorus, time);
      
      leftParticle.position.set(
        -g.sep/2 + leftPos.x,
        leftPos.y,
        leftPos.z
      );
      rightParticle.position.set(
        g.sep/2 + rightPos.x,
        rightPos.y,
        rightPos.z
      );
      
      // Rotate tori
      leftMesh.rotation.y += 0.01;
      rightMesh.rotation.y -= 0.01;
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [play, twistL, twistR, separation, viewRotation]);

  // Update particle position
  const updateParticlePosition = (torus: any, time: number) => {
    const obj = torus.obj;
    const dir = torus.side === 'L' ? dirL : dirR;
    const speed = torus.side === 'L' ? speedL : speedR;
    const vib = torus.side === 'L' ? vibL : vibR;
    
    // Update particle position
    obj.phi += dir * speed;
    obj.theta += 0.5 * speed;
    
    // Add vibration
    obj.phi += vib * Math.sin(time * obj.oPhi + obj.vibPhi) * 0.1;
    obj.theta += vib * Math.sin(time * obj.oTheta + obj.vibTheta) * 0.1;
    obj.rCtr += vib * Math.sin(time * obj.oR + obj.vibR) * 0.1;
    
    // Calculate 3D position
    const twistAngle = torus.twist * obj.phi / 2;
    
    const centerX = g.R * Math.cos(obj.phi);
    const centerY = g.R * Math.sin(obj.phi) * Math.cos(twistAngle);
    const centerZ = g.R * Math.sin(obj.phi) * Math.sin(twistAngle);
    
    const tubeX = obj.rCtr * Math.cos(obj.theta);
    const tubeY = obj.rCtr * Math.sin(obj.theta) * Math.cos(twistAngle);
    const tubeZ = obj.rCtr * Math.sin(obj.theta) * Math.sin(twistAngle);
    
    return {
      x: centerX + tubeX,
      y: centerY + tubeY,
      z: centerZ + tubeZ
    };
  };

  return (
    <div className="w-full h-full bg-black">
      <div className="flex flex-col items-center space-y-4 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setPlay(!play)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {play ? 'Pause' : 'Play'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Left Torus Controls */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-white text-lg mb-4">Left Torus (Blue)</h3>
            <div className="space-y-2">
              <label className="text-white text-sm">Twist: {twistL.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={twistL}
                onChange={(e) => setTwistL(parseFloat(e.target.value))}
                className="w-full"
              />
              <label className="text-white text-sm">Speed: {speedL.toFixed(3)}</label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.001"
                value={speedL}
                onChange={(e) => setSpeedL(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Torus Controls */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-white text-lg mb-4">Right Torus (Red)</h3>
            <div className="space-y-2">
              <label className="text-white text-sm">Twist: {twistR.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={twistR}
                onChange={(e) => setTwistR(parseFloat(e.target.value))}
                className="w-full"
              />
              <label className="text-white text-sm">Speed: {speedR.toFixed(3)}</label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.001"
                value={speedR}
                onChange={(e) => setSpeedR(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="bg-gray-800 p-4 rounded w-full max-w-4xl">
          <h3 className="text-white text-lg mb-4">View Controls</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm">Separation: {separation}</label>
              <input
                type="range"
                min="200"
                max="500"
                step="10"
                value={separation}
                onChange={(e) => setSeparation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white text-sm">View Rotation: {viewRotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={viewRotation}
                onChange={(e) => setViewRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div ref={mountRef} className="w-full h-96" />
    </div>
  );
};

export default DualMobiusTori3D;
