import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

/* ── Animated particle/mesh canvas background ── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W, H
    const PARTICLE_COUNT = 80
    const GREEN = '13,59,46'
    const particles = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.35
        this.vy = (Math.random() - 0.5) * 0.35
        this.r = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.4 + 0.1
        this.pulse = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.01 + Math.random() * 0.015
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.pulse += this.pulseSpeed
        this.opacity = 0.1 + Math.abs(Math.sin(this.pulse)) * 0.35
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${GREEN},${this.opacity})`
        ctx.fill()
      }
    }

    resize()
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle())
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 130) {
            const alpha = (1 - dist/130) * 0.12
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${GREEN},${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
        particles[i].update()
        particles[i].draw()
      }
      animId = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
}

/* ── Flowing orb decorations ── */
function FloatingOrbs() {
  return (
    <div className="orbs" aria-hidden="true">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
    </div>
  )
}

/* ── Intersection observer ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Animated counter ── */
function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round(ease(p) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

/* ── Mouse tilt ── */
function useTilt(strength = 10) {
  const ref = useRef(null)
  const onMove = useCallback(e => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateY(${x*strength}deg) rotateX(${-y*strength}deg) translateZ(6px)`
  }, [strength])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }, [])
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave }
}

/* ── Intelligence flow visualization ── */
function IntelFlow() {
  const [ref, visible] = useReveal(0.2)
  const steps = [
    { id:'01', label:'Veri', sub:'Data' },
    { id:'02', label:'Zeka', sub:'Intelligence' },
    { id:'03', label:'Karar', sub:'Decision' },
    { id:'04', label:'Eylem', sub:'Action' },
    { id:'05', label:'Etki', sub:'Impact' },
  ]
  return (
    <div ref={ref} className={`intel-flow ${visible ? 'intel-flow--visible' : ''}`}>
      {steps.map((s,i) => (
        <div key={s.id} className="flow-node" style={{ transitionDelay: `${i*0.12}s` }}>
          <div className="flow-node__circle">
            <span className="flow-node__num">{s.id}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flow-node__line">
              <div className="flow-node__line-fill" style={{ transitionDelay: `${i*0.12+0.3}s` }} />
            </div>
          )}
          <div className="flow-node__labels">
            <span className="flow-node__label">{s.label}</span>
            <span className="flow-node__sub">{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Product Card with glass + tilt ── */
function ProductCard({ p }) {
  const tilt = useTilt(8)
  return (
    <div className={`pcard pcard--${p.key}`} {...tilt}>
      <div className="pcard__glow" />
      <div className="pcard__header">
        <span className={`pcard__badge ${p.live ? 'pcard__badge--live' : 'pcard__badge--soon'}`}>
          {p.live ? <><span className="badge-dot"/>CANLI</> : 'YAKINDA'}
        </span>
        <div>
          <h3 className="pcard__name">{p.name}</h3>
          <span className="pcard__sub">{p.category}</span>
        </div>
      </div>
      <p className="pcard__desc">{p.desc}</p>
      <ul className="pcard__features">
        {p.features.map(f => <li key={f}><span className="pcard__dot"/>  {f}</li>)}
      </ul>
      <div className="pcard__footer">
        {p.live
          ? <a href={p.url} className="pcard__cta" target="_blank" rel="noopener noreferrer">Keşfet <span>→</span></a>
          : <button className="pcard__cta pcard__cta--ghost">Bekleme Listesi <span>→</span></button>
        }
      </div>
    </div>
  )
}

/* ── Metric counter ── */
function Metric({ value, suffix, label, active }) {
  const count = useCounter(value, active)
  return (
    <div className="metric">
      <div className="metric__val">{count}{suffix}</div>
      <div className="metric__label">{label}</div>
    </div>
  )
}

/* ── Contact Form ── */
function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = e => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 900)
  }
  if (sent) return (
    <div className="form-done">
      <div className="form-done__icon">✓</div>
      <p className="form-done__title">Mesajınız alındı.</p>
      <p className="form-done__sub">24 saat içinde dönüş yapacağız.</p>
    </div>
  )
  return (
    <form className="cform" onSubmit={submit}>
      <div className="cform__row">
        <div className="cform__field"><label>Ad Soyad</label><input type="text" placeholder="Adınız" required /></div>
        <div className="cform__field"><label>Şirket</label><input type="text" placeholder="Şirket adı" required /></div>
      </div>
      <div className="cform__field"><label>E-posta</label><input type="email" placeholder="isim@sirket.com" required /></div>
      <div className="cform__field">
        <label>İlgilendiğiniz Ürün</label>
        <select required defaultValue="">
          <option value="" disabled>Seçiniz</option>
          <option>SkillMatch AI</option>
          <option>EstateMatch AI</option>
          <option>SRYVERSE Copilot</option>
          <option>Özel çözüm</option>
        </select>
      </div>
      <div className="cform__field"><label>Mesaj</label><textarea rows="4" placeholder="Operasyonunuzu veya dönüştürmek istediğiniz süreci anlatın..." required /></div>
      <button type="submit" className={`cform__btn${loading?' cform__btn--loading':''}`} disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Demo Talep Et →'}
      </button>
    </form>
  )
}

/* ══════════════ MAIN APP ══════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [metricsRef, metricsVisible] = useReveal(0.3)
  const [heroRef, heroVisible] = useReveal(0.1)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const products = [
    {
      key: 'skill', name: 'SkillMatch AI', category: 'Recruitment Intelligence', live: true,
      url: 'https://skillmatch.sryverse.com',
      desc: 'CV analizi, aday eşleştirme ve mülakat zekasıyla işe alım süreçlerini uçtan uca dönüştüren AI platformu.',
      features: ['AI CV Analizi', 'LLM Aday Eşleştirme', 'Mülakat Kopilosu', 'Yetenek Havuzu', 'İşe Alım Analitiği'],
    },
    {
      key: 'estate', name: 'EstateMatch AI', category: 'Real Estate Intelligence', live: true,
      url: 'https://estate.sryverse.com',
      desc: 'Gayrimenkul portföyünü yöneten, müşteri ihtiyaçlarıyla ilanları eşleştiren ve verileri akıllı önerilere dönüştüren AI platformu.',
      features: ['Akıllı Mülk Eşleştirme', 'Portföy Yönetimi', 'AI İlan Asistanı', 'Müşteri Zekası', 'Satış Pipeline'],
    },
    {
      key: 'copilot', name: 'SRYVERSE Copilot', category: 'Business Intelligence Layer', live: false,
      url: null,
      desc: 'İş ekipleri için analitik, operasyon ve karar desteğini tek bir akıllı arayüzde birleştiren AI asistan katmanı.',
      features: ['BI Kopilosu', 'İK Kopilosu', 'Sözleşme AI', 'İş Akışı Otomasyonu'],
    },
  ]

  const navItems = [
    { label: 'Ürünler', href: '#products' },
    { label: 'Zeka Katmanı', href: '#intelligence' },
    { label: 'Çözümler', href: '#usecases' },
    { label: 'Vizyon', href: '#vision' },
    { label: 'İletişim', href: '#contact' },
  ]

  return (
    <div className="site">

      {/* HEADER */}
      <header className={`header${scrollY > 30 ? ' header--solid' : ''}`}>
        <div className="header__inner">
          <a href="/" className="header__logo">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="header__logo-img" />
          </a>
          <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}>
            {navItems.map(n => (
              <a key={n.label} href={n.href} className="nav-link" onClick={() => setMenuOpen(false)}>{n.label}</a>
            ))}
          </nav>
          <div className="header__actions">
            <a href="#products" className="hbtn hbtn--ghost">Ürünleri Keşfet</a>
            <a href="#contact" className="hbtn hbtn--solid">Demo Al →</a>
          </div>
          <button className={`burger${menuOpen?' burger--open':''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span/><span/><span/>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" ref={heroRef}>
          <ParticleCanvas />
          <FloatingOrbs />
          <div className="hero__inner wrap">
            <div className={`hero__content${heroVisible ? ' hero__content--visible' : ''}`}>
              <div className="hero__eyebrow">
                <span className="eyebrow-dot" />
                AI Ürünleri · Dijital Dönüşüm
              </div>
              <h1 className="hero__h1">
                Akıllı Yazılım.<br/>
                <em>Gerçek Dönüşüm.</em>
              </h1>
              <p className="hero__sub">
                SRYVERSE, karmaşık operasyonları ölçülebilir sonuçlara dönüştüren yapay zeka destekli ürünler inşa eder.
              </p>
              <div className="hero__ctas">
                <a href="#products" className="cta cta--primary">Ürünleri Keşfet <span>→</span></a>
                <a href="#contact" className="cta cta--outline">Demo Talep Et</a>
              </div>

              {/* Intelligence flow inside hero */}
              <div className="hero__flow-label">
                <span className="flow-label-text">Operasyonel Zeka Katmanı</span>
              </div>
              <IntelFlow />
            </div>
          </div>
          <div className="hero__scroll"><div className="scroll-line" /></div>
        </section>

        {/* PRODUCTS */}
        <section className="section" id="products">
          <div className="wrap">
            <div className="section__head fade-up">
              <span className="eyebrow-label">Ürün Ekosistemi</span>
              <h2 className="section__h2">Tek ekosistem.<br/><em>Çok sayıda AI ürünü.</em></h2>
            </div>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.key} p={p} />)}
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="metrics-band" ref={metricsRef}>
          <ParticleCanvas />
          <div className="wrap metrics-grid">
            <Metric value={2}   suffix=""   label="Aktif AI Ürünü"           active={metricsVisible} />
            <Metric value={10}  suffix="+"  label="Otomatize AI İş Akışı"    active={metricsVisible} />
            <Metric value={100} suffix="K+" label="Kararlar Geliştirildi"     active={metricsVisible} />
            <Metric value={1}   suffix=""   label="Birleşik Platform"         active={metricsVisible} />
          </div>
        </section>

        {/* HOW WE WORK */}
        <section className="section" id="intelligence">
          <div className="wrap">
            <div className="howwe-grid fade-up">
              <div className="howwe-left">
                <span className="eyebrow-label">Nasıl Çalışıyoruz</span>
                <h2 className="howwe__h2">
                  Karmaşıklıktan<br/>
                  <em>ölçekte netliğe.</em>
                </h2>
              </div>
              <div className="howwe-right">
                {[
                  { id:'01', name:'Keşfet', desc:'İş akışlarını ve operasyonel zorlukları anlayın.' },
                  { id:'02', name:'Modelle', desc:'Veri ve süreçleri akıllı modellere dönüştürün.' },
                  { id:'03', name:'Optimize Et', desc:'Darboğazları ve kritik karar noktalarını belirleyin.' },
                  { id:'04', name:'Otomatize', desc:'Tekrarlayan yüksek etkili görevleri AI ile otomatize edin.' },
                  { id:'05', name:'Ölçeklendir', desc:'İşinizle birlikte büyüyecek platform olarak deploy edin.' },
                ].map((s,i) => (
                  <div key={s.id} className="step-row" style={{ animationDelay:`${i*0.08}s` }}>
                    <span className="step-row__id">{s.id}</span>
                    <div className="step-row__content">
                      <span className="step-row__name">{s.name}</span>
                      <span className="step-row__desc">{s.desc}</span>
                    </div>
                    <div className="step-row__bar">
                      <div className="step-row__fill" style={{ width:`${100-i*12}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="section section--tinted" id="usecases">
          <div className="wrap">
            <div className="section__head fade-up">
              <span className="eyebrow-label">Kimler İçin İnşa Ettik</span>
              <h2 className="section__h2">Karmaşık operasyon<br/><em>yürüten ekipler için.</em></h2>
            </div>
            <div className="cases-grid">
              {[
                { role:'Recruitment Teams', tr:'İşe Alım Ekipleri', desc:'Doğru yeteneği daha hızlı ve daha akıllı işe alın.' },
                { role:'Real Estate Agencies', tr:'Gayrimenkul Acenteleri', desc:'Mülkleri, müşterileri ve fırsatları eşleştirin.' },
                { role:'HR Departments', tr:'İnsan Kaynakları', desc:'İnsan verilerini stratejik içgörülere dönüştürün.' },
                { role:'Operations Teams', tr:'Operasyon Ekipleri', desc:'İş akışlarını otomatize edin, sürtüşmeyi azaltın.' },
                { role:'Business Analysts', tr:'İş Analistleri', desc:'Veriyi AI yardımıyla kararlara dönüştürün.' },
                { role:'Transformation Leaders', tr:'Dönüşüm Liderleri', desc:'Geleceğin akıllı organizasyonunu inşa edin.' },
              ].map((c,i) => (
                <div key={i} className="case-card">
                  <div className="case-card__glow" />
                  <span className="case-card__en">{c.role}</span>
                  <h4 className="case-card__tr">{c.tr}</h4>
                  <p className="case-card__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="vision" id="vision">
          <ParticleCanvas />
          <FloatingOrbs />
          <div className="wrap">
            <div className="vision__inner">
              <span className="eyebrow-label eyebrow-label--dim">Vizyonumuz</span>
              <p className="vision__line1">Araç inşa etmiyoruz.</p>
              <h2 className="vision__line2">
                <em>Geleceğin işletim<br/>katmanını inşa ediyoruz.</em>
              </h2>
              <p className="vision__body">
                SRYVERSE, işletmelerin geleceğin hızında düşünmesine, karar vermesine ve faaliyet göstermesine yardımcı olan işletim altyapısını inşa ediyor.
              </p>
              <div className="manifesto">
                {['Karmaşıklığı sadeleştiriyoruz.','Sistemler tasarlıyoruz.','Zekayı otomatize ediyoruz.','Ölçeklenen ürünler inşa ediyoruz.'].map((l,i) => (
                  <div key={i} className="manifesto__line"><span className="manifesto__dash">—</span>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="wrap">
            <div className="contact-grid">
              <div className="contact-left fade-up">
                <span className="eyebrow-label">Demo Al</span>
                <h2 className="contact-left__h2">Bir sonraki akıllı iş akışınızı birlikte kuralım.</h2>
                <p className="contact-left__note">Sürecinizi anlatın; nasıl dönüştürebileceğimizi gösterelim.</p>
                <div className="contact-left__meta">
                  <div><span className="meta-label">Ekosistem</span><span className="meta-val">sryverse.com</span></div>
                  <div><span className="meta-label">Yanıt Süresi</span><span className="meta-val">24 saat</span></div>
                </div>
              </div>
              <div className="contact-right fade-up" style={{ animationDelay:'0.15s' }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="footer__logo" />
            <p className="footer__tagline">Yapay zeka ürünleri için operasyonel zeka.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h5>Ürünler</h5>
              <a href="https://skillmatch.sryverse.com" target="_blank" rel="noopener noreferrer">SkillMatch AI</a>
              <a href="https://estate.sryverse.com" target="_blank" rel="noopener noreferrer">EstateMatch AI</a>
              <a href="#contact">SRYVERSE Copilot</a>
            </div>
            <div className="footer__col">
              <h5>Şirket</h5>
              <a href="#vision">Vizyon</a>
              <a href="#intelligence">Metodoloji</a>
              <a href="#contact">İletişim</a>
            </div>
            <div className="footer__col">
              <h5>Bağlantı</h5>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
        <div className="wrap footer__bottom">
          <span>© 2026 SRYVERSE. Tüm hakları saklıdır.</span>
          <span className="footer__mono">Geleceğin işletim sistemi.</span>
        </div>
      </footer>
    </div>
  )
}
