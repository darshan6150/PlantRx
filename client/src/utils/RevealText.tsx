'use client'

import { motion } from 'framer-motion'
import { wordContainer, wordRisePerspective } from '@/animation/framerMotionVariants'
import { JSX, ReactNode, useMemo } from 'react'

type RevealTextProps = {
  children: ReactNode
  className?: string
  tag?: keyof JSX.IntrinsicElements
}

export default function RevealText({
  children,
  className,
  tag = 'div',
}: RevealTextProps) {
  const text = useMemo(() => {
    if (typeof children === 'string') {
      return children
    }
    return ''
  }, [children])

  const words = useMemo(
    () =>
      text
        .replace(/\s+/g, ' ')
        .trim()
        .split(' '),
    [text]
  )

  const MotionTag = ((motion as any)[tag] || motion.div) as React.ComponentType<{
    children?: React.ReactNode;
    variants?: any;
    initial?: any;
    whileInView?: any;
    viewport?: any;
    className?: string;
    style?: React.CSSProperties;
  }>

  return (
    <span style={{ perspective: '1200px' }}>
      <MotionTag
        {...(tag !== 'svg'
          ? {
              variants: wordContainer,
              initial: 'hidden',
              whileInView: 'visible',
              viewport: { amount: 0.4 },
              className,
              style: { transformStyle: 'preserve-3d' },
            }
          : { className, style: { transformStyle: 'preserve-3d' } })}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden"
          >
            <motion.span
              variants={wordRisePerspective}
              className="inline-block backface-hidden"
            >
              {word}
              <span>&nbsp;</span>
            </motion.span>
          </span>
        ))}
      </MotionTag>
    </span>
  )
}