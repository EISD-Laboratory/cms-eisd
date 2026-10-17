import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/AppLayout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Events } from './pages/Events'
import { Articles } from './pages/Articles'
import { Achievements } from './pages/Achievements'
import { AchievementForm } from './pages/AchievementForm'
import { SidebarBgPrototype } from './pages/prototype/SidebarBg'
import { ArticleForm } from './pages/ArticleForm'
import { EventForm } from './pages/EventForm'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Info toast host: bottom-right, accent border + colored icons (see index.css). */}
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
          {/* All protected pages share one layout: the sidebar renders once
              and stays put as nested routes swap in via <Outlet />. */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/new" element={<EventForm mode="create" />} />
            <Route path="/events/:id/edit" element={<EventForm mode="edit" />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/new" element={<ArticleForm />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/achievements/new" element={<AchievementForm mode="create" />} />
            <Route path="/achievements/:id/edit" element={<AchievementForm mode="edit" />} />
          </Route>
          {/* PROTOTYPE route — throwaway, do not ship. */}
          <Route path="/prototype/sidebar-bg" element={<SidebarBgPrototype />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
