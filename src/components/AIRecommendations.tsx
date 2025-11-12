/**
 * AI Recommendations Component for Client Dashboard
 * 
 * Displays AI-powered freelancer recommendations for job postings
 * with detailed match scores, insights, and contact actions.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button, LoadingSpinner, ErrorMessage } from '@/components/ui'
import type { FreelancerMatch } from '@/lib/aiMatchingEngine'

/**
 * AI Recommendations Props
 */
interface AIRecommendationsProps {
  jobId: string
  onContactFreelancer?: (freelancerId: string) => void
}

/**
 * AI Recommendations Component
 */
export function AIRecommendations({ jobId, onContactFreelancer }: AIRecommendationsProps) {
  const [matches, setMatches] = useState<FreelancerMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    if (jobId) {
      fetchAIRecommendations()
    }
  }, [jobId])

  /**
   * Fetch AI recommendations for the job
   */
  const fetchAIRecommendations = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      const endpoint = `/api/ai/matches/${jobId}`
      const options: RequestInit = {
        method: forceRefresh ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...(forceRefresh && {
          body: JSON.stringify({ force_refresh: true })
        })
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations')
      }

      setMatches(data.matches || [])
      setLastUpdated(data.generated_at)

    } catch (error) {
      console.error('Error fetching AI recommendations:', error)
      setError(error instanceof Error ? error.message : 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get badge color based on match score
   */
  const getMatchBadgeVariant = (score: number): 'success' | 'warning' | 'secondary' => {
    if (score >= 0.8) return 'success'
    if (score >= 0.6) return 'warning'
    return 'secondary'
  }

  /**
   * Format match score as percentage
   */
  const formatMatchScore = (score: number): string => {
    return `${Math.round(score * 100)}%`
  }

  if (loading && matches.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Analyzing freelancer profiles...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🤖 AI Recommended Freelancers</h3>
          <p className="text-sm text-gray-600 mt-1">
            Top matches based on skills, experience, and job requirements
          </p>
        </div>
        <Button
          onClick={() => fetchAIRecommendations(true)}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-sm"
        >
          {loading ? <LoadingSpinner size="sm" className="mr-2" /> : '🔄'}
          Refresh
        </Button>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={() => setError(null)}
          className="mb-6"
        />
      )}

      {matches.length === 0 && !loading ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h4>
          <p className="text-gray-600 mb-4">
            Our AI couldn't find suitable matches for this job yet.
          </p>
          <Button
            onClick={() => fetchAIRecommendations(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match, index) => (
            <div 
              key={match.freelancer_id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {match.freelancer.name}
                    </h4>
                    <p className="text-sm text-gray-600">{match.freelancer.email}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {match.freelancer.experience_level}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getMatchBadgeVariant(match.match_score)} className="text-lg px-3 py-1">
                    {formatMatchScore(match.match_score)} Match
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {formatMatchScore(match.confidence)}
                  </p>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-green-700 mb-2">
                    ✅ Matching Skills ({match.matching_skills.length})
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {match.matching_skills.slice(0, 6).map((skill, idx) => (
                      <Badge key={idx} variant="success" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {match.matching_skills.length > 6 && (
                      <Badge variant="success" className="text-xs">
                        +{match.matching_skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {match.missing_skills.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-orange-700 mb-2">
                      ⚠️ May Need Training ({match.missing_skills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {match.missing_skills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="warning" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {match.missing_skills.length > 4 && (
                        <Badge variant="warning" className="text-xs">
                          +{match.missing_skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Insights */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-blue-900 mb-2">🧠 AI Insights</h5>
                <p className="text-sm text-blue-800 leading-relaxed">{match.ai_insights}</p>
              </div>

              {/* Match Reasons */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">📊 Why This Match?</h5>
                <ul className="space-y-1">
                  {match.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Experience Match: {formatMatchScore(match.experience_match)}
                </div>
                <div className="flex space-x-3">
                  {match.freelancer.portfolio_url && (
                    <Button
                      onClick={() => window.open(match.freelancer.portfolio_url, '_blank')}
                      className="bg-gray-600 hover:bg-gray-700 text-sm px-4 py-2"
                    >
                      View Portfolio
                    </Button>
                  )}
                  <Button
                    onClick={() => onContactFreelancer?.(match.freelancer_id)}
                    className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2"
                  >
                    Contact Freelancer
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}