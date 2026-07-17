import { useEffect } from 'react'
import Background from './Background.jsx'

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
      {/* Background decoration */}
      <Background density={1.2} color="56,189,248" boost={0.65} />
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
          <span className="elabel elabel--light" style={{ color: '#38bdf8' }}>EstateMatch AI</span>
          <h1 className="vpage__h1">
            Müşteri taleplerini ve portföyleri<br />
            <em>sistematik olarak eşleştirin.</em>
          </h1>
          <p className="vpage__sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
            EstateMatch AI, emlak operasyonlarınızı zeka tabanlı bir ekosisteme dönüştürerek doğru mülkü, doğru alıcıyla buluşturan yapay zekâ asistanınızdır.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <a 
              href="https://estate.sryverse.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-btn"
              style={{ background: '#38bdf8', color: '#040e09', fontWeight: '600', boxShadow: '0 10px 30px rgba(56,189,248,0.3)' }}
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
              <div key={i} className="vblock" style={{ borderLeft: '4px solid #38bdf8' }}>
                <span className="vblock__id">0{i+1}</span>
                <h3 className="vblock__h" style={{ fontSize: '1.6rem' }}>{f.title}</h3>
                <p className="vblock__p">{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fs)', fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>
              Gayrimenkul Portföyünüzü Akıllandırın
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Veri tabanınızdaki mülk ilanları ile alıcı talepleri arasındaki anlamsal bağı kurun ve satış sürelerinizi kısaltın.
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
