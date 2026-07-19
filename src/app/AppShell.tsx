import { Menu, PanelLeftClose, PanelLeftOpen, ShieldAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'

type AppShellProps = {
  children: React.ReactNode
}

const sidebarId = 'app-sidebar'

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainContentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          mainContentRef.current?.focus()
        }}
        className="bg-action-primary text-foreground-inverse focus:not-sr-only sr-only fixed left-md top-md z-50 rounded-md px-md py-sm font-medium"
      >
        Skip to main content
      </a>
      {mobileOpen && (
        <div
          data-testid="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <aside
        id={sidebarId}
        className={`bg-background-inverse fixed inset-y-0 left-0 z-40 flex flex-shrink-0 flex-col gap-md p-md transition-all lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-16' : 'w-56'}`}
      >
        <div className="flex items-center gap-sm">
          <Logo size={28} />
          {!collapsed && (
            <span className="text-foreground-on-inverse font-semibold">
              DELA Security
            </span>
          )}
        </div>
        <nav aria-label="Primary" className="flex flex-col gap-xs">
          <NavLink
            to="/alerts"
            aria-label="Alerts"
            className="text-foreground-on-inverse flex items-center gap-sm rounded-md px-sm py-xs text-sm font-medium"
          >
            <ShieldAlert size={18} aria-hidden="true" />
            {!collapsed && 'Alerts'}
          </NavLink>
        </nav>
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
          className="text-foreground-on-inverse mt-auto flex items-center gap-sm rounded-md px-sm py-xs text-sm font-medium"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={18} aria-hidden="true" />
          )}
          {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </button>
      </aside>
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls={sidebarId}
        onClick={() => setMobileOpen(true)}
        className="text-foreground-default fixed left-md top-md z-20 rounded-md p-xs lg:hidden"
      >
        <Menu size={20} aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>
      <main
        id="main-content"
        ref={mainContentRef}
        tabIndex={-1}
        className="w-full min-w-0 flex-1"
      >
        {children}
      </main>
    </div>
  )
}
