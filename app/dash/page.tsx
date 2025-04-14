'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { NavBar } from '../components/nav_bar'
export default function DashPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Laddar...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Profile'}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200" />
          )}
          <div>
            <h1 className="text-xl font-semibold">
              Välkommen {session?.user?.name || session?.user?.email}!
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
} 