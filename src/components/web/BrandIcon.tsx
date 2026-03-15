import * as React from 'react'

const DARK_MODE_INVERTED_ICONS = new Set([
  '/claudecode.png',
  '/cursor.svg',
  '/mastra.svg',
  '/manus.svg',
  '/neovim.svg',
  '/opencode.svg',
  '/v0.svg'
])

type BrandIconProps = React.ComponentPropsWithoutRef<'img'> & {
  src: string
  alt: string
}

export const BrandIcon = React.forwardRef<HTMLImageElement, BrandIconProps>(function BrandIcon(
  { src, alt, className, ...props },
  ref
) {
  const themeClassName = DARK_MODE_INVERTED_ICONS.has(src) ? 'dark:invert' : ''
  const classes = ['shrink-0', themeClassName, className].filter(Boolean).join(' ')

  return <img ref={ref} src={src} alt={alt} className={classes} {...props} />
})
