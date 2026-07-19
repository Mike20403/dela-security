import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const mainContentRef = useRef<HTMLElement>(null)

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
      <aside
        className={`bg-background-inverse flex flex-shrink-0 flex-col gap-md p-md transition-all ${
          collapsed ? 'w-16' : 'w-56'
        }`}
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
            className="text-foreground-on-inverse rounded-md px-sm py-xs text-sm font-medium"
          >
            {collapsed ? 'A' : 'Alerts'}
          </NavLink>
        </nav>
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
          className="text-foreground-on-inverse mt-auto rounded-md px-sm py-xs text-sm font-medium"
        >
          {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </button>
      </aside>
      <main
        id="main-content"
        ref={mainContentRef}
        tabIndex={-1}
        className="flex-1"
      >
        {children}
      </main>
    </div>
  )
}
