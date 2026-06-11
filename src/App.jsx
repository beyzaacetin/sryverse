import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import InteractiveCanvas from './components/InteractiveCanvas';
import AiSimulator from './components/AiSimulator';

/* ── Intersection Observer hook for scroll reveals ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Animated counter hook for numbers ── */
function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ── Magnetic effect hook for buttons ── */
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px) scale(1.03)`;
        el.style.boxShadow = '0 12px 30px rgba(7, 37, 30, 0.15)';
      } else {
        el.style.transform = 'translate(0px, 0px) scale(1)';
        el.style.boxShadow = '';
      }
    };

    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px) scale(1)';
      el.style.boxShadow = '';
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (el) el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

/* ── Cursor coordinate tracker for card border-glows ── */
function useCardGlow() {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty('--mouse-x', `${x}px`);
    ref.current.style.setProperty('--mouse-y', `${y}px`);
  }, []);
  return { ref, onMouseMove: onMove };
}

/* ── Translation Dictionary ── */
const DICT = {
  en: {
    navProducts: 'Products',
    navIntel: 'Intelligence Layer',
    navSolutions: 'Solutions',
    navVision: 'Vision',
    navContact: 'Contact',
    launchBtn: 'Launch Products',
    demoBtn: 'Request Demo',
    
    heroEyebrow: 'AI Products • Digital Transformation',
    heroH1Line1: 'Intelligent Software.',
    heroH1Line2: 'Real Transformation.',
    heroSub: 'SRYVERSE builds AI-powered products that transform complex operations into measurable outcomes.',
    heroExplore: 'Explore Products',
    heroDemo: 'Request Demo',
    
    proofProducts: 'Active AI Products',
    proofWorkflows: 'Workflows Automated',
    proofDecisions: 'Decisions Enhanced',
    proofUnified: 'Unified Platform',
    
    intelLayerTitle: 'Operational Intelligence Layer',
    intelLayerDesc: 'Hover/click below to see telemetry routing:',
    intelDataTitle: 'Raw Ingestion',
    intelIntelTitle: 'Neural Core',
    intelDecTitle: 'Inference Layer',
    intelActTitle: 'Execution Engine',
    intelImpTitle: 'Analytics Feed',
    
    statementLine1: 'Operations become systems.',
    statementLine2: 'Systems become products.',
    statementLine3: 'Products become ecosystems.',
    
    methodologyEyebrow: 'Methodology',
    methodologyTitle: 'From complexity to clarity at scale.',
    methodologySub: 'SRYVERSE builds intelligent products through a structured operational mapping process.',
    
    step1Title: 'Discover',
    step1Desc: 'Understand workflows and operational challenges.',
    step2Title: 'Model',
    step2Desc: 'Structure data and processes into intelligent models.',
    step3Title: 'Optimize',
    step3Desc: 'Identify bottlenecks and optimize decision points.',
    step4Title: 'Automate',
    step4Desc: 'Apply AI to automate repetitive and high-impact tasks.',
    step5Title: 'Scale',
    step5Desc: 'Deploy as a platform built to grow with your business.',
    
    cardLive: 'Live',
    cardSoon: 'Coming Soon',
    cardExplore: 'Explore',
    cardWaitlist: 'Join Waitlist',
    
    prodSkillName: 'SkillMatch AI',
    prodSkillSub: 'Recruitment Intelligence',
    prodSkillDesc: 'AI-powered recruitment platform that analyzes, matches, and optimizes hiring pipelines.',
    prodSkillF1: 'AI CV Analysis',
    prodSkillF2: 'Semantic Applicant Matching',
    prodSkillF3: 'Technical Agent Coordinator',
    
    prodEstateName: 'EstateMatch AI',
    prodEstateSub: 'Real Estate Intelligence',
    prodEstateDesc: 'AI-powered real estate platform that matches, analyzes, and maximizes property potential.',
    prodEstateF1: 'Dynamic Match Engine',
    prodEstateF2: 'Automated Listing Assistant',
    prodEstateF3: 'Client Requirement Mapper',
    
    prodCopilotName: 'SRYVERSE Copilot',
    prodCopilotSub: 'Business Intelligence Layer',
    prodCopilotDesc: 'Unified AI assistant layer for analytics, operations, and decision support.',
    prodCopilotF1: 'Predictive BI Copilot',
    prodCopilotF2: 'Workflow Orchestrator',
    prodCopilotF3: 'Automated Decision Logger',
    
    editorialEyebrow: 'Transformation',
    editorialTitle: 'Built for teams that run complex operations.',
    editorialC1B: 'Chaos',
    editorialC1A: 'Net Clarity',
    editorialC2B: 'Manual Execution',
    editorialC2A: 'Agentic Automation',
    editorialC3B: 'Scattered Data',
    editorialC3A: 'Structured Systems',
    editorialC4B: 'Delayed Decisions',
    editorialC4A: 'Real-Time Intelligence',
    
    metricsEyebrow: 'Scale Indicators',
    stackEyebrow: 'Infrastructure',
    stackTitle: 'Modern AI-native stack.',
    useCasesEyebrow: 'Deployment Sectors',
    useCasesTitle: 'Built for complex operations.',
    
    uc1Role: 'Recruitment Teams',
    uc1Desc: 'Hire the right talent, faster and smarter, using semantic resumes profiling.',
    uc2Role: 'Real Estate Agencies',
    uc2Desc: 'Match properties, clients, and opportunities automatically with zero overhead.',
    uc3Role: 'HR Departments',
    uc3Desc: 'Transform unstructured employee feedback into strategic growth metrics.',
    uc4Role: 'Operations Teams',
    uc4Desc: 'Map out manual bottlenecks and deploy self-operating workflow triggers.',
    uc5Role: 'Business Analysts',
    uc5Desc: 'Query complex enterprise datastores instantly with conversational BI agents.',
    uc6Role: 'Transformation Leaders',
    uc6Desc: 'Build the intelligent, self-organizing organization of tomorrow.',
    
    visionEyebrow: 'Future Vision',
    visionH2Line1: 'We don\'t build tools.',
    visionH2Line2: 'We build the operating layer of the future.',
    visionBody: 'SRYVERSE is building the intelligent infrastructure that helps businesses think, decide, and operate at the speed of tomorrow.',
    manifesto1: 'We simplify complexity.',
    manifesto2: 'We design unified systems.',
    manifesto3: 'We automate intelligence.',
    manifesto4: 'We scale high-impact products.',
    
    contactEyebrow: 'Get In Touch',
    contactTitle: 'Build your next intelligent workflow with us.',
    contactNote: 'Tell us about your operational bottleneck, and we\'ll show you how SRYVERSE solves it.',
    contactLabel1: 'Ecosystem',
    contactLabel2: 'SLA Response',
    contactVal2: 'Within 24 Hours',
    
    formName: 'Full Name',
    formCompany: 'Company',
    formEmail: 'Email',
    formInterest: 'Product of Interest',
    formSelectDefault: 'Select product...',
    formMessage: 'Message',
    formBtn: 'Request Demo',
    formLoading: 'Deploying Request...',
    formSentSuccess: 'Request Received.',
    formSentSub: 'Our engineering team will reach out within 24 hours.',
    
    footerTagline: 'AI Products. Operational Intelligence.'
  },
  tr: {
    navProducts: 'Ürünler',
    navIntel: 'Zeka Katmanı',
    navSolutions: 'Çözümler',
    navVision: 'Vizyon',
    navContact: 'İletişim',
    launchBtn: 'Ürünleri Aç',
    demoBtn: 'Demo Talep Et',
    
    heroEyebrow: 'AI Ürünleri • Dijital Dönüşüm',
    heroH1Line1: 'Akıllı Yazılım.',
    heroH1Line2: 'Gerçek Dönüşüm.',
    heroSub: 'SRYVERSE, karmaşık iş operasyonlarını ölçülebilir çıktılara dönüştüren yapay zeka destekli ürünler inşa eder.',
    heroExplore: 'Ürünleri Keşfet',
    heroDemo: 'Demo Talep Et',
    
    proofProducts: 'Aktif AI Ürünü',
    proofWorkflows: 'Otomatize Süreç',
    proofDecisions: 'Desteklenen Karar',
    proofUnified: 'Tek Birleşik Ekosistem',
    
    intelLayerTitle: 'Operasyonel Zeka Katmanı',
    intelLayerDesc: 'Canlı telemetri akışını görmek için üzerlerine gelin/tıklayın:',
    intelDataTitle: 'Ham Veri Girişi',
    intelIntelTitle: 'Yapay Sinir Çekirdeği',
    intelDecTitle: 'Karar Katmanı',
    intelActTitle: 'Yürütme Motoru',
    intelImpTitle: 'Analitik Çıktı',
    
    statementLine1: 'Operasyonlar sistemlere dönüşür.',
    statementLine2: 'Sistemler ürünlere dönüşür.',
    statementLine3: 'Ürünler ekosistemlere dönüşür.',
    
    methodologyEyebrow: 'Metodoloji',
    methodologyTitle: 'Karmaşıklıktan ölçeklenebilir netliğe.',
    methodologySub: 'SRYVERSE, yapılandırılmış bir operasyonel haritalama süreciyle akıllı ürünler geliştirir.',
    
    step1Title: 'Keşfet',
    step1Desc: 'İş akışlarını ve operasyonel zorlukları derinlemesine analiz et.',
    step2Title: 'Modelle',
    step2Desc: 'Süreçleri ve verileri akıllı makine öğrenimi modellerine dönüştür.',
    step3Title: 'Optimize Et',
    step3Desc: 'Darboğazları belirle ve karar aşamalarını en uygun hale getir.',
    step4Title: 'Otomatize Et',
    step4Desc: 'Yüksek etkili ve tekrarlayan işleri yapay zekaya devret.',
    step5Title: 'Ölçeklendir',
    step5Desc: 'İşinizle birlikte büyümek üzere tasarlanmış bulut platformu olarak dağıt.',
    
    cardLive: 'Aktif',
    cardSoon: 'Yakında',
    cardExplore: 'Keşfet',
    cardWaitlist: 'Bekleme Listesine Katıl',
    
    prodSkillName: 'SkillMatch AI',
    prodSkillSub: 'İşe Alım Zekası',
    prodSkillDesc: 'Özgeçmiş analizini, aday eşleştirmesini ve teknik değerlendirmeleri yöneten yapay zeka platformu.',
    prodSkillF1: 'Yapay Zeka Özgeçmiş Analitiği',
    prodSkillF2: 'Semantik Aday Eşleştirme',
    prodSkillF3: 'Teknik Ajan Koordinasyonu',
    
    prodEstateName: 'EstateMatch AI',
    prodEstateSub: 'Gayrimenkul Zekası',
    prodEstateDesc: 'Müşteri taleplerini, ilanları eşleştiren ve mülk potansiyelini maksimize eden AI platformu.',
    prodEstateF1: 'Dinamik Eşleştirme Motoru',
    prodEstateF2: 'Otomatik İlan Asistanı',
    prodEstateF3: 'Müşteri İhtiyaç Eşleştiricisi',
    
    prodCopilotName: 'SRYVERSE Copilot',
    prodCopilotSub: 'İş Zekası Katmanı',
    prodCopilotDesc: 'Analitik, günlük operasyonlar ve karar desteği için birleşik yapay zeka asistanı.',
    prodCopilotF1: 'Öngörücü İş Zekası Kopilotu',
    prodCopilotF2: 'İş Akışı Yöneticisi',
    prodCopilotF3: 'Otomatik Karar Günlüğü',
    
    editorialEyebrow: 'Dönüşüm',
    editorialTitle: 'Karmaşık operasyonlar yöneten ekipler için.',
    editorialC1B: 'Kaos',
    editorialC1A: 'Net Netlik',
    editorialC2B: 'Manuel Yürütme',
    editorialC2A: 'Ajanlı Otomasyon',
    editorialC3B: 'Dağınık Veri',
    editorialC3A: 'Yapılandırılmış Sistem',
    editorialC4B: 'Gecikmiş Kararlar',
    editorialC4A: 'Gerçek Zamanlı Zeka',
    
    metricsEyebrow: 'Ölçek Göstergeleri',
    stackEyebrow: 'Teknoloji Altyapısı',
    stackTitle: 'Modern AI-native stack.',
    useCasesEyebrow: 'Kullanım Alanları',
    useCasesTitle: 'Karmaşık süreçleri yönetenler için.',
    
    uc1Role: 'İşe Alım Ekipleri',
    uc1Desc: 'Yüksek hacimli aday başvurularını semantik CV profilleme ile akıllıca filtreleyin.',
    uc2Role: 'Gayrimenkul Danışmanları',
    uc2Desc: 'Müşteri profillerini ve ilanları sıfır zaman kaybıyla eşleştirin.',
    uc3Role: 'İK Departmanları',
    uc3Desc: 'Yapılandırılmamış çalışan geri bildirimlerini stratejik raporlara dönüştürün.',
    uc4Role: 'Operasyon Ekipleri',
    uc4Desc: 'Manuel iş adımlarını haritalayın ve kendi kendine çalışan otomasyonları tetikleyin.',
    uc5Role: 'İş Analistleri',
    uc5Desc: 'Veri ambarlarını yapay zeka sorgu ajanlarıyla anında raporlayın.',
    uc6Role: 'Dönüşüm Liderleri',
    uc6Desc: 'Yarını bugünden yöneten, akıllı ve kendi kendine optimize olan yapılar kurun.',
    
    visionEyebrow: 'Gelecek Vizyonu',
    visionH2Line1: 'Araçlar geliştirmiyoruz.',
    visionH2Line2: 'Geleceğin işletim sistemini inşa ediyoruz.',
    visionBody: 'SRYVERSE, şirketlerin yarının hızında düşünmesine, karar vermesine ve çalışmasına olanak tanıyan akıllı altyapıyı geliştiriyor.',
    manifesto1: 'Karmaşıklığı basitleştiriyoruz.',
    manifesto2: 'Bütünleşik sistemler tasarlıyoruz.',
    manifesto3: 'Zekayı otomatize ediyoruz.',
    manifesto4: 'Yüksek etkili ürünleri ölçeklendiriyoruz.',
    
    contactEyebrow: 'Bize Ulaşın',
    contactTitle: 'Bir sonraki akıllı iş akışınızı birlikte kuralım.',
    contactNote: 'Süreçlerinizdeki operasyonel darboğazları anlatın, SRYVERSE\'in bunları nasıl çözeceğini gösterelim.',
    contactLabel1: 'Ekosistem',
    contactLabel2: 'Geri Dönüş Süresi',
    contactVal2: '24 Saat İçinde',
    
    formName: 'Ad Soyad',
    formCompany: 'Şirket Adı',
    formEmail: 'E-posta Adresi',
    formInterest: 'İlgilendiğiniz Ürün',
    formSelectDefault: 'Seçiniz...',
    formMessage: 'Mesajınız',
    formBtn: 'Demo Talep Et',
    formLoading: 'İstek Gönderiliyor...',
    formSentSuccess: 'Talebiniz Alındı.',
    formSentSub: 'Mühendislik ekibimiz 24 saat içinde sizinle iletişime geçecektir.',
    
    footerTagline: 'Yapay Zeka Ürünleri. Operasyonel Zeka.'
  }
};

/* ── Interactive Operational Intelligence dashboard ── */
function OperationalIntelligenceDashboard({ lang }) {
  const [activeTab, setActiveTab] = useState('data');
  const t = DICT[lang];

  const dataLogs = {
    data: {
      title: t.intelDataTitle,
      subtitle: lang === 'tr' ? 'Ham Veri Entegrasyonu' : 'Heterogeneous Data Pipeline',
      status: 'ONLINE',
      metric: '4.2 MB/s',
      lines: lang === 'tr' ? [
        'POST /v1/ingest/cv - 200 OK (38ms)',
        'Sözleşme PDF ayrıştırılıyor (2.1 MB)',
        'Yazım hataları temizleniyor ve JSON formatına dönüştürülüyor',
        'Vektör veritabanı buffer kuyruğuna yazıldı (Node: INGEST-09)'
      ] : [
        'POST /v1/ingest/cv - 200 OK (38ms)',
        'Parsing PDF contract schema (2.1 MB)',
        'Stripping whitespace & generating document embeddings chunk...',
        'Wrote raw string to buffer database (Node: INGEST-09)'
      ]
    },
    intel: {
      title: t.intelIntelTitle,
      subtitle: lang === 'tr' ? 'Semantik Ajan Motoru' : 'LLM Vector Space Routing',
      status: 'PROCESSING',
      metric: '124 GigaFLOPs',
      lines: lang === 'tr' ? [
        'Sorgu semantik vektöre çevriliyor (Dim: 1536)',
        'Gemini-Pro-Agent bağlam parametreleri yüklendi',
        'Yetenek kümeleme analizi yapılıyor (K-means k=8)',
        'Gömülü vektör eşleşme yakınlığı sorgulanıyor'
      ] : [
        'Encoding string to dense float vector (Dim: 1536)',
        'Loaded Gemini-Pro-Agent context parameters',
        'Executing clustering algorithm (K-means k=8)',
        'Measuring cosine distance across talent matrix'
      ]
    },
    decision: {
      title: t.intelDecTitle,
      subtitle: lang === 'tr' ? 'Yapay Zeka Mantık Katmanı' : 'Confidence Scoring Layer',
      status: 'RESOLVED',
      metric: 'Conf. 94.6%',
      lines: lang === 'tr' ? [
        'Aday eşleşme güven skoru hesaplandı: 0.946',
        'Zorunlu kısıt kontrolü: Evcil hayvan izni = UYUMSUZ',
        'Alternatif portföy taraması tetikleniyor',
        'Eylem yürütücü (Automation Trigger) tetikleme sırasına alındı'
      ] : [
        'Match confidence output completed: 0.946',
        'Constraint check: Pet Policy validation = FAILED',
        'Triggering alternative listings sub-pipeline query',
        'Enqueued execution dispatch command to system bus'
      ]
    },
    action: {
      title: t.intelActTitle,
      subtitle: lang === 'tr' ? 'Otomasyon ve API Entegrasyonu' : 'Distributed Webhook Dispatches',
      status: 'DISPATCHED',
      metric: 'Latency: 12ms',
      lines: lang === 'tr' ? [
        'WhatsApp API ile mülk broşürü gönderimi yapıldı',
        'Aday mülakat takvimi daveti gönderildi (SendGrid)',
        'CRM aday statüsü "Stage 1: Technical" olarak güncellendi',
        'Slack bildirim kanalı güncellendi: #sryverse-pipeline'
      ] : [
        'WhatsApp API outbound property PDF catalog sent successfully',
        'Sent technical coordinator calendar invite (SendGrid)',
        'Patched applicant pipeline status to "Stage 1: Technical" in CRM',
        'Slack alert dispatched to #sryverse-pipeline-feed'
      ]
    },
    impact: {
      title: t.intelImpTitle,
      subtitle: lang === 'tr' ? 'Operasyonel KPI Raporu' : 'Telemetry Analytics Feed',
      status: 'MONITORING',
      metric: 'Overhead: -30%',
      lines: lang === 'tr' ? [
        'İşe alım süreci hızı: +%42 artış saptandı',
        'Operasyonel harcama verimliliği: -%30 tasarruf',
        'Toplam tetiklenen akış sayısı: 142,391',
        'Hata/Sürtünme oranı: %0.012 (Nominal limitler dahilinde)'
      ] : [
        'Recruitment cycle velocity: +42% improvement detected',
        'Operations overhead expenditure: -30% reduction',
        'Total automated runs processed this month: 142,391',
        'System failure rate: 0.012% (Within nominal parameters)'
      ]
    }
  };

  const activeData = dataLogs[activeTab];

  return (
    <div className="intel-dashboard">
      <div className="intel-dashboard__header">
        <h4>{t.intelLayerTitle}</h4>
        <p>{t.intelLayerDesc}</p>
      </div>

      {/* Node buttons */}
      <div className="intel-dashboard__nodes">
        {Object.keys(dataLogs).map((key, idx) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`intel-node-btn ${activeTab === key ? 'intel-node-btn--active' : ''}`}
          >
            <span className="intel-node-number">0{idx + 1}</span>
            <span className="intel-node-name">{dataLogs[key].title}</span>
          </button>
        ))}
      </div>

      {/* Screen Display */}
      <div className="intel-screen">
        <div className="intel-screen__top">
          <div className="intel-screen__title-group">
            <span className="intel-screen__label">{activeData.title}</span>
            <span className="intel-screen__sublabel">{activeData.subtitle}</span>
          </div>
          <div className="intel-screen__stats">
            <span className={`intel-status-pill intel-status-pill--${activeData.status.toLowerCase()}`}>
              {activeData.status}
            </span>
            <span className="intel-metric-pill">{activeData.metric}</span>
          </div>
        </div>

        <div className="intel-screen__terminal">
          {activeData.lines.map((line, idx) => (
            <div key={idx} className="intel-terminal-line">
              <span className="intel-terminal-caret">&gt;&gt;</span>
              <span>{line}</span>
            </div>
          ))}
          <div className="intel-terminal-cursor" />
        </div>
      </div>
    </div>
  );
}

/* ── Metric Display ── */
function Metric({ value, suffix, label, active }) {
  const count = useCounter(value, active);
  return (
    <div className="metric">
      <div className="metric__value">{count}{suffix}</div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

/* ── Contact Form ── */
function ContactForm({ lang }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = DICT[lang];

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  const btnRef = useMagnetic(0.25);

  if (sent) {
    return (
      <div className="form-sent">
        <div className="form-sent__check">✓</div>
        <p className="form-sent__title">{t.formSentSuccess}</p>
        <p className="form-sent__sub">{t.formSentSub}</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={submit}>
      <div className="cform__row">
        <div className="cform__field">
          <label>{t.formName}</label>
          <input type="text" placeholder={lang === 'tr' ? 'Adınız Soyadınız' : 'Your name'} required />
        </div>
        <div className="cform__field">
          <label>{t.formCompany}</label>
          <input type="text" placeholder={lang === 'tr' ? 'Şirket adı' : 'Company name'} required />
        </div>
      </div>
      <div className="cform__field">
        <label>{t.formEmail}</label>
        <input type="email" placeholder="name@company.com" required />
      </div>
      <div className="cform__field">
        <label>{t.formInterest}</label>
        <select required defaultValue="">
          <option value="" disabled>{t.formSelectDefault}</option>
          <option>SkillMatch AI</option>
          <option>EstateMatch AI</option>
          <option>SRYVERSE Copilot</option>
          <option>{lang === 'tr' ? 'Özel Çözüm Entegrasyonu' : 'Custom Solutions'}</option>
        </select>
      </div>
      <div className="cform__field">
        <label>{t.formMessage}</label>
        <textarea
          rows={4}
          placeholder={lang === 'tr' ? 'Geliştirmek istediğiniz süreç veya darboğaz hakkında bilgi verin...' : 'Describe your operational process or bottleneck...'}
          required
        />
      </div>
      <button
        ref={btnRef}
        type="submit"
        className={`cform__btn ${loading ? 'cform__btn--loading' : ''}`}
        disabled={loading}
      >
        {loading ? t.formLoading : `${t.formBtn} →`}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════
   MAIN APPLICATION
   ══════════════════════════════════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [metricsRef, metricsVisible] = useReveal(0.3);
  const [lang, setLang] = useState('en');

  const t = DICT[lang];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Card cursor glow hooks
  const glowSkill = useCardGlow();
  const glowEstate = useCardGlow();
  const glowCopilot = useCardGlow();

  // Magnetic CTA hooks
  const magHeroPrimary = useMagnetic(0.35);
  const magHeroSecondary = useMagnetic(0.2);

  const products = [
    {
      key: 'skill',
      name: t.prodSkillName,
      sub: t.prodSkillSub,
      live: true,
      url: 'https://skillmatch.sryverse.com',
      desc: t.prodSkillDesc,
      features: [t.prodSkillF1, t.prodSkillF2, t.prodSkillF3],
      glowHook: glowSkill
    },
    {
      key: 'estate',
      name: t.prodEstateName,
      sub: t.prodEstateSub,
      live: true,
      url: 'https://estate.sryverse.com',
      desc: t.prodEstateDesc,
      features: [t.prodEstateF1, t.prodEstateF2, t.prodEstateF3],
      glowHook: glowEstate
    },
    {
      key: 'copilot',
      name: t.prodCopilotName,
      sub: t.prodCopilotSub,
      live: false,
      url: null,
      desc: t.prodCopilotDesc,
      features: [t.prodCopilotF1, t.prodCopilotF2, t.prodCopilotF3],
      glowHook: glowCopilot
    }
  ];

  const navItems = [
    { label: t.navProducts, href: '#products' },
    { label: t.navIntel, href: '#intelligence' },
    { label: t.navSolutions, href: '#transformation' },
    { label: t.navVision, href: '#vision' },
    { label: t.navContact, href: '#contact' }
  ];

  return (
    <div className="site">
      {/* Dynamic Canvas Background */}
      <InteractiveCanvas />

      {/* ── HEADER ── */}
      <header className={`header ${scrollY > 30 ? 'header--solid' : ''}`}>
        <div className="header__inner">
          <a href="/" className="header__logo" aria-label="SRYVERSE">
            <img src="/sryverse-logo.png" alt="SRYVERSE" className="header__logo-img" />
          </a>
          
          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="header__nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            {/* Bilingual Toggle */}
            <div className="lang-switcher">
              <button
                className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <span className="lang-divider">|</span>
              <button
                className={`lang-btn ${lang === 'tr' ? 'lang-btn--active' : ''}`}
                onClick={() => setLang('tr')}
              >
                TR
              </button>
            </div>

            <a href="#products" className="hbtn hbtn--ghost">{t.launchBtn}</a>
            <a href="#contact" className="hbtn hbtn--solid">{t.demoBtn}</a>
          </div>

          <button
            className={`burger ${menuOpen ? 'burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero__bg-lines" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="hero__bg-line" />
            ))}
          </div>
          
          <div className="hero__inner wrap">
            <div className="hero__content">
              <div className="hero__eyebrow">
                <span className="eyebrow-dot" />
                {t.heroEyebrow}
              </div>
              <h1 className="hero__h1">
                {t.heroH1Line1}
                <br />
                <em>{t.heroH1Line2}</em>
              </h1>
              <p className="hero__sub">{t.heroSub}</p>
              
              <div className="hero__ctas">
                <a
                  ref={magHeroPrimary}
                  href="#products"
                  className="cta cta--primary"
                >
                  {t.heroExplore}
                </a>
                <a
                  ref={magHeroSecondary}
                  href="#contact"
                  className="cta cta--text"
                >
                  {t.heroDemo} <span className="cta__arrow">→</span>
                </a>
              </div>
              
              <div className="hero__proof">
                <div className="hero__proof-item">
                  <span className="hero__proof-num">2</span>
                  <span className="hero__proof-label">{t.proofProducts}</span>
                </div>
                <div className="hero__proof-divider" />
                <div className="hero__proof-item">
                  <span className="hero__proof-num">10+</span>
                  <span className="hero__proof-label">{t.proofWorkflows}</span>
                </div>
                <div className="hero__proof-divider" />
                <div className="hero__proof-item">
                  <span className="hero__proof-num">100K+</span>
                  <span className="hero__proof-label">{t.proofDecisions}</span>
                </div>
              </div>
            </div>

            {/* Interactive Operations Dashboard Visualizer */}
            <div className="hero__viz">
              <OperationalIntelligenceDashboard lang={lang} />
            </div>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true">
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── STATEMENT ── */}
        <section className="statement">
          <div className="wrap">
            <div className="statement__inner">
              <p className="statement__text">
                {t.statementLine1}
                <br />
                {t.statementLine2}
                <br />
                <em>{t.statementLine3}</em>
              </p>
              <div className="statement__line" />
            </div>
          </div>
        </section>

        {/* ── HOW WE WORK / METHODOLOGY ── */}
        <section className="section" id="intelligence">
          <div className="wrap">
            <div className="section__header" data-align="left">
              <span className="eyebrow-label">{t.methodologyEyebrow}</span>
              <h2 className="section__h2">
                {lang === 'tr' ? 'Karmaşıklıktan' : 'From complexity'}
                <br />
                <em>{lang === 'tr' ? 'netliğe ölçekte.' : 'to clarity at scale.'}</em>
              </h2>
              <p className="section__sub">{t.methodologySub}</p>
            </div>

            {/* Scrolling progress timeline */}
            <div className="intelligence-track revealed">
              {[
                { id: '01', title: t.step1Title, desc: t.step1Desc },
                { id: '02', title: t.step2Title, desc: t.step2Desc },
                { id: '03', title: t.step3Title, desc: t.step3Desc },
                { id: '04', title: t.step4Title, desc: t.step4Desc },
                { id: '05', title: t.step5Title, desc: t.step5Desc }
              ].map((s, i) => (
                <div key={s.id} className="track-step" style={{ opacity: 1, transform: 'translateY(0)', transitionDelay: `${i * 0.1}s` }}>
                  <div className="track-step__id">{s.id}</div>
                  <div className="track-step__bar">
                    <div className="track-step__fill" style={{ width: `${100 - i * 15}%` }} />
                  </div>
                  <div className="track-step__text">
                    <span className="track-step__tr">{s.title}</span>
                  </div>
                  <p className="track-step__desc">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="intel-cards">
              {[
                { icon: '◈', title: lang === 'tr' ? 'Süreç Analitiği' : 'Process Analytics', desc: lang === 'tr' ? 'Dağınık iş akışlarını net, ölçülebilir sistemlere haritalandırıyoruz.' : 'Map disjointed operational steps into transparent digital pipelines.' },
                { icon: '◎', title: lang === 'tr' ? 'AI Karar Ajanları' : 'AI Decision Agents', desc: lang === 'tr' ? 'Tekrarlayan manuel kararları zeki LLM kararlarına devrediyoruz.' : 'Hand over repetitive manual constraints check to AI agents.' },
                { icon: '⬡', title: lang === 'tr' ? 'Ölçeklenebilir SaaS' : 'Scalable SaaS Architecture', desc: lang === 'tr' ? 'Her sistem bulut altyapısında esnekçe çalışmak üzere kurulur.' : 'Built cloud-native from day one, preparing your pipelines to scale.' },
                { icon: '◇', title: lang === 'tr' ? 'Ölçülebilir Sonuç' : 'Tangible Cost Efficiency', desc: lang === 'tr' ? 'Zaman kaybını önleyerek verimlilik odaklı özellikler sunuyoruz.' : 'Every module is benchmarked to reduce cost and processing latency.' }
              ].map((c, i) => (
                <div key={i} className="intel-card">
                  <div className="intel-card__icon">{c.icon}</div>
                  <h4 className="intel-card__title">{c.title}</h4>
                  <p className="intel-card__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT ECOSYSTEM ── */}
        <section className="section section--sage" id="products">
          <div className="wrap">
            <div className="section__header">
              <span className="eyebrow-label">{lang === 'tr' ? 'Ürün Ekosistemi' : 'Product Ecosystem'}</span>
              <h2 className="section__h2">
                {lang === 'tr' ? 'Birleşik Ekosistem.' : 'One ecosystem.'}
                <br />
                <em>{lang === 'tr' ? 'Çok Sayıda AI Çözümü.' : 'Multiple AI applications.'}</em>
              </h2>
            </div>
            
            <div className="products-grid">
              {products.map((p) => (
                <div
                  key={p.key}
                  className={`product-card product-card--${p.key}`}
                  ref={p.glowHook.ref}
                  onMouseMove={p.glowHook.onMouseMove}
                >
                  <div className="product-card__top">
                    <div className="product-card__status">
                      <span className={`status-dot ${p.live ? 'status-dot--live' : ''}`} />
                      <span>{p.live ? t.cardLive : t.cardSoon}</span>
                    </div>
                    <div className="product-card__meta">
                      <h3 className="product-card__name">{p.name}</h3>
                      <span className="product-card__by">{p.sub}</span>
                    </div>
                  </div>
                  
                  <p className="product-card__desc">{p.desc}</p>
                  
                  <ul className="product-card__features">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  
                  <div className="product-card__footer">
                    {p.live ? (
                      <a
                        href={p.url}
                        className="product-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.cardExplore} <span>→</span>
                      </a>
                    ) : (
                      <button className="product-cta product-cta--ghost">
                        {t.cardWaitlist} <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Live AI Simulator Panel */}
            <div className="product-simulator-wrapper">
              <AiSimulator lang={lang} />
            </div>
          </div>
        </section>

        {/* ── TRANSFORMATION EDITORIAL ── */}
        <section className="section editorial" id="transformation">
          <div className="wrap">
            <div className="editorial__grid">
              <div className="editorial__left">
                <span className="eyebrow-label">{t.editorialEyebrow}</span>
                <h2 className="editorial__h2">
                  {lang === 'tr' ? 'Sadece yazılım' : 'Not just software.'}
                  <br />
                  {lang === 'tr' ? 'değil.' : ''}
                  <br />
                  <em>{lang === 'tr' ? 'Operasyonel dönüşüm.' : 'Operational transformation.'}</em>
                </h2>
              </div>
              
              <div className="editorial__right">
                {[
                  { before: t.editorialC1B, after: t.editorialC1A },
                  { before: t.editorialC2B, after: t.editorialC2A },
                  { before: t.editorialC3B, after: t.editorialC3A },
                  { before: t.editorialC4B, after: t.editorialC4A }
                ].map((item, i) => (
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
            <div className="section__header">
              <span className="eyebrow-label eyebrow-label--light">{t.metricsEyebrow}</span>
            </div>
            <div className="metrics-grid">
              <Metric value={2} suffix="" label={t.proofProducts} active={metricsVisible} />
              <Metric value={10} suffix="+" label={t.proofWorkflows} active={metricsVisible} />
              <Metric value={100} suffix="K+" label={t.proofDecisions} active={metricsVisible} />
              <Metric value={1} suffix="" label={t.proofUnified} active={metricsVisible} />
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="section">
          <div className="wrap">
            <div className="section__header">
              <span className="eyebrow-label">{t.stackEyebrow}</span>
              <h2 className="section__h2">
                {lang === 'tr' ? 'Akıllı ve Yerel' : 'Modern and'}
                <br />
                <em>{lang === 'tr' ? 'yapay zeka altyapısı.' : 'AI-native stack.'}</em>
              </h2>
            </div>
            
            <div className="stack-grid">
              {[
                ['LLM & Agents', 'gemini-pro · openai-gpt4'],
                ['Python Backend', 'fastapi · celery · async'],
                ['Frontend Application', 'react · vite · vanilla css'],
                ['Relational Vector DB', 'postgresql · pgvector'],
                ['Edge Deployments', 'railway · vercel edge'],
                ['Secure Buckets', 'supabase storage buckets'],
                ['Orchestration Layer', 'langchain · custom agents']
              ].map(([name, sub], i) => (
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
              <span className="eyebrow-label">{t.useCasesEyebrow}</span>
              <h2 className="section__h2">
                {t.useCasesTitle}
              </h2>
            </div>
            
            <div className="cases-grid">
              {[
                { role: t.uc1Role, desc: t.uc1Desc },
                { role: t.uc2Role, desc: t.uc2Desc },
                { role: t.uc3Role, desc: t.uc3Desc },
                { role: t.uc4Role, desc: t.uc4Desc },
                { role: t.uc5Role, desc: t.uc5Desc },
                { role: t.uc6Role, desc: t.uc6Desc }
              ].map((c, i) => (
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
              <span className="eyebrow-label eyebrow-label--light">{t.visionEyebrow}</span>
              <h2 className="vision__h2">{t.visionH2Line1}</h2>
              <h2 className="vision__h2 vision__h2--em">
                <em>{t.visionH2Line2}</em>
              </h2>
              <p className="vision__body">{t.visionBody}</p>
              
              <div className="manifesto">
                {[
                  t.manifesto1,
                  t.manifesto2,
                  t.manifesto3,
                  t.manifesto4
                ].map((line, i) => (
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
                <span className="eyebrow-label">{t.contactEyebrow}</span>
                <h2 className="contact-left__h2">
                  {t.contactTitle}
                </h2>
                <p className="contact-left__note">{t.contactNote}</p>
                
                <div className="contact-left__items">
                  <div className="contact-info">
                    <span className="contact-info__label">{t.contactLabel1}</span>
                    <span className="contact-info__val">sryverse.com</span>
                  </div>
                  <div className="contact-info">
                    <span className="contact-info__label">{t.contactLabel2}</span>
                    <span className="contact-info__val">{t.contactVal2}</span>
                  </div>
                </div>
              </div>
              
              <div className="contact-right">
                <ContactForm lang={lang} />
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
              <img src="/sryverse-logo.png" alt="SRYVERSE" className="footer__logo" />
              <p className="footer__tagline">{t.footerTagline}</p>
            </div>
            
            <div className="footer__links">
              <div className="footer__col">
                <h5>{lang === 'tr' ? 'Ürünler' : 'Products'}</h5>
                <a href="https://skillmatch.sryverse.com" target="_blank" rel="noopener noreferrer">SkillMatch AI</a>
                <a href="https://estate.sryverse.com" target="_blank" rel="noopener noreferrer">EstateMatch AI</a>
                <a href="#contact">SRYVERSE Copilot</a>
              </div>
              <div className="footer__col">
                <h5>{lang === 'tr' ? 'Şirket' : 'Company'}</h5>
                <a href="#vision">{t.navVision}</a>
                <a href="#intelligence">{t.navIntel}</a>
                <a href="#contact">{t.navContact}</a>
              </div>
              <div className="footer__col">
                <h5>{lang === 'tr' ? 'Sosyal' : 'Connect'}</h5>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
          
          <div className="footer__bottom">
            <span>© 2026 SRYVERSE. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</span>
            <span className="footer__mono">{lang === 'tr' ? 'Geleceğin işletim sistemi.' : 'The operating layer of the future.'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
