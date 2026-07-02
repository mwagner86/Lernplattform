import { createContext, useContext, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import content from './content.generated.json'
import { useTheme } from './lib/store.js'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Home from './components/Home.jsx'
import ChapterPage from './components/ChapterPage.jsx'
import SearchModal from './components/SearchModal.jsx'

const ThemeContext = createContext({ theme: 'light', toggle: () => {} })
export const useThemeContext = () => useContext(ThemeContext)

export function getModule(moduleId) {
  return content.modules.find((m) => m.id === moduleId)
}

function ModuleLayout({ children }) {
  const { moduleId } = useParams()
  const mod = getModule(moduleId)
  if (!mod) return <Navigate to={`/${content.defaultModule}`} replace />
  return children
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const themeValue = useMemo(() => ({ theme, toggle }), [theme, toggle])

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="app-shell">
        <Sidebar
          content={content}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="app-main">
          <TopBar
            content={content}
            onOpenSearch={() => setSearchOpen(true)}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to={`/${content.defaultModule}`} replace />} />
              <Route
                path="/:moduleId"
                element={<ModuleLayout><Home /></ModuleLayout>}
              />
              <Route
                path="/:moduleId/:slug"
                element={<ModuleLayout><ChapterPage /></ModuleLayout>}
              />
              <Route path="*" element={<Navigate to={`/${content.defaultModule}`} replace />} />
            </Routes>
          </main>
        </div>
        {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}
        <SearchModal
          content={content}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </ThemeContext.Provider>
  )
}
