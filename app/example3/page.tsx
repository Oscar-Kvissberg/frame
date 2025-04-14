'use client'

import React from 'react'
import { NavBar } from '../components/nav_bar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const Example3 = () => {
  useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })
  
  return (
    <div className="flex flex-col h-screen w-screen mt-14">
      <NavBar />
      <div>Hello World 3</div>
    </div>
  )
}

export default Example3