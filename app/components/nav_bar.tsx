'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { UserCircleIcon, RocketLaunchIcon, CakeIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { PrimaryButton } from './ui/primary_button'
import { SecondaryButton } from './ui/secondary_button'

export function NavBar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        const hamburgerButton = document.querySelector('#hamburger-button')
        if (!hamburgerButton?.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Hamburger button */}
      <button
        id="hamburger-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-0 h-14 flex items-center left-4 z-[51] p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <div className="flex flex-col gap-1.5 w-6">
          <span className={`block h-0.5 w-full bg-gray-900 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-full bg-gray-900 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full bg-gray-900 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Horizontal navbar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-40">
        <div className="h-full flex items-center justify-between ml-20">
          {/* Left side - Company name */}
          <div className="flex items-center">
            <h1 className="text-lg font-medium">
              <Link href="/">Company name</Link>
            </h1>
          </div>

          {/* Right side - Profile info and logout */}
          <div className="flex items-center gap-4">
            {session?.user?.name && session?.user?.email && (
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-800">{session.user.email}</p>
              </div>
            )}

            {session?.user?.image ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}

            {session ? (
              <SecondaryButton
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm mr-4"
                icon={<ArrowLeftEndOnRectangleIcon className="w-4 h-4" />}
              >
                Logga ut
              </SecondaryButton>
            ) : (
              <Link href="/login">
                <PrimaryButton className="text-sm">Logga in</PrimaryButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Side navigation */}
      <nav
        ref={navRef}
        className={`
          fixed left-0 top-0 h-screen w-64 
          bg-white
          border-r border-gray-200
          transition-transform duration-300 
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Profile section */}
        <div className="p-4 mt-16 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            )}
            <div>
              <h3 className="text-gray-900 text-xl font-light tracking-wide">
                {session?.user?.name || session?.user?.email || 'Guest'}
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="p-4">
          <div className="flex flex-col gap-4">

            <Link
              href="/example1"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-3"
            >
              <UserCircleIcon className="w-5 h-5" />
              Example 1
            </Link>

            <Link
              href="/example2"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-3"
            >
              <CakeIcon className="w-5 h-5" />
              Example 2
            </Link>

            <Link
              href="/example3"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-3"
            >
              <RocketLaunchIcon className="w-5 h-5" />
              Example 3
            </Link>
            
          </div>
        </div>
      </nav>
    </>
  )
}
