'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/sheetsAuth'
import { sheetsClient } from '@/lib/googleSheetsClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSpinner, ErrorMessage, Card, Badge, Button, InputField } from '@/components/ui'
import { MultiSelect } from '@/components/MultiSelect'
import { POPULAR_SKILLS } from '@/constants/home'

interface ProfileData {
  name: string
  email: string
  bio: string
  skills: string[]
  experience: string
  hourlyRate: string
  availability: 'full-time' | 'part-time' | 'contract'
  portfolio: string
  github: string
  linkedin: string
}

interface AnalysisResult {
  extractedSkills: string[]
  experienceLevel: 'junior' | 'mid' | 'senior'
  suggestions: string[]
  confidence: number
  hourlyRateRange?: { min: number; max: number }
  marketDemand?: 'low' | 'medium' | 'high'
  improvementAreas?: string[]
}

function FreelancerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    skills: [],
    experience: '',
    hourlyRate: '',
    availability: 'full-time',
    portfolio: '',
    github: '',
    linkedin: ''
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
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
        
        // Load existing profile data
        setProfileData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          skills: user.skills || []
        }))

      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file')
        return
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB')
        return
      }

      setUploadedFile(file)
      setError('')
      setSuccess(`File "${file.name}" selected for analysis`)
    }
  }

  const analyzeProfile = async () => {
    if (!uploadedFile && !profileData.bio && !profileData.experience) {
      setError('Please upload a resume or fill in your bio and experience to analyze')
      return
    }

    setAnalyzing(true)
    setError('')

    try {
      // Prepare analysis data
      const analysisData = {
        text: profileData.bio + ' ' + profileData.experience,
        skills: profileData.skills,
        experience: profileData.experience
      }

      // Call AI analysis API
      const response = await fetch('/api/ai/analyze/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const analysis: AnalysisResult = await response.json()
      setAnalysisResult(analysis)
      setSuccess('Profile analysis completed! Review the suggestions below.')

      // Auto-add extracted skills to profile (only new ones)
      const newSkills = analysis.extractedSkills.filter(skill => 
        !profileData.skills.includes(skill)
      )
      
      if (newSkills.length > 0) {
        setProfileData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills]
        }))
      }

      // Auto-suggest hourly rate if not set
      if (!profileData.hourlyRate && analysis.hourlyRateRange) {
        const suggestedRate = Math.round((analysis.hourlyRateRange.min + analysis.hourlyRateRange.max) / 2)
        setProfileData(prev => ({
          ...prev,
          hourlyRate: suggestedRate.toString()
        }))
      }

    } catch (err) {
      console.error('Error analyzing profile:', err)
      setError('Failed to analyze profile. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const extractSkillsFromText = (text: string): string[] => {
    const allSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Machine Learning',
      'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
      'Next.js', 'Vue.js', 'Angular', 'Express', 'FastAPI', 'Django', 'Flask',
      'Data Science', 'AI', 'NLP', 'Computer Vision', 'Deep Learning', 'SQL',
      'NoSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'DevOps'
    ]
    
    return allSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 8) // Limit to 8 skills
  }

  const determineExperienceLevel = (text: string): 'junior' | 'mid' | 'senior' => {
    const seniorKeywords = ['senior', 'lead', 'architect', '5+ years', 'team lead', 'management']
    const midKeywords = ['3 years', '4 years', 'intermediate', 'mid-level']
    
    const textLower = text.toLowerCase()
    
    if (seniorKeywords.some(keyword => textLower.includes(keyword))) {
      return 'senior'
    } else if (midKeywords.some(keyword => textLower.includes(keyword))) {
      return 'mid'
    }
    return 'junior'
  }

  const generateSuggestions = (text: string): string[] => {
    const suggestions = [
      'Consider adding specific project examples to showcase your experience',
      'Include quantifiable achievements (e.g., "improved performance by 40%")',
      'Add more technical skills relevant to AI/ML projects',
      'Mention your preferred project types and industries',
      'Include links to your GitHub repositories or portfolio',
      'Describe your problem-solving approach and methodology'
    ]
    
    return suggestions.slice(0, 3) // Return 3 random suggestions
  }

  const saveProfile = async () => {
    setSaving(true)
    setError('')

    try {
      // Validate required fields
      if (!profileData.name || !profileData.bio || profileData.skills.length === 0) {
        setError('Please fill in name, bio, and at least one skill')
        return
      }

      // In real implementation, update user profile in sheets
      console.log('Saving profile:', profileData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Profile saved successfully!')
      
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Freelancer Profile</h1>
                <p className="text-gray-600 mt-1">Complete your profile to get better job matches</p>
              </div>
              <Link href="/dashboard/freelancer">
                <Button className="bg-gray-600 hover:bg-gray-700">
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            {error && <ErrorMessage message={error} className="mb-4" />}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                  
                  <InputField
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    disabled
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience & Background
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Describe your relevant work experience, projects, and achievements..."
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                <MultiSelect
                  label="Technical Skills"
                  options={POPULAR_SKILLS}
                  value={profileData.skills}
                  onChange={(selected) => handleInputChange('skills', selected)}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Add skills that match the types of projects you want to work on
                </p>
              </Card>

              {/* Work Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Hourly Rate ($)"
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="75"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={profileData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Links */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Links</h2>
                <div className="space-y-4">
                  <InputField
                    label="Portfolio Website"
                    value={profileData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                  
                  <InputField
                    label="GitHub Profile"
                    value={profileData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                  
                  <InputField
                    label="LinkedIn Profile"
                    value={profileData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>

            {/* AI Analysis Sidebar */}
            <div className="space-y-6">
              {/* Resume Upload & Analysis */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Profile Analysis
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume/CV
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, TXT (max 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                    {uploadedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {uploadedFile.name}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={analyzeProfile}
                    disabled={analyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {analyzing ? 'Analyzing...' : '🔍 Analyze Profile'}
                  </Button>
                </div>

                {/* Analysis Results */}
                {analysisResult && (
                  <div className="mt-6 space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">📊 Analysis Results</h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-gray-500">Experience Level</span>
                            <div>
                              <Badge variant="primary" className="text-xs">
                                {analysisResult.experienceLevel.charAt(0).toUpperCase() + analysisResult.experienceLevel.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-xs text-gray-500">Confidence</span>
                            <div className="text-sm font-medium">
                              {Math.round(analysisResult.confidence * 100)}%
                            </div>
                          </div>
                        </div>

                        {analysisResult.hourlyRateRange && (
                          <div>
                            <span className="text-xs text-gray-500">Suggested Rate Range</span>
                            <div className="text-sm font-medium text-green-600">
                              ${analysisResult.hourlyRateRange.min} - ${analysisResult.hourlyRateRange.max}/hour
                            </div>
                          </div>
                        )}

                        {analysisResult.marketDemand && (
                          <div>
                            <span className="text-xs text-gray-500">Market Demand</span>
                            <div>
                              <Badge 
                                variant={analysisResult.marketDemand === 'high' ? 'success' : analysisResult.marketDemand === 'medium' ? 'warning' : 'secondary'}
                                className="text-xs"
                              >
                                {analysisResult.marketDemand.charAt(0).toUpperCase() + analysisResult.marketDemand.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {analysisResult.extractedSkills.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500">Detected Skills</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {analysisResult.extractedSkills.slice(0, 6).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-xs text-gray-500">💡 Suggestions</span>
                          <ul className="mt-1 text-xs text-gray-600 space-y-1">
                            {analysisResult.suggestions.slice(0, 3).map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>

                        {analysisResult.improvementAreas && analysisResult.improvementAreas.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500">🎯 Growth Areas</span>
                            <ul className="mt-1 text-xs text-gray-600 space-y-1">
                              {analysisResult.improvementAreas.map((area, index) => (
                                <li key={index}>• {area}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Profile Completeness */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Completeness
                </h3>
                
                {(() => {
                  const fields = [
                    { key: 'name', label: 'Name', completed: !!profileData.name },
                    { key: 'bio', label: 'Bio', completed: !!profileData.bio },
                    { key: 'skills', label: 'Skills', completed: profileData.skills.length > 0 },
                    { key: 'experience', label: 'Experience', completed: !!profileData.experience },
                    { key: 'hourlyRate', label: 'Hourly Rate', completed: !!profileData.hourlyRate },
                    { key: 'portfolio', label: 'Portfolio', completed: !!profileData.portfolio }
                  ]
                  
                  const completedCount = fields.filter(f => f.completed).length
                  const percentage = Math.round((completedCount / fields.length) * 100)
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Completed</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {fields.map((field) => (
                          <div key={field.key} className="flex items-center justify-between text-sm">
                            <span>{field.label}</span>
                            {field.completed ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-gray-400">○</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function FreelancerProfilePageWrapper() {
  return <FreelancerProfilePage />
}