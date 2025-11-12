'use client'

import { useState, useEffect } from 'react'
import { sheetsClient, Job as SheetsJob } from '@/lib/googleSheetsClient'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSpinner, ErrorMessage, Card, Badge, Button } from '@/components/ui'

// Temporary type mapping
interface Job {
  id: string
  title: string
  description: string
  skills: string[]
  budget: number
  status: string
  createdAt: string
}

interface JobApplication {
  id: string
  job_id: string
  freelancer_id: string
  status: string
  created_at: string
  freelancer: {
    name: string
    skills: string[]
  }
  job: {
    title: string
  }
}

function ClientDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [pendingApplications, setPendingApplications] = useState<JobApplication[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login?role=client')
          return
        }

        if (currentUser.role !== 'client') {
          router.push('/auth/login?role=client')
          return
        }

        // Fetch jobs for this client
        const sheetsJobs = await sheetsClient.getJobsByClient(currentUser.id)
        const jobs: Job[] = sheetsJobs.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          skills: job.skills,
          budget: job.budget,
          status: job.status,
          createdAt: job.createdAt
        }))
        
        const activeJobsFiltered = jobs.filter(job => job.status === 'open')
        setActiveJobs(activeJobsFiltered)

        // For demo, create some sample pending applications
        const sampleApplications: JobApplication[] = activeJobsFiltered.length > 0 ? [
          {
            id: 'app1',
            job_id: activeJobsFiltered[0].id,
            freelancer_id: 'freelancer1',
            status: 'applied',
            created_at: new Date().toISOString(),
            freelancer: {
              name: 'Sarah Johnson',
              skills: ['React', 'Node.js', 'TypeScript']
            },
            job: {
              title: activeJobsFiltered[0].title
            }
          },
          {
            id: 'app2',
            job_id: activeJobsFiltered[0].id,
            freelancer_id: 'freelancer2', 
            status: 'applied',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            freelancer: {
              name: 'Michael Chen',
              skills: ['Python', 'Machine Learning', 'TensorFlow']
            },
            job: {
              title: activeJobsFiltered[0].title
            }
          }
        ] : []
        
        setPendingApplications(sampleApplications)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
              </div>
              <Link href="/jobs/post">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <ErrorMessage 
              message={error}
              className="mb-6"
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{activeJobs.length}</p>
                  <p className="text-gray-600">Active Jobs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{pendingApplications.length}</p>
                  <p className="text-gray-600">New Applications</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">8</p>
                  <p className="text-gray-600">Active Freelancers</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Jobs */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Job Postings</h2>
              {activeJobs.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No active jobs posted yet</p>
                  <Link href="/jobs/post">
                    <Button>Post Your First Job</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <Card key={job.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>${job.budget} • Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        <Button className="text-indigo-600 hover:text-indigo-800">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Applications */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
              {pendingApplications.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No pending applications</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.map((application) => (
                    <Card key={application.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{application.freelancer.name}</h3>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">Applied for: {application.job.title}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {application.freelancer.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.created_at).toLocaleDateString()}
                        </span>
                        <Button className="text-indigo-600 hover:text-indigo-800">
                          Review Application
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function ClientDashboardPage() {
  return <ClientDashboard />
}