/**
 * Error Boundary Component
 * 
 * React Error Boundary to catch JavaScript errors anywhere in the component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */

'use client'

import React from 'react'
import { ErrorMessage } from './ui'

/**
 * Error Boundary State Interface
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

/**
 * Error Boundary Props Interface
 */
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Default Error Fallback Component
 * 
 * @param error - The error that occurred
 * @param resetError - Function to reset the error boundary
 */
function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <ErrorMessage
          message="Something went wrong. Please try again."
          className="mb-4"
        />
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Error Details</h2>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Error Message:</p>
            <p className="text-sm text-gray-600 font-mono">{error.message}</p>
          </div>
          
          {process.env.NODE_ENV === 'development' && error.stack && (
            <div className="bg-gray-50 rounded-md p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</p>
              <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                {error.stack}
              </pre>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={resetError}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Error Boundary Class Component
 * 
 * Catches JavaScript errors in the component tree and displays a fallback UI.
 * Provides error logging and recovery mechanisms.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Static method to update state when an error occurs
   * 
   * @param error - The error that occurred
   * @returns Updated state object
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  /**
   * Lifecycle method called when an error occurs
   * 
   * @param error - The error that occurred
   * @param errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log errors to an external service
    // Example: Sentry, LogRocket, or custom error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  /**
   * Reset error boundary state
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Higher-Order Component for wrapping components with Error Boundary
 * 
 * @param Component - Component to wrap
 * @param errorBoundaryProps - Props for the error boundary
 * @returns Wrapped component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook for handling async errors in functional components
 * 
 * @returns Function to throw errors to be caught by Error Boundary
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    // Create a new error with additional context
    const errorWithContext = new Error(`Async error: ${error.message}`)
    errorWithContext.stack = error.stack

    // Throw in next tick to be caught by Error Boundary
    setTimeout(() => {
      throw errorWithContext
    }, 0)
  }, [])
}

/**
 * Custom Error Classes for different types of errors
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}