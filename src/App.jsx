import { useState, useEffect, useRef } from 'react'
import './App.css'

// SRY Monogram SVG Logo
function SRYLogo({ size = 32, dark = false }) {
  const color = dark ? '#FAFAF7' : '#12372A'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="20" y="30"
        fontFamily="'Instrument Serif', Georgia, serif"
        fontSize="26"
        fontWeight="700"
        fill={color}
        textAnchor="middle"
        letterSpacing="-1"
      >SRY</text>
    </svg>
  )
}

// Animated counter hook
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

// Intersection observer hook
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// Hero system diagram
function SystemDiagram() {
  return (
    <div className="system-diagram" aria-hidden="true">
      <svg viewBox="0 0 580 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="diagram-svg">
        {/* Grid dots */}
        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 6 }, (_, j) => (
            <circle key={`${i}-${j}`} cx={40 + i * 72} cy={30 + j * 72} r="1.5" fill="#ADBC9F" opacity="0.5" />
          ))
        )}

        {/* Flow lines */}
        <path d="M 80 120 Q 160 80 240 120" stroke="#ADBC9F" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.6" className="flow-line" />
        <path d="M 240 120 Q 320 80 400 120" stroke="#ADBC9F" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.6" className="flow-line" style={{animationDelay:'0.3s'}} />
        <path d="M 160 200 L 290 200" stroke="#436850" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 290 200 L 420 200" stroke="#436850" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 160 200 L 160 300" stroke="#ADBC9F" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity="0.5" />
        <path d="M 420 200 L 420 300" stroke="#ADBC9F" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity="0.5" />

        {/* Data nodes */}
        <circle cx="80" cy="120" r="6" fill="#12372A" opacity="0.7" />
        <circle cx="240" cy="120" r="6" fill="#12372A" opacity="0.7" />
        <circle cx="400" cy="120" r="6" fill="#12372A" opacity="0.7" />
        <circle cx="520" cy="120" r="4" fill="#ADBC9F" opacity="0.8" />

        {/* AI Decision Layer box */}
        <rect x="220" y="170" width="140" height="60" rx="8" fill="#12372A" opacity="0.08" stroke="#12372A" strokeWidth="1" />
        <text x="290" y="196" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#12372A" fontWeight="500" opacity="0.7">AI DECISION</text>
        <text x="290" y="212" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#12372A" opacity="0.7">LAYER</text>

        {/* SkillMatch card */}
        <rect x="100" y="270" width="160" height="90" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="100" y="270" width="160" height="6" rx="10" fill="#12372A" />
        <text x="180" y="302" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="12" fill="#12372A" fontWeight="700">SkillMatch AI</text>
        <text x="180" y="320" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fill="#6B7280">by SRYVERSE</text>
        <circle cx="125" cy="342" r="3" fill="#436850" opacity="0.6" />
        <circle cx="138" cy="342" r="3" fill="#436850" opacity="0.4" />
        <circle cx="151" cy="342" r="3" fill="#436850" opacity="0.3" />

        {/* EstateMatch card */}
        <rect x="320" y="270" width="160" height="90" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="320" y="270" width="160" height="6" rx="10" fill="#436850" />
        <text x="400" y="302" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="12" fill="#12372A" fontWeight="700">EstateMatch AI</text>
        <text x="400" y="320" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="9" fill="#6B7280">by SRYVERSE</text>
        <circle cx="345" cy="342" r="3" fill="#ADBC9F" opacity="0.8" />
        <circle cx="358" cy="342" r="3" fill="#ADBC9F" opacity="0.6" />
        <circle cx="371" cy="342" r="3" fill="#ADBC9F" opacity="0.4" />

        {/* Label text */}
        <text x="80" y="108" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="8" fill="#6B7280">INPUT</text>
        <text x="520" y="108" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="8" fill="#6B7280">OUTPUT</text>

        {/* Workflow arrows */}
        <path d="M 290 230 L 290 265" stroke="#12372A" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.5" />
        <path d="M 245 265 L 195 268" stroke="#ADBC9F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <path d="M 335 265 L 395 268" stroke="#ADBC9F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#12372A" opacity="0.5" />
          </marker>
        </defs>

        {/* Pulse circles */}
        <circle cx="290" cy="200" r="4" fill="#12372A" opacity="0.8" className="pulse-dot" />
        <circle cx="290" cy="200" r="12" fill="none" stroke="#12372A" strokeWidth="1" opacity="0.2" className="pulse-ring" />
      </svg>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [metricsRef, metricsInView] = useInView(0.3)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app">
      {/* HEADER */}
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__inner">
          <a href="#" className="logo" aria-label="SRYVERSE home">
            <div className="logo__mark">
              <SRYLogo size={36} />
            </div>
            <span className="logo__name">SRYVERSE</span>
          </a>

          <nav className={`nav ${menuOpen ? 'nav--open' : ''}`} aria-label="Main navigation">
            <a href="#products" className="nav__link" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#intelligence" className="nav__link" onClick={() => setMenuOpen(false)}>Intelligence Layer</a>
            <a href="#transformation" className="nav__link" onClick={() => setMenuOpen(false)}>Solutions</a>
            <a href="#vision" className="nav__link" onClick={() => setMenuOpen(false)}>Vision</a>
            <a href="#contact" className="nav__link" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>

          <div className="header__actions">
            <a href="#products" className="btn btn--ghost">Launch Products</a>
            <a href="#contact" className="btn btn--primary">Request Demo</a>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__content fade-in">
              <div className="eyebrow">
                <span className="eyebrow__dot"></span>
                AI Products · Digital Transformation
              </div>
              <h1 className="hero__headline">
                AI Products for<br />
                <em>Operational Intelligence</em>
              </h1>
              <p className="hero__sub">Where industrial engineering meets artificial intelligence.</p>
              <p className="hero__desc">
                SRYVERSE builds intelligent software products that transform complex business processes into scalable, automated and data-driven systems.
              </p>
              <div className="hero__cta">
                <a href="#products" className="btn btn--primary btn--lg">Explore Products</a>
                <a href="#contact" className="btn btn--outline btn--lg">Request Demo</a>
              </div>
            </div>
            <div className="hero__visual fade-in" style={{ animationDelay: '0.2s' }}>
              <SystemDiagram />
            </div>
          </div>
        </section>

        {/* INTELLIGENCE LAYER */}
        <section className="section" id="intelligence">
          <div className="container">
            <div className="section__header fade-up">
              <span className="label">Intelligence Layer</span>
              <h2 className="section__title">From process complexity<br />to intelligent systems.</h2>
              <p className="section__desc">Every SRYVERSE product is designed with an industrial engineering mindset and powered by AI engineering.</p>
            </div>
            <div className="grid grid--4 fade-up" style={{ animationDelay: '0.15s' }}>
              {[
                {
                  icon: '◈',
                  title: 'Process Intelligence',
                  desc: 'We map messy business workflows into measurable, observable systems — before automating anything.',
                },
                {
                  icon: '◎',
                  title: 'AI Decision Layer',
                  desc: 'We use LLMs, automation and data models to support better decisions at scale.',
                },
                {
                  icon: '⬡',
                  title: 'Scalable SaaS Architecture',
                  desc: 'Products are built as cloud-native platforms, designed for growth from day one.',
                },
                {
                  icon: '◇',
                  title: 'Business Impact',
                  desc: 'Every feature is designed to reduce time, cost and operational friction — measurably.',
                },
              ].map((card, i) => (
                <div key={i} className="card card--intelligence" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="card__icon">{card.icon}</div>
                  <h3 className="card__title">{card.title}</h3>
                  <p className="card__desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="section section--tinted" id="products">
          <div className="container">
            <div className="section__header fade-up">
              <span className="label">Product Ecosystem</span>
              <h2 className="section__title">One ecosystem.<br />Multiple AI products.</h2>
            </div>
            <div className="grid grid--3 fade-up" style={{ animationDelay: '0.1s' }}>
              {/* SkillMatch */}
              <div className="card card--product card--skillmatch">
                <div className="product-card__header">
                  <div className="product-badge product-badge--active">Live</div>
                  <div className="product-card__brand">
                    <h3 className="product-card__name">SkillMatch AI</h3>
                    <span className="product-card__by">by SRYVERSE</span>
                  </div>
                </div>
                <p className="product-card__desc">
                  An AI-powered recruitment platform that analyzes CVs, matches candidates with roles, generates interview intelligence and supports end-to-end hiring workflows.
                </p>
                <ul className="product-features">
                  {['AI CV Parsing', 'LLM Candidate Matching', 'Interview Copilot', 'Talent Pool', 'Hiring Analytics'].map(f => (
                    <li key={f}><span className="feature-dot"></span>{f}</li>
                  ))}
                </ul>
                <a href="https://skillmatch.sryverse.com" className="btn btn--product btn--dark" target="_blank" rel="noopener noreferrer">
                  Launch SkillMatch AI →
                </a>
              </div>

              {/* EstateMatch */}
              <div className="card card--product card--estate">
                <div className="product-card__header">
                  <div className="product-badge product-badge--active">Live</div>
                  <div className="product-card__brand">
                    <h3 className="product-card__name">EstateMatch AI</h3>
                    <span className="product-card__by">by SRYVERSE</span>
                  </div>
                </div>
                <p className="product-card__desc">
                  An AI-powered real estate platform that helps agencies manage properties, match client needs with listings and turn scattered portfolio data into intelligent recommendations.
                </p>
                <ul className="product-features">
                  {['Smart Property Matching', 'Portfolio Management', 'AI Listing Assistant', 'Client Intelligence', 'Sales Pipeline'].map(f => (
                    <li key={f}><span className="feature-dot feature-dot--sage"></span>{f}</li>
                  ))}
                </ul>
                <a href="https://estate.sryverse.com" className="btn btn--product btn--mid" target="_blank" rel="noopener noreferrer">
                  Launch EstateMatch AI →
                </a>
              </div>

              {/* Coming Soon */}
              <div className="card card--product card--coming">
                <div className="product-card__header">
                  <div className="product-badge product-badge--soon">Coming Soon</div>
                  <div className="product-card__brand">
                    <h3 className="product-card__name">SRYVERSE Copilot</h3>
                    <span className="product-card__by">by SRYVERSE</span>
                  </div>
                </div>
                <p className="product-card__desc">
                  An AI assistant layer for business teams — analytics, operations and decision support, unified in one intelligent interface.
                </p>
                <ul className="product-features">
                  {['BI Copilot', 'HR Copilot', 'Contract AI', 'Workflow Automation'].map(f => (
                    <li key={f}><span className="feature-dot feature-dot--light"></span>{f}</li>
                  ))}
                </ul>
                <a href="#contact" className="btn btn--product btn--ghost-dark">
                  Join Waitlist →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DIGITAL TRANSFORMATION */}
        <section className="section" id="transformation">
          <div className="container">
            <div className="section__header fade-up">
              <span className="label">Methodology</span>
              <h2 className="section__title">Not just software.<br /><em>Operational transformation.</em></h2>
            </div>
            <div className="timeline fade-up" style={{ animationDelay: '0.1s' }}>
              {[
                { step: 'Observe', desc: 'Understand the real workflow — before writing a single line of code.' },
                { step: 'Model', desc: 'Turn processes into data structures that can be measured, tracked and reasoned about.' },
                { step: 'Optimize', desc: 'Find bottlenecks and decision points where intelligence can intervene.' },
                { step: 'Automate', desc: 'Let AI handle repeatable intelligence, so humans focus on judgment.' },
                { step: 'Scale', desc: 'Deploy as a productized SaaS system, built for growth without friction.' },
              ].map((item, i) => (
                <div key={i} className="timeline__item">
                  <div className="timeline__connector">
                    <div className="timeline__node">{i + 1}</div>
                    {i < 4 && <div className="timeline__line"></div>}
                  </div>
                  <div className="timeline__content">
                    <h4 className="timeline__step">{item.step}</h4>
                    <p className="timeline__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="section section--dark" ref={metricsRef}>
          <div className="container">
            <div className="metrics">
              {[
                { value: 2, suffix: '', label: 'Active AI Products', prefix: '' },
                { value: 10, suffix: '+', label: 'AI Workflows Automated', prefix: '' },
                { value: 100, suffix: 'K+', label: 'Records Ready to Scale', prefix: '' },
                { value: 1, suffix: '', label: 'Unified AI Ecosystem', prefix: '' },
              ].map((m, i) => (
                <MetricCard key={i} {...m} active={metricsInView} delay={i * 150} />
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="section">
          <div className="container">
            <div className="section__header fade-up">
              <span className="label">Infrastructure</span>
              <h2 className="section__title">Built on a modern<br />AI-native stack.</h2>
            </div>
            <div className="tech-grid fade-up" style={{ animationDelay: '0.1s' }}>
              {[
                { name: 'LLMs & AI Agents', mono: 'gemini · openai' },
                { name: 'FastAPI Backend', mono: 'python · async' },
                { name: 'Vue / Modern Frontend', mono: 'vue3 · vite' },
                { name: 'PostgreSQL', mono: 'relational · scalable' },
                { name: 'Railway / Vercel', mono: 'cloud · edge' },
                { name: 'Supabase Storage', mono: 'files · buckets' },
                { name: 'Analytics & Automation', mono: 'bi · workflows' },
              ].map((t, i) => (
                <div key={i} className="tech-card">
                  <span className="tech-card__name">{t.name}</span>
                  <span className="tech-card__mono">{t.mono}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="section section--tinted">
          <div className="container">
            <div className="section__header fade-up">
              <span className="label">Use Cases</span>
              <h2 className="section__title">Designed for teams that<br />run complex operations.</h2>
            </div>
            <div className="grid grid--3 fade-up" style={{ animationDelay: '0.1s' }}>
              {[
                { role: 'Recruitment Teams', desc: 'Automate CV screening, candidate matching and interview scheduling across high-volume hiring pipelines.' },
                { role: 'Real Estate Agencies', desc: 'Match client requirements to property listings intelligently, with AI-generated listing summaries.' },
                { role: 'HR Departments', desc: 'Turn talent data into structured insights — workforce planning, skills gaps, and hiring analytics.' },
                { role: 'Business Analysts', desc: 'Move from raw data to decision-ready intelligence with AI-assisted reporting and BI copilots.' },
                { role: 'Operations Teams', desc: 'Map and automate operational workflows to eliminate repetitive manual work at scale.' },
                { role: 'Digital Transformation Leaders', desc: 'Build a roadmap from today\'s fragmented tools to a unified, AI-native business infrastructure.' },
              ].map((u, i) => (
                <div key={i} className="card card--usecase">
                  <h4 className="usecase__role">{u.role}</h4>
                  <p className="usecase__desc">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="section section--vision" id="vision">
          <div className="container">
            <div className="vision__inner fade-up">
              <span className="label label--light">Vision</span>
              <h2 className="vision__title">
                The future is not one app.<br />
                It is an <em>intelligent ecosystem.</em>
              </h2>
              <p className="vision__body">
                SRYVERSE is building a universe of AI products that help businesses think, decide and operate faster.
              </p>
              <div className="manifesto">
                {[
                  'We simplify complexity.',
                  'We design systems.',
                  'We automate intelligence.',
                  'We build products that scale.',
                ].map((line, i) => (
                  <div key={i} className="manifesto__line">
                    <span className="manifesto__mark">—</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="container">
            <div className="contact__grid">
              <div className="contact__left fade-up">
                <span className="label">Get in Touch</span>
                <h2 className="section__title">Build your next<br />intelligent workflow<br />with SRYVERSE.</h2>
                <p className="contact__note">Tell us about your process and we'll show you how AI can transform it.</p>
              </div>
              <div className="contact__right fade-up" style={{ animationDelay: '0.15s' }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="logo logo--light">
              <div className="logo__mark">
                <SRYLogo size={32} dark />
              </div>
              <span className="logo__name logo__name--light">SRYVERSE</span>
            </div>
            <p className="footer__tagline">AI products for operational intelligence.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h5>Products</h5>
              <a href="https://skillmatch.sryverse.com" target="_blank" rel="noopener noreferrer">SkillMatch AI</a>
              <a href="https://estate.sryverse.com" target="_blank" rel="noopener noreferrer">EstateMatch AI</a>
            </div>
            <div className="footer__col">
              <h5>Company</h5>
              <a href="#vision">Vision</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer__col">
              <h5>Connect</h5>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
        <div className="container footer__bottom">
          <span>© 2026 SRYVERSE. All rights reserved.</span>
          <span className="footer__mono">Built with operational intelligence.</span>
        </div>
      </footer>
    </div>
  )
}

function MetricCard({ value, suffix, label, prefix, active, delay }) {
  const count = useCounter(value, 1200, active)
  return (
    <div className="metric" style={{ transitionDelay: `${delay}ms` }}>
      <div className="metric__value">
        {prefix}{active ? count : 0}{suffix}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }
  if (sent) {
    return (
      <div className="form-success">
        <div className="form-success__icon">✓</div>
        <h4>Message received.</h4>
        <p>We'll be in touch within 24 hours.</p>
      </div>
    )
  }
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label>Name</label>
          <input type="text" placeholder="Your name" required />
        </div>
        <div className="form-field">
          <label>Company</label>
          <input type="text" placeholder="Company name" required />
        </div>
      </div>
      <div className="form-field">
        <label>Email</label>
        <input type="email" placeholder="work@company.com" required />
      </div>
      <div className="form-field">
        <label>Product interest</label>
        <select required defaultValue="">
          <option value="" disabled>Select a product</option>
          <option>SkillMatch AI</option>
          <option>EstateMatch AI</option>
          <option>SRYVERSE Copilot</option>
          <option>Custom solution</option>
        </select>
      </div>
      <div className="form-field">
        <label>Message</label>
        <textarea rows="4" placeholder="Tell us about your workflow or challenge..." required></textarea>
      </div>
      <button type="submit" className="btn btn--primary btn--full">Request Demo →</button>
    </form>
  )
}
