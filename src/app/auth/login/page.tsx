/**
 * Authentication Page Component
 * 
 * Handles both sign-in and sign-up functionality for freelancers and clients.
 * Provides role-based authentication with comprehensive error handling and validation.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signUpWithEmail } from '@/lib/sheetsAuth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { 
  LoadingSpinner, 
  ErrorMessage, 
  SuccessMessage, 
  Card, 
  Button,
  InputField,
  SecondaryButton
} from '@/components/ui'

/**
 * Form Validation Errors Interface
 */
interface FormErrors {
  email?: string
  password?: string
  name?: string
}

/**
 * Main Authentication Component
 */
function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [role, setRole] = useState<'freelancer' | 'client'>('freelancer')
  const router = useRouter()

  // Get role from URL parameters on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const roleParam = urlParams.get('role') as 'freelancer' | 'client'
      if (roleParam) {
        setRole(roleParam)
      }
    }
  }, [])

  /**
   * Validate form data
   */
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password.trim()) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (isSignUp && !name.trim()) {
      errors.name = 'Name is required'
    }

    return errors
  }

  /**
   * Handle authentication (sign in or sign up)
   */
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    setError('')
    setMessage('')
    setFormErrors({})

    try {
      if (isSignUp) {
        const result = await signUpWithEmail(email, password, role, name)
        if (result.success) {
          setMessage('Success! Check your email for the confirmation link.')
          // Clear form after successful signup
          setEmail('')
          setPassword('')
          setName('')
        } else {
          setError(result.error || 'Sign up failed')
        }
      } else {
        const result = await signInWithEmail(email, password)
        if (result.success) {
          router.push(`/dashboard/${role}`)
        } else {
          setError(result.error || 'Sign in failed')
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Toggle between sign in and sign up modes
   */
  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setMessage('')
    setFormErrors({})
  }

  /**
   * Clear error message
   */
  const clearError = () => setError('')

  /**
   * Clear success message
   */
  const clearMessage = () => setMessage('')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            As a <span className="font-medium text-indigo-600 capitalize">{role}</span>
          </p>
        </div>

        <Card>
          {/* Error and Success Messages */}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={clearError}
              className="mb-6"
            />
          )}
          
          {message && (
            <SuccessMessage 
              message={message} 
              onDismiss={clearMessage}
              className="mb-6"
            />
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            {isSignUp && (
              <InputField
                label="Full Name"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={formErrors.name}
                placeholder="Enter your full name"
              />
            )}
            <InputField
              label="Email Address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              placeholder="Enter your email address"
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
              placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="text-center">
              <SecondaryButton
                type="button"
                onClick={toggleMode}
                className="text-sm text-indigo-600 hover:text-indigo-500 bg-transparent border-none shadow-none hover:bg-gray-50"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : 'Need an account? Sign up'
                }
              </SecondaryButton>
            </div>

            {/* Role Selection Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Looking to {role === 'freelancer' ? 'hire talent' : 'find work'}?
              </p>
              <a 
                href={`/auth/login?role=${role === 'freelancer' ? 'client' : 'freelancer'}`}
                className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in as a {role === 'freelancer' ? 'client' : 'freelancer'}
              </a>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Login Page with Error Boundary
 * 
 * Wraps the authentication component with error boundary for better error handling
 */
export default function LoginPage() {
  return (
    <ErrorBoundary>
      <LoginPageContent />
    </ErrorBoundary>
  )
}