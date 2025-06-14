import VForm from '@/components/base/VForm'
import { Forms } from '@/data/directus-collections'
import BlockContainer from '@/components/BlockContainer'
import TypographyTitle from '@/components/typography/TypographyTitle'
import TypographyHeadline from '@/components/typography/TypographyHeadline'

interface FormBlockProps {
  title?: string
  headline?: string
  form: Forms
  translations?: {
    languages_code: string
    title?: string
    headline?: string
  }[]
  id: string
}

interface FormBlockComponentProps {
  data: FormBlockProps
  lang: string
}

interface FormField {
  id?: string
  name?: string
  type?: string
  width?: string
  validation?: string
  translations?: {
    languages_code: string
    label?: string
    placeholder?: string
    help?: string
    options?: any[]
  }[]
}

interface FormWithSchema extends Omit<Forms, 'fields'> {
  schema: {
    name: string
    type: string
    label: string
    placeholder?: string
    help?: string
    validation?: string
    width?: string
    options?: any[]
  }[]
}

const FormBlock = ({ data, lang }: FormBlockComponentProps) => {
  if (!data || !data.form) {
    return null;
  }

  // Map language code to match Directus format
  const getDirectusLangCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'vi': 'vi-VN',
      'en': 'en-US',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'it': 'it-IT',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'th': 'th-TH',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'tr': 'tr-TR',
      'nl': 'nl-NL',
      'pl': 'pl-PL',
      'uk': 'uk-UA',
    };

    if (langMap[lang]) {
      return langMap[lang];
    }

    const availableTranslations = data.form.translations || [];
    const matchingTranslation = availableTranslations.find(t => 
      t.languages_code.toLowerCase().startsWith(lang.toLowerCase() + '-')
    );

    if (matchingTranslation) {
      return matchingTranslation.languages_code;
    }

    return lang;
  };

  const directusLang = getDirectusLangCode(lang);

  const translation = data.translations?.find(
    (t) =>
      t.languages_code === directusLang ||
      (t.languages_code &&
        directusLang &&
        t.languages_code.toLowerCase().startsWith(directusLang.toLowerCase() + '-'))
  );

  const title = translation?.title || data.title;
  const headline = translation?.headline || data.headline;

  // Transform form.fields to schema expected by VForm
  const formWithSchema: FormWithSchema = {
    ...data.form,
    schema: (data.form.fields || []).map((field: FormField, index: number) => {
      const fieldTranslation = field?.translations?.find(
        (t) => t.languages_code === directusLang
      );

      const fieldName = field?.id || `field_${index}`;
      
      return {
        name: fieldName,
        type: field?.type || 'input',
        label: fieldTranslation?.label || field?.name || fieldName,
        placeholder: fieldTranslation?.placeholder || '',
        help: fieldTranslation?.help || '',
        validation: field?.validation || '',
        width: field?.width || '100',
        options: fieldTranslation?.options || [],
      };
    }),
    submit_label:
      data.form.translations?.find((t) => t.languages_code === directusLang)
        ?.submit_label || data.form.submit_label || 'Submit',
    success_message:
      data.form.translations?.find((t) => t.languages_code === directusLang)
        ?.success_message || data.form.success_message || 'Form submitted successfully',
  };

  return (
    <BlockContainer>
      <div className='card mx-auto mt-4 max-w-4xl bg-[var(--color-primary)]'>
        <div className='card-body'>
          {title && (
            <TypographyTitle className='text-white'>{title}</TypographyTitle>
          )}
          {headline && (
            <TypographyHeadline
              className='text-white font-[var(--font-display)] font-semibold'
              content={headline}
            />
          )}
          <VForm form={formWithSchema} className='mt-4' />
        </div>
      </div>
    </BlockContainer>
  );
};

export default FormBlock
