import { redirect } from 'next/navigation'

export default function AdminRootPage() {
  // The AuthProvider will handle the rest of the logic.
  // If logged in, it will show the dashboard.
  // If not, it will redirect to the login page.
  redirect('/admin/dashboard')
}
