import type { SimpleIcon } from 'simple-icons';

interface IconLoaderProps {
  /** A Simple Icons icon object (e.g. from `import { siCursor } from "simple-icons"`) */
  icon: SimpleIcon;
  /** Size in pixels (default 16) */
  size?: number;
  /** Override fill color (defaults to icon's brand hex) */
  fill?: string;
  /** Accessible label (defaults to icon.title) */
  'aria-label'?: string;
  className?: string;
}

export function IconLoader({ icon, size = 16, fill, 'aria-label': ariaLabel, className }: IconLoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ?? 'currentColor'}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      aria-label={ariaLabel ?? icon.title}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
