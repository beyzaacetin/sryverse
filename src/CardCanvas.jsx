import { useEffect, useRef } from 'react'

const PALETTES = {
  skill:   { p: 'rgba(29,200,120,', s: 'rgba(16,240,160,' },
  estate:  { p: 'rgba(29,130,220,', s: 'rgba(16,180,255,' },
  future:  { p: 'rgba(160,100,240,', s: 'rgba(200,150,255,' },
  metraj:  { p: 'rgba(200,155,60,', s: 'rgba(232,196,120,' },
}

export default function CardCanvas({ variant = 'skill' }) {
  const canvasRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pal = PALETTES[variant]
    let W, H, animId
    let cmx = -999, cmy = -999, scmx = -999, scmy = -999
    let orbPh = Math.random() * Math.PI * 2, wt = 0

    const resize = () => {
      const p = canvas.parentElement
      W = canvas.width = p.offsetWidth
      H = canvas.height = p.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const parent = canvas.parentElement
    const onMove = e => { const r = parent.getBoundingClientRect(); cmx = e.clientX - r.left; cmy = e.clientY - r.top }
    const onLeave = () => { cmx = -999; cmy = -999 }
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)

    const cpts = Array.from({ length: 38 }, () => ({
      x: Math.random() * 400, y: Math.random() * 300,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.5 + .3, op: .1,
      ph: Math.random() * Math.PI * 2, ps: .007 + Math.random() * .011
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      scmx += (cmx - scmx) * .08; scmy += (cmy - scmy) * .08
      wt += .009; orbPh += .006

      const ox = W * .68 + Math.sin(orbPh) * (W * .12)
      const oy = H * .38 + Math.cos(orbPh * 1.2) * (H * .1)
      const gr = ctx.createRadialGradient(ox, oy, 0, ox, oy, W * .55)
      gr.addColorStop(0, pal.p + '0.28)')
      gr.addColorStop(.45, pal.s + '0.07)')
      gr.addColorStop(1, 'transparent')
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H)

      const ox2 = W * .2 + Math.cos(orbPh * .7) * (W * .08)
      const oy2 = H * .75 + Math.sin(orbPh) * (H * .08)
      const gr2 = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, W * .3)
      gr2.addColorStop(0, pal.p + '0.12)'); gr2.addColorStop(1, 'transparent')
      ctx.fillStyle = gr2; ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < 4; i++) {
        const yb = (H / 5) * (i + 1)
        ctx.beginPath(); ctx.moveTo(0, yb)
        for (let x = 0; x <= W; x += 3) {
          const y = yb + Math.sin(x * .014 + wt + i) * (H * .065) + Math.sin(x * .022 + wt * .9 + i) * (H * .035)
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = pal.p + `${.14 - i * .025})`; ctx.lineWidth = .75; ctx.stroke()
      }

      for (const p of cpts) {
        if (scmx > 0) { const dx = scmx - p.x, dy = scmy - p.y, d = Math.sqrt(dx*dx+dy*dy); if (d < 110) { const f=(1-d/110)*.35; p.vx+=(dx/d)*f*.025; p.vy+=(dy/d)*f*.025 } }
        p.vx *= .97; p.vy *= .97; p.x += p.vx; p.y += p.vy
        p.ph += p.ps; p.op = .07 + Math.abs(Math.sin(p.ph)) * .25
        if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5
        if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = -5
      }
      for (let i = 0; i < cpts.length; i++) {
        const pi = cpts[i]
        if (scmx > 0) { const dx=scmx-pi.x,dy=scmy-pi.y,d=Math.sqrt(dx*dx+dy*dy); if(d<100){ctx.beginPath();ctx.moveTo(pi.x,pi.y);ctx.lineTo(scmx,scmy);ctx.strokeStyle=pal.p+`${(1-d/100)*.22})`;ctx.lineWidth=.55;ctx.stroke()} }
        for (let j = i+1; j < cpts.length; j++) { const pj=cpts[j],dx=pi.x-pj.x,dy=pi.y-pj.y,d=Math.sqrt(dx*dx+dy*dy); if(d<85){ctx.beginPath();ctx.moveTo(pi.x,pi.y);ctx.lineTo(pj.x,pj.y);ctx.strokeStyle=pal.p+`${(1-d/85)*.17})`;ctx.lineWidth=.4;ctx.stroke()} }
      }
      for (const p of cpts) { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=pal.p+`${p.op})`; ctx.fill() }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [variant])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}
