import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

function SkillMatch3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x34d399, 1.5, 30)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    // Nodes Network Group
    const group = new THREE.Group()
    scene.add(group)

    const nodeCount = 16
    const nodes = []
    const nodeGeometry = new THREE.SphereGeometry(0.18, 16, 16)
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x34d399,
      emissive: 0x064e3b,
      shininess: 30,
      flatShading: true
    })

    // Create random floating node spheres
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5
      )
      // Save custom velocity data for floating animation
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
        vz: (Math.random() - 0.5) * 0.004,
        ox: mesh.position.x,
        oy: mesh.position.y,
        oz: mesh.position.z
      }
      group.add(mesh)
      nodes.push(mesh)
    }

    // Connect nodes with lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35
    })

    let lineGeometry = new THREE.BufferGeometry()
    let lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    group.add(lines)

    // Mouse movement rotation handler
    let mouseX = 0, mouseY = 0
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) - 0.5
      mouseY = ((e.clientY - rect.top) / rect.height) - 0.5

      gsap.to(group.rotation, {
        y: mouseX * 0.8,
        x: mouseY * 0.8,
        duration: 1.5,
        ease: 'power2.out'
      })
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Node floating & connection updates
      const linePositions = []
      
      nodes.forEach((node, i) => {
        // Float nodes gently around their origin
        node.position.x = node.userData.ox + Math.sin(elapsed * 1.2 + i) * 0.25
        node.position.y = node.userData.oy + Math.cos(elapsed * 1.5 + i) * 0.25
        node.position.z = node.userData.oz + Math.sin(elapsed * 0.9 + i) * 0.25
      })

      // Update lines based on proximity
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position)
          if (dist < 2.5) {
            linePositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z)
            linePositions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z)
          }
        }
      }

      group.remove(lines)
      lineGeometry.dispose()
      
      lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      lines = new THREE.LineSegments(lineGeometry, lineMaterial)
      group.add(lines)

      // Slow baseline rotation
      group.rotation.y += 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
      
      scene.clear()
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={canvasRef} style={{ width: '100%', height: '100%', minHeight: '350px' }} />
}

export default function SkillMatchPage({ goBack }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    { title: 'Semantik CV Analizi', desc: 'Adayların özgeçmişlerini sadece kelime bazlı değil, anlamsal ve yetkinlik bazlı olarak analiz eder.' },
    { title: 'Pozisyon Eşleştirme', desc: 'Aday yetenek setleri ile şirket pozisyon gereksinimlerini çok boyutlu vektör uzayında karşılaştırır.' },
    { title: 'Darboğaz Tespiti', desc: 'İşe alım sürecindeki gecikmeleri ve verimsiz aşamaları otomatik olarak raporlar.' },
    { title: 'Mülakat Zekası', desc: 'Aday mülakat yanıtlarını değerlendirerek yetkinlik eşleşmesini sayısal metriklere döker.' }
  ]

  return (
    <main className="vpage">
      <Background density={1} color="34,197,94" boost={0.4} />
      <div className="hero__veil" style={{ background: 'linear-gradient(180deg, rgba(4,14,9,0.15) 0%, rgba(4,14,9,0.95) 100%)' }} />

      <section className="vpage__hero" style={{ paddingBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div className="wrap">
          <button 
            onClick={goBack} 
            className="cta-btn" 
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '2.5rem',
              cursor: 'pointer'
            }}
          >
            ← Geri Dön
          </button>
          
          <div className="product-split" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left Column: Text Content */}
            <div>
              <span className="elabel elabel--light" style={{ color: '#34d399' }}>SKILLMATCH AI</span>
              <h1 className="vpage__h1" style={{ textAlign: 'left', marginTop: '1rem' }}>
                İşe alımda manuel filtrelemeyi sonlandırın.<br />
                <em>Yetenekleri anlamsal vektörlerle eşleyin.</em>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                SkillMatch AI, işe alım süreçlerindeki karmaşıklığı ortadan kaldırarak adaylar ile pozisyonları en yüksek doğrulukla eşleştiren kurumsal yapay zekâ asistanınızdır.
              </p>
              <div>
                <a 
                  href="https://skillmatch.sryverse.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-btn"
                  style={{ background: '#10b981', color: '#fff', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', marginRight: '1rem' }}
                >
                  Platformu Aç (Launch App) →
                </a>
              </div>
            </div>

            {/* Right Column: Dedicated 3D Canvas */}
            <div className="product-3d-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '1rem', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkillMatch3D />
            </div>
          </div>
        </div>
      </section>

      <section className="vpage__blocks" style={{ paddingTop: '4rem', position: 'relative', zIndex: 10 }}>
        <div className="wrap">
          <h2 style={{ fontFamily: 'var(--fs)', fontSize: '2.5rem', color: '#fff', textAlign: 'center', marginBottom: '3.5rem' }}>
            Öne Çıkan <em>Yetenekler</em>
          </h2>
          
          <div className="vpage__grid">
            {features.map((f, i) => (
              <div key={i} className="vblock" style={{ borderLeft: '4px solid #10b981' }}>
                <span className="vblock__id">0{i+1}</span>
                <h3 className="vblock__h" style={{ fontSize: '1.6rem' }}>{f.title}</h3>
                <p className="vblock__p">{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '3.5rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fs)', fontSize: '2.1rem', color: '#fff', marginBottom: '1.5rem' }}>
              Operasyonunuzu Hızlandırmaya Hazır Mısınız?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>
              İşe alım huninizdeki dönüşüm oranlarını artırmak ve aday kalitesini sayısal olarak izlemek için entegrasyon sürecini hemen başlatın.
            </p>
            <button 
              onClick={() => {
                goBack();
                setTimeout(() => {
                  const contactEl = document.querySelector('#contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="cta-btn"
              style={{ background: '#fff', color: '#000' }}
            >
              Demo Talep Et
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
