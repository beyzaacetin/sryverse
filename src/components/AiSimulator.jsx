import { useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: {
    title: 'AI Product Simulator',
    subtitle: 'Interact with SRYVERSE\'s intelligence layer in real time. Choose a product and run a simulation.',
    tabSkill: 'SkillMatch AI',
    tabEstate: 'EstateMatch AI',
    tabCopilot: 'SRYVERSE Copilot',
    
    // SkillMatch Copy
    skillPresetLabel: 'Select Preset Candidate & Job:',
    skillCandidateLabel: 'Candidate CV / Profile Summary:',
    skillJobLabel: 'Job Description / Requirements:',
    skillCandidatePlaceholder: 'Paste candidate resume text or experience details...',
    skillJobPlaceholder: 'Paste job requirements and criteria...',
    runBtn: 'Analyze Match Vector',
    processing: 'Processing AI Vectors...',
    
    // EstateMatch Copy
    estatePresetLabel: 'Select Preset Client & Listing:',
    estateClientLabel: 'Buyer / Tenant Search Criteria:',
    estatePropertyLabel: 'Property Listing Details:',
    estateClientPlaceholder: 'Describe what the client is looking for...',
    estatePropertyPlaceholder: 'Describe the property, location, price, and specs...',
    
    // Copilot Copy
    copilotPresetLabel: 'Select Preset Business Prompt:',
    copilotQueryLabel: 'Enterprise BI / Operations Query:',
    copilotPlaceholder: 'Type a query (e.g., "Analyze department performance and highlight bottlenecks")...',
    
    // Console / Logs
    consoleHeader: 'SRYVERSE Operations Console',
    runPrompt: 'Press button to start AI pipeline analysis...',
    complete: 'Analysis Complete!',
    
    // Report
    scoreLabel: 'Match Relevance',
    dispatchedAction: 'Dispatched Automation Action',
    strengthsTitle: 'Semantic Alignment',
    gapsTitle: 'Identified Gaps / Risks',
    
    // Skill Presets
    presetsSkill: [
      {
        name: 'Senior React Developer (High Match)',
        candidate: 'Ahmet Yilmaz\n- 6 years frontend development experience.\n- Expert in React, Redux, Next.js, and TypeScript.\n- Strong background in Webpack, Vite, and performance optimization.\n- Familiar with Node.js and REST APIs.',
        job: 'Senior Frontend Engineer\n- 5+ years experience building web applications.\n- Advanced proficiency in React.js and TypeScript.\n- Experience optimizing core web vitals and bundle sizes.\n- Collaborative worker with agile teams.',
        score: 95,
        strengths: ['Exceeds experience criteria (6 yrs vs 5+ yrs requirement)', 'Deep expertise in React, Next.js, TypeScript', 'Proven optimization skills (Vite, Webpack, Core Web Vitals)'],
        gaps: ['Node.js experience is noted but not required for this frontend role'],
        action: 'Pipeline Update: Sent automated interview invite email to Ahmet. Moved to Stage 1 Technical Review.'
      },
      {
        name: 'Junior Data Scientist (Low Match)',
        candidate: 'Selin Kaya\n- Recent bootcamp graduate.\n- Basic Python, SQL, and HTML/CSS knowledge.\n- Projects with Pandas and Matplotlib.\n- Eager to learn machine learning models.',
        job: 'Lead Machine Learning Research Scientist\n- Ph.D. or Masters in Computer Science or Mathematics.\n- 5+ years industrial experience with PyTorch, TensorFlow, LLMs.\n- Authored papers in top-tier ML conferences (NeurIPS, CVPR).\n- System design experience for large scale distributed training.',
        score: 32,
        strengths: ['Basic Python programming', 'Bootcamp project portfolio'],
        gaps: ['Lacks Ph.D./Master\'s degree requirement', 'No professional ML system design experience', 'Bootcamp level vs 5+ years Lead level expectation'],
        action: 'Pipeline Update: Added Selin to Talent Pool database for future internships/junior roles. Automated thank-you email sent.'
      }
    ],

    // Estate Presets
    presetsEstate: [
      {
        name: 'Luxury Villa Buyer (High Match)',
        candidate: 'Can Demir\n- Budget: $2,500,000.\n- Looking for a 4+ bedroom villa in Bodrum or Cesme.\n- Demands private pool, sea view, and high security.\n- Cash buyer, ready to sign within 2 weeks.',
        job: 'Seafront Mansion in Bodrum\n- 5 Bedrooms, 6 Bathrooms, Bodrum Yalikavak.\n- Private infinity pool, panoramic sea view, smart home automation, gated community security.\n- Price: $2,400,000.\n- Fully furnished.',
        score: 98,
        strengths: ['Budget matches property price ($2.5M budget vs $2.4M price)', 'Exact location matched (Bodrum)', 'Matches amenities (infinity pool, sea view, high security)'],
        gaps: ['None. Excellent alignment.'],
        action: 'Automation Dispatched: Multi-media property PDF sent via WhatsApp. Scheduled private viewing with agent.'
      },
      {
        name: 'City Studio Tenant (Partial Match)',
        candidate: 'Merve Ozturk\n- Budget: $1,200/month.\n- Looking for a furnished studio apartment in central Istanbul.\n- Needs close proximity to Metro line.\n- Pet-friendly building is mandatory (owns a cat).',
        job: 'Modern 1+1 Flat in Sisli\n- 1 Bedroom flat, Sisli, Istanbul.\n- Furnished, 5-minute walk to Metro.\n- Price: $1,100/month.\n- Strictly NO pets allowed policy.',
        score: 64,
        strengths: ['Budget fits ($1,100/mo vs $1,200/mo)', 'Location and Metro access match perfectly', 'Furnished layout matches'],
        gaps: ['Mandatory pet-friendly requirement is violated (Property policy: No pets)'],
        action: 'Automation Dispatched: Listed Sisli property sent with warning about pet policy. Found 2 alternative pet-friendly units nearby.'
      }
    ],

    // Copilot Presets
    presetsCopilot: [
      {
        name: 'Optimize HR Recruitment Bottleneck',
        candidate: 'Analyze Recruitment pipeline bottleneck in SkillMatch. We have 200 candidates in Stage 1 but average time-to-hire is 45 days. Where is the delay?',
        job: 'Enterprise Analytics request: Identify drop-offs and process speed.',
        score: 88,
        strengths: ['Identified Stage 1 processing lag: CV reviews take average 12 days', 'Discovered technical coordinator scheduling bottleneck in Stage 2'],
        gaps: ['Insufficient interview feedback data for Stage 3 managers'],
        action: 'Automated Insight Action: Enabled SRYVERSE Technical Interview Auto-Scheduler. Predicted reduction in time-to-hire by 14 days.'
      },
      {
        name: 'Predict Property Portfolio Yields',
        candidate: 'Summarize yield trends for Bodrum vs Istanbul real estate. Portfolio has 14 listings in Bodrum and 25 flats in Istanbul.',
        job: 'Investment Strategy analysis.',
        score: 91,
        strengths: ['Bodrum villas show +18% rental yield growth in summer months', 'Istanbul central studios maintain 6.8% high occupancy capitalization rate'],
        gaps: ['Fluctuating exchange rates affect long-term valuation models'],
        action: 'Automated Insight Action: Generated Bodrum dynamic summer pricing rules. Pushed to EstateMatch listings engine.'
      }
    ]
  },
  tr: {
    title: 'AI Ürün Simülatörü',
    subtitle: 'SRYVERSE yapay zeka katmanı ile gerçek zamanlı etkileşime girin. Bir ürün seçin ve simülasyonu başlatın.',
    tabSkill: 'SkillMatch AI',
    tabEstate: 'EstateMatch AI',
    tabCopilot: 'SRYVERSE Copilot',
    
    // SkillMatch Copy
    skillPresetLabel: 'Hazır Aday ve İş Tanımı Seçin:',
    skillCandidateLabel: 'Aday Özgeçmişi / Profil Özeti:',
    skillJobLabel: 'İş Tanımı / Gereksinimler:',
    skillCandidatePlaceholder: 'Aday özgeçmiş metnini veya deneyim detaylarını yapıştırın...',
    skillJobPlaceholder: 'İş gereksinimlerini ve kriterlerini yapıştırın...',
    runBtn: 'Eşleşme Vektörünü Analiz Et',
    processing: 'AI Vektörleri İşleniyor...',
    
    // EstateMatch Copy
    estatePresetLabel: 'Hazır Müşteri ve İlan Seçin:',
    estateClientLabel: 'Alıcı / Kiracı Arama Kriterleri:',
    estatePropertyLabel: 'Gayrimenkul İlan Detayları:',
    estateClientPlaceholder: 'Müşterinin ne aradığını açıklayın...',
    estatePropertyPlaceholder: 'Mülkün konum, fiyat ve özelliklerini açıklayın...',
    
    // Copilot Copy
    copilotPresetLabel: 'Hazır İş Analitiği Talebi Seçin:',
    copilotQueryLabel: 'Kurumsal BI / Operasyon Sorgusu:',
    copilotPlaceholder: 'Bir sorgu yazın (örn. "Departman performansını analiz et ve darboğazları göster")...',
    
    // Console / Logs
    consoleHeader: 'SRYVERSE Operasyon Konsolu',
    runPrompt: 'AI analiz akışını başlatmak için butona tıklayın...',
    complete: 'Analiz Tamamlandı!',
    
    // Report
    scoreLabel: 'Eşleşme Derecesi',
    dispatchedAction: 'Tetiklenen Otomasyon Aksiyonu',
    strengthsTitle: 'Semantik Uyum Noktaları',
    gapsTitle: 'Tespit Edilen Uyumsuzluklar / Riskler',
    
    // Skill Presets
    presetsSkill: [
      {
        name: 'Kıdemli React Geliştirici (Yüksek Uyum)',
        candidate: 'Ahmet Yılmaz\n- 6 yıl frontend geliştirme deneyimi.\n- React, Redux, Next.js ve TypeScript uzmanı.\n- Webpack, Vite ve performans optimizasyonu konularında güçlü.\n- Node.js ve REST API\'lerine aşina.',
        job: 'Kıdemli Frontend Mühendisi\n- Web uygulamaları geliştirmede 5+ yıl deneyim.\n- React.js ve TypeScript konusunda ileri düzey yetkinlik.\n- Core web vitals ve bundle boyutlarını optimize etme deneyimi.\n- Çevik (agile) ekiplerle uyumlu çalışma.',
        score: 95,
        strengths: ['Deneyim süresi kriteri fazlasıyla karşılanıyor (6 yıl vs 5+ yıl)', 'React, Next.js ve TypeScript alanlarında derin uzmanlık', 'Kanıtlanmış optimizasyon becerisi (Vite, Webpack, Core Web Vitals)'],
        gaps: ['Node.js deneyimi var ancak bu frontend rolü için zorunlu değil'],
        action: 'Aday Havuzu Güncellemesi: Ahmet\'e otomatik teknik mülakat daveti gönderildi. Aşama 1 Teknik Değerlendirme durumuna alındı.'
      },
      {
        name: 'Genç Veri Bilimci (Düşük Uyum)',
        candidate: 'Selin Kaya\n- Yeni bootcamp mezunu.\n- Temel Python, SQL ve HTML/CSS bilgisi.\n- Pandas ve Matplotlib ile projeler.\n- Makine öğrenimi modellerini öğrenmeye hevesli.',
        job: 'Yapay Zeka Araştırma Lideri\n- Bilgisayar Bilimleri veya Matematik alanında Doktora (Ph.D.) veya Yüksek Lisans.\n- PyTorch, TensorFlow ve LLM modellerinde 5+ yıl endüstriyel deneyim.\n- Prestijli yapay zeka konferanslarında (NeurIPS, CVPR) yayınlanmış makaleler.\n- Büyük ölçekli dağıtık eğitim sistemleri tasarımı deneyimi.',
        score: 32,
        strengths: ['Temel Python programlama bilgisi', 'Bootcamp proje portföyü'],
        gaps: ['Doktora/Yüksek Lisans gereksinimi karşılanmıyor', 'Profesyonel ML sistem mimarisi tasarımı deneyimi yok', 'Liderlik seviyesi beklentisi ile başlangıç seviyesi profil uyuşmazlığı'],
        action: 'Aday Havuzu Güncellemesi: Selin gelecekteki staj/başlangıç pozisyonları için yetenek havuzuna eklendi. Teşekkür e-postası otomatik olarak gönderildi.'
      }
    ],

    // Estate Presets
    presetsEstate: [
      {
        name: 'Lüks Villa Alıcısı (Yüksek Uyum)',
        candidate: 'Can Demir\n- Bütçe: $2.500.000.\n- Bodrum veya Çeşme\'de 4+ odalı villa arıyor.\n- Özel havuz, deniz manzarası ve yüksek güvenlik talep ediyor.\n- Nakit alıcı, 2 hafta içinde imzaya hazır.',
        job: 'Denize Sıfır Malikane - Bodrum\n- 5 Oda, 6 Banyo, Bodrum Yalıkavak.\n- Özel sonsuzluk havuzu, panoramik deniz manzarası, akıllı ev otomasyonu, güvenlikli site içi.\n- Fiyat: $2.400.000.\n- Tam eşyalı.',
        score: 98,
        strengths: ['Bütçe mülk fiyatıyla uyuşuyor ($2.5M bütçe vs $2.4M fiyat)', 'Konum eşleşmesi tam (Bodrum)', 'Aranan nitelikler mevcut (sonsuzluk havuzu, deniz manzarası, güvenlik)'],
        gaps: ['Uyumsuzluk yok. Mükemmel eşleşme.'],
        action: 'Tetiklenen Otomasyon: Detaylı mülk PDF kataloğu WhatsApp üzerinden gönderildi. Danışman ile özel mülk gösterim randevusu planlandı.'
      },
      {
        name: 'Şehir Stüdyo Kiracısı (Kısmi Uyum)',
        candidate: 'Merve Öztürk\n- Bütçe: 40.000 TL / ay ($1,200).\n- İstanbul merkezde eşyalı stüdyo daire arıyor.\n- Metro hattına çok yakın olmalı.\n- Evcil hayvan dostu bina zorunlu (kedisi var).',
        job: 'Şişli\'de Modern 1+1 Daire\n- 1 Oda 1 Salon, Şişli, İstanbul.\n- Eşyalı, Metro durağına 5 dakika yürüme mesafesinde.\n- Fiyat: 37.000 TL / ay.\n- Bina yönetim planına göre evcil hayvana KESİNLİKLE izin verilmiyor.',
        score: 64,
        strengths: ['Bütçe kriteri uygun (37k TL vs 40k TL bütçe)', 'Konum ve Metro erişimi mükemmel eşleşiyor', 'Eşyalı olması gereksinimi karşılıyor'],
        gaps: ['Kritik evcil hayvan kabulü gereksinimi ihlal ediliyor (Bina kuralı: Evcil hayvana izin verilmez)'],
        action: 'Tetiklenen Otomasyon: Şişli dairesi evcil hayvan uyarısıyla birlikte gönderildi. Yakınlardaki evcil hayvan kabul eden 2 alternatif daire listesi ek olarak iletildi.'
      }
    ],

    // Copilot Presets
    presetsCopilot: [
      {
        name: 'İşe Alım Darboğazını Optimize Et',
        candidate: 'SkillMatch platformundaki işe alım sürecini analiz et. Adaylar 1. aşamada birikiyor, ortalama işe alım süresi 45 gün. Gecikme nerede?',
        job: 'Kurumsal Analitik Talebi: Süreç kayıpları ve hız analizi.',
        score: 88,
        strengths: ['Aşama 1 değerlendirme gecikmesi saptandı: CV incelemeleri ortalama 12 gün sürüyor', 'Aşama 2\'de teknik koordinatör mülakat planlama sıkışıklığı tespit edildi'],
        gaps: ['3. aşama yöneticilerinden toplanan geri bildirim verisi yetersiz'],
        action: 'Otomatik Akış Kararı: SRYVERSE Teknik Mülakat Otomatik Planlayıcısı devreye alındı. İşe alım süresinde 14 günlük kısalma öngörülüyor.'
      },
      {
        name: 'Portföy Kira Getirilerini Öngör',
        candidate: 'Bodrum ve İstanbul gayrimenkul kira getirisi trendlerini karşılaştır. Portföyde Bodrum\'da 14 villa, İstanbul\'da 25 stüdyo daire var.',
        job: 'Yatırım Stratejisi Analizi.',
        score: 91,
        strengths: ['Bodrum villalarında yaz aylarında +%18 kira getirisi artışı', 'İstanbul merkezi stüdyo dairelerinde %6.8 yüksek doluluk ve düzenli kapitalizasyon oranı'],
        gaps: ['Döviz dalgalanmaları uzun vadeli değerleme modellerini etkiliyor'],
        action: 'Otomatik Akış Kararı: Bodrum yaz sezonu dinamik fiyatlandırma kuralları oluşturuldu. EstateMatch ilan modülüne yüklendi.'
      }
    ]
  }
};

export default function AiSimulator({ lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('skill'); // 'skill' | 'estate' | 'copilot'
  const [candidateText, setCandidateText] = useState('');
  const [jobText, setJobText] = useState('');
  
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Presets based on tab
  const getPresets = () => {
    if (activeTab === 'skill') return t.presetsSkill;
    if (activeTab === 'estate') return t.presetsEstate;
    return t.presetsCopilot;
  };

  // Switch tab resets
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCandidateText('');
    setJobText('');
    setSelectedPresetIndex(-1);
    setIsSimulating(false);
    setShowReport(false);
    setProgress(0);
    setLogs([]);
  };

  // Load preset details
  const handlePresetSelect = (index) => {
    setSelectedPresetIndex(index);
    const presets = getPresets();
    if (index >= 0 && presets[index]) {
      setCandidateText(presets[index].candidate);
      setJobText(presets[index].job);
    } else {
      setCandidateText('');
      setJobText('');
    }
    // reset status
    setIsSimulating(false);
    setShowReport(false);
    setProgress(0);
    setLogs([]);
  };

  // Run simulated analysis pipeline
  const runSimulation = () => {
    if (!candidateText || !jobText) return;
    
    setIsSimulating(true);
    setShowReport(false);
    setProgress(0);
    setLogs([]);

    const steps = lang === 'tr' ? [
      { text: 'SRYVERSE Intelligence Core sunucularıyla bağlantı kuruluyor...', delay: 0 },
      { text: 'Ham metin LLM ayrıştırıcı tarafından analiz ediliyor...', delay: 600 },
      { text: 'Semantik vektör gösterimi hesaplanıyor (Dimension: 1536)...', delay: 1300 },
      { text: 'Profil nitelikleri ve kısıt kural matrisi oluşturuluyor...', delay: 2100 },
      { text: 'Semantik benzerlik ve kosinüs mesafesi puanlanıyor...', delay: 2800 },
      { text: 'Eşleşme raporu üretiliyor ve otomasyon tetikleyicisi hazırlanıyor...', delay: 3500 },
    ] : [
      { text: 'Connecting to SRYVERSE Intelligence Core servers...', delay: 0 },
      { text: 'Parsing raw unstructured text via LLM extractor...', delay: 600 },
      { text: 'Computing semantic vector embeddings (1536 dimensions)...', delay: 1300 },
      { text: 'Building profile attributes and constraint rule matrix...', delay: 2100 },
      { text: 'Measuring semantic alignment and cosine similarity...', delay: 2800 },
      { text: 'Generating matching report and preparing pipeline triggers...', delay: 3500 },
    ];

    // Simulate logs printing
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);
        setProgress(((idx + 1) / steps.length) * 100);
        
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setShowReport(true);
          }, 800);
        }
      }, step.delay);
    });
  };

  // Get active item details for report
  const activePreset = selectedPresetIndex >= 0 ? getPresets()[selectedPresetIndex] : {
    score: 82,
    strengths: lang === 'tr' ? ['Genel niteliklerin iş tanımıyla uyumu', 'İletişim ve dil yetenekleri'] : ['General skills match criteria', 'Communication and language specs'],
    gaps: lang === 'tr' ? ['Bazı spesifik kütüphanelerin doğrulanması gerekiyor'] : ['Verify familiarity with niche frameworks'],
    action: lang === 'tr' ? 'Adaya profil inceleme durumuna geçildiğine dair SMS/E-posta gönderildi.' : 'Moved profile to assessment review status and notified candidate.'
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">{t.title}</h3>
        <p className="sim-sub">{t.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="sim-tabs">
        <button
          className={`sim-tab-btn ${activeTab === 'skill' ? 'sim-tab-btn--active' : ''}`}
          onClick={() => handleTabChange('skill')}
        >
          <span className="sim-tab-icon">👥</span> {t.tabSkill}
        </button>
        <button
          className={`sim-tab-btn ${activeTab === 'estate' ? 'sim-tab-btn--active' : ''}`}
          onClick={() => handleTabChange('estate')}
        >
          <span className="sim-tab-icon">🏠</span> {t.tabEstate}
        </button>
        <button
          className={`sim-tab-btn ${activeTab === 'copilot' ? 'sim-tab-btn--active' : ''}`}
          onClick={() => handleTabChange('copilot')}
        >
          <span className="sim-tab-icon">⚡</span> {t.tabCopilot}
        </button>
      </div>

      <div className="sim-grid">
        {/* Input Panel */}
        <div className="sim-input-panel">
          {/* Presets */}
          <div className="sim-field">
            <label className="sim-label">
              {activeTab === 'skill' && t.skillPresetLabel}
              {activeTab === 'estate' && t.estatePresetLabel}
              {activeTab === 'copilot' && t.copilotPresetLabel}
            </label>
            <select
              className="sim-select"
              value={selectedPresetIndex}
              onChange={(e) => handlePresetSelect(parseInt(e.target.value))}
            >
              <option value="-1">-- {lang === 'tr' ? 'Kendin Yaz veya Preset Seç' : 'Custom Input or Select Preset'} --</option>
              {getPresets().map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input 1 */}
          <div className="sim-field">
            <label className="sim-label">
              {activeTab === 'skill' && t.skillCandidateLabel}
              {activeTab === 'estate' && t.estateClientLabel}
              {activeTab === 'copilot' && t.copilotQueryLabel}
            </label>
            <textarea
              className="sim-textarea"
              rows={4}
              value={candidateText}
              onChange={(e) => setCandidateText(e.target.value)}
              placeholder={
                activeTab === 'skill'
                  ? t.skillCandidatePlaceholder
                  : activeTab === 'estate'
                  ? t.estateClientPlaceholder
                  : t.copilotPlaceholder
              }
            />
          </div>

          {/* Input 2 (Only for Skill and Estate Match) */}
          {activeTab !== 'copilot' && (
            <div className="sim-field">
              <label className="sim-label">
                {activeTab === 'skill' && t.skillJobLabel}
                {activeTab === 'estate' && t.estatePropertyLabel}
              </label>
              <textarea
                className="sim-textarea"
                rows={4}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder={
                  activeTab === 'skill'
                    ? t.skillJobPlaceholder
                    : t.estatePropertyPlaceholder
                }
              />
            </div>
          )}

          {/* Run Button */}
          <button
            className={`sim-run-btn ${(isSimulating || !candidateText || (!jobText && activeTab !== 'copilot')) ? 'sim-run-btn--disabled' : ''}`}
            onClick={runSimulation}
            disabled={isSimulating || !candidateText || (!jobText && activeTab !== 'copilot')}
          >
            {isSimulating ? (
              <>
                <span className="sim-spinner" />
                {t.processing}
              </>
            ) : (
              <>
                {activeTab === 'copilot' ? (lang === 'tr' ? 'AI Analiz Sorgusunu Çalıştır' : 'Execute AI Analytics') : t.runBtn}
                <span className="sim-btn-arrow"> →</span>
              </>
            )}
          </button>
        </div>

        {/* Console / Output Panel */}
        <div className="sim-output-panel">
          <div className="sim-console">
            <div className="sim-console-header">
              <div className="sim-console-dots">
                <span className="dot dot-r" />
                <span className="dot dot-y" />
                <span className="dot dot-g" />
              </div>
              <span className="sim-console-title">{t.consoleHeader}</span>
            </div>
            
            <div className="sim-console-body">
              {logs.length === 0 && (
                <div className="sim-console-placeholder">{t.runPrompt}</div>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className="sim-console-line">
                  <span className="sim-console-caret">&gt;</span> {log}
                </div>
              ))}
              {isSimulating && (
                <div className="sim-console-loader">
                  <div className="sim-loader-bar" style={{ width: `${progress}%` }} />
                </div>
              )}
              {!isSimulating && logs.length > 0 && (
                <div className="sim-console-line sim-console-success">
                  ✓ {t.complete}
                </div>
              )}
            </div>
          </div>

          {/* Report Display */}
          {showReport && (
            <div className="sim-report reveal-fade">
              <div className="sim-report-top">
                <div className="sim-gauge">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${activePreset.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      {activePreset.score}%
                    </text>
                  </svg>
                  <span className="sim-gauge-label">{t.scoreLabel}</span>
                </div>

                <div className="sim-action-dispatch">
                  <span className="sim-action-tag">{t.dispatchedAction}</span>
                  <p className="sim-action-text">{activePreset.action}</p>
                </div>
              </div>

              <div className="sim-report-details">
                <div className="sim-report-col">
                  <h5>{t.strengthsTitle}</h5>
                  <ul>
                    {activePreset.strengths.map((s, idx) => (
                      <li key={idx} className="strength-item">✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="sim-report-col">
                  <h5>{t.gapsTitle}</h5>
                  <ul>
                    {activePreset.gaps.map((g, idx) => (
                      <li key={idx} className="gap-item">⚠ {g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
