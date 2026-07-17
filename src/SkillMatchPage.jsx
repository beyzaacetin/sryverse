import { useEffect } from 'react'
import Background from './Background.jsx'

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
      {/* Background decoration */}
      <Background density={1.2} color="34,197,94" boost={0.7} />
      <div className="hero__veil" style={{ background: 'linear-gradient(180deg, rgba(4,14,9,0.2) 0%, rgba(4,14,9,0.95) 100%)' }} />

      <section className="vpage__hero" style={{ paddingBottom: '3rem' }}>
        <div className="wrap vpage__in">
          <button 
            onClick={goBack} 
            className="cta-btn" 
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '2rem',
              cursor: 'pointer'
            }}
          >
            ← Geri Dön
          </button>
          <br />
          <span className="elabel elabel--light">SkillMatch AI</span>
          <h1 className="vpage__h1">
            İşe alımda manuel filtrelemeyi sonlandırın.<br />
            <em>Yetenekleri anlamsal vektörlerle eşleyin.</em>
          </h1>
          <p className="vpage__sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
            SkillMatch AI, işe alım süreçlerindeki karmaşıklığı ortadan kaldırarak adaylar ile pozisyonları en yüksek doğrulukla eşleştiren kurumsal yapay zekâ asistanınızdır.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <a 
              href="https://skillmatch.sryverse.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-btn"
              style={{ background: '#10b981', color: '#fff', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}
            >
              Platformu Aç (Launch App) →
            </a>
          </div>
        </div>
      </section>

      <section className="vpage__blocks" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <h2 style={{ fontFamily: 'var(--fs)', fontSize: '2.5rem', color: '#fff', textAlign: 'center', marginBottom: '3rem' }}>
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

          <div style={{ marginTop: '5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fs)', fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>
              Operasyonunuzu Hızlandırmaya Hazır Mısınız?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2rem' }}>
              İşe alım huninizdeki dönüşüm oranlarını artırmak ve aday kalitesini sayısal olarak izlemek için entegrasyon sürecini hemen başlatın.
            </p>
            <button 
              onClick={() => {
                goBack();
                setTimeout(() => {
                  const contactEl = document.querySelector('#contact');
                  if (contactEl && window.lenisInstance) window.lenisInstance.scrollTo(contactEl);
                  else if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
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
