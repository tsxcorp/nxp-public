"use client";
import React from 'react'
import { Pages, Navigation } from '@/data/directus-collections'
import RichTextBlock from '@/components/blocks/RichTextBlock'
import HeroBlock from '@/components/blocks/HeroBlock'
import GalleryBlock from '@/components/blocks/GalleryBlock'
import QuoteBlock from '@/components/blocks/QuoteBlock'
import LogoCloudBlock from '@/components/blocks/LogoCloudBlock'
import VideoBlock from '@/components/blocks/VideoBlock'
import TestimonialsBlock from '@/components/blocks/TestimonialsBlock'
import StepsBlock from '@/components/blocks/StepsBlock'
import FaqsBlock from '@/components/blocks/FaqsBlock'
import CtaBlock from '@/components/blocks/CtaBlock'
import RawHtmlBlock from '@/components/blocks/RawHtmlBlock'
import ColumnsBlock from '@/components/blocks/ColumnsBlock'
import CardGroupBlock from '@/components/blocks/CardGroupBlock'
import FormBlock from '@/components/blocks/FormBlock'
import TeamBlock from '@/components/blocks/TeamBlock'
import FeaturesBlock from '@/components/blocks/FeaturesBlock'
import TheHeader from './navigation/TheHeader'
import TheFooter from './navigation/TheFooter'
import { DirectusSchema } from '@/data/directus-schema'

interface PageBuilderProps {
  blocks: any[]
  lang: string
  teamMembersMap?: Record<string, any[]>
}

export default function PageBuilder({ blocks, lang, teamMembersMap }: PageBuilderProps) {
  if (!Array.isArray(blocks)) {
    console.warn('[PageBuilder] blocks is not an array:', blocks);
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (!block || !block.collection) {
          console.warn(`[PageBuilder] Invalid block at index ${index}:`, block);
          return null;
        }

        try {
          switch (block.collection) {
            case 'block_features':
              return <FeaturesBlock key={index} data={block.item} lang={lang} />
            case 'block_richtext':
              return <RichTextBlock key={index} data={block.item} lang={lang} />
            case 'block_hero':
              return <HeroBlock key={index} data={block.item} lang={lang} />
            case 'block_gallery':
              return <GalleryBlock key={index} data={block.item} lang={lang} />
            case 'block_quote':
              return <QuoteBlock key={index} data={block.item} lang={lang} />
            case 'block_logocloud':
              return <LogoCloudBlock key={index} data={block.item} lang={lang} />
            case 'block_video':
              return <VideoBlock key={index} data={block.item} lang={lang} />
            case 'block_testimonials':
              return <TestimonialsBlock key={index} data={block.item} lang={lang} />
            case 'block_steps':
              return <StepsBlock key={index} data={block.item} lang={lang} />
            case 'block_faqs':
              return <FaqsBlock key={index} data={block.item} lang={lang} />
            case 'block_cta':
              return <CtaBlock key={index} data={block.item} lang={lang} />
            case 'block_html':
              return <RawHtmlBlock key={index} data={block.item} lang={lang} />
            case 'block_columns':
              return <ColumnsBlock key={index} data={block.item} lang={lang} />
            case 'block_cardgroup':
              return <CardGroupBlock key={index} data={block.item} lang={lang} />
            case 'block_team':
              return <TeamBlock key={index} data={block.item} lang={lang} teams={block.item.team || []} />
            case 'block_form':
              return <FormBlock key={index} data={block.item} lang={lang} />
            default:
              console.warn(`[PageBuilder] Unknown block type: ${block.collection}`);
              return null
          }
        } catch (error) {
          console.error(`[PageBuilder] Error rendering block ${index}:`, error);
          return null;
        }
      })}
    </>
  )
}