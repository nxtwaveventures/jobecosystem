/**
 * Reusable UI Components
 * 
 * This module exports common UI components used throughout the application
 * to maintain consistency and reduce code duplication.
 */

import React from 'react'
import { MultiSelect as MultiSelectComponent } from './MultiSelect'
import { Tabs as TabsComponent } from './ui/Tabs'

export const MultiSelect = MultiSelectComponent
export const Tabs = TabsComponent

/**
 * Loading Spinner Component
 * 
 * @param size - Size of the spinner ('sm' | 'md' | 'lg')
 * @param className - Additional CSS classes
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Error Message Component
 * 
 * @param message - Error message to display
 * @param onDismiss - Optional callback when error is dismissed
 * @param className - Additional CSS classes
 */
interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Success Message Component
 * 
 * @param message - Success message to display
 * @param onDismiss - Optional callback when message is dismissed
 * @param className - Additional CSS classes
 */
interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function SuccessMessage({ message, onDismiss, className = '' }: SuccessMessageProps) {
  return (
    <div className={`rounded-md bg-green-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Primary Button Component
 * 
 * @param children - Button content
 * @param onClick - Click handler
 * @param disabled - Whether button is disabled
 * @param loading - Whether button is in loading state
 * @param type - Button type
 * @param className - Additional CSS classes
 */
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false, 
  type = 'button',
  className = '' 
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
        text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
        ${className}
      `}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

/**
 * Secondary Button Component
 * 
 * @param children - Button content
 * @param onClick - Click handler
 * @param disabled - Whether button is disabled
 * @param loading - Whether button is in loading state
 * @param type - Button type
 * @param className - Additional CSS classes
 */
export function SecondaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false, 
  type = 'button',
  className = '' 
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md 
        text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
        ${className}
      `}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

/**
 * Input Field Component
 * 
 * @param label - Input label
 * @param error - Error message to display
 * @param className - Additional CSS classes
 * @param props - Additional input props
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export function InputField({ label, error, className = '', ...props }: InputFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

/**
 * Textarea Field Component
 * 
 * @param label - Textarea label
 * @param error - Error message to display
 * @param className - Additional CSS classes
 * @param props - Additional textarea props
 */
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}

export function TextareaField({ label, error, className = '', ...props }: TextareaFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

/**
 * Card Component
 * 
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param padding - Padding size ('sm' | 'md' | 'lg')
 */
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`bg-white shadow rounded-lg ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Badge Component
 * 
 * @param children - Badge content
 * @param variant - Badge color variant
 * @param className - Additional CSS classes
 */
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  className?: string
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}