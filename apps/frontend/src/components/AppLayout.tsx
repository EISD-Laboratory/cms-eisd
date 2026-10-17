import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'

// Default app chrome for every protected page — the sidebar is rendered once
// here and persists across navigation instead of being redefined per page.
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white text-foreground">
      <AppSidebar />
      <Outlet />
    </div>
  )
}
