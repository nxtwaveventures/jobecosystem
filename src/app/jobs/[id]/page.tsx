'use client'

import { useState, useEffect } from 'react'
import { sheetsClient } from '@/lib/googleSheetsClient'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from '@/components/ui'

interface Job {
  id: string
  clientId: string
  title: string
  description: string
  skills: string[]
  budget: number
  status: 'open' | 'closed'
  createdAt: string
}

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

function JobDetailsContent({ params }: JobDetailsPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [job, setJob] = useState<Job | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)

        // Try to get job from sheets first
        const allJobs = await sheetsClient.getJobs()
        let foundJob = allJobs.find(j => j.id === params.id)

        // If not found in sheets, create demo job data
        if (!foundJob) {
          const demoJobs: Record<string, Job> = {
            'demo-1': {
              id: 'demo-1',
              clientId: 'client-1',
              title: 'AI Chatbot Development',
              description: `We are looking for an experienced AI developer to build an intelligent chatbot for our customer service platform. 

## Project Overview
This project involves creating a sophisticated chatbot that can handle complex customer inquiries, provide accurate information, and escalate to human agents when necessary.

## Key Requirements
- Integration with OpenAI GPT-4 API
- Natural Language Processing expertise
- Experience with customer service automation
- Knowledge of machine learning algorithms
- Proficiency in Python and JavaScript

## Technical Stack
- Python for backend development
- OpenAI GPT-4 API integration
- React.js for admin dashboard
- Node.js and Express for API
- MongoDB for conversation storage
- Docker for containerization

## Project Scope
- Design and implement chatbot logic
- Create training datasets
- Develop admin dashboard
- API integration and testing
- Documentation and deployment

## Budget and Timeline
Budget: $3,500
Timeline: 6-8 weeks

## How to Apply
Please include:
1. Portfolio of similar AI projects
2. Proposed technical approach
3. Timeline breakdown
4. References from previous clients`,
              skills: ['Python', 'OpenAI', 'Machine Learning', 'NLP', 'React', 'Node.js'],
              budget: 3500,
              status: 'open',
              createdAt: new Date().toISOString()
            },
            'demo-2': {
              id: 'demo-2',
              clientId: 'client-2',
              title: 'Mobile App with AI Features',
              description: `## Project Description

We need an experienced React Native developer to create a cutting-edge mobile application with integrated AI capabilities.

## Core Features
- Image recognition and classification
- Voice-to-text functionality
- AI-powered recommendations
- Real-time chat interface
- Offline mode support
- User authentication

## Technical Requirements
- React Native for cross-platform development
- TensorFlow Lite for on-device AI
- Firebase for backend services
- WebRTC for real-time features
- Redux for state management
- TypeScript for type safety

## Expected Timeline
4-6 weeks development + 2 weeks testing`,
              skills: ['React Native', 'TypeScript', 'Firebase', 'WebRTC', 'Redux'],
              budget: 5000,
              status: 'open',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          }

          foundJob = demoJobs[params.id as keyof typeof demoJobs]
        }

        if (!foundJob) {
          setError('Job not found')
          return
        }

        setJob(foundJob)

        // Check if user has already applied (mock for now)
        if (user?.role === 'freelancer') {
          // In real implementation, check applications sheet
          const hasAppliedBefore = Math.random() > 0.7 // Random for demo
          setHasApplied(hasAppliedBefore)
        }

      } catch (err) {
        console.error('Error fetching job details:', err)
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [params.id])

  const handleApply = async () => {
    if (!currentUser) {
      router.push('/auth/login?role=freelancer')
      return
    }

    if (currentUser.role !== 'freelancer') {
      alert('Only freelancers can apply to jobs')
      return
    }

    setApplying(true)
    
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, add to applications sheet:
      // await sheetsClient.addApplication({
      //   jobId: job.id,
      //   freelancerId: currentUser.id,
      //   status: 'applied'
      // })
      
      console.log('Application submitted for job:', job?.id)
      setHasApplied(true)
      alert('Application submitted successfully!')
      
    } catch (err) {
      console.error('Error applying to job:', err)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
          <p className="text-gray-600 mb-4">The job you&rsquo;re looking for doesn&rsquo;t exist or has been removed.</p>
          <Link href="/jobs">
            <Button>Browse Other Jobs</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link href="/jobs" className="text-indigo-600 hover:text-indigo-800 text-sm">
              ← Back to Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      <Badge variant="success">Open</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${job.budget.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Fixed Price</div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  {job.description.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('## ', '')}</h3>
                    } else if (paragraph.startsWith('- ')) {
                      return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>
                    } else if (paragraph.trim()) {
                      return <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                    }
                    return null
                  })}
                </div>
              </Card>

              {/* Skills Required */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to this job</h3>
                
                {!currentUser ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Sign in to apply for this job</p>
                    <Link href="/auth/login?role=freelancer" className="block">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign In to Apply
                      </Button>
                    </Link>
                  </div>
                ) : currentUser.role !== 'freelancer' ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Only freelancers can apply to jobs</p>
                    <Link href="/auth/login?role=freelancer" className="block">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Switch to Freelancer
                      </Button>
                    </Link>
                  </div>
                ) : hasApplied ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Application Submitted</span>
                    </div>
                    <p className="text-sm text-gray-600">You have already applied to this job.</p>
                    <Link href="/dashboard/freelancer" className="block">
                      <Button className="w-full">View My Applications</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      By applying, you agree to our terms of service
                    </p>
                  </div>
                )}
              </Card>

              {/* Job Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget</span>
                    <p className="text-lg font-semibold text-gray-900">${job.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <p className="text-gray-900">Open for applications</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Posted</span>
                    <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Job ID</span>
                    <p className="text-gray-900 font-mono text-sm">{job.id}</p>
                  </div>
                </div>
              </Card>

              {/* Similar Jobs */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  <Link href="/jobs/demo-2" className="block p-3 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">React Native App</h4>
                    <p className="text-sm text-gray-600">$5,000</p>
                  </Link>
                  <Link href="/jobs" className="block text-center">
                    <Button className="text-indigo-600 bg-transparent border-none shadow-none hover:bg-gray-50">
                      View All Jobs
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  return <JobDetailsContent params={params} />
}