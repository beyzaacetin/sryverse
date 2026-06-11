import { useState, useEffect, useRef, useCallback } from 'react'
import Background from './Background.jsx'
import CardCanvas from './CardCanvas.jsx'
import Terminal from './Terminal.jsx'
import './App.css'

/* ── hooks ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, v]
}

function useCounter(target, active, dur = 2000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let st = null
    const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t
    const step = ts => { if (!st) st = ts; const p = Math.min((ts-st)/dur,1); setVal(Math.round(ease(p)*target)); if(p<1)requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }, [active, target, dur])
  return val
}

function useTilt(s = 8) {
  const ref = useRef(null)
  const onMove = useCallback(e => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5
    ref.current.style.transform = `perspective(1000px) rotateY(${x*s}deg) rotateX(${-y*s}deg) translateZ(8px)`
  }, [s])
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = 'none' }, [])
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave }
}

/* ── Intel Flow ── */
function IntelFlow() {
  const [ref, v] = useReveal(0.2)
  const steps = [
    {id:'01',tr:'Gözlemle',en:'Observe'},
    {id:'02',tr:'Modelle',en:'Model'},
    {id:'03',tr:'Optimize Et',en:'Optimize'},
    {id:'04',tr:'Otomatize',en:'Automate'},
    {id:'05',tr:'Ölçeklendir',en:'Scale'},
  ]
  return (
    <div ref={ref} className={`iflow glass${v?' iflow--on':''}`}>
      {steps.map((s,i) => (
        <div key={s.id} className="fn">
          <div className="fn__c"><span>{s.id}</span></div>
          {i < steps.length-1 && <div className="fn__line"><div className="fn__fill" style={{transitionDelay:`${i*.12+.3}s`}}/></div>}
          <div className="fn__txt"><b>{s.tr}</b><span>{s.en}</span></div>
        </div>
      ))}
    </div>
  )
}

/* ── Live Ticker ── */
function LiveTicker() {
  const items = [
    {id:'t0', label:'Global AI Kullanımı /dk', color:'#22c55e', base:4800000, step:()=>Math.floor(Math.random()*3000+500), fmt:v=>v.toLocaleString('tr-TR')},
    {id:'t1', label:'İşlenen CV /sn',          color:'#3b82f6', base:847,     step:()=>Math.random()*.8+.1,               fmt:v=>v.toFixed(1)},
    {id:'t2', label:'Mülk Eşleşmesi /gün',     color:'#a78bfa', base:12400,   step:()=>Math.floor(Math.random()*25+5),    fmt:v=>v.toLocaleString('tr-TR')},
    {id:'t3', label:'Otomasyon Kararı /sn',    color:'#f59e0b', base:2300,    step:()=>Math.random()*.6+.1,               fmt:v=>v.toFixed(1)},
  ]
  const vals = useRef(items.map(i=>i.base))
  const [display, setDisplay] = useState(items.map((i,idx)=>i.fmt(vals.current[idx])))

  useEffect(() => {
    const t = setInterval(() => {
      items.forEach((item,i) => { vals.current[i] += item.step() })
      setDisplay(items.map((item,i) => item.fmt(vals.current[i])))
    }, 800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="lticker">
      <span className="lticker__label">🔴 Canlı</span>
      {items.map((item,i) => (
        <div key={item.id} className="ltick glass">
          <span className="ltick__dot" style={{background:item.color, animationDelay:`${i*.3}s`}}/>
          <span className="ltick__val">{display[i]}</span>
          <span className="ltick__lbl">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Product Card ── */
function ProductCard({ p }) {
  const tilt = useTilt(7)
  return (
    <div className={`pcard pcard--${p.key}`} {...tilt}>
      <CardCanvas variant={p.key} />
      <div className="pcard__c">
        <span className={`pbadge pbadge--${p.live?'live':p.future?'future':'soon'}`}>
          {p.live ? <><i className="bdot"/>{' '}CANLI</> : p.future ? '✦ GELECEKTE' : 'YAKINDA'}
        </span>
        <h3 className="pcard__name">{p.name}</h3>
        <span className="pcard__cat">{p.category}</span>
        <p className="pcard__desc">{p.desc}</p>
        <div className="pcard__foot">
          {p.live
            ? <a href={p.url} className="pcta" target="_blank" rel="noopener noreferrer">Keşfet <span>→</span></a>
            : p.future
              ? <div className="pcard__future-hint">
                  <div className="future-line"/>
                  <p className="future-text">Bekleme listesine katıl →</p>
                </div>
              : <button className="pcta pcta--dim">Bekleme Listesi <span>→</span></button>
          }
        </div>
      </div>
    </div>
  )
}

/* ── Metric ── */
function Metric({ value, suffix, label, active }) {
  const v = useCounter(value, active)
  return (
    <div className="metric">
      <div className="metric__val">{v}{suffix}</div>
      <div className="metric__lbl">{label}</div>
    </div>
  )
}

/* ── Contact Form ── */
function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = e => { e.preventDefault(); setLoading(true); setTimeout(()=>{setLoading(false);setSent(true)},900) }
  if (sent) return (
    <div className="form-ok glass">
      <div className="form-ok__icon">✓</div>
      <p className="form-ok__title">Mesajınız alındı.</p>
      <p className="form-ok__sub">24 saat içinde dönüş yapacağız.</p>
    </div>
  )
  return (
    <form className="cform glass" onSubmit={submit}>
      <div className="cform__row">
        <div className="cf"><label>Ad Soyad</label><input type="text" placeholder="Adınız" required /></div>
        <div className="cf"><label>Şirket</label><input type="text" placeholder="Şirket adı" required /></div>
      </div>
      <div className="cf"><label>E-posta</label><input type="email" placeholder="isim@sirket.com" required /></div>
      <div className="cf">
        <label>İlgilendiğiniz Ürün</label>
        <select required defaultValue="">
          <option value="" disabled>Seçiniz</option>
          <option>SkillMatch AI</option><option>EstateMatch AI</option><option>Özel çözüm</option>
        </select>
      </div>
      <div className="cf"><label>Mesaj</label><textarea rows="4" placeholder="Operasyonunuzu veya dönüştürmek istediğiniz süreci anlatın..." required /></div>
      <button type="submit" className={`cform__btn${loading?' cform__btn--loading':''}`} disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Demo Talep Et →'}
      </button>
    </form>
  )
}

/* ══════════════ MAIN ══════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mRef, mVisible] = useReveal(0.3)
  const [heroRef, heroOn] = useReveal(0.05)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const products = [
    { key:'skill',  name:'SkillMatch AI',    category:'Recruitment Intelligence',     live:true,  future:false, url:'https://skillmatch.sryverse.com', desc:'İşe alım süreçlerindeki karmaşıklığı çözen AI platformu — CV analizi, darboğaz tespiti ve aday eşleştirme ile uçtan uca dönüşüm.' },
    { key:'estate', name:'EstateMatch AI',   category:'Real Estate Intelligence',     live:true,  future:false, url:'https://estate.sryverse.com',      desc:'Gayrimenkul operasyonlarını sistemleştiren AI platformu — portföy yönetimi, akıllı eşleştirme ve müşteri zekası tek çatı altında.' },
    { key:'future', name:'Yeni Ürün',        category:'SRYVERSE Ekosistemi',          live:false, future:true,  url:null, desc:'SRYVERSE ekosisteminin bir sonraki halkası şekilleniyor. Yeni bir iş alanı, yeni bir AI ürünü — yakında duyurulacak.' },
  ]

  const nav = [
    {label:'Ürünler',href:'#products'},
    {label:'Zeka Katmanı',href:'#intelligence'},
    {label:'Çözümler',href:'#usecases'},
    {label:'Vizyon',href:'#vision'},
    {label:'İletişim',href:'#contact'},
  ]

  return (
    <div className="site">

      {/* HEADER */}
      <header className={`hdr${scrollY>30?' hdr--solid':''}`}>
        <div className="hdr__in">
          <a href="/" className="hdr__logo">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="hdr__logo-img" />
          </a>
          <nav className={`hdr__nav${menuOpen?' hdr__nav--open':''}`}>
            {nav.map(n => <a key={n.label} href={n.href} className="nlink" onClick={()=>setMenuOpen(false)}>{n.label}</a>)}
          </nav>
          <div className="hdr__act">
            <a href="#products" className="hbtn hbtn--g">Ürünleri Keşfet</a>
            <a href="#contact" className="hbtn hbtn--s">Demo Al →</a>
          </div>
          <button className={`burger${menuOpen?' burger--x':''}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menü">
            <span/><span/><span/>
          </button>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero" ref={heroRef}>
          <Background density={1} />
          <div className="wrap hero__in">
            <div className={`hero__content${heroOn?' hero__content--on':''}`}>
              <div className="hero__eye">
                <span className="edot"/>
                Endüstri Mühendisliği × AI × Dijital Dönüşüm
              </div>
              <h1 className="hero__h1">
                Operasyonel Karmaşıklıktan<br/>
                <em>Akıllı Sistem Çözümlerine.</em>
              </h1>
              <p className="hero__sub">
                İş süreçlerindeki darboğazları tespit eder, sistemleştirir ve yapay zeka destekli ürünlerle ölçeklenebilir çözümlere dönüştürürüz.
              </p>
              <div className="hero__ctas">
                <a href="#products" className="btn btn--p">Ekosistemi Keşfet <span>→</span></a>
                <a href="#contact" className="btn btn--o">Demo Talep Et</a>
              </div>
              <p className="elabel" style={{marginBottom:'10px'}}>Operasyonel Zeka Katmanı</p>
              <IntelFlow />
            </div>
            <div className="hero__pills">
              <div className="pill glass"><span className="pill__num">2</span><span className="pill__lbl">Aktif AI Ürünü</span></div>
              <div className="pill glass"><span className="pill__num">10+</span><span className="pill__lbl">AI İş Akışı</span></div>
              <div className="pill glass"><span className="pill__num">100K+</span><span className="pill__lbl">Kayıt İşlendi</span></div>
            </div>
          </div>
          <div className="scroll-hint"><div className="scroll-line"/></div>
        </section>

        {/* LIVE TICKER */}
        <LiveTicker />

        {/* PRODUCTS */}
        <section className="sec" id="products">
          <div className="wrap">
            <div className="sec__head fade-up">
              <span className="elabel">Ürün Ekosistemi</span>
              <h2 className="sec__h2">Tek ekosistem.<br/><em>Çok sayıda AI ürünü.</em></h2>
            </div>
            <div className="pgrid">
              {products.map(p => <ProductCard key={p.key} p={p}/>)}
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="msec" ref={mRef}>
          <Background density={0.6} />
          <div className="wrap mgrid">
            <Metric value={2}   suffix=""   label="Aktif AI Ürünü"         active={mVisible}/>
            <Metric value={10}  suffix="+"  label="Otomatize İş Akışı"     active={mVisible}/>
            <Metric value={100} suffix="K+" label="Kararlar Geliştirildi"   active={mVisible}/>
            <Metric value={1}   suffix=""   label="Birleşik Platform"       active={mVisible}/>
          </div>
        </section>

        {/* INTELLIGENCE TERMINAL */}
        <section className="sec" id="intelligence">
          <div className="wrap">
            <div className="sec__head fade-up">
              <span className="elabel">Operasyonel Zeka Katmanı</span>
              <h2 className="sec__h2">Sisteme sor,<br/><em>gerçek zamanlı yanıt al.</em></h2>
              <p className="sec__sub">Her katmana tıkla, canlı sistemi gözlemle — ya da kendi sorunuzu sorun.</p>
            </div>
            <Terminal />
          </div>
        </section>

        {/* HOW WE WORK */}
        <section className="sec sec--tint" id="howwe">
          <div className="wrap howwe fade-up">
            <div className="howwe__left">
              <span className="elabel">Metodoloji</span>
              <h2 className="howwe__h2">Karmaşıklıktan<br/><em>ölçekte netliğe.</em></h2>
            </div>
            <div className="steps">
              {[
                {id:'01',name:'Gözlemle',desc:'İş akışlarını ve operasyonel darboğazları tespit et.'},
                {id:'02',name:'Modelle',desc:'Süreci veri yapılarına ve ölçülebilir modellere dönüştür.'},
                {id:'03',name:'Optimize Et',desc:'Kritik karar noktalarını ve verimsizlikleri belirle.'},
                {id:'04',name:'Otomatize',desc:'Tekrarlayan, yüksek hacimli görevleri AI ile devral.'},
                {id:'05',name:'Ölçeklendir',desc:'SaaS platformu olarak deploy et ve büyü.'},
              ].map((s,i) => (
                <div key={s.id} className="step" style={{animationDelay:`${i*.08}s`}}>
                  <span className="step__id">{s.id}</span>
                  <div className="step__txt"><b>{s.name}</b><span>{s.desc}</span></div>
                  <div className="step__bar"><div className="step__fill" style={{width:`${100-i*12}%`}}/></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="sec" id="usecases">
          <div className="wrap">
            <div className="sec__head fade-up">
              <span className="elabel">Kimler İçin</span>
              <h2 className="sec__h2">Karmaşık operasyon<br/><em>yürüten ekipler için.</em></h2>
            </div>
            <div className="cgrid">
              {[
                {en:'Recruitment Teams',   tr:'İşe Alım Ekipleri',     desc:'Doğru yeteneği daha hızlı ve daha akıllı işe alın.'},
                {en:'Real Estate Agencies',tr:'Gayrimenkul Acenteleri', desc:'Mülkleri, müşterileri ve fırsatları eşleştirin.'},
                {en:'HR Departments',      tr:'İnsan Kaynakları',       desc:'İnsan verilerini stratejik içgörülere dönüştürün.'},
                {en:'Operations Teams',    tr:'Operasyon Ekipleri',     desc:'İş akışlarını otomatize edin, sürtüşmeyi azaltın.'},
                {en:'Business Analysts',   tr:'İş Analistleri',         desc:'Veriyi AI yardımıyla kararlara dönüştürün.'},
                {en:'Transformation Leaders',tr:'Dönüşüm Liderleri',   desc:'Geleceğin akıllı organizasyonunu inşa edin.'},
              ].map((c,i) => (
                <div key={i} className="ccard glass">
                  <div className="ccard__shine"/>
                  <span className="ccard__en">{c.en}</span>
                  <h4 className="ccard__tr">{c.tr}</h4>
                  <p className="ccard__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="vsec" id="vision">
          <Background density={0.7} />
          <div className="wrap vsec__in">
            <span className="elabel elabel--dim">Vizyonumuz</span>
            <p className="vision__l1">Araç inşa etmiyoruz.</p>
            <h2 className="vision__l2"><em>Geleceğin işletim katmanını<br/>inşa ediyoruz.</em></h2>
            <p className="vision__body">SRYVERSE, işletmelerin geleceğin hızında düşünmesine, karar vermesine ve faaliyet göstermesine yardımcı olan işletim altyapısını inşa ediyor.</p>
            <div className="manifesto">
              {['Karmaşıklığı sadeleştiriyoruz.','Sistemler tasarlıyoruz.','Zekayı otomatize ediyoruz.','Ölçeklenen ürünler inşa ediyoruz.'].map((l,i) => (
                <div key={i} className="manifesto__line"><span>—</span>{l}</div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec" id="contact">
          <div className="wrap cgrid2">
            <div className="fade-up">
              <span className="elabel">Demo Al</span>
              <h2 className="contact__h2">Bir sonraki akıllı iş akışınızı birlikte kuralım.</h2>
              <p className="contact__note">Sürecinizi anlatın; nasıl dönüştürebileceğimizi gösterelim.</p>
              <div className="contact__meta">
                <div><span className="mlbl">Ekosistem</span><span className="mval">sryverse.com</span></div>
                <div><span className="mlbl">Yanıt Süresi</span><span className="mval">24 saat</span></div>
              </div>
            </div>
            <div className="fade-up" style={{animationDelay:'0.15s'}}><ContactForm /></div>
          </div>
        </section>

      </main>

      <footer className="footer">
        <div className="wrap footer__in">
          <div className="footer__brand">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="footer__logo"/>
            <p className="footer__tag">Yapay zeka ürünleri için operasyonel zeka.</p>
          </div>
          <div className="footer__links">
            <div className="fcol"><h5>Ürünler</h5>
              <a href="https://skillmatch.sryverse.com" target="_blank" rel="noopener noreferrer">SkillMatch AI</a>
              <a href="https://estate.sryverse.com" target="_blank" rel="noopener noreferrer">EstateMatch AI</a>
            </div>
            <div className="fcol"><h5>Şirket</h5><a href="#vision">Vizyon</a><a href="#intelligence">Metodoloji</a><a href="#contact">İletişim</a></div>
            <div className="fcol"><h5>Bağlantı</h5><a href="#">LinkedIn</a><a href="#">GitHub</a></div>
          </div>
        </div>
        <div className="wrap footer__bot">
          <span>© 2026 SRYVERSE. Tüm hakları saklıdır.</span>
          <span className="footer__mono">Geleceğin işletim sistemi.</span>
        </div>
      </footer>

    </div>
  )
}
