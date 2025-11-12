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
  job: {
    title: string
    budget: number
    client: {
      name: string
    }
  }
}

function FreelancerDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [myApplications, setMyApplications] = useState<JobApplication[]>([])
  const [matchingJobs, setMatchingJobs] = useState<Job[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login?role=freelancer')
          return
        }

        if (currentUser.role !== 'freelancer') {
          router.push('/auth/login?role=freelancer')
          return
        }

        // Get all jobs from sheets
        const allJobs = await sheetsClient.getJobs()
        const availableJobs: Job[] = allJobs
          .filter(job => job.status === 'open')
          .map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            skills: job.skills,
            budget: job.budget,
            status: job.status,
            createdAt: job.createdAt
          }))

        // Filter jobs that match freelancer skills
        const userSkills = currentUser.skills || []
        const matchingJobsFiltered = availableJobs.filter(job => 
          job.skills.some(skill => 
            userSkills.some(userSkill => 
              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(userSkill.toLowerCase())
            )
          )
        )
        setMatchingJobs(matchingJobsFiltered)

        // For demo, create some sample applications
        const sampleApplications: JobApplication[] = availableJobs.length > 0 ? [
          {
            id: 'app1',
            job_id: availableJobs[0].id,
            freelancer_id: currentUser.id,
            status: 'applied',
            created_at: new Date().toISOString(),
            job: {
              title: availableJobs[0].title,
              budget: availableJobs[0].budget,
              client: {
                name: 'Tech Corp Inc.'
              }
            }
          },
          {
            id: 'app2', 
            job_id: availableJobs[1]?.id || 'job2',
            freelancer_id: currentUser.id,
            status: 'interview',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            job: {
              title: availableJobs[1]?.title || 'ML Engineer Position',
              budget: availableJobs[1]?.budget || 5000,
              client: {
                name: 'AI Startup Ltd.'
              }
            }
          }
        ] : []
        
        setMyApplications(sampleApplications)

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
                <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
                <p className="text-gray-600 mt-1">Find jobs that match your skills</p>
              </div>
              <div className="flex gap-3">
                <Link href="/profile/freelancer">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Complete Profile
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <ErrorMessage 
              message={error}
              className="mb-6"
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{matchingJobs.length}</p>
                  <p className="text-gray-600">Matching Jobs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{myApplications.length}</p>
                  <p className="text-gray-600">Applications</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">$3,200</p>
                  <p className="text-gray-600">Avg. Bid</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">92%</p>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matching Jobs */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Jobs Matching Your Skills</h2>
              {matchingJobs.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No matching jobs found</p>
                  <p className="text-sm text-gray-400 mb-4">Update your skills to see more relevant opportunities</p>
                  <Button>Update Profile</Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {matchingJobs.slice(0, 3).map((job) => (
                    <Card key={job.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <Badge variant="success">${job.budget}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="secondary">+{job.skills.length - 3} more</Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Apply Now
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* My Applications */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>
              {myApplications.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No applications yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start applying to jobs that match your skills</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((application) => (
                    <Card key={application.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{application.job.title}</h3>
                        <Badge 
                          variant={
                            application.status === 'applied' ? 'warning' :
                            application.status === 'interview' ? 'primary' :
                            application.status === 'accepted' ? 'success' : 'secondary'
                          }
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">Client: {application.job.client.name}</p>
                      <p className="text-gray-600 mb-3">Budget: ${application.job.budget}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.created_at).toLocaleDateString()}
                        </span>
                        <Button className="text-indigo-600 hover:text-indigo-800">
                          View Details
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

export default function FreelancerDashboardPage() {
  return <FreelancerDashboard />
}