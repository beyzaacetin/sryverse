import { useState, useEffect, useCallback } from 'react'

/**
 * Sayfa durumunu tarayici adresiyle esitler.
 *
 * Harici router kutuphanesi yerine History API kullaniyoruz: uygulama
 * zaten tek `page` state'i uzerinden calisiyordu, buraya sadece adres
 * senkronizasyonu ekleniyor.
 *
 * /            -> home
 * /skillmatch  -> skillmatch
 * /estatematch -> estatematch
 * /vizyon      -> vision
 */

const PATHS = {
  home: '/',
  skillmatch: '/skillmatch',
  estatematch: '/estatematch',
  vision: '/vizyon',
}

// Adres -> sayfa anahtari. Eski/alternatif yazimlar da kabul edilir.
const ROUTES = {
  '': 'home',
  'skillmatch': 'skillmatch',
  'skillmatch-ai': 'skillmatch',
  'estatematch': 'estatematch',
  'estatematch-ai': 'estatematch',
  'vizyon': 'vision',
  'vision': 'vision',
}

const TITLES = {
  home: 'SRYVERSE — Operasyonel Karmaşıklıktan Akıllı Sistem Çözümlerine',
  skillmatch: 'SkillMatch AI — Recruitment Intelligence | SRYVERSE',
  estatematch: 'EstateMatch AI — Real Estate Intelligence | SRYVERSE',
  vision: 'Vizyon & Misyon | SRYVERSE',
}

function pageFromLocation() {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  return ROUTES[seg] || 'home'
}

/**
 * GitHub Pages gibi sunucu yonlendirmesi yapamayan ortamlarda 404.html
 * istenen adresi sessionStorage'a yazip koke atar. Uygulama acilir
 * acilmaz o adresi geri yukluyoruz.
 */
function consumeRedirect() {
  try {
    const saved = sessionStorage.getItem('sry:redirect')
    if (!saved) return null
    sessionStorage.removeItem('sry:redirect')
    window.history.replaceState({}, '', saved)
    return true
  } catch {
    return null
  }
}

export default function useRoute() {
  const [page, setPageState] = useState(() => {
    consumeRedirect()
    return pageFromLocation()
  })

  // Geri/ileri tuslari
  useEffect(() => {
    const onPop = () => setPageState(pageFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Sekme basligi
  useEffect(() => {
    document.title = TITLES[page] || TITLES.home
  }, [page])

  /**
   * Sayfayi degistirir ve adresi gunceller.
   * `replace` true ise gecmise yeni kayit eklemez.
   */
  const setPage = useCallback((next, { replace = false } = {}) => {
    const path = PATHS[next] || '/'
    if (window.location.pathname !== path) {
      window.history[replace ? 'replaceState' : 'pushState']({ page: next }, '', path)
    }
    setPageState(next)
  }, [])

  return [page, setPage]
}
