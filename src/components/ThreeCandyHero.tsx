import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeCandyHeroProps {
  interactive?: boolean;
}

export const ThreeCandyHero: React.FC<ThreeCandyHeroProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Balanced Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf472b6, 1.8);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc084fc, 1.2);
    scene.add(hemiLight);

    // Group of 3D Cartoon Candies Floating in Kingdom
    const candyGroup = new THREE.Group();
    scene.add(candyGroup);

    // 1. Centerpiece: Royal Golden Crown Jewel Candy
    const crownGroup = new THREE.Group();
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.35, 16), crownMat);
    crownGroup.add(crownBase);

    // Crown spikes with gems
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), crownMat);
      spike.position.set(Math.cos(angle) * 0.65, 0.35, Math.sin(angle) * 0.65);
      spike.rotation.z = -Math.cos(angle) * 0.2;
      spike.rotation.x = Math.sin(angle) * 0.2;
      crownGroup.add(spike);

      const gemMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0xef4444 : 0xec4899,
        metalness: 0.2,
        roughness: 0.1,
        transmission: isSoftwareGl ? 0 : 0.85,
        transparent: true,
        opacity: isSoftwareGl ? 0.7 : 0.95,
        clearcoat: 1.0,
      });
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), gemMat);
      gem.position.set(Math.cos(angle) * 0.65, 0.65, Math.sin(angle) * 0.65);
      crownGroup.add(gem);
    }
    crownGroup.position.set(0, 0.2, 0);
    candyGroup.add(crownGroup);

    // 2. Heart Candy (Red Glossy Jelly)
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.2);
    heartShape.bezierCurveTo(0, 0.5, -0.4, 0.8, -0.8, 0.5);
    heartShape.bezierCurveTo(-1.2, 0.2, -0.8, -0.4, 0, -0.9);
    heartShape.bezierCurveTo(0.8, -0.4, 1.2, 0.2, 0.8, 0.5);
    heartShape.bezierCurveTo(0.4, 0.8, 0, 0.5, 0, 0.2);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.scale(0.5, 0.5, 0.5);
    const redJellyMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      metalness: 0.1,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const heartMesh = new THREE.Mesh(heartGeo, redJellyMat);
    heartMesh.position.set(-1.8, 0.4, 0.4);
    heartMesh.rotation.z = 0.2;
    candyGroup.add(heartMesh);

    // 3. Yellow Star Candy
    const starShape = new THREE.Shape();
    const starPoints = 5;
    for (let i = 0; i < starPoints * 2; i++) {
      const radius = i % 2 === 0 ? 0.65 : 0.32;
      const a = (i / (starPoints * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    const yellowStarMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      metalness: 0.2,
      roughness: 0.12,
      clearcoat: 1.0,
    });
    const starMesh = new THREE.Mesh(starGeo, yellowStarMat);
    starMesh.position.set(1.9, 0.3, 0.2);
    starMesh.rotation.y = 0.4;
    candyGroup.add(starMesh);

    // 4. Blue Diamond Gem Candy
    const gemGeo = new THREE.OctahedronGeometry(0.48, 1);
    const blueGemMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.3,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const blueGem = new THREE.Mesh(gemGeo, blueGemMat);
    blueGem.position.set(-1.2, -0.7, 0.8);
    blueGem.scale.set(1, 1.2, 1);
    candyGroup.add(blueGem);

    // 5. Purple Wrapped Bonbon
    const purpleMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      metalness: 0.2,
      roughness: 0.2,
      clearcoat: 0.8,
    });
    const purpleCandy = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.18, 12, 24), purpleMat);
    purpleCandy.position.set(1.3, -0.6, 0.7);
    candyGroup.add(purpleCandy);

    // Floating Sparkles / Sugar Crystals
    const crystalGeo = new THREE.TetrahedronGeometry(0.08, 0);
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const crystalGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const c = new THREE.Mesh(crystalGeo, crystalMat);
      c.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );
      c.scale.setScalar(0.6 + Math.random() * 0.8);
      crystalGroup.add(c);
    }
    candyGroup.add(crystalGroup);

    // Mouse / Touch Interaction
    let targetRotY = 0;
    let targetRotX = 0;
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.8;
      targetRotX = y * 0.5;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Animation Loop with Three.js Clock and smooth damping
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Exponential damping toward pointer target
      candyGroup.rotation.y = THREE.MathUtils.damp(candyGroup.rotation.y, targetRotY, 4, dt);
      candyGroup.rotation.x = THREE.MathUtils.damp(candyGroup.rotation.x, targetRotX, 4, dt);

      // Sweet floating breathing animations
      crownGroup.position.y = 0.2 + Math.sin(time * 2.0) * 0.08;
      crownGroup.rotation.y += dt * 0.5;

      heartMesh.position.y = 0.4 + Math.cos(time * 2.2) * 0.1;
      heartMesh.rotation.y += dt * 0.7;

      starMesh.position.y = 0.3 + Math.sin(time * 2.4 + 1) * 0.12;
      starMesh.rotation.z += dt * 0.6;

      blueGem.rotation.x += dt * 0.8;
      blueGem.rotation.y += dt * 0.6;

      purpleCandy.rotation.x += dt * 0.9;
      purpleCandy.rotation.y += dt * 0.7;

      crystalGroup.rotation.y -= dt * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '220px' }}
    />
  );
};
