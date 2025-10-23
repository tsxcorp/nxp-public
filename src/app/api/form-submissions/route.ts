import { createItem } from '@directus/sdk'
import { NextRequest, NextResponse } from 'next/server'
import directusApi from '@/directus/client'

export interface FormSubmission {
  answers: Array<{
    field: string
    value: string
  }>
  form: string
}

export async function POST(req: NextRequest) {
  try {
    const body: FormSubmission = await req.json()
    const { answers, form } = body

    // Validate required fields
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers array is required' },
        { status: 400 }
      )
    }

    if (!form) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    // Create the form submission
    const response = await directusApi.request(
      createItem('form_submissions', {
        answers,
        form,
      })
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


