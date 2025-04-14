'use client'

import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { PrimaryButton } from '../components/ui/primary_button'
import { GoogleIcon } from '../components/ui/google_icon'
import Image from 'next/image'

function LoginContent() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Välkommen till Frame",
      description: "Din nya digitala arbetsplats",
      image: "/illustration1.svg"
    },
    {
      title: "Effektivt samarbete",
      description: "Jobba tillsammans, var som helst",
      image: "/illustration2.svg"
    },
    {
      title: "Säker och snabb",
      description: "Modern teknologi för moderna team",
      image: "/illustration3.svg"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const getErrorMessage = useCallback((errorCode?: string) => {
    switch (errorCode) {
      case 'OAuthAccountNotLinked':
        return 'Detta Google-konto är inte kopplat till något befintligt konto. Skapa först ett konto med din e-postadress.'
      case 'AccessDenied':
        return 'Åtkomst nekad. Kontrollera att du har rätt behörighet.'
      default:
        return error ? 'Ett fel uppstod vid inloggning. Försök igen.' : null
    }
  }, [error])

  useEffect(() => {
    if (registered) {
      setMessage('Konto skapat! Du kan nu logga in med Google.')
    }
    
    if (error) {
      setMessage(getErrorMessage(error))
    }
  }, [registered, error, getErrorMessage])

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setMessage(null)
      
      await signIn('google', {
        redirect: true,
        callbackUrl: '/dash'
      })
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Ett fel uppstod vid inloggning. Försök igen.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-500">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-900 mb-4">{slides[currentSlide].title}</h1>
            <p className="text-lg text-indigo-700 mb-8">{slides[currentSlide].description}</p>
            <div className="relative w-full max-w-lg mx-auto aspect-square">
              <Image
                src={slides[currentSlide].image}
                alt="Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? ' w-4' : ''
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center transform rotate-12">
                <span className="text-white text-2xl font-bold transform -rotate-12">F</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Välkommen tillbaka!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Logga in för att fortsätta till ditt konto
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes('Konto skapat') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <PrimaryButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 text-base"
              icon={<GoogleIcon />}
            >
              {isLoading ? 'Loggar in...' : 'Fortsätt med Google'}
            </PrimaryButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">eller</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/register" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Har du inget konto? Skapa ett här
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Laddar...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
} 