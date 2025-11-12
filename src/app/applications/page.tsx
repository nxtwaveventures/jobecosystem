'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from '@/components/ui'

interface Application {
  id: string
  jobId: string
  freelancerId: string
  status: 'applied' | 'interview' | 'accepted' | 'rejected'
  createdAt: string
  job: {
    title: string
    budget: number
    client: {
      name: string
    }
  }
}

function ApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'applied' | 'interview' | 'accepted' | 'rejected'>('all')
  const router = useRouter()

  useEffect(() => {
    async function fetchApplications() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/auth/login?role=freelancer')
          return
        }

        if (user.role !== 'freelancer') {
          router.push('/dashboard/client')
          return
        }

        setCurrentUser(user)

        // In real implementation, fetch from applications sheet
        // For now, create demo applications
        const demoApplications: Application[] = [
          {
            id: 'app-1',
            jobId: 'demo-1',
            freelancerId: user.id,
            status: 'interview',
            createdAt: new Date().toISOString(),
            job: {
              title: 'AI Chatbot Development',
              budget: 3500,
              client: {
                name: 'Tech Corp Inc.'
              }
            }
          },
          {
            id: 'app-2',
            jobId: 'demo-2',
            freelancerId: user.id,
            status: 'applied',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            job: {
              title: 'React Native Mobile App',
              budget: 5000,
              client: {
                name: 'Startup Labs'
              }
            }
          },
          {
            id: 'app-3',
            jobId: 'demo-3',
            freelancerId: user.id,
            status: 'accepted',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            job: {
              title: 'Data Science Pipeline',
              budget: 4200,
              client: {
                name: 'Analytics Pro'
              }
            }
          },
          {
            id: 'app-4',
            jobId: 'demo-4',
            freelancerId: user.id,
            status: 'rejected',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            job: {
              title: 'Next.js E-commerce Platform',
              budget: 6000,
              client: {
                name: 'E-Shop Solutions'
              }
            }
          }
        ]

        setApplications(demoApplications)

      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [router])

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'warning'
      case 'interview': return 'primary'
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'interview':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        )
      case 'accepted':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'rejected':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-1">Track your job applications and their status</p>
              </div>
              <div className="flex gap-3">
                <Link href="/jobs">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Browse More Jobs
                  </Button>
                </Link>
                <Link href="/dashboard/freelancer">
                  <Button className="bg-gray-600 hover:bg-gray-700">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {error && (
              <ErrorMessage message={error} className="mb-6" />
            )}

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg inline-flex">
              {[
                { key: 'all', label: 'All', count: applications.length },
                { key: 'applied', label: 'Applied', count: applications.filter(a => a.status === 'applied').length },
                { key: 'interview', label: 'Interview', count: applications.filter(a => a.status === 'interview').length },
                { key: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
                { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'all' 
                    ? 'Start applying to jobs to track your applications here.'
                    : `You don't have any ${filter} applications at the moment.`
                  }
                </p>
                <Link href="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {application.job.title}
                          </h3>
                          <p className="text-gray-600">
                            {application.job.client.name} • ${application.job.budget.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(application.status) as any}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                          {application.status === 'interview' && (
                            <span className="ml-4 text-blue-600 font-medium">
                              🎉 Interview scheduled!
                            </span>
                          )}
                          {application.status === 'accepted' && (
                            <span className="ml-4 text-green-600 font-medium">
                              🎉 Congratulations! You got the job!
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/jobs/${application.jobId}`}>
                            <Button className="text-indigo-600 bg-transparent border-none shadow-none hover:bg-gray-50">
                              View Job
                            </Button>
                          </Link>
                          {application.status === 'accepted' && (
                            <Button className="bg-green-600 hover:bg-green-700">
                              Start Work
                            </Button>
                          )}
                          {application.status === 'interview' && (
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Interview Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {applications.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 'interview').length}
                </div>
                <div className="text-sm text-gray-600">Interviews</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function ApplicationsPageWrapper() {
  return <ApplicationsPage />
}