'use client'
import { motion } from 'framer-motion'
import { getDirectusMedia } from '@/lib/utils/directus-helpers'
import BlockContainer from '@/components/BlockContainer'
import { useEffect } from 'react'

interface Quote {
  id: string
  headline?: string
  title?: string
  subtitle?: string
  content?: string
  image?: string
  background_color?: string
  translations?: Array<{
    headline?: string
    title?: string
    subtitle?: string
    content?: string
    languages_code: string
  }>
}

interface QuoteBlockProps {
  data: Quote
  lang: string
}

export default function QuoteBlock({ data, lang }: QuoteBlockProps) {
  const directusLang = lang === 'en' ? 'en-US' : 'vi-VN'
  const translations = Array.isArray(data.translations) ? data.translations : []
  const translation = translations.find(t => t.languages_code === directusLang) || translations[0]
  const title = translation?.title || data.title || ''
  const subtitle = translation?.subtitle || data.subtitle || ''
  const content = translation?.content || data.content || ''

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyStyles = window.getComputedStyle(document.body)
    }
  }, [])

  return (
    <BlockContainer className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative max-w-3xl mx-auto bg-white/80 shadow-xl rounded-2xl border-l-8 border-[var(--color-primary)] p-8"
      >
        <div className="flex items-start space-x-4">
          <span className="text-6xl font-bold text-[var(--color-primary)] leading-none select-none -mt-2">“</span>
          <div
            className="italic text-2xl font-[var(--font-display)] text-[var(--color-gray)]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        {(title || subtitle) && (
          <div className="mt-6 pl-12">
            {title && <div className="text-lg text-[var(--color-gray)] font-[var(--font-display) ] font-semibold">{title}</div>}
            {subtitle && <div className="text-base text-[var(--color-primary)]">{subtitle}</div>}
          </div>
        )}
      </motion.div>
    </BlockContainer>
  )
}
