import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ThreeBg() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0xe8c26f, 1.2, 50);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Group for entire interactive items
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Spline curve for camera path
    const splinePoints = [
      new THREE.Vector3(0, 0, 10),      // Sryverse Start
      new THREE.Vector3(8, 2, -5),       // SkillMatch
      new THREE.Vector3(-8, -4, -20),    // EstateMatch
      new THREE.Vector3(6, 6, -35),      // Metraj AI
      new THREE.Vector3(0, 0, -50)       // Methodology
    ];
    const cameraSpline = new THREE.CatmullRomCurve3(splinePoints);

    // LookAt targets corresponding to each section
    const lookAtTargets = [
      new THREE.Vector3(0, 0, 0),        // Sryverse Core
      new THREE.Vector3(8, 2, -15),      // SkillMatch Mesh
      new THREE.Vector3(-8, -4, -30),    // EstateMatch Grid
      new THREE.Vector3(6, 6, -45),      // Metraj Poly
      new THREE.Vector3(0, 0, -60)       // Methodology
    ];

    // --- 2. 3D GEOMETRIES FOR PRODUCTS ---
    
    // 1. Sryverse Core (Particle Mesh Sphere)
    const sryGeo = new THREE.BufferGeometry();
    const particleCount = 600;
    const sryPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 3.5;
      sryPos[i] = r * Math.sin(phi) * Math.cos(theta);
      sryPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      sryPos[i + 2] = r * Math.cos(phi);
    }
    sryGeo.setAttribute('position', new THREE.BufferAttribute(sryPos, 3));
    const sryMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x10b981,
      transparent: true,
      opacity: 0.8
    });
    const sryPoints = new THREE.Points(sryGeo, sryMat);
    sryPoints.position.copy(lookAtTargets[0]);
    sceneGroup.add(sryPoints);

    // 2. SkillMatch AI (Connected Spheres)
    const skillGroup = new THREE.Group();
    skillGroup.position.copy(lookAtTargets[1]);
    sceneGroup.add(skillGroup);

    const nodesList = [];
    const skillMat = new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x064e3b, shininess: 30 });
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.SphereGeometry(0.25, 16, 16);
      const mesh = new THREE.Mesh(geo, skillMat);
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      skillGroup.add(mesh);
      nodesList.push(mesh);
    }

    // Connect node spheres with line segments
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, opacity: 0.4, transparent: true });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < nodesList.length; i++) {
      for (let j = i + 1; j < nodesList.length; j++) {
        if (nodesList[i].position.distanceTo(nodesList[j].position) < 2.5) {
          linePositions.push(nodesList[i].position.x, nodesList[i].position.y, nodesList[i].position.z);
          linePositions.push(nodesList[j].position.x, nodesList[j].position.y, nodesList[j].position.z);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const skillNetworkLines = new THREE.LineSegments(lineGeo, lineMat);
    skillGroup.add(skillNetworkLines);

    // 3. EstateMatch AI (Structured Wireframe Grid Structure)
    const estateGroup = new THREE.Group();
    estateGroup.position.copy(lookAtTargets[2]);
    sceneGroup.add(estateGroup);

    const gridBox = new THREE.BoxGeometry(4, 4, 4, 4, 4, 4);
    const gridWire = new THREE.WireframeGeometry(gridBox);
    const estateMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 1 });
    const estateMesh = new THREE.LineSegments(gridWire, estateMat);
    estateGroup.add(estateMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.3 });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    estateGroup.add(innerSphere);

    // 4. Metraj AI (Gold Polyhedron Geometry)
    const metrajGroup = new THREE.Group();
    metrajGroup.position.copy(lookAtTargets[3]);
    sceneGroup.add(metrajGroup);

    const polyGeo = new THREE.IcosahedronGeometry(2, 1);
    const polyWire = new THREE.WireframeGeometry(polyGeo);
    const metrajMat = new THREE.LineBasicMaterial({ color: 0xe8c26f, linewidth: 2 });
    const metrajMesh = new THREE.LineSegments(polyWire, metrajMat);
    metrajGroup.add(metrajMesh);

    const solidPolyMat = new THREE.MeshPhongMaterial({ color: 0xe8c26f, transparent: true, opacity: 0.15, flatShading: true });
    const solidPoly = new THREE.Mesh(polyGeo, solidPolyMat);
    metrajGroup.add(solidPoly);

    // 5. Methodology (Complex torus ring)
    const methodGroup = new THREE.Group();
    methodGroup.position.copy(lookAtTargets[4]);
    sceneGroup.add(methodGroup);

    const torusGeo = new THREE.TorusKnotGeometry(1.8, 0.4, 120, 16);
    const torusMat = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    methodGroup.add(torusKnot);

    // Helper: floaty space dust particles
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 40;
      dustPositions[i + 1] = (Math.random() - 0.5) * 40;
      dustPositions[i + 2] = (Math.random() - 0.5) * 100 - 40; // along path
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.04, color: 0xffffff, transparent: true, opacity: 0.3 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // --- 3. CAMERA SPLINE ROTATION & SCROLL INTEGRATION ---
    gsap.registerPlugin(ScrollTrigger);

    function updateCamera(progress) {
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      const camPos = cameraSpline.getPointAt(progress);
      camera.position.copy(camPos);

      const segmentCount = lookAtTargets.length - 1;
      const rawIndex = progress * segmentCount;
      const startIndex = Math.floor(rawIndex);
      const endIndex = Math.min(startIndex + 1, segmentCount);
      const localProgress = rawIndex - startIndex;

      const currentLookAt = new THREE.Vector3().copy(lookAtTargets[startIndex]);
      const nextLookAt = lookAtTargets[endIndex];
      currentLookAt.lerp(nextLookAt, localProgress);

      camera.lookAt(currentLookAt);
      pointLight.position.copy(camPos).add(new THREE.Vector3(0, 0, -2));
    }

    // Initialize camera
    updateCamera(0);

    // Bind GSAP ScrollTrigger to page scroll
    const trigger = ScrollTrigger.create({
      trigger: ".site-scroll-wrapper", // main scroll wrapper
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        updateCamera(self.progress);
        
        // Dispatch custom event to notify React App about active indices
        const segmentCount = lookAtTargets.length - 1;
        const activeIdx = Math.round(self.progress * segmentCount);
        const event = new CustomEvent('sryverse-scroll-index', { detail: { activeIdx, progress: self.progress } });
        window.dispatchEvent(event);
      }
    });

    // --- 4. INTERACTION & ANIMATION LOOP ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
      
      gsap.to(sceneGroup.rotation, {
        y: mouseX * 0.15,
        x: mouseY * 0.15,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Spin abstract product shapes
      sryPoints.rotation.y = elapsedTime * 0.08;
      sryPoints.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      skillGroup.rotation.y = elapsedTime * 0.12;
      nodesList.forEach((node, idx) => {
        node.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.003;
      });

      estateGroup.rotation.y = elapsedTime * 0.05;
      estateGroup.rotation.x = elapsedTime * 0.03;
      innerSphere.rotation.y = -elapsedTime * 0.1;

      metrajGroup.rotation.y = elapsedTime * 0.15;
      metrajGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;

      torusKnot.rotation.y = elapsedTime * 0.2;
      torusKnot.rotation.x = elapsedTime * 0.1;

      dust.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
      
      // Dispose Three.js objects
      scene.clear();
      sryGeo.dispose();
      sryMat.dispose();
      skillMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      gridBox.dispose();
      gridWire.dispose();
      estateMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      polyGeo.dispose();
      polyWire.dispose();
      metrajMat.dispose();
      solidPolyMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
