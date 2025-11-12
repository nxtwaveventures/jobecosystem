/**
 * AI Skill Analysis API Route
 * 
 * Analyzes freelancer profiles, resumes, and job descriptions using AI
 * to extract skills, experience levels, and provide recommendations.
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiMatchingEngine } from '@/lib/aiMatchingEngine'

/**
 * POST /api/ai/analyze/skills - Analyze text/profile for skills extraction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, type = 'profile' } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required for analysis' },
        { status: 400 }
      )
    }

    // Extract skills using AI
    const extractedSkills = await aiMatchingEngine.extractSkillsFromText(text)

    // Categorize skills
    const skillsByCategory = extractedSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, any[]>)

    // Generate insights
    const insights = generateSkillInsights(extractedSkills, type)

    return NextResponse.json({
      success: true,
      analysis: {
        total_skills_found: extractedSkills.length,
        skills_by_category: skillsByCategory,
        top_skills: extractedSkills.slice(0, 10),
        insights,
        confidence_score: calculateOverallConfidence(extractedSkills)
      },
      analyzed_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in skill analysis:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze skills',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai/analyze/pdf - Analyze PDF resume for skill extraction
 */
export async function PUT(request: NextRequest) {
  try {
    // Get the PDF file from form data
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const pdfBuffer = await pdfFile.arrayBuffer()

    // Parse PDF content (placeholder - would use actual PDF parsing)
    const pdfText = await aiMatchingEngine.parsePDFContent(pdfBuffer)

    // Extract skills from parsed text
    const extractedSkills = await aiMatchingEngine.extractSkillsFromText(pdfText)

    // Categorize skills
    const skillsByCategory = extractedSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, any[]>)

    // Generate resume insights
    const insights = generateResumeInsights(extractedSkills, pdfText)

    return NextResponse.json({
      success: true,
      pdf_analysis: {
        filename: pdfFile.name,
        file_size: pdfFile.size,
        total_skills_found: extractedSkills.length,
        skills_by_category: skillsByCategory,
        top_skills: extractedSkills.slice(0, 15),
        insights,
        confidence_score: calculateOverallConfidence(extractedSkills),
        extracted_text_preview: pdfText.substring(0, 200) + '...'
      },
      analyzed_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in PDF analysis:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Generate insights from extracted skills
 */
function generateSkillInsights(skills: any[], type: string): string[] {
  const insights: string[] = []
  
  if (skills.length === 0) {
    insights.push("No specific technical skills were identified. Consider adding more detailed skill descriptions.")
    return insights
  }

  // Skill count insights
  if (skills.length > 20) {
    insights.push(`Excellent skill diversity with ${skills.length} identified skills.`)
  } else if (skills.length > 10) {
    insights.push(`Good skill range with ${skills.length} identified skills.`)
  } else {
    insights.push(`Consider expanding skill descriptions to showcase more expertise.`)
  }

  // High confidence skills
  const highConfidenceSkills = skills.filter(s => s.confidence > 0.8)
  if (highConfidenceSkills.length > 0) {
    insights.push(`Strong evidence found for ${highConfidenceSkills.length} skills: ${highConfidenceSkills.slice(0, 3).map(s => s.skill).join(', ')}.`)
  }

  // Category analysis
  const categories = new Set(skills.map(s => s.category))
  if (categories.has('technical') && categories.has('tool')) {
    insights.push("Great balance of technical knowledge and practical tool experience.")
  }

  // Domain-specific insights
  const mlSkills = skills.filter(s => s.skill.includes('learning') || s.skill.includes('neural')).length
  if (mlSkills > 3) {
    insights.push("Strong machine learning background detected.")
  }

  const programmingSkills = skills.filter(s => s.category === 'tool' && ['python', 'r', 'java'].includes(s.skill.toLowerCase())).length
  if (programmingSkills > 1) {
    insights.push("Multi-language programming capability identified.")
  }

  return insights
}

/**
 * Generate resume-specific insights
 */
function generateResumeInsights(skills: any[], fullText: string): string[] {
  const insights = generateSkillInsights(skills, 'resume')
  
  // Resume-specific analysis
  const text = fullText.toLowerCase()
  
  // Experience indicators
  if (text.includes('years') || text.includes('experience')) {
    insights.push("Experience duration indicators found in resume.")
  }
  
  // Education indicators
  if (text.includes('degree') || text.includes('university') || text.includes('phd')) {
    insights.push("Educational background information detected.")
  }
  
  // Project indicators
  if (text.includes('project') || text.includes('developed') || text.includes('built')) {
    insights.push("Project experience and hands-on work evidence found.")
  }
  
  // Publication indicators
  if (text.includes('publication') || text.includes('paper') || text.includes('research')) {
    insights.push("Research and publication background identified.")
  }

  return insights
}

/**
 * Calculate overall confidence score
 */
function calculateOverallConfidence(skills: any[]): number {
  if (skills.length === 0) return 0
  
  const totalConfidence = skills.reduce((sum, skill) => sum + skill.confidence, 0)
  const averageConfidence = totalConfidence / skills.length
  
  // Adjust confidence based on number of skills found
  const volumeBonus = Math.min(0.2, skills.length * 0.01)
  
  return Math.min(1.0, averageConfidence + volumeBonus)
}