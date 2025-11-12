'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sheetsClient } from '@/lib/googleSheetsClient'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { 
  LoadingSpinner, 
  ErrorMessage, 
  Card, 
  Button, 
  InputField,
  MultiSelect
} from '@/components/ui'
import { POPULAR_SKILLS } from '@/constants/home'

interface JobFormData {
  title: string
  description: string
  skills_required: string[]
  budget: string
}

interface FormErrors {
  title?: string
  description?: string
  skills_required?: string
  budget?: string
}

export default function PostJob() {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    skills_required: [],
    budget: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const router = useRouter()

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Job title is required'
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required'
    }

    if (!formData.skills_required.length) {
      errors.skills_required = 'Please select at least one required skill'
    }

    if (!formData.budget.trim()) {
      errors.budget = 'Budget is required'
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      errors.budget = 'Please enter a valid budget amount'
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)

    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user')
      }

      if (currentUser.role !== 'client') {
        throw new Error('Only clients can post jobs')
      }

      // Create job posting using Google Sheets
      const jobId = await sheetsClient.addJob({
        clientId: currentUser.id,
        title: formData.title,
        description: formData.description,
        skills: formData.skills_required,
        budget: Number(formData.budget),
        status: 'open'
      })

      if (!jobId) {
        throw new Error('Failed to create job')
      }

      console.log('Job posted successfully:', jobId)
      
      // Redirect to dashboard
      router.push('/dashboard/client')
    } catch (err) {
      console.error('Error posting job:', err)
      setError('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-600 mt-2">
                Find the perfect AI/ML specialist for your project
              </p>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Job Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={formErrors.title}
                placeholder="e.g., AI Engineer for Computer Vision Project"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                  placeholder="Describe the project, requirements, and expectations..."
                  required
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              <MultiSelect
                label="Required Skills"
                options={POPULAR_SKILLS}
                value={formData.skills_required}
                onChange={(skills: string[]) => setFormData({ ...formData, skills_required: skills })}
                error={formErrors.skills_required}
              />

              <InputField
                label="Budget (USD)"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                error={formErrors.budget}
                placeholder="e.g., 5000"
                min="0"
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Post Job'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </ErrorBoundary>
  )
}