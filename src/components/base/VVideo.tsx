import React from 'react'
import { generateVideoEmbed } from '@/lib/utils/embed'
import { motion } from 'framer-motion'

interface VideoProps {
  url: string
  title?: string
  name?: string
  className?: string
}

export default function VVideo({ url, title, name, className }: VideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
      className={`mx-auto my-6 max-w-4xl w-full rounded-2xl  bg-white shadow-lg overflow-hidden ${className || ''}`}
    >
      <iframe
        className='aspect-video w-full min-h-[400px]'
        id={name}
        loading='lazy'
        src={generateVideoEmbed(url)}
        frameBorder='0'
        allow='autoplay; fullscreen; picture-in-picture'
        allowFullScreen
        title={title}
        style={{ borderRadius: '1rem' }}
      ></iframe>
    </motion.div>
  )
}
