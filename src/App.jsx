import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

/* ── Intersection Observer hook ── */
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

/* ── Animated counter hook ── */
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

/* ── Cursor-following tilt on product cards ── */
function useTilt(strength = 8) {
  const ref = useRef(null)
  const onMove = useCallback(e => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(800px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(4px)`
  }, [strength])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }, [])
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave }
}

/* ── Abstract System Visualization ── */
function SystemViz() {
  return (
    <div className="system-viz" aria-hidden="true">
      <svg viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="viz-svg">
        {/* Subtle grid */}
        {Array.from({length:10},(_,i)=>Array.from({length:8},(_,j)=>(
          <circle key={`${i}-${j}`} cx={35+i*70} cy={30+j*62} r="1" fill="#0D3B2E" opacity="0.08"/>
        )))}

        {/* Horizontal layer lines */}
        <line x1="80" y1="110" x2="620" y2="110" stroke="#0D3B2E" strokeWidth="0.5" opacity="0.15"/>
        <line x1="80" y1="220" x2="620" y2="220" stroke="#0D3B2E" strokeWidth="0.5" opacity="0.15"/>
        <line x1="80" y1="330" x2="620" y2="330" stroke="#0D3B2E" strokeWidth="0.5" opacity="0.15"/>

        {/* Layer labels */}
        <text x="40" y="114" fontFamily="'DM Mono',monospace" fontSize="8" fill="#0D3B2E" opacity="0.35" textAnchor="end">GİRDİ</text>
        <text x="40" y="224" fontFamily="'DM Mono',monospace" fontSize="8" fill="#0D3B2E" opacity="0.35" textAnchor="end">İŞLEM</text>
        <text x="40" y="334" fontFamily="'DM Mono',monospace" fontSize="8" fill="#0D3B2E" opacity="0.35" textAnchor="end">ÇIKTI</text>

        {/* Input nodes */}
        {[130,260,390,520].map((x,i)=>(
          <g key={i}>
            <circle cx={x} cy="110" r="5" fill="#0D3B2E" opacity="0.6"/>
            <circle cx={x} cy="110" r="10" fill="none" stroke="#0D3B2E" strokeWidth="0.5" opacity="0.2" className={`ring r${i}`}/>
          </g>
        ))}

        {/* Connection lines input → processing */}
        <path d="M130 115 C 130 165, 210 165, 250 220" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.2" className="flow-path"/>
        <path d="M260 115 C 260 165, 250 165, 250 220" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.25" className="flow-path" style={{animationDelay:'0.4s'}}/>
        <path d="M390 115 C 390 165, 370 165, 350 220" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.2" className="flow-path" style={{animationDelay:'0.8s'}}/>
        <path d="M520 115 C 520 165, 450 165, 450 220" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.25" className="flow-path" style={{animationDelay:'1.2s'}}/>

        {/* AI Core — center processing */}
        <rect x="180" y="188" width="340" height="64" rx="6" fill="#0D3B2E" opacity="0.04" stroke="#0D3B2E" strokeWidth="0.75"/>
        <text x="350" y="216" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="9" fill="#0D3B2E" opacity="0.5" letterSpacing="0.12em">SRYVERSE</text>
        <text x="350" y="232" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="7" fill="#0D3B2E" opacity="0.3" letterSpacing="0.1em">YAPAY ZEKA KARAR KATMANI</text>

        {/* Processing pulse line */}
        <line x1="200" y1="220" x2="500" y2="220" stroke="#0D3B2E" strokeWidth="1" opacity="0.15" strokeDasharray="3 6" className="pulse-line"/>

        {/* Output connections */}
        <path d="M250 252 C 250 290, 220 290, 200 330" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.2"/>
        <path d="M350 252 C 350 290, 350 290, 350 330" stroke="#0D3B2E" strokeWidth="1" opacity="0.3"/>
        <path d="M450 252 C 450 290, 490 290, 500 330" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.2"/>

        {/* Output nodes — product icons */}
        {/* SkillMatch */}
        <rect x="130" y="320" width="140" height="54" rx="5" fill="white" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.3"/>
        <rect x="130" y="320" width="140" height="4" rx="5" fill="#0D3B2E" opacity="0.6"/>
        <text x="200" y="348" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="11" fill="#0D3B2E" opacity="0.8" fontWeight="500">SkillMatch AI</text>
        <text x="200" y="363" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="7" fill="#0D3B2E" opacity="0.35" letterSpacing="0.06em">by SRYVERSE</text>

        {/* Copilot */}
        <rect x="280" y="320" width="140" height="54" rx="5" fill="#0D3B2E" opacity="0.05" stroke="#0D3B2E" strokeWidth="0.75"/>
        <rect x="280" y="320" width="140" height="4" rx="5" fill="#0D3B2E" opacity="0.2"/>
        <text x="350" y="348" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="11" fill="#0D3B2E" opacity="0.5" fontWeight="500">SRYVERSE Copilot</text>
        <text x="350" y="363" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="7" fill="#0D3B2E" opacity="0.25" letterSpacing="0.06em">YAKINDA</text>

        {/* EstateMatch */}
        <rect x="430" y="320" width="140" height="54" rx="5" fill="white" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.3"/>
        <rect x="430" y="320" width="140" height="4" rx="5" fill="#124734" opacity="0.6"/>
        <text x="500" y="348" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="11" fill="#0D3B2E" opacity="0.8" fontWeight="500">EstateMatch AI</text>
        <text x="500" y="363" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="7" fill="#0D3B2E" opacity="0.35" letterSpacing="0.06em">by SRYVERSE</text>

        {/* Center dot pulse */}
        <circle cx="350" cy="220" r="3.5" fill="#0D3B2E" opacity="0.7" className="center-pulse"/>
        <circle cx="350" cy="220" r="8" fill="none" stroke="#0D3B2E" strokeWidth="0.75" opacity="0.15" className="center-ring"/>
        <circle cx="350" cy="220" r="16" fill="none" stroke="#0D3B2E" strokeWidth="0.5" opacity="0.07" className="center-ring2"/>
      </svg>
    </div>
  )
}

/* ── Intelligence Timeline ── */
function IntelligenceLayer() {
  const [tRef, tVisible] = useReveal(0.2)
  const steps = [
    { id: '01', tr: 'Gözlemle', en: 'Observe', desc: 'Gerçek iş akışını anla. Veriyi değil, süreci ölç.' },
    { id: '02', tr: 'Modelle', en: 'Model', desc: 'Süreçleri ölçülebilir veri yapılarına dönüştür.' },
    { id: '03', tr: 'Optimize Et', en: 'Optimize', desc: 'Darboğazları ve karar noktalarını tespit et.' },
    { id: '04', tr: 'Otomatize', en: 'Automate', desc: 'Tekrarlayan kararları yapay zekaya devret.' },
    { id: '05', tr: 'Ölçeklendir', en: 'Scale', desc: 'Ürünleştirilmiş SaaS sistemi olarak deploy et.' },
  ]
  return (
    <div ref={tRef} className={`intelligence-track ${tVisible ? 'revealed' : ''}`}>
      {steps.map((s, i) => (
        <div key={s.id} className="track-step" style={{ transitionDelay: `${i * 0.1}s` }}>
          <div className="track-step__id">{s.id}</div>
          <div className="track-step__bar">
            <div className="track-step__fill" style={{ width: `${100 - i * 10}%`, transitionDelay: `${i * 0.12 + 0.3}s` }}></div>
          </div>
          <div className="track-step__text">
            <span className="track-step__tr">{s.tr}</span>
            <span className="track-step__en">{s.en}</span>
          </div>
          <p className="track-step__desc">{s.desc}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Product Card ── */
function ProductCard({ product }) {
  const tilt = useTilt(6)
  return (
    <div className={`product-card product-card--${product.key}`} {...tilt}>
      <div className="product-card__top">
        <div className="product-card__status">
          <span className={`status-dot ${product.live ? 'status-dot--live' : ''}`}></span>
          <span>{product.live ? 'Aktif' : 'Yakında'}</span>
        </div>
        <div className="product-card__meta">
          <h3 className="product-card__name">{product.name}</h3>
          <span className="product-card__by">by SRYVERSE</span>
        </div>
      </div>
      <p className="product-card__desc">{product.desc}</p>
      <ul className="product-card__features">
        {product.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <div className="product-card__footer">
        {product.live
          ? <a href={product.url} className="product-cta" target="_blank" rel="noopener noreferrer">Ürünü Aç <span>→</span></a>
          : <button className="product-cta product-cta--ghost">Bekleme Listesi <span>→</span></button>
        }
      </div>
    </div>
  )
}

/* ── Metric ── */
function Metric({ value, suffix, label, active }) {
  const count = useCounter(value, active)
  return (
    <div className="metric">
      <div className="metric__value">{count}{suffix}</div>
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
    setTimeout(() => { setLoading(false); setSent(true) }, 1000)
  }
  if (sent) return (
    <div className="form-sent">
      <div className="form-sent__check">✓</div>
      <p className="form-sent__title">Mesajınız alındı.</p>
      <p className="form-sent__sub">24 saat içinde size dönüş yapacağız.</p>
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
      <div className="cform__field"><label>Mesaj</label><textarea rows="4" placeholder="İş sürecinizi veya dönüştürmek istediğiniz operasyonu anlatın..." required></textarea></div>
      <button type="submit" className={`cform__btn ${loading ? 'cform__btn--loading' : ''}`} disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Demo Talep Et →'}
      </button>
    </form>
  )
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [metricsRef, metricsVisible] = useReveal(0.3)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const products = [
    {
      key: 'skill',
      name: 'SkillMatch AI',
      live: true,
      url: 'https://skillmatch.sryverse.com',
      desc: 'CV analizi, aday eşleştirme ve mülakat zekasıyla işe alım süreçlerini uçtan uca dönüştüren yapay zeka platformu.',
      features: ['AI CV Analizi', 'LLM Aday Eşleştirme', 'Mülakat Kopilosu', 'Yetenek Havuzu', 'İşe Alım Analitiği'],
    },
    {
      key: 'estate',
      name: 'EstateMatch AI',
      live: true,
      url: 'https://estate.sryverse.com',
      desc: 'Gayrimenkul portföyünü yöneten, müşteri ihtiyaçlarıyla ilanları eşleştiren ve dağınık verileri akıllı önerilere dönüştüren AI platformu.',
      features: ['Akıllı Mülk Eşleştirme', 'Portföy Yönetimi', 'AI İlan Asistanı', 'Müşteri Zekası', 'Satış Pipeline'],
    },
    {
      key: 'copilot',
      name: 'SRYVERSE Copilot',
      live: false,
      url: null,
      desc: 'İş ekipleri için analitik, operasyon ve karar desteğini tek bir akıllı arayüzde birleştiren AI asistan katmanı.',
      features: ['BI Kopilosu', 'İK Kopilosu', 'Sözleşme AI', 'İş Akışı Otomasyonu'],
    },
  ]

  const navItems = [
    { label: 'Ürünler', href: '#products' },
    { label: 'Zeka Katmanı', href: '#intelligence' },
    { label: 'Dönüşüm', href: '#transformation' },
    { label: 'Vizyon', href: '#vision' },
    { label: 'İletişim', href: '#contact' },
  ]

  return (
    <div className="site">

      {/* ── HEADER ── */}
      <header className={`header ${scrollY > 30 ? 'header--solid' : ''}`}>
        <div className="header__inner">
          <a href="/" className="header__logo" aria-label="SRYVERSE">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="header__logo-img" />
          </a>
          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            {navItems.map(n => (
              <a key={n.label} href={n.href} className="header__nav-link" onClick={() => setMenuOpen(false)}>{n.label}</a>
            ))}
          </nav>
          <div className="header__actions">
            <a href="#products" className="hbtn hbtn--ghost">Ürünleri Keşfet</a>
            <a href="#contact" className="hbtn hbtn--solid">Demo Al</a>
          </div>
          <button className={`burger ${menuOpen ? 'burger--open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span/><span/><span/>
          </button>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero__bg-lines" aria-hidden="true">
            {[...Array(6)].map((_,i) => <div key={i} className="hero__bg-line"/>)}
          </div>
          <div className="hero__inner wrap">
            <div className="hero__content">
              <div className="hero__eyebrow">
                <span className="eyebrow-dot"/>
                Endüstri Mühendisliği × Yapay Zeka Mühendisliği
              </div>
              <h1 className="hero__h1">
                Karmaşıklıktan<br/>
                <em>Akıllı Sistemlere.</em>
              </h1>
              <p className="hero__sub">
                SRYVERSE, parçalanmış iş akışlarını ölçeklenebilir yapay zeka ürünlerine dönüştüren operasyonel zeka sistemleri tasarlar.
              </p>
              <div className="hero__ctas">
                <a href="#products" className="cta cta--primary">Ekosistemi Keşfet</a>
                <a href="#contact" className="cta cta--text">Demo Talep Et <span className="cta__arrow">→</span></a>
              </div>
              <div className="hero__proof">
                <div className="hero__proof-item">
                  <span className="hero__proof-num">2</span>
                  <span className="hero__proof-label">Aktif AI Ürünü</span>
                </div>
                <div className="hero__proof-divider"/>
                <div className="hero__proof-item">
                  <span className="hero__proof-num">10+</span>
                  <span className="hero__proof-label">Otomatize İş Akışı</span>
                </div>
                <div className="hero__proof-divider"/>
                <div className="hero__proof-item">
                  <span className="hero__proof-num">100K+</span>
                  <span className="hero__proof-label">Hazır Kayıt</span>
                </div>
              </div>
            </div>
            <div className="hero__viz">
              <SystemViz />
            </div>
          </div>
          <div className="hero__scroll-hint" aria-hidden="true">
            <div className="scroll-line"/>
          </div>
        </section>

        {/* ── STATEMENT ── */}
        <section className="statement">
          <div className="wrap">
            <div className="statement__inner">
              <p className="statement__text">
                Operasyonlar sistem olur.<br/>
                Sistemler ürün olur.<br/>
                <em>Ürünler ekosistem olur.</em>
              </p>
              <div className="statement__line"/>
            </div>
          </div>
        </section>

        {/* ── INTELLIGENCE LAYER ── */}
        <section className="section" id="intelligence">
          <div className="wrap">
            <div className="section__header" data-align="left">
              <span className="eyebrow-label">Metodoloji</span>
              <h2 className="section__h2">Her sistem beş<br/><em>adımda zekalaşır.</em></h2>
              <p className="section__sub">SRYVERSE'in her ürünü endüstri mühendisliği perspektifi ve yapay zeka mühendisliği gücüyle inşa edilir.</p>
            </div>
            <IntelligenceLayer />
            <div className="intel-cards">
              {[
                { icon: '◈', title: 'Süreç Zekası', desc: 'Dağınık iş akışlarını ölçülebilir sistemlere çeviriyoruz.' },
                { icon: '◎', title: 'AI Karar Katmanı', desc: 'LLM\'ler ve otomasyon modellerini daha iyi kararlar için kullanıyoruz.' },
                { icon: '⬡', title: 'SaaS Mimarisi', desc: 'Ürünler bulut-native platformlar olarak ölçeklenmeye hazır inşa edilir.' },
                { icon: '◇', title: 'İş Etkisi', desc: 'Her özellik zaman, maliyet ve operasyonel sürtüşmeyi azaltacak şekilde tasarlanır.' },
              ].map((c,i) => (
                <div key={i} className="intel-card">
                  <div className="intel-card__icon">{c.icon}</div>
                  <h4 className="intel-card__title">{c.title}</h4>
                  <p className="intel-card__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="section section--sage" id="products">
          <div className="wrap">
            <div className="section__header">
              <span className="eyebrow-label">Ürün Ekosistemi</span>
              <h2 className="section__h2">Tek ekosistem.<br/><em>Çok sayıda AI ürünü.</em></h2>
            </div>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.key} product={p}/>)}
            </div>
          </div>
        </section>

        {/* ── TRANSFORMATION EDITORIAL ── */}
        <section className="section editorial" id="transformation">
          <div className="wrap">
            <div className="editorial__grid">
              <div className="editorial__left">
                <span className="eyebrow-label">Dönüşüm</span>
                <h2 className="editorial__h2">
                  Sadece yazılım<br/>değil.<br/>
                  <em>Operasyonel<br/>dönüşüm.</em>
                </h2>
              </div>
              <div className="editorial__right">
                {[
                  { before: 'Kaos', after: 'Netlik', icon: '→' },
                  { before: 'Manuel', after: 'Otomatize', icon: '→' },
                  { before: 'Dağınık Veri', after: 'Akıllı Sistem', icon: '→' },
                  { before: 'Yavaş Karar', after: 'Gerçek Zamanlı Zeka', icon: '→' },
                ].map((item,i) => (
                  <div key={i} className="transform-row">
                    <span className="transform-before">{item.before}</span>
                    <span className="transform-arrow">→</span>
                    <span className="transform-after">{item.after}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── METRICS ── */}
        <section className="metrics-section" ref={metricsRef}>
          <div className="wrap">
            <div className="metrics-grid">
              <Metric value={2}   suffix=""   label="Aktif AI Ürünü"         active={metricsVisible}/>
              <Metric value={10}  suffix="+"  label="AI İş Akışı"            active={metricsVisible}/>
              <Metric value={100} suffix="K+" label="Ölçeklenmeye Hazır Kayıt" active={metricsVisible}/>
              <Metric value={1}   suffix=""   label="Birleşik AI Ekosistemi"  active={metricsVisible}/>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="section">
          <div className="wrap">
            <div className="section__header">
              <span className="eyebrow-label">Altyapı</span>
              <h2 className="section__h2">Modern bir<br/><em>AI-native stack.</em></h2>
            </div>
            <div className="stack-grid">
              {[
                ['LLM & AI Ajanlar', 'gemini · openai'],
                ['FastAPI Backend', 'python · async'],
                ['Vue.js Frontend', 'vue3 · vite'],
                ['PostgreSQL', 'ilişkisel · ölçeklenebilir'],
                ['Railway / Vercel', 'bulut · edge'],
                ['Supabase Storage', 'dosya · bucket'],
                ['Analitik & Otomasyon', 'bi · workflow'],
              ].map(([name, sub],i) => (
                <div key={i} className="stack-card">
                  <span className="stack-card__name">{name}</span>
                  <span className="stack-card__sub">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="section section--sage">
          <div className="wrap">
            <div className="section__header">
              <span className="eyebrow-label">Kullanım Alanları</span>
              <h2 className="section__h2">Karmaşık operasyon<br/><em>yürüten ekipler için.</em></h2>
            </div>
            <div className="cases-grid">
              {[
                { role: 'İşe Alım Ekipleri', desc: 'Yüksek hacimli işe alım süreçlerinde CV eleme ve aday eşleştirmeyi otomatize edin.' },
                { role: 'Gayrimenkul Acenteleri', desc: 'Müşteri gereksinimlerini ilanlarla akıllı biçimde eşleştirin, yapay zeka destekli öneriler alın.' },
                { role: 'İnsan Kaynakları', desc: 'Yetenek verisini yapılandırılmış zekaya dönüştürün — iş gücü planlaması ve yetenek açığı analizi.' },
                { role: 'İş Analistleri', desc: 'Ham veriden karar almaya hazır zekaya AI destekli raporlama ve BI kopilotlarıyla geçin.' },
                { role: 'Operasyon Ekipleri', desc: 'Tekrarlayan manuel işleri ölçekte ortadan kaldırmak için operasyonel iş akışlarını haritalayın ve otomatize edin.' },
                { role: 'Dijital Dönüşüm Liderleri', desc: 'Bugünün dağınık araçlarından birleşik, AI-native iş altyapısına giden yol haritanızı oluşturun.' },
              ].map((c,i) => (
                <div key={i} className="case-card">
                  <h4 className="case-card__role">{c.role}</h4>
                  <p className="case-card__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISION ── */}
        <section className="vision" id="vision">
          <div className="wrap">
            <div className="vision__inner">
              <span className="eyebrow-label eyebrow-label--light">Vizyon</span>
              <h2 className="vision__h2">
                Yazılım inşa<br/>etmiyoruz.
              </h2>
              <h2 className="vision__h2 vision__h2--em">
                <em>Geleceğin işletim<br/>sistemini inşa ediyoruz.</em>
              </h2>
              <p className="vision__body">
                SRYVERSE, işletmelerin daha hızlı düşünmesine, karar vermesine ve faaliyet göstermesine yardımcı olan bir AI ürünleri evreni inşa ediyor.
              </p>
              <div className="manifesto">
                {[
                  'Karmaşıklığı sadeleştiriyoruz.',
                  'Sistemler tasarlıyoruz.',
                  'Zekayı otomatize ediyoruz.',
                  'Ölçeklenen ürünler inşa ediyoruz.',
                ].map((line,i) => (
                  <div key={i} className="manifesto__line">
                    <span className="manifesto__dash">—</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="section" id="contact">
          <div className="wrap">
            <div className="contact-grid">
              <div className="contact-left">
                <span className="eyebrow-label">Demo Al</span>
                <h2 className="contact-left__h2">
                  Bir sonraki akıllı<br/>iş akışınızı<br/>birlikte kuralım.
                </h2>
                <p className="contact-left__note">Sürecinizi anlatın; SRYVERSE'in onu nasıl dönüştürebileceğini gösterelim.</p>
                <div className="contact-left__items">
                  <div className="contact-info">
                    <span className="contact-info__label">Ekosistem</span>
                    <span className="contact-info__val">sryverse.com</span>
                  </div>
                  <div className="contact-info">
                    <span className="contact-info__label">Yanıt Süresi</span>
                    <span className="contact-info__val">24 saat</span>
                  </div>
                </div>
              </div>
              <div className="contact-right">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer__main">
            <div className="footer__brand">
              <img src="/sryverse-logo.png" alt="SRYVERSE" className="footer__logo"/>
              <p className="footer__tagline">Yapay zeka ürünleri.<br/>Operasyonel zeka.</p>
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
          <div className="footer__bottom">
            <span>© 2026 SRYVERSE. Tüm hakları saklıdır.</span>
            <span className="footer__mono">Geleceğin işletim sistemi.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
