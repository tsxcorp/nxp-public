import { createItems } from '@directus/sdk'
import { NextRequest, NextResponse } from 'next/server'
import directusApi from '@/directus/client'

export interface BatchFormSubmission {
  answers: Array<{
    field: string
    value: string
  }>
  form: string
  is_lead?: boolean
  date_started?: string
  date_sumitted?: string
  group_id?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface BatchFormSubmissionsRequest {
  submissions: BatchFormSubmission[]
}

export async function POST(req: NextRequest) {
  try {
    const body: BatchFormSubmissionsRequest = await req.json()
    const { submissions } = body

    // Validate required fields
    if (!submissions || !Array.isArray(submissions)) {
      return NextResponse.json(
        { error: 'Submissions array is required' },
        { status: 400 }
      )
    }

    if (submissions.length === 0) {
      return NextResponse.json(
        { error: 'At least one submission is required' },
        { status: 400 }
      )
    }

    // Validate each submission
    for (const submission of submissions) {
      if (!submission.answers || !Array.isArray(submission.answers)) {
        return NextResponse.json(
          { error: 'Answers array is required for each submission' },
          { status: 400 }
        )
      }

      if (!submission.form) {
        return NextResponse.json(
          { error: 'Form ID is required for each submission' },
          { status: 400 }
        )
      }
    }

    // Batch create all submissions using Directus SDK
    const response = await directusApi.request(
      createItems('form_submissions', submissions)
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Batch form submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit form submissions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
