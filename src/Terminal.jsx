import { useState, useRef, useEffect, useCallback } from 'react'

const LAYERS = [
  { name: 'Veri Alımı', sub: 'Heterogeneous Data Pipeline', speed: '4.2 MB/s',
    boot: ['SRY-INGEST servisi başlatılıyor...', 'CV & mülk veri akışları bağlandı', 'PDF parser hazır — chunk: 512 token', '>> Katman aktif.'] },
  { name: 'AI Çekirdeği', sub: 'LLM Orchestration & Embeddings', speed: '1.8k tok/s',
    boot: ['LLM orkestrasyon katmanı başlatılıyor...', 'Embedding modeli yüklendi (dim: 768)', 'Bağlam penceresi: 128K token aktif', '>> Çekirdek aktif.'] },
  { name: 'Karar Katmanı', sub: 'Semantic Scoring & Ranking', speed: '320 ops/s',
    boot: ['Semantik eşleştirme motoru yükleniyor...', 'Scoring ağırlıkları kalibre edildi', 'Vektör uzayı oluşturuldu', '>> Karar katmanı aktif.'] },
  { name: 'Yürütme', sub: 'Workflow & Action Dispatcher', speed: '95 wf/s',
    boot: ['Otomasyon motoru başlatılıyor...', 'İş akışı şablonları yüklendi (47)', 'Aksiyon dispatcher hazır', '>> Motor aktif.'] },
  { name: 'Analitik', sub: 'Real-time Intelligence Engine', speed: '12 req/s',
    boot: ['BI raporlama katmanı başlatılıyor...', 'Gerçek zamanlı metrik pipeline bağlandı', 'Öngörülü analiz modeli yüklendi', '>> Analitik aktif.'] },
]

const QUICK = [
  { label: 'SkillMatch nasıl çalışır?', q: 'SkillMatch AI işe alım sürecini nasıl dönüştürür?' },
  { label: 'EstateMatch nedir?', q: 'EstateMatch AI gayrimenkul operasyonlarına nasıl değer katar?' },
  { label: 'SRYVERSE yaklaşımı', q: "SRYVERSE'in sistem mühendisliği yaklaşımı nedir?" },
  { label: 'Hangi sorunları çözer?', q: 'SRYVERSE hangi iş sorunlarını çözer?' },
]

export default function Terminal({ compact = false }) {
  const [curLayer, setCurLayer] = useState(0)
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [speed, setSpeed] = useState('4.2 MB/s')
  const logRef = useRef(null)
  const booted = useRef(false)

  const addLine = useCallback((text, cls = '', id = null) => {
    setLines(prev => [...prev, { text, cls, id: id || Date.now() + Math.random() }])
  }, [])

  const scrollBottom = () => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }

  useEffect(() => { scrollBottom() }, [lines])

  useEffect(() => {
    const L = LAYERS[curLayer]
    setLines([])
    booted.current = false
    let i = 0
    const interval = setInterval(() => {
      if (i < L.boot.length) {
        const cls = i === L.boot.length - 1 ? 'green' : i === 0 ? 'yellow' : 'muted'
        addLine(L.boot[i], cls)
        i++
      } else {
        clearInterval(interval)
        booted.current = true
      }
    }, 130)
    return () => clearInterval(interval)
  }, [curLayer, addLine])

  useEffect(() => {
    const t = setInterval(() => {
      const L = LAYERS[curLayer]
      const base = parseFloat(L.speed)
      const unit = L.speed.replace(/[\d.]/g, '').trim()
      setSpeed((base * (0.9 + Math.random() * 0.2)).toFixed(1) + ' ' + unit)
    }, 1200)
    return () => clearInterval(t)
  }, [curLayer])

  const ask = useCallback(async (question) => {
    if (busy || !question.trim()) return
    setBusy(true)
    setInput('')

    addLine('')
    addLine('Kullanıcı → ' + question, 'question')
    addLine('')
    addLine('SRY//CORE zeka çekirdeğine yönlendiriliyor...', 'muted')
    addLine('Bağlam: Katman ' + (curLayer + 1) + ' — ' + LAYERS[curLayer].name, 'muted')

    const streamId = 'stream-' + Date.now()
    await new Promise(r => setTimeout(r, 900))
    setLines(prev => [...prev, { text: '', cls: 'ai', id: streamId, streaming: true }])

    try {
      const sys = `Sen SRY//CORE'sun — SRYVERSE'in canlı zeka çekirdeği. SRYVERSE, sistem mühendisliği + yapay zekayı birleştirerek iş operasyonlarını akıllı, ölçeklenebilir sistemlere dönüştüren bir AI ürünleri şirketidir.

Ürünler:
- SkillMatch AI: İşe alım süreçlerini dönüştüren AI platformu (CV analizi, aday eşleştirme, mülakat kopilosu)
- EstateMatch AI: Gayrimenkul operasyonlarını sistemleştiren AI platformu (portföy yönetimi, müşteri eşleştirme)

Aktif katman: ${LAYERS[curLayer].name} — ${LAYERS[curLayer].sub}

Kısa, teknik ama anlaşılır Türkçe yanıt ver. 2-3 cümle yeterli. Terminal çıktısı gibi öz ve bilgilendirici ol. Markdown kullanma.`

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          stream: true,
          system: sys,
          messages: [{ role: 'user', content: question }]
        })
      })

      const reader = resp.body.getReader()
      const dec = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const parts = buf.split('\n')
        buf = parts.pop()
        for (const part of parts) {
          if (!part.startsWith('data:')) continue
          const data = part.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const j = JSON.parse(data)
            if (j.type === 'content_block_delta' && j.delta?.type === 'text_delta') {
              setLines(prev => prev.map(l => l.id === streamId ? { ...l, text: l.text + j.delta.text } : l))
            }
          } catch {}
        }
      }
    } catch (err) {
      setLines(prev => prev.map(l => l.id === streamId ? { ...l, text: 'Bağlantı hatası: ' + err.message } : l))
    }

    setLines(prev => prev.map(l => l.id === streamId ? { ...l, streaming: false } : l))
    addLine('')
    addLine('İşlem tamamlandı. ✓', 'green')
    setBusy(false)
  }, [busy, curLayer, addLine])

  return (
    <div className={`terminal-wrap${compact ? ' terminal-wrap--compact' : ''}`}>

      <div className="terminal-box">
        <div className="terminal-head">
          <div>
            <div className="terminal-head__name">SRY<span className="thd-sep">//</span>CORE</div>
            <div className="terminal-head__sub">Canlı Zeka Çekirdeği — {LAYERS[curLayer].sub}</div>
          </div>
          <div className="terminal-head__badges">
            <span className="tbadge tbadge--on">● CANLI</span>
            <span className="tbadge">{speed}</span>
          </div>
        </div>

        <div className="terminal-tabs">
          {LAYERS.map((l, i) => (
            <button key={i} className={`ttab${curLayer === i ? ' ttab--on' : ''}`} onClick={() => !busy && setCurLayer(i)} disabled={busy}>
              <span className="ttab__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="ttab__name">{l.name}</span>
            </button>
          ))}
        </div>

        <div className="terminal-log" ref={logRef}>
          {lines.map(l => l.text === '' ? (
            <div key={l.id} style={{ height: 4 }} />
          ) : (
            <div key={l.id} className="tline">
              <span className="tline__arrow">&gt;&gt;</span>
              <span className={`tline__text tline__text--${l.cls}`}>
                {l.text}{l.streaming && <span className="tcursor" />}
              </span>
            </div>
          ))}
        </div>

        <div className="terminal-input">
          <span className="terminal-prompt">sry@core:~$</span>
          <input
            className="terminal-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask(input)}
            placeholder="Çekirdeğe komut verin..."
            disabled={busy}
          />
          <button className="terminal-run" onClick={() => ask(input)} disabled={busy}>
            {busy ? '...' : 'ÇALIŞTIR ↵'}
          </button>
        </div>

        <div className="terminal-quick">
          {QUICK.map((q, i) => (
            <button key={i} className="qbtn" onClick={() => ask(q.q)} disabled={busy}>{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
