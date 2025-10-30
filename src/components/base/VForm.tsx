'use client'

import { Forms, FormField } from '@/directus/types'
import { useState } from 'react'
import VAlert from '@/components/base/VAlert'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import DirectusFormBuilder from '@/components/form/DirectusFormBuilder'
import { cn } from '@/lib/utils/tw'
import formTheme from '@/form.theme'
import { useRouter } from '@/lib/navigation'
import VButton from '@/components/base/VButton'
import { v4 as uuidv4 } from 'uuid'

interface FormProps {
  form: Forms
  className?: string
}

function transformSchema(schema: FormField[] = []) {
  return schema.map((item) => {
    const newItem = { ...item };
    // Map type to FormKit-compatible type
    if (newItem.type === 'input') {
      newItem.$formkit = 'text';
    } else {
      newItem.$formkit = newItem.type;
    }
    // Set outerclass based on width
    switch (newItem.width) {
      case '33':
        newItem.outerclass = 'md:col-span-2';
        break;
      case '50':
        newItem.outerclass = 'md:col-span-3';
        break;
      case '67':
        newItem.outerclass = 'md:col-span-4';
        break;
      case '100':
        newItem.outerclass = 'md:col-span-6';
        break;
      default:
        newItem.outerclass = 'md:col-span-6';
    }
    // Add validation rules
    if (newItem.validation) {
      newItem.validation = newItem.validation;
    }
    // For select fields, ensure options are formatted
    if (newItem.type === 'select' && newItem.options) {
      newItem.options = newItem.options.map((opt: { label: string; value: string }) => ({
        label: opt.label,
        value: opt.value,
      }));
    }
    return newItem;
  });
}

// Helper function to separate fields by group
function separateFieldsByGroup(schema: FormField[] = []) {
  const leadFields = schema.filter(field => !field.is_group_field);
  const groupFields = schema.filter(field => field.is_group_field);
  
  return { leadFields, groupFields };
}

function VForm(props: FormProps) {
  const { form } = props
  console.log('VForm - Received form props:', props);

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [groupSections, setGroupSections] = useState<number[]>([])

  const schema = transformSchema(form.schema || [])
  const { leadFields, groupFields } = separateFieldsByGroup(schema)
  
  console.log('VForm - Lead fields:', leadFields);
  console.log('VForm - Group fields:', groupFields);
  console.log('VForm - Form allows groups:', form.is_allow_group);

  const hookForm = useForm<any>()

  // Add new group section
  const addGroupSection = () => {
    const newIndex = groupSections.length
    setGroupSections([...groupSections, newIndex])
  }

  // Remove group section
  const removeGroupSection = (index: number) => {
    setGroupSections(groupSections.filter((_, i) => i !== index))
    // Clear form data for this section
    const sectionPrefix = `group_${index}_`
    groupFields.forEach(field => {
      hookForm.unregister(`${sectionPrefix}${field.name}`)
    })
  }

  async function submitForm(data: any) {
    setLoading(true)
    try {
      // If form doesn't allow groups, use original logic
      if (!form.is_allow_group || groupFields.length === 0) {
        const answers = Object.entries(data).map(([field, value]) => ({
          field,
          value: String(value || '')
        }));

        const response = await fetch('/api/form-submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            form: props.form.id,
            date_started: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to submit form')
        }
      } else {
        // Group form logic
        const leadData: Record<string, any> = {}
        const groupData: Record<number, Record<string, any>> = {}

        // Separate lead data and group data
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith('group_')) {
            const [_, sectionIndex, fieldName] = key.split('_')
            const sectionIdx = parseInt(sectionIndex)
            if (!groupData[sectionIdx]) {
              groupData[sectionIdx] = {}
            }
            groupData[sectionIdx][fieldName] = value
          } else {
            leadData[key] = value
          }
        })

        // Check if there are any group members added
        const hasGroupMembers = Object.keys(groupData).length > 0

        if (!hasGroupMembers) {
          // No group members added, create single submission without is_lead and group_id
          const allAnswers = Object.entries(data).map(([field, value]) => ({
            field,
            value: String(value || '')
          }));

          const response = await fetch('/api/form-submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers: allAnswers,
              form: props.form.id,
              date_started: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to submit form')
          }
        } else {
          // Has group members, generate group_id and create lead + group submissions
          const groupId = uuidv4()
          const submissions = []

          // Lead submission (only lead fields)
          const leadAnswers = Object.entries(leadData).map(([field, value]) => ({
            field,
            value: String(value || '')
          }));

          submissions.push({
            answers: leadAnswers,
            form: props.form.id,
            is_lead: true,
            date_started: new Date().toISOString(),
            group_id: groupId,
            status: 'published',
            date_sumitted: new Date().toISOString(),
          })

          // Group submissions (only group fields for each section)
          Object.entries(groupData).forEach(([sectionIndex, sectionData]) => {
            const groupAnswers = Object.entries(sectionData).map(([field, value]) => ({
              field,
              value: String(value || '')
            }));

            submissions.push({
              answers: groupAnswers,
              form: props.form.id,
              is_lead: false,
              date_started: new Date().toISOString(),
              group_id: groupId,
              status: 'published',
              date_sumitted: new Date().toISOString(),
            })
          })

          // Batch create all submissions
          const response = await fetch('/api/form-submissions/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              submissions,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to submit form')
          }
        }
      }

      setSuccess(true)
      if (form.on_success === 'redirect' && form.redirect_url) {
        return router.push(form.redirect_url)
      }
    } catch (err) {
      setError(err as any)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (element: any, sectionIndex?: number) => {
    const fieldName = sectionIndex !== undefined ? `group_${sectionIndex}_${element.name}` : element.name
    
    return (
      <div
        key={`${fieldName}-${element.name}`}
        className={cn(element.outerclass, 'w-full')}
      >
        <label className='label' htmlFor={fieldName}>
          <span className='label-text text-gray-900'>{element.label}</span>
          {element.is_required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        <DirectusFormBuilder 
          element={{...element, name: fieldName}} 
          hookForm={hookForm} 
        />
        <ErrorMessage
          errors={hookForm.formState.errors}
          name={fieldName}
          render={({ message }) => (
            <VAlert type='error'>{message}</VAlert>
          )}
        />
      </div>
    )
  }

  return (
    <div className={cn(
      props.className,
      'max-w-4xl mx-auto bg-white border-2 border-[var(--color-primary)] rounded-[12px] shadow-md p-8'
    )}>
      <div className='mb-4'>
        {error && <VAlert type='error'>{(error as any)?.message || String(error)}</VAlert>}
        {form.on_success === 'message' && success && (
          <VAlert
            type='success'
            html={
              form.success_message ?? 'Success! Your form has been submitted.'
            }
          ></VAlert>
        )}
      </div>

      {!success && (
        <form className={formTheme.formClass} onSubmit={hookForm.handleSubmit(submitForm)}>
          <div className='grid gap-6 md:grid-cols-6'>
            {/* Render all fields normally first */}
            {schema.map((element) => {
              console.log('VForm - Rendering schema element:', element);
              return (
                <div
                  key={`fields-${element.name}`}
                  className={cn(element.outerclass, 'w-full')}
                >
                  <label className='label' htmlFor={element.name}>
                    <span className='label-text text-gray-900'>{element.label}</span>
                    {element.is_required && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <DirectusFormBuilder element={element} hookForm={hookForm} />
                  <ErrorMessage
                    errors={hookForm.formState.errors}
                    name={element.name}
                    render={({ message }) => (
                      <VAlert type='error'>{message}</VAlert>
                    )}
                  />
                </div>
              );
            })}

            {/* Add Group Section if form allows groups and has group fields */}
            {form.is_allow_group && groupFields.length > 0 && (
              <div className='col-span-6 mt-8'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Thành viên nhóm
                  </h3>
                  <VButton
                    type='button'
                    variant='outline'
                    onClick={addGroupSection}
                    className='text-sm'
                  >
                    + Thêm thành viên
                  </VButton>
                </div>

                {groupSections.map((sectionIndex) => (
                  <div key={sectionIndex} className='mb-6 p-4 border border-gray-200 rounded-lg'>
                    <div className='flex justify-between items-center mb-4'>
                      <h4 className='text-md font-medium text-gray-700'>
                        Thành viên {sectionIndex + 1}
                      </h4>
                      <VButton
                        type='button'
                        variant='ghost'
                        onClick={() => removeGroupSection(sectionIndex)}
                        className='text-red-600 hover:text-red-800 text-sm'
                      >
                        Xóa
                      </VButton>
                    </div>
                    <div className='grid gap-6 md:grid-cols-6'>
                      {groupFields.map((element) => renderField(element, sectionIndex))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className='col-span-6 mx-auto'>
            <div className='form-control mt-6'>
              <button 
                type='submit'
                className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-md disabled:opacity-50'
                disabled={loading}
              >
                {loading && <span className='loading loading-spinner mr-2'></span>}
                {form.translations?.[0]?.submit_label || form.submit_label || 'Submit'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default VForm
