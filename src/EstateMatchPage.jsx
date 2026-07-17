import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

function EstateMatch3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 7.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(-5, 5, 5)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x38bdf8, 1.8, 30)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    // Grid Group
    const group = new THREE.Group()
    scene.add(group)

    // 1. Structured Outer Wireframe Box
    const gridBox = new THREE.BoxGeometry(3.5, 3.5, 3.5, 3, 3, 3)
    const gridWire = new THREE.WireframeGeometry(gridBox)
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 1,
      transparent: true,
      opacity: 0.35
    })
    const boxMesh = new THREE.LineSegments(gridWire, wireframeMat)
    group.add(boxMesh)

    // 2. Inner Glowing Sphere Grid
    const innerGeo = new THREE.SphereGeometry(1.2, 16, 16)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
    const innerSphere = new THREE.Mesh(innerGeo, innerMat)
    group.add(innerSphere)

    // 3. Coordinate Vector Points
    const pointsGeo = new THREE.BufferGeometry()
    const pointsCount = 60
    const pointsPos = new Float32Array(pointsCount * 3)
    for (let i = 0; i < pointsCount * 3; i += 3) {
      pointsPos[i] = (Math.random() - 0.5) * 3.2
      pointsPos[i + 1] = (Math.random() - 0.5) * 3.2
      pointsPos[i + 2] = (Math.random() - 0.5) * 3.2
    }
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3))
    const pointsMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    })
    const vectorPoints = new THREE.Points(pointsGeo, pointsMat)
    group.add(vectorPoints)

    // Mouse movement parallax handler
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

    // Animation loop
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Slowly rotate structures
      boxMesh.rotation.y += 0.003
      boxMesh.rotation.x += 0.002
      
      innerSphere.rotation.y -= 0.002
      vectorPoints.rotation.y += 0.004

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
      gridBox.dispose()
      gridWire.dispose()
      wireframeMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      pointsGeo.dispose()
      pointsMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={canvasRef} style={{ width: '100%', height: '100%', minHeight: '350px' }} />
}

export default function EstateMatchPage({ goBack }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    { title: 'Akıllı Portföy Analizi', desc: 'Mülk portföyünüzü ve ilan detaylarını zenginleştirerek en ince niteliklerine kadar sınıflandırır.' },
    { title: 'Çapraz Talep Eşleştirme', desc: 'Müşteri talepleriyle portföy verilerini gelişmiş bir koordinat matrisinde saniyeler içinde eşler.' },
    { title: 'Lokasyon Zekası', desc: 'İlanları coğrafi veriler, bölge eğilimleri ve müşteri yaşam tarzı tercihleriyle entegre eder.' },
    { title: 'Akıllı İletişim Hattı', desc: 'Eşleşen fırsatları ve portföy güncellemelerini müşterilere otomatik ve özelleştirilmiş olarak sunar.' }
  ]

  return (
    <main className="vpage">
      <Background density={1} color="56,189,248" boost={0.4} />
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
              <span className="elabel elabel--light" style={{ color: '#38bdf8' }}>ESTATEMATCH AI</span>
              <h1 className="vpage__h1" style={{ textAlign: 'left', marginTop: '1rem' }}>
                Müşteri taleplerini ve portföyleri<br />
                <em>sistematik olarak eşleştirin.</em>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                EstateMatch AI, emlak operasyonlarınızı zeka tabanlı bir ekosisteme dönüştürerek doğru mülkü, doğru alıcıyla buluşturan yapay zekâ asistanınızdır.
              </p>
              <div>
                <a 
                  href="https://estate.sryverse.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-btn"
                  style={{ background: '#38bdf8', color: '#040e09', fontWeight: '600', boxShadow: '0 10px 30px rgba(56,189,248,0.3)', marginRight: '1rem' }}
                >
                  Platformu Aç (Launch App) →
                </a>
              </div>
            </div>

            {/* Right Column: Dedicated 3D Canvas */}
            <div className="product-3d-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '1rem', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EstateMatch3D />
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
              <div key={i} className="vblock" style={{ borderLeft: '4px solid #38bdf8' }}>
                <span className="vblock__id">0{i+1}</span>
                <h3 className="vblock__h" style={{ fontSize: '1.6rem' }}>{f.title}</h3>
                <p className="vblock__p">{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '3.5rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fs)', fontSize: '2.1rem', color: '#fff', marginBottom: '1.5rem' }}>
              Gayrimenkul Portföyünüzü Akıllandırın
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>
              Veri tabanınızdaki mülk ilanları ile alıcı talepleri arasındaki anlamsal bağı kurun ve satış sürelerinizi kısaltın.
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
