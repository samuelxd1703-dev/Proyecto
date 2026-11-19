
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Atmósfera de fondo independiente con nubes oscuras, grises y resplandor verde
function crearTexturaAtmosfera() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGrad.addColorStop(0, '#031526');
  baseGrad.addColorStop(0.5, '#042a2b');
  baseGrad.addColorStop(1, '#01120e');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lucesVerdes = [
    { x: 512, y: 260, r: 340, color: 'rgba(16, 185, 129, 0.26)' },
    { x: 260, y: 250, r: 260, color: 'rgba(5, 150, 105, 0.20)' },
    { x: 760, y: 250, r: 260, color: 'rgba(20, 184, 166, 0.22)' },
    { x: 512, y: 140, r: 280, color: 'rgba(14, 165, 233, 0.20)' }
  ];

  lucesVerdes.forEach((n) => {
    const grad = ctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, n.r);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  const nubesGrises = [
    { x: 140, y: 220, r: 210, color: 'rgba(100, 116, 139, 0.22)' },
    { x: 380, y: 180, r: 190, color: 'rgba(148, 163, 184, 0.16)' },
    { x: 660, y: 210, r: 220, color: 'rgba(100, 116, 139, 0.20)' },
    { x: 890, y: 260, r: 200, color: 'rgba(71, 85, 105, 0.24)' }
  ];

  nubesGrises.forEach((n) => {
    const grad = ctx.createRadialGradient(n.x, n.y, 15, n.x, n.y, n.r);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  const nubesOscuras = [
    { x: 90, y: 170, r: 240, color: 'rgba(2, 6, 12, 0.65)' },
    { x: 920, y: 190, r: 250, color: 'rgba(2, 8, 14, 0.68)' },
    { x: 220, y: 380, r: 260, color: 'rgba(1, 10, 8, 0.72)' },
    { x: 810, y: 370, r: 270, color: 'rgba(2, 12, 10, 0.70)' }
  ];

  nubesOscuras.forEach((n) => {
    const grad = ctx.createRadialGradient(n.x, n.y, 20, n.x, n.y, n.r);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function TerminalTVA() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [respuesta, setRespuesta] = useState('');
  const mountRef = useRef(null);
  const [panelOculto, setPanelOculto] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x031a1c, 0.0068);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    currentMount.appendChild(renderer.domElement);

    // 2. Cúpula Atmosférica de Fondo
    const skyGeo = new THREE.SphereGeometry(220, 48, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      map: crearTexturaAtmosfera(),
      side: THREE.BackSide,
      fog: false
    });
    const atmosphereDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(atmosphereDome);

    // 3. Controles de Ratón
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.maxDistance = 85;
    controls.minDistance = 4;

    // 4. Grupo Principal de Yggdrasil
    const yggdrasilGroup = new THREE.Group();

    // A. Tronco Central Luminoso + Luz Interna Palpitante (~30%)
    const coreTrunkGeo = new THREE.CylinderGeometry(1.7, 3.3, 18, 32, 16, true);
    const coreTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x033324,
      emissive: 0x10b981,
      emissiveIntensity: 0.95,
      roughness: 0.3,
      metalness: 0.7
    });
    const coreTrunk = new THREE.Mesh(coreTrunkGeo, coreTrunkMat);
    coreTrunk.position.y = -1.5;
    yggdrasilGroup.add(coreTrunk);

    // Núcleo interior sutil al ~30% de intensidad
    const innerGlowGeo = new THREE.CylinderGeometry(1.0, 1.95, 14.5, 24);
    const innerGlowMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.75,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    innerGlow.position.y = -1.5;
    yggdrasilGroup.add(innerGlow);

    // Halo suave concentrado en el centro del tronco (~30%)
    const centerAuraGeo = new THREE.SphereGeometry(4.2, 24, 18);
    const centerAuraMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const centerAura = new THREE.Mesh(centerAuraGeo, centerAuraMat);
    centerAura.scale.set(0.7, 1.25, 0.7);
    centerAura.position.set(0, -1.5, 0);
    yggdrasilGroup.add(centerAura);

    const barkGroup = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const barkGeo = new THREE.CylinderGeometry(0.65, 1.15, 17.5, 8, 8);
      const barkMat = new THREE.MeshStandardMaterial({
        color: 0x01120c,
        emissive: 0x022c22,
        emissiveIntensity: 0.3,
        roughness: 0.9,
        metalness: 0.3
      });
      const barkPiece = new THREE.Mesh(barkGeo, barkMat);
      barkPiece.position.set(Math.cos(angle) * 2.1, -1.5, Math.sin(angle) * 2.1);
      barkPiece.rotation.z = (Math.random() - 0.5) * 0.22;
      barkGroup.add(barkPiece);
    }
    yggdrasilGroup.add(barkGroup);

    // B. Base Inferior del Tronco
    const rootCollarGeo = new THREE.CylinderGeometry(2.7, 4.4, 3.8, 32);
    const rootCollarMat = new THREE.MeshStandardMaterial({
      color: 0x01160f,
      emissive: 0x022c22,
      emissiveIntensity: 0.45,
      roughness: 0.85,
      metalness: 0.35
    });
    const rootCollar = new THREE.Mesh(rootCollarGeo, rootCollarMat);
    rootCollar.position.y = -10.2;
    yggdrasilGroup.add(rootCollar);

    // C. RAÍCES AMPLIAS Y ONDULADAS HACIA LOS COSTADOS
    const rootsGroup = new THREE.Group();
    const totalRoots = 75;
    for (let i = 0; i < totalRoots; i++) {
      const angle = (i / totalRoots) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 2.3, -9.8, Math.sin(angle) * 2.3),
        new THREE.Vector3(
          Math.cos(angle) * 8.5 + Math.sin(i) * 2.2,
          -13.5 + Math.sin(i * 3) * 0.8,
          Math.sin(angle) * 8.5 + Math.cos(i) * 2.2
        ),
        new THREE.Vector3(
          Math.cos(angle) * 15.0 + Math.cos(i * 2) * 2.8,
          -17.5 + Math.sin(i * 2) * 1.0,
          Math.sin(angle) * 15.0 + Math.sin(i * 2) * 2.8
        ),
        new THREE.Vector3(
          Math.cos(angle) * 21.0,
          -20.5 - Math.random() * 2.0,
          Math.sin(angle) * 21.0
        )
      ]);

      const rootGeo = new THREE.TubeGeometry(curve, 56, Math.random() * 0.25 + 0.1, 8, false);
      const isDeepLayer = i % 3 === 0;
      const rootMat = new THREE.MeshStandardMaterial({
        color: isDeepLayer ? 0x01140d : 0x022419,
        emissive: isDeepLayer ? 0x022c22 : 0x064e3b,
        emissiveIntensity: isDeepLayer ? 0.45 : 0.72,
        roughness: 0.82,
        metalness: 0.35
      });
      rootsGroup.add(new THREE.Mesh(rootGeo, rootMat));
    }
    yggdrasilGroup.add(rootsGroup);

    // D. Ramas Superiores
    const branchesGroup = new THREE.Group();
    const mainBranches = 18;

    for (let i = 0; i < mainBranches; i++) {
      const angle = (i / mainBranches) * Math.PI * 2 + (Math.random() * 0.2);
      const basePoint = new THREE.Vector3(Math.cos(angle) * 1.4, 5.5, Math.sin(angle) * 1.4);
      const midPoint = new THREE.Vector3(Math.cos(angle) * 7.2, 10.5 + Math.sin(i) * 1.8, Math.sin(angle) * 7.2);

      const mainCurve = new THREE.CatmullRomCurve3([basePoint, midPoint]);
      const mainGeo = new THREE.TubeGeometry(mainCurve, 24, 0.28, 8, false);
      const branchMat = new THREE.MeshStandardMaterial({
        color: 0x012e1f,
        emissive: 0x10b981,
        emissiveIntensity: 0.85,
        roughness: 0.4,
        metalness: 0.5
      });
      branchesGroup.add(new THREE.Mesh(mainGeo, branchMat));

      for (let sub = 0; sub < 3; sub++) {
        const subAngle = angle + (sub - 1) * 0.42;
        const endPoint = new THREE.Vector3(
          Math.cos(subAngle) * (12.5 + Math.random() * 2.8),
          14.8 + Math.random() * 2.8,
          Math.sin(subAngle) * (12.5 + Math.random() * 2.8)
        );
        const subCurve = new THREE.CatmullRomCurve3([midPoint, endPoint]);
        const subGeo = new THREE.TubeGeometry(subCurve, 18, 0.14, 6, false);
        const subMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.85,
          roughness: 0.3,
          metalness: 0.6
        });
        branchesGroup.add(new THREE.Mesh(subGeo, subMat));
      }
    }
    yggdrasilGroup.add(branchesGroup);

    // E. COPA SUPERIOR MASIVA Y CON MUCHO MÁS VOLUMEN
    const cloudsGroup = new THREE.Group();
    const canopyCount = 450;
    for (let i = 0; i < canopyCount; i++) {
      const radius = Math.random() * 1.8 + 1.4;
      const geo = new THREE.IcosahedronGeometry(radius, 2);

      const type = Math.random();
      let col = 0x2563eb, emissiveCol = 0x1d4ed8;
      if (type > 0.52) {
        col = 0x10b981; emissiveCol = 0x047857;
      } else if (type > 0.25) {
        col = 0x7c3aed; emissiveCol = 0x5b21b6;
      }

      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: emissiveCol,
        emissiveIntensity: 0.90,
        roughness: 0.22,
        metalness: 0.25,
        transparent: true,
        opacity: 0.52,
        blending: THREE.AdditiveBlending
      });

      const leafCluster = new THREE.Mesh(geo, mat);

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const rNorm = Math.cbrt(Math.random());

      const x = rNorm * Math.sin(phi) * Math.cos(theta) * 19.0;
      const yOffset = Math.abs(rNorm * Math.cos(phi)) * 11.5;
      const z = rNorm * Math.sin(phi) * Math.sin(theta) * 19.0;

      leafCluster.position.set(x, 10.0 + yOffset, z);
      cloudsGroup.add(leafCluster);
    }
    yggdrasilGroup.add(cloudsGroup);

    scene.add(yggdrasilGroup);

    // 5. Partículas Estelares
    const particlesGeo = new THREE.BufferGeometry();
    const count = 5500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 190;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.55,
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const backgroundCosmos = new THREE.Points(particlesGeo, particlesMat);
    scene.add(backgroundCosmos);

    // 6. Iluminación (luz central sutil al ~30% para mantener el entorno intacto)
    const ambientLight = new THREE.AmbientLight(0x06373a, 1.3);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x10b981, 210, 105);
    coreLight.position.set(0, -1.5, 5);
    scene.add(coreLight);

    const bottomLight = new THREE.PointLight(0x047857, 260, 125);
    bottomLight.position.set(0, -16, 14);
    scene.add(bottomLight);

    const topLight = new THREE.PointLight(0x3b82f6, 460, 165);
    topLight.position.set(0, 24, 20);
    scene.add(topLight);

    camera.position.set(0, 4, 38);

    // 7. Animación con latido sutil al ~30% en el centro del tronco
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Pulso suave al ~30% de intensidad
      const latido = Math.pow(Math.max(0, Math.sin(elapsedTime * 2.0)), 2);
      const respiracion = Math.sin(elapsedTime * 1.3) * 0.5 + 0.5;
      const pulso = (respiracion * 0.65 + latido * 0.35) * 0.3;

      coreTrunkMat.emissiveIntensity = 0.8 + pulso * 0.65;
      innerGlowMat.emissiveIntensity = 0.55 + pulso * 0.65;
      innerGlowMat.opacity = 0.22 + pulso * 0.14;
      innerGlow.scale.set(1 + pulso * 0.06, 1, 1 + pulso * 0.06);

      centerAuraMat.opacity = 0.025 + pulso * 0.035;
      const auraScale = 0.68 + pulso * 0.06;
      centerAura.scale.set(auraScale, 1.25 + pulso * 0.06, auraScale);

      coreLight.intensity = 180 + pulso * 110;

      yggdrasilGroup.rotation.y += 0.0005;
      branchesGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.022;
      branchesGroup.rotation.x = Math.cos(elapsedTime * 0.8) * 0.018;

      cloudsGroup.rotation.z = Math.sin(elapsedTime * 0.9) * 0.028;
      cloudsGroup.rotation.x = Math.cos(elapsedTime * 1.0) * 0.022;

      atmosphereDome.rotation.y += 0.00015;
      backgroundCosmos.rotation.y -= 0.0002;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      innerGlowGeo.dispose();
      innerGlowMat.dispose();
      centerAuraGeo.dispose();
      centerAuraMat.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://yggdrasil-backend-m23g.onrender.com/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setRespuesta(data.mensaje);
    } catch (error) {
      setRespuesta('Error de enlace con Yggdrasil.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#031a1c] text-emerald-400 flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      <div ref={mountRef} className="fixed inset-0 z-0 opacity-100 pointer-events-auto cursor-grab active:cursor-grabbing" />

      {/* Botón para ocultar (barrer) o ampliar (mostrar) el panel */}
      <button
        type="button"
        onClick={() => setPanelOculto((prev) => !prev)}
        className="fixed top-4 right-4 z-30 px-4 py-2 font-mono text-xs uppercase tracking-widest bg-stone-950/90 hover:bg-stone-900 text-emerald-300 border border-emerald-500/70 rounded shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
      >
        {panelOculto ? 'Ampliar panel' : 'Ver árbol'}
      </button>

      {/* Contenedor del formulario con efecto tipo barrido */}
      <div
        style={{
          clipPath: panelOculto ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)'
        }}
        className={`relative z-10 w-full max-w-lg transition-[clip-path,opacity,transform] duration-500 ease-in-out ${
          panelOculto
            ? 'opacity-0 translate-x-8 pointer-events-none'
            : 'opacity-100 translate-x-0 pointer-events-auto'
        }`}
      >
        <div className="bg-stone-950/85 backdrop-blur-xl p-6 md:p-8 rounded-none border-2 border-emerald-500/60 shadow-[0_0_90px_rgba(16,185,129,0.4)] w-full">
          <div className="border-b border-emerald-500/40 pb-3 mb-5 text-center">
            <span className="text-[10px] md:text-xs tracking-widest text-emerald-400 uppercase font-mono">
              Santuario de Yggdrasil — Versión Cinematográfica Suprema
            </span>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-emerald-200 mt-1">
              CONTROL DE LÍNEAS TEMPORALES
            </h1>
            <p className="text-[11px] text-emerald-400/70 mt-1 italic">
              (Haz clic y arrastra para rotar y examinar el entorno en 360°)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs md:text-sm">
            <div>
              <label className="block uppercase tracking-wider text-emerald-400 mb-1">Identificador de Variante</label>
              <input
                type="text"
                required
                placeholder="Ej. Loki L1130"
                className="w-full px-3 py-2 bg-stone-900 border border-emerald-700/70 rounded text-emerald-100 focus:outline-none focus:border-emerald-400 shadow-inner"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-emerald-400 mb-1">Canal Cuántico (Correo)</label>
              <input
                type="email"
                required
                placeholder="loki@yggdrasil.nexus"
                className="w-full px-3 py-2 bg-stone-900 border border-emerald-700/70 rounded text-emerald-100 focus:outline-none focus:border-emerald-400 shadow-inner"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-emerald-400 mb-1">Registro de Anomalía Nexus</label>
              <textarea
                rows="3"
                required
                placeholder="Describa la alteración en las ramas..."
                className="w-full px-3 py-2 bg-stone-900 border border-emerald-700/70 rounded text-emerald-100 focus:outline-none focus:border-emerald-400 resize-none shadow-inner"
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold tracking-widest uppercase transition-colors rounded shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            >
              Sostener Yggdrasil
            </button>
          </form>

          {respuesta && (
            <div className="mt-4 p-3 bg-stone-900 border border-emerald-500 rounded text-center text-emerald-300 font-mono text-xs md:text-sm animate-pulse">
              [YGGDRASIL RESPUESTA]: {respuesta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
