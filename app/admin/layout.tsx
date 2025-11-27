'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only protect routes that are not the login page
    if (pathname !== '/admin' && pathname?.startsWith('/admin') && !isAdminAuthenticated()) {
      router.push('/admin')
    }
  }, [pathname, router])

  return <div className="admin-layout">{children}</div>
}

