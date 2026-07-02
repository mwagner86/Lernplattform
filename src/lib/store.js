import { useCallback, useEffect, useState } from 'react'

// --- Theme (hell/dunkel) ---------------------------------------------------

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light'
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('lp-theme', theme) } catch (_) {}
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}

// --- Fortschritt (als "gelernt" markierte Kapitel) -------------------------

const PROGRESS_KEY = 'lp-progress'

function readProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch (_) { return {} }
}

export function useProgress() {
  const [progress, setProgress] = useState(readProgress)

  useEffect(() => {
    const onStorage = (e) => { if (e.key === PROGRESS_KEY) setProgress(readProgress()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persist = useCallback((next) => {
    setProgress(next)
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)) } catch (_) {}
  }, [])

  const isLearned = useCallback(
    (moduleId, slug) => Boolean(progress[`${moduleId}/${slug}`]),
    [progress]
  )

  const toggleLearned = useCallback(
    (moduleId, slug) => {
      const key = `${moduleId}/${slug}`
      const next = { ...progress }
      if (next[key]) delete next[key]
      else next[key] = true
      persist(next)
    },
    [progress, persist]
  )

  const countLearned = useCallback(
    (moduleId, slugs) => slugs.filter((s) => progress[`${moduleId}/${s}`]).length,
    [progress]
  )

  return { progress, isLearned, toggleLearned, countLearned }
}
