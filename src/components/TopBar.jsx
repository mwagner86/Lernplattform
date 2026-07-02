import { useEffect } from 'react'
import { useThemeContext } from '../App.jsx'

export default function TopBar({ onOpenSearch, onToggleSidebar }) {
  const { theme, toggle } = useThemeContext()

  // Tastenkürzel: Cmd/Ctrl+K öffnet die Suche.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenSearch])

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onToggleSidebar} aria-label="Menü">
        ☰
      </button>

      <button className="search-trigger" onClick={onOpenSearch}>
        <span aria-hidden>🔍</span>
        <span className="search-trigger-text">Suchen …</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="topbar-spacer" />

      <button
        className="icon-btn"
        onClick={toggle}
        aria-label="Design wechseln"
        title={theme === 'dark' ? 'Hell' : 'Dunkel'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </header>
  )
}
