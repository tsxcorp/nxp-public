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
import TeamBlock from '@/components/blocks/TeamBlockServer'
import FeaturesBlock from '@/components/blocks/FeaturesBlock'
import TheHeader from './navigation/TheHeader'
import TheFooter from './navigation/TheFooter'

interface PageBuilderProps {
  page: Pages
  mainNav: Navigation | null
  footerNav: Navigation | null
}

export default function PageBuilder({ page, mainNav, footerNav }: PageBuilderProps) {
  return (
    <>
      <TheHeader navigation={mainNav} />
      <main>
        {page.translations?.[0]?.blocks?.map((block, index) => {
          switch (block.collection) {
            case 'block_features':
              return (
                <FeaturesBlock key={index} data={block.item}></FeaturesBlock>
              )
            case 'block_richtext':
              return (
                <RichTextBlock key={index} data={block.item}></RichTextBlock>
              )
            case 'block_hero':
              return <HeroBlock key={index} data={block.item}></HeroBlock>
            case 'block_gallery':
              return (
                <GalleryBlock key={index} data={block.item}></GalleryBlock>
              )
            case 'block_quote':
              return <QuoteBlock key={index} data={block.item}></QuoteBlock>
            case 'block_logocloud':
              return (
                <LogoCloudBlock
                  key={index}
                  data={block.item}
                ></LogoCloudBlock>
              )
            case 'block_video':
              return <VideoBlock key={index} data={block.item}></VideoBlock>
            case 'block_testimonials':
              return (
                <TestimonialsBlock
                  key={index}
                  data={block.item}
                ></TestimonialsBlock>
              )
            case 'block_steps':
              return <StepsBlock key={index} data={block.item}></StepsBlock>
            case 'block_faqs':
              return <FaqsBlock key={index} data={block.item}></FaqsBlock>
            case 'block_cta':
              return <CtaBlock key={index} data={block.item}></CtaBlock>
            case 'block_html':
              return (
                <RawHtmlBlock key={index} data={block.item}></RawHtmlBlock>
              )
            case 'block_team':
              return <TeamBlock key={index} data={block.item}></TeamBlock>
            case 'block_columns':
              return (
                <ColumnsBlock key={index} data={block.item}></ColumnsBlock>
              )
            case 'block_cardgroup':
              return (
                <CardGroupBlock
                  key={index}
                  data={block.item}
                ></CardGroupBlock>
              )
            case 'block_form':
              return <FormBlock key={index} data={block.item}></FormBlock>
          }
        })}
      </main>
      <TheFooter navigation={footerNav} />
    </>
  )
}
