'use client'

import { useState, useEffect } from 'react'
import { sheetsClient } from '@/lib/googleSheetsClient'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSpinner, ErrorMessage, Card, Badge, Button, InputField } from '@/components/ui'

interface Job {
  id: string
  clientId: string
  title: string
  description: string
  skills: string[]
  budget: number
  status: string
  createdAt: string
}

interface FilterState {
  search: string
  skills: string[]
  minBudget: string
  maxBudget: string
  sortBy: 'newest' | 'budget-high' | 'budget-low'
}

function JobBrowsePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    skills: [],
    minBudget: '',
    maxBudget: '',
    sortBy: 'newest'
  })
  const router = useRouter()

  // Popular skills for filter chips
  const popularSkills = [
    'React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript', 
    'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Next.js'
  ]

  useEffect(() => {
    async function fetchJobs() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
        
        // Fetch all jobs
        const allJobs = await sheetsClient.getJobs()
        const openJobs = allJobs.filter(job => job.status === 'open')
        
        // Add some demo jobs if no jobs exist
        let jobsToShow = openJobs
        if (openJobs.length === 0) {
          jobsToShow = [
            {
              id: 'demo-1',
              clientId: 'client-1',
              title: 'AI Chatbot Development',
              description: 'Build an intelligent chatbot using OpenAI GPT-4 for customer service automation. Must have experience with AI/ML and natural language processing.',
              skills: ['Python', 'OpenAI', 'Machine Learning', 'NLP'],
              budget: 3500,
              status: 'open',
              createdAt: new Date().toISOString()
            },
            {
              id: 'demo-2',
              clientId: 'client-2', 
              title: 'React Native Mobile App',
              description: 'Develop a cross-platform mobile application with real-time features and cloud integration.',
              skills: ['React Native', 'TypeScript', 'Firebase', 'Mobile Development'],
              budget: 5000,
              status: 'open',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 'demo-3',
              clientId: 'client-3',
              title: 'Data Science Pipeline',
              description: 'Create an end-to-end machine learning pipeline for predictive analytics on large datasets.',
              skills: ['Python', 'Pandas', 'Scikit-learn', 'AWS', 'Data Science'],
              budget: 4200,
              status: 'open',
              createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: 'demo-4',
              clientId: 'client-4',
              title: 'Next.js E-commerce Platform',
              description: 'Build a modern e-commerce platform with payment integration, inventory management, and admin dashboard.',
              skills: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
              budget: 6000,
              status: 'open',
              createdAt: new Date(Date.now() - 259200000).toISOString()
            }
          ]
        }
        
        setJobs(jobsToShow)
        setFilteredJobs(jobsToShow)
        
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter and sort jobs whenever filters change
  useEffect(() => {
    let filtered = [...jobs]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower))
      )
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(filterSkill =>
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        )
      )
    }

    // Budget filter
    if (filters.minBudget) {
      filtered = filtered.filter(job => job.budget >= Number(filters.minBudget))
    }
    if (filters.maxBudget) {
      filtered = filtered.filter(job => job.budget <= Number(filters.maxBudget))
    }

    // Sort
    switch (filters.sortBy) {
      case 'budget-high':
        filtered.sort((a, b) => b.budget - a.budget)
        break
      case 'budget-low':
        filtered.sort((a, b) => a.budget - b.budget)
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredJobs(filtered)
  }, [jobs, filters])

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      skills: [],
      minBudget: '',
      maxBudget: '',
      sortBy: 'newest'
    })
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
                <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                <p className="text-gray-600 mt-1">Find AI/ML projects that match your skills</p>
              </div>
              <div className="flex gap-3">
                <Link href="/">
                  <Button className="bg-gray-600 hover:bg-gray-700">
                    Back to Home
                  </Button>
                </Link>
                {currentUser && (
                  <Link href={`/dashboard/${currentUser.role}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      My Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {error && (
              <ErrorMessage message={error} className="mb-6" />
            )}

            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div className="lg:col-span-2">
                  <InputField
                    label="Search Jobs"
                    placeholder="Search by title, description, or skills..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                {/* Budget Range */}
                <div className="flex gap-2">
                  <InputField
                    label="Min Budget ($)"
                    type="number"
                    placeholder="0"
                    value={filters.minBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                  />
                  <InputField
                    label="Max Budget ($)"
                    type="number"
                    placeholder="10000"
                    value={filters.maxBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  >
                    <option value="newest">Newest First</option>
                    <option value="budget-high">Highest Budget</option>
                    <option value="budget-low">Lowest Budget</option>
                  </select>
                </div>
              </div>

              {/* Skills Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Skills</label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkillFilter(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.skills.includes(skill)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {(filters.search || filters.skills.length > 0 || filters.minBudget || filters.maxBudget) && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new opportunities.</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>${job.budget.toLocaleString()}</span>
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="success">Open</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/jobs/${job.id}`} className="flex-1">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        View Details
                      </Button>
                    </Link>
                    {currentUser?.role === 'freelancer' && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        Quick Apply
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function JobBrowsePageWrapper() {
  return <JobBrowsePage />
}