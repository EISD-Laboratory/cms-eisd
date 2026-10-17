import { Link, useLocation } from 'react-router-dom'
import {
  Calendar,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Trophy,
} from 'lucide-react'
import { useAuth } from '@/context/useAuth'

const NAV = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', to: '/events', icon: Calendar },
  { label: 'Articles', to: '/articles', icon: Newspaper },
  { label: 'Achievements', to: '/achievements', icon: Trophy },
]

// Single source of truth for the app's primary navigation. Rendered by
// AppLayout so every protected page shares the same menu.
export function AppSidebar() {
  const { signOut } = useAuth()
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-52 shrink-0 flex-col overflow-y-auto border-r border-border bg-white p-3">
      <div className="flex items-center gap-2 px-1">
        <span className="grid size-7 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <FlaskConical className="size-3.5" />
        </span>
        <p className="text-sm font-semibold">EISD CMS</p>
      </div>
      <div className="mt-6">
        <p className="px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Menu</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {NAV.map((item) => {
            // A section stays active on its nested routes (e.g. /articles/new).
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`)
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative flex h-8 items-center gap-2 rounded-md px-2 pl-3 text-[13px] font-medium ${
                  active ? 'bg-secondary/10 font-semibold text-foreground' : 'text-muted-foreground hover:bg-[#F5F5F5]'
                }`}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full bg-secondary" />
                )}
                <item.icon className={`size-3.5 ${active ? 'text-secondary' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={() => void signOut()}
        className="mt-auto flex h-8 items-center gap-2 rounded-md border-t border-border px-2 pt-2 text-[13px] font-medium text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-3.5" />
        Log out
      </button>
    </aside>
  )
}
