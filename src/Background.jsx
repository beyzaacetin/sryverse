import { useEffect, useRef } from 'react'

export default function Background({ density = 1 }) {
  const canvasRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const glow = glowRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W, H
    const C = '11,61,46'
    const N = Math.floor(120 * density)
    let mx = -999, my = -999, smx = -999, smy = -999
    let gridOff = 0, waveT = 0

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * 1400, y: Math.random() * 1200,
      vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
      r: Math.random() * 1.8 + .3, op: Math.random() * .22 + .06,
      ph: Math.random() * Math.PI * 2, ps: .007 + Math.random() * .013
    }))

    const onMove = e => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
      if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px' }
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      smx += (mx - smx) * .07; smy += (my - smy) * .07

      // Grid
      gridOff = (gridOff + .09) % 36
      ctx.strokeStyle = `rgba(${C},.055)`; ctx.lineWidth = 1
      for (let x = gridOff % 36; x < W + 36; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = gridOff % 36; y < H + 36; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Waves
      waveT += .007
      for (let i = 0; i < 7; i++) {
        const yb = (H / 8) * (i + 1)
        ctx.beginPath(); ctx.moveTo(0, yb)
        for (let x = 0; x <= W; x += 4) {
          const md = Math.abs(x - smx)
          const mi = smx > 0 ? Math.max(0, 1 - md / 280) * 22 : 0
          const y = yb + Math.sin(x * .005 + waveT + i * .8) * 17 + Math.sin(x * .009 + waveT * 1.3 + i) * 9 + Math.sin((x - smx) * .022) * mi * Math.sin(waveT * 2)
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${C},${.05 - i * .005})`; ctx.lineWidth = 1; ctx.stroke()
      }

      // Particles
      for (const p of pts) {
        const dx = smx - p.x, dy = smy - p.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 200 && smx > 0) { const f = (1 - d / 200) * .4; p.vx += (dx / d) * f * .035; p.vy += (dy / d) * f * .035 }
        p.vx *= .98; p.vy *= .98; p.x += p.vx; p.y += p.vy
        p.ph += p.ps; p.op = .06 + Math.abs(Math.sin(p.ph)) * .2
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10
      }
      for (let i = 0; i < pts.length; i++) {
        const pi = pts[i]
        if (smx > 0) {
          const dx = smx - pi.x, dy = smy - pi.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 170) { ctx.beginPath(); ctx.moveTo(pi.x, pi.y); ctx.lineTo(smx, smy); ctx.strokeStyle = `rgba(${C},${(1 - d / 170) * .18})`; ctx.lineWidth = .65; ctx.stroke() }
        }
        for (let j = i + 1; j < pts.length; j++) {
          const pj = pts[j], dx = pi.x - pj.x, dy = pi.y - pj.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) { ctx.beginPath(); ctx.moveTo(pi.x, pi.y); ctx.lineTo(pj.x, pj.y); ctx.strokeStyle = `rgba(${C},${(1 - d / 130) * .11})`; ctx.lineWidth = .5; ctx.stroke() }
        }
      }
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${C},${p.op})`; ctx.fill() }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [density])

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      <div ref={glowRef} style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,61,46,0.14) 0%, transparent 65%)', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0, mixBlendMode: 'multiply', transition: 'left 0.08s linear, top 0.08s linear', left: -999, top: -999 }} />
    </>
  )
}
