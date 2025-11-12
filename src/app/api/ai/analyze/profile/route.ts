import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, skills, experience } = body

    // Validate input
    if (!text && (!skills || !experience)) {
      return NextResponse.json(
        { error: 'Please provide text content or profile information to analyze' },
        { status: 400 }
      )
    }

    // In a real implementation, this would call OpenAI, Google AI, or other AI service
    // For now, we'll provide a comprehensive mock analysis
    
    const analysisText = `${text || ''} ${skills?.join(' ') || ''} ${experience || ''}`.toLowerCase()
    
    // Extract skills from text
    const allSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Machine Learning',
      'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
      'Next.js', 'Vue.js', 'Angular', 'Express', 'FastAPI', 'Django', 'Flask',
      'Data Science', 'AI', 'NLP', 'Computer Vision', 'Deep Learning', 'SQL',
      'NoSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'DevOps',
      'Git', 'Linux', 'HTML', 'CSS', 'Sass', 'Webpack', 'Babel', 'Jest',
      'Cypress', 'Selenium', 'Jenkins', 'GitHub Actions', 'Firebase', 'Stripe',
      'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch'
    ]
    
    const extractedSkills = allSkills.filter(skill => 
      analysisText.includes(skill.toLowerCase())
    ).slice(0, 12)

    // Determine experience level
    const seniorKeywords = ['senior', 'lead', 'architect', '5+ years', '6+ years', '7+ years', 'team lead', 'management', 'mentor', 'principal']
    const midKeywords = ['3 years', '4 years', '5 years', 'intermediate', 'mid-level', 'experienced']
    
    let experienceLevel: 'junior' | 'mid' | 'senior' = 'junior'
    
    if (seniorKeywords.some(keyword => analysisText.includes(keyword))) {
      experienceLevel = 'senior'
    } else if (midKeywords.some(keyword => analysisText.includes(keyword))) {
      experienceLevel = 'mid'
    }

    // Generate personalized suggestions based on skills and content
    const suggestions = generatePersonalizedSuggestions(extractedSkills, experienceLevel, analysisText)
    
    // Calculate confidence based on text length and keyword matches
    const textLength = analysisText.length
    const keywordMatches = extractedSkills.length + seniorKeywords.filter(k => analysisText.includes(k)).length
    const confidence = Math.min(0.95, 0.6 + (Math.min(textLength, 500) / 1000) + (keywordMatches / 20))

    // Estimate hourly rate range based on skills and experience
    const hourlyRateRange = estimateHourlyRate(extractedSkills, experienceLevel)

    const analysisResult = {
      extractedSkills,
      experienceLevel,
      suggestions,
      confidence: Math.round(confidence * 100) / 100,
      hourlyRateRange,
      marketDemand: calculateMarketDemand(extractedSkills),
      improvementAreas: getImprovementAreas(extractedSkills, experienceLevel)
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze profile. Please try again.' },
      { status: 500 }
    )
  }
}

function generatePersonalizedSuggestions(skills: string[], experienceLevel: string, text: string): string[] {
  const suggestions = []
  
  // Skills-based suggestions
  const hasAI = skills.some(s => ['AI', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning'].includes(s))
  const hasWeb = skills.some(s => ['React', 'Vue.js', 'Angular', 'Next.js', 'JavaScript', 'TypeScript'].includes(s))
  const hasBackend = skills.some(s => ['Node.js', 'Python', 'Django', 'FastAPI', 'Express'].includes(s))
  const hasCloud = skills.some(s => ['AWS', 'Docker', 'Kubernetes', 'DevOps'].includes(s))
  
  if (hasAI) {
    suggestions.push('Consider highlighting specific AI/ML projects with measurable results (e.g., "improved accuracy by 15%")')
  }
  
  if (hasWeb && !hasBackend) {
    suggestions.push('Adding backend skills like Node.js or Python could increase your project opportunities')
  }
  
  if (!hasCloud && experienceLevel !== 'junior') {
    suggestions.push('Cloud skills (AWS, Docker) are in high demand - consider adding these to your skillset')
  }
  
  // Experience-based suggestions
  if (experienceLevel === 'junior') {
    suggestions.push('Focus on building a portfolio of personal projects to demonstrate your skills')
    suggestions.push('Consider contributing to open-source projects to showcase collaboration skills')
  } else if (experienceLevel === 'mid') {
    suggestions.push('Highlight leadership experiences and complex problem-solving achievements')
    suggestions.push('Consider mentioning team collaboration and project management experience')
  } else {
    suggestions.push('Emphasize your impact on business outcomes and team growth')
    suggestions.push('Showcase your architecture decisions and technical leadership examples')
  }
  
  // Content-based suggestions
  if (!text.includes('project')) {
    suggestions.push('Include specific project examples with technologies used and outcomes achieved')
  }
  
  if (!text.includes('%') && !text.includes('improved') && !text.includes('increased')) {
    suggestions.push('Add quantifiable achievements (e.g., "reduced load time by 40%", "increased user engagement by 25%")')
  }
  
  return suggestions.slice(0, 4) // Return top 4 suggestions
}

function estimateHourlyRate(skills: string[], experienceLevel: string): { min: number; max: number } {
  let baseRate = 25 // Base rate for junior
  
  if (experienceLevel === 'mid') {
    baseRate = 50
  } else if (experienceLevel === 'senior') {
    baseRate = 85
  }
  
  // Premium skills bonus
  const premiumSkills = ['AI', 'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS', 'Kubernetes', 'DevOps']
  const premiumBonus = skills.filter(s => premiumSkills.includes(s)).length * 10
  
  const adjustedRate = baseRate + premiumBonus
  
  return {
    min: Math.max(15, adjustedRate - 15),
    max: adjustedRate + 25
  }
}

function calculateMarketDemand(skills: string[]): 'low' | 'medium' | 'high' {
  const highDemandSkills = ['React', 'Node.js', 'Python', 'AI', 'Machine Learning', 'AWS', 'TypeScript']
  const matchingHighDemand = skills.filter(s => highDemandSkills.includes(s)).length
  
  if (matchingHighDemand >= 3) return 'high'
  if (matchingHighDemand >= 1) return 'medium'
  return 'low'
}

function getImprovementAreas(skills: string[], experienceLevel: string): string[] {
  const areas = []
  
  const hasModernWeb = skills.some(s => ['React', 'Vue.js', 'Next.js', 'TypeScript'].includes(s))
  const hasTesting = skills.some(s => ['Jest', 'Cypress', 'Selenium'].includes(s))
  const hasDevOps = skills.some(s => ['Docker', 'Kubernetes', 'AWS', 'Jenkins'].includes(s))
  
  if (!hasModernWeb) {
    areas.push('Modern JavaScript frameworks (React, Vue.js)')
  }
  
  if (!hasTesting && experienceLevel !== 'junior') {
    areas.push('Testing frameworks and methodologies')
  }
  
  if (!hasDevOps) {
    areas.push('DevOps and cloud technologies')
  }
  
  return areas.slice(0, 3)
}