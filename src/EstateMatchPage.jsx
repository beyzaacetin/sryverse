import { useState, useEffect, useRef, useCallback } from 'react'
import EstateMatch3D from './EstateMatch3D.jsx'
import './EstatePage.css'

/* Scroll ile beliren sarmalayici */
function Rev({ children, delay = 0 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`erev${on ? ' erev--on' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* Gorunurken sayarak yukselen deger */
function Count({ value }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const m = String(value).match(/^(\D*)([\d.,]+)(.*)$/s)
    if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const [, pre, numRaw, post] = m
    const decimals = numRaw.includes('.') ? (numRaw.split('.')[1] || '').length : 0
    const target = parseFloat(numRaw.replace(/,/g, ''))
    if (!isFinite(target)) return

    let raf = 0, start = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min(1, (ts - start) / 1300)
        const v = target * (1 - Math.pow(1 - p, 3))
        setShown(pre + v.toFixed(decimals) + post)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [value])

  return <span ref={ref}>{shown}</span>
}

/* ── Ekran turu ── */
const SCREENS = [
  { key: 'dashboard', n: '01', t: 'Panel',          d: 'Aktif portföy, sıcak müşteri, dönüşüm oranı ve AI öngörüleri tek ekranda.', icon: '◱' },
  { key: 'portfolio', n: '02', t: 'Portföy',        d: 'Görsel ilan kartları, işlem türü, danışman ve AI uyum skoru aynı görünümde.', icon: '⌂' },
  { key: 'import',    n: '03', t: 'İlan Aktarımı',  d: 'Sahibinden, Hürriyet Emlak ve Emlakjet ilanlarını URL ile içe aktarın.', icon: '⇱' },
  { key: 'listing',   n: '04', t: 'İlan Detayı',    d: 'Tüm nitelikler ve o ilana uyan müşteriler skorlarıyla birlikte.', icon: '▤' },
  { key: 'match',     n: '05', t: 'AI Eşleştirme',  d: 'Dönüşüm olasılığı, risk skoru ve uyum puanı gerekçesiyle sunulur.', icon: '✦' },
  { key: 'pipeline',  n: '06', t: 'İş Akışı',       d: 'Talepten kapanışa kadar her fırsat sürükle-bırak Kanban üzerinde.', icon: '⇉' },
  { key: 'calendar',  n: '07', t: 'Takvim & Takip', d: 'Randevular, gösterimler ve AI önerili takip aramaları.', icon: '◷' },
  { key: 'generator', n: '08', t: 'İlan Üreteci',   d: 'Portföyden seçin, AI ile Sahibinden / Instagram / WhatsApp metni üretin.', icon: '✎' },
  { key: 'reports',   n: '09', t: 'Raporlar',       d: 'Ciro, satış hunisi, dönüşüm ve danışman performansı.', icon: '◲' },
]

function ScreenTour() {
  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState(() => new Set())
  const s = SCREENS[active]
  const missing = failed.has(s.key)

  return (
    <div className="etour">
      <div className="etour__list">
        {SCREENS.map((x, i) => (
          <button
            key={x.key}
            className={`etour__btn${i === active ? ' etour__btn--on' : ''}`}
            onClick={() => setActive(i)}
            aria-current={i === active}
          >
            <span className="etour__n">{x.n}</span>
            <span className="etour__t">{x.t}</span>
            <span className="etour__d">{x.d}</span>
          </button>
        ))}
      </div>

      <div className="eshot">
        <div className="eshot__bar">
          <span className="eshot__dot" /><span className="eshot__dot" /><span className="eshot__dot" />
          <span className="eshot__url">estate.sryverse.com — {s.t}</span>
        </div>
        <div className="eshot__frame">
          {!missing && (
            <img
              key={s.key}
              className="eshot__img"
              src={`/screens/${s.key}.png`}
              alt={`EstateMatch AI — ${s.t} ekranı`}
              loading="lazy"
              onError={() => setFailed(prev => new Set(prev).add(s.key))}
            />
          )}
          {missing && (
            <div className="eshot__ph">
              <div className="eshot__phgrid" />
              <div className="eshot__phscan" />
              <span className="eshot__phicon">{s.icon}</span>
              <span className="eshot__phtitle">{s.t}</span>
              <span className="eshot__phnote">Ekran görüntüsü yakında</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Moduller ── */
const MODULES = [
  {
    id: '01', h: 'Portföy ve İlan Aktarımı',
    p: 'Sahibinden, Hürriyet Emlak ve Emlakjet ilanlarınızı URL ile içe aktarın; portföyünüz dakikalar içinde sisteme taşınsın.',
    list: ['Tek tıkla portal ilan aktarımı', 'Görsel portföy kartları ve hızlı filtreleme', 'İlan açıklamasında geçen tek kelimeyi bulma'],
  },
  {
    id: '02', h: 'Semantik Müşteri Eşleştirme',
    p: 'Müşteri talebini doğal dilde kaydedin; sistem anlamı yakalayarak en uygun portföyleri gerekçesiyle sıralar.',
    list: ['Dönüşüm olasılığı, risk skoru ve AI uyum puanı', 'Uyumsuzluk uyarısı ile yanlış eşleşmeyi önleme', '"Denize yakın, sakin" gibi ifadeleri anlama'],
  },
  {
    id: '03', h: 'Satış Akışı ve Takip',
    p: 'Talepten kapanışa kadar her adım Kanban üzerinde görünür; hiçbir fırsat unutulmaz.',
    list: ['Randevu ve gösterim takvimi', 'Otomatik hatırlatıcı ve takip planı', 'WhatsApp / e-posta ile ilan paylaşımı'],
  },
  {
    id: '04', h: 'AI İlan Üreteci',
    p: 'Portföyden bir mülk seçin; Sahibinden, Instagram ve WhatsApp için hazır metinler saniyeler içinde üretilsin.',
    list: ['Çoklu mecra için tek tıkla içerik', 'Hedef müşteriye göre kişiselleştirilmiş ton', 'WhatsApp kampanya şablonları'],
  },
  {
    id: '05', h: 'Yönetim ve Yetkilendirme',
    p: 'Rol bazlı erişim ile kimin neyi göreceğine yönetici karar verir.',
    list: ['Süper yönetici, acente yöneticisi, danışman, görüntüleyici', 'Acente verileri birbirinden izole', 'KVKK odaklı kişisel veri maskeleme'],
  },
  {
    id: '06', h: 'Raporlama ve İçgörü',
    p: 'Gelir, dönüşüm ve danışman performansı güncel olarak izlenir.',
    list: ['Gelir trendi ve satış hunisi', 'Danışman bazlı hedef takibi', 'Lead kaynak analizi'],
  },
]

/* ── Fiyat paketleri ── */
const PLANS = [
  {
    n: 'Starter', h: 'Küçük ekipler',
    p: 'Temel operasyonu tek merkeze taşımak isteyen butik acenteler için.',
    ul: ['10 kullanıcı', '500 ilan', 'Aylık 50.000 AI token', 'Tüm temel modüller'],
    cta: 'Pilot başlat',
  },
  {
    n: 'Professional', h: 'Büyüyen acenteler', best: true,
    p: 'Portföyü ve danışman ekibi hızla büyüyen emlak şirketleri için.',
    ul: ['25 kullanıcı', '2.500 ilan', 'Aylık 250.000 AI token', 'Gelişmiş raporlar ve yönetim'],
    cta: 'Demo talep et',
  },
  {
    n: 'Enterprise', h: 'Kurumsal yapı',
    p: 'Çok şubeli, özel entegrasyon ve yüksek ölçek ihtiyacı olan kurumlar için.',
    ul: ['Esnek kullanıcı', 'Esnek portföy limiti', 'Özel AI kullanım planı', 'Kuruma özel çözümler'],
    cta: 'Görüşelim',
  },
]

/* ── SSS ── */
const FAQS = [
  { q: 'Mevcut portföyümüzü sisteme nasıl aktarırız?',
    a: 'Excel ve CSV dosyalarınızı doğrudan içe aktarabilirsiniz. Pilot sürecinde portföy aktarımını birlikte yapıyor, alan eşleştirmesini sizin veri yapınıza göre ayarlıyoruz.' },
  { q: 'Müşteri verilerimiz güvende mi?',
    a: 'Her acentenin verisi birbirinden izole tutulur. İsim, telefon ve e-posta gibi kişisel bilgiler yapay zekâya gönderilmeden önce maskelenir. Rol bazlı yetkilendirme ile kimin neyi göreceğini yönetici belirler.' },
  { q: 'Yapay zekâ yanlış eşleştirme yaparsa ne olur?',
    a: 'Karar her zaman danışmanda kalır. Sistem önerir ve gerekçesini açıklar; danışman düzenler ve onaylar. Ayrıca şehir, mülk tipi ve bütçe gibi kritik uyumsuzluklar AI devreye girmeden önce elenir.' },
  { q: 'Ekibimizin teknik bilgisi yok, kullanabilir miyiz?',
    a: 'Evet. Arayüz danışmanın günlük iş akışına göre tasarlandı; teknik terim yerine emlak diliyle çalışır. Kurulum sonrası ekibinize eğitim veriyoruz.' },
  { q: 'Pilot süreç nasıl işliyor?',
    a: 'Önce operasyonunuzu birlikte inceliyoruz, ardından sınırlı bir ekiple pilot başlatıyoruz. Pilot süresince portföy aktarımı, eğitim ve süreç uyarlaması bizim tarafımızdan yürütülür.' },
  { q: 'AI kullanımı maliyeti nasıl kontrol ediliyor?',
    a: 'Ön eleme ve önbellekleme sayesinde her sorgu yapay zekâya gitmez. Paketlerde aylık token limiti tanımlıdır; kullanım paneliden şeffaf biçimde izlenir.' },
]

function Faq({ q, a, open, onToggle }) {
  return (
    <div className={`efaq${open ? ' efaq--on' : ''}`}>
      <button className="efaq__q" onClick={onToggle} aria-expanded={open}>
        {q}
        <span className="efaq__ico" />
      </button>
      <div className="efaq__a"><p>{a}</p></div>
    </div>
  )
}

const TRY = new Intl.NumberFormat('tr-TR')

/* ── ROI ── */
function Roi() {
  const [consultants, setConsultants] = useState(10)
  const [leads, setLeads] = useState(30)
  const [minutes, setMinutes] = useState(120)
  const [hourly, setHourly] = useState(400)

  const savedHours = Math.round((consultants * leads * minutes) / 60)
  const monthly = savedHours * hourly
  const yearly = monthly * 12
  const days = Math.round(savedHours / 8)

  return (
    <div className="eroi">
      <div className="eroi__ctrls">
        <div className="eroi__f">
          <label>Danışman sayısı <b>{consultants}</b></label>
          <input type="range" min="1" max="80" value={consultants} onChange={e => setConsultants(+e.target.value)} />
        </div>
        <div className="eroi__f">
          <label>Danışman başına aylık talep <b>{leads}</b></label>
          <input type="range" min="5" max="150" value={leads} onChange={e => setLeads(+e.target.value)} />
        </div>
        <div className="eroi__f">
          <label>Eşleştirme süresi <b>{minutes} dk</b></label>
          <input type="range" min="10" max="240" step="5" value={minutes} onChange={e => setMinutes(+e.target.value)} />
        </div>
        <div className="eroi__f">
          <label>Danışmanın saatlik değeri <b>₺{TRY.format(hourly)}</b></label>
          <input type="range" min="100" max="2000" step="50" value={hourly} onChange={e => setHourly(+e.target.value)} />
        </div>
      </div>

      <div className="eroi__out">
        <span className="eroi__lbl">Aylık tahmini zaman kazanımı</span>
        <div className="eroi__big">{TRY.format(savedHours)} saat</div>
        <p className="eroi__sub">≈ ₺{TRY.format(monthly)} değerinde zaman</p>
        <div className="eroi__div" />
        <div className="eroi__row">
          <span className="eroi__lbl">Yıllık karşılığı</span>
          <span className="eroi__rv">₺{TRY.format(yearly)}</span>
        </div>
        <div className="eroi__row">
          <span className="eroi__lbl">İş günü / ay</span>
          <span className="eroi__rv">{TRY.format(days)} gün</span>
        </div>
        <p className="eroi__note">
          Hesaplama yalnızca portföy arama süresini temel alır; takip, ilan üretimi, raporlama ve
          iletişim kazanımları dahil değildir.
        </p>
      </div>
    </div>
  )
}

/* ══════════════ SAYFA ══════════════ */
export default function EstateMatchPage({ goBack, onDemo }) {
  const [openFaq, setOpenFaq] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const demo = useCallback(() => {
    if (onDemo) onDemo()
    else goBack?.()
  }, [onDemo, goBack])

  return (
    <main className="epage">
      <div className="epage__progress" style={{ width: `${progress}%` }} />

      {/* ── HERO ── */}
      <section className="ehero">
        <div className="ehero__bg" />
        <div className="ehero__grid" />
        <div className="wrap">
          <button className="eback" onClick={goBack}>← Ana sayfaya dön</button>

          <div className="ehero__in">
            <div>
              <span className="ehero__eye"><i />EstateMatch AI · Real Estate Intelligence</span>
              <h1 className="ehero__h1">
                Portföylerinizi değil,<br /><em>fırsatlarınızı yönetin.</em>
              </h1>
              <p className="ehero__sub">
                Müşteri talebini anlayan, en doğru portföyü saniyenin altında bulan ve danışmana
                nedenini açıklayan emlak operasyon platformu.
              </p>
              <div className="ehero__ctas">
                <button className="ebtn ebtn--solid" onClick={demo}>Pilot başlat <span>→</span></button>
                <a className="ebtn ebtn--ghost" href="https://estate.sryverse.com" target="_blank" rel="noopener noreferrer">
                  Platformu aç <span>→</span>
                </a>
              </div>
            </div>

            <div className="ehero__3d"><EstateMatch3D /></div>
          </div>

          <div className="estrip">
            {[
              { v: '0.2 sn', l: 'ortalama eşleştirme' },
              { v: '%95', l: 'zaman tasarrufu' },
              { v: '4 rol', l: 'kontrollü erişim' },
              { v: '7/24', l: 'akıllı operasyon' },
            ].map((x, i) => (
              <div key={i} className="estrip__i">
                <div className="estrip__v"><Count value={x.v} /></div>
                <span className="estrip__l">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EKRAN TURU ── */}
      <section className="esec esec--tint">
        <div className="wrap">
          <Rev>
            <div className="esec__head">
              <span className="eeye">Ürün turu</span>
              <h2 className="eh2">Danışmanın bütün günü, <em>tek akışta.</em></h2>
              <p className="ep">
                Her modül ayrı bir araç değil; müşteri kazanımını hızlandıran aynı sistemin parçası.
              </p>
            </div>
          </Rev>
          <Rev delay={100}><ScreenTour /></Rev>
        </div>
      </section>

      {/* ── MODULLER ── */}
      <section className="esec">
        <div className="wrap">
          <Rev>
            <div className="esec__head">
              <span className="eeye">Yetenekler</span>
              <h2 className="eh2">Operasyonun her adımında <em>bir karşılığı var.</em></h2>
            </div>
          </Rev>
          <div className="emods">
            {MODULES.map((m, i) => (
              <Rev key={m.id} delay={i * 70}>
                <div className="emod">
                  <span className="emod__id">{m.id}</span>
                  <h3 className="emod__h">{m.h}</h3>
                  <p className="emod__p">{m.p}</p>
                  <ul className="emod__list">
                    {m.list.map((li, j) => <li key={j}>{li}</li>)}
                  </ul>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI ── */}
      <section className="esec esec--tint">
        <div className="wrap">
          <Rev>
            <div className="esec__head esec__head--mid">
              <span className="eeye">Kendi operasyonunuzla hesaplayın</span>
              <h2 className="eh2">Kazandırdığı <em>zamanı görün.</em></h2>
              <p className="ep">
                Değerleri değiştirin; yalnızca portföy eşleştirme süresinden doğan kazanımı anında hesaplayın.
              </p>
            </div>
          </Rev>
          <Rev delay={100}><Roi /></Rev>
        </div>
      </section>

      {/* ── FIYATLANDIRMA ── */}
      <section className="esec">
        <div className="wrap">
          <Rev>
            <div className="esec__head esec__head--mid">
              <span className="eeye">Büyümeye hazır</span>
              <h2 className="eh2">Ekibiniz neredeyse, <em>oradan başlayın.</em></h2>
            </div>
          </Rev>
          <div className="eplans">
            {PLANS.map((p, i) => (
              <Rev key={p.n} delay={i * 90}>
                <div className={`eplan${p.best ? ' eplan--best' : ''}`}>
                  {p.best && <span className="eplan__tag">En çok tercih edilen</span>}
                  <span className="eplan__n">{p.n}</span>
                  <h3 className="eplan__h">{p.h}</h3>
                  <p className="eplan__p">{p.p}</p>
                  <ul className="eplan__ul">
                    {p.ul.map((li, j) => <li key={j}>{li}</li>)}
                  </ul>
                  <button className="eplan__btn" onClick={demo}>{p.cta}</button>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS ── */}
      <section className="esec esec--tint">
        <div className="wrap">
          <Rev>
            <div className="esec__head esec__head--mid">
              <span className="eeye">Sık sorulanlar</span>
              <h2 className="eh2">Merak edilenler.</h2>
            </div>
          </Rev>
          <Rev delay={80}>
            <div className="efaqs">
              {FAQS.map((f, i) => (
                <Faq
                  key={i}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* ── KAPANIS ── */}
      <section className="esec">
        <div className="wrap">
          <Rev>
            <div className="ecta">
              <div className="ecta__glow" />
              <div className="ecta__in">
                <h2 className="ecta__h">
                  Emlak operasyonunuzun<br /><em>yeni işletim sistemi.</em>
                </h2>
                <p className="ecta__p">
                  Doğru müşteri. Doğru portföy. Doğru zaman. Pilot programa katılın, sürecinizi
                  birlikte kuralım.
                </p>
                <div className="ecta__row">
                  <button className="ebtn ebtn--solid" onClick={demo}>Pilot programa katıl <span>→</span></button>
                  <a
                    className="ebtn ebtn--ghost"
                    href="https://wa.me/905315178170?text=Merhaba%2C%20EstateMatch%20AI%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                    target="_blank" rel="noopener noreferrer"
                  >
                    WhatsApp'tan yazın <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </Rev>
        </div>
      </section>
    </main>
  )
}
