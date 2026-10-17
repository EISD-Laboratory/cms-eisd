import { useNavigate } from 'react-router-dom'

/**
 * Returns a handler that leaves the current page by returning to the previous
 * entry in history — so a form opened from the dashboard goes back to the
 * dashboard, and one opened from a list goes back to that list.
 *
 * Falls back to `fallback` when there is no in-app history to return to
 * (fresh tab, bookmark, or refresh on the form URL) so users never get sent
 * out of the app.
 */
export function useBack(fallback: string) {
  const navigate = useNavigate()

  return () => {
    // React Router stamps each history entry with a numeric `idx` (0 = first
    // entry). Anything > 0 means there is somewhere in-app to go back to.
    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) void navigate(-1)
    else void navigate(fallback)
  }
}
