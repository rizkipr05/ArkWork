'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type SimpleUser = { email?: string | null; name?: string | null } | null

export default function Dashboard() {
  const router = useRouter()

  const auth = useAuth() as { user: SimpleUser; loading?: boolean }
  const user = auth.user
  const loading = auth.loading ?? false

  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/auth/signin')
      return
    }

    try {
      const appsRaw = localStorage.getItem('ark_apps')
      const jobsRaw = localStorage.getItem('ark_jobs')

      const apps = JSON.parse(appsRaw ?? '{}')
      const jobs = JSON.parse(jobsRaw ?? '[]')

      const userKey = user?.email ?? ''
      const arr = (apps[userKey] ?? [])
        .slice(-3)
        .map((a: any) => ({
          ...a,
          title: jobs.find((j: any) => j.id === a.jobId)?.title ?? `Job ${a.jobId}`,
        }))

      setRecent(arr)
    } catch (e) {
      setRecent([])
      console.error('Failed to parse localStorage:', e)
    }
  }, [loading, user, router])

  if (loading) return null
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-8">
          Hi, {user?.name ?? 'there'}!
        </h1>

        {/* Dua kotak/card di tengah */}
        <div className="flex justify-center">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card My Profile */}
            <div className="rounded-lg bg-white p-6 shadow-lg border border-gray-300">
              <h3 className="mb-4 text-xl font-semibold">My Profile</h3>
              <p className="mb-4 text-gray-600">
                Complete your profile to get better job recommendations
              </p>
              <Link
                href="/profile"
                className="block rounded-lg bg-brand-yellow text-black hover:text-white py-2 text-center hover:bg-yellow-600 transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {/* Card Recent Activity */}
            <div className="rounded-lg bg-white p-6 shadow-lg border border-gray-300">
              <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
              <div className="space-y-2">
                {recent.length === 0 ? (
                  <p className="text-gray-600">No activity yet</p>
                ) : (
                  recent.map((r, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      Applied to {r.title} — {r.date}
                    </p>
                  ))
                )}
              </div>
              <Link
                href="/applications"
                className="mt-4 block rounded-lg bg-brand-yellow text-black hover:text-white py-2 text-center hover:bg-yellow-600 transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
