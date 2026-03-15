import { useState } from 'react';

const COMMENT_STYLES = [
  { prefix: '// ', suffix: '' },
  { prefix: '# ', suffix: '' },
  { prefix: '-- ', suffix: '' },
  { prefix: '/* ', suffix: ' */' },
  { prefix: '<!-- ', suffix: ' -->' },
] as const;

export function CommentTitle({ text = 'HUMANTODO' }: { text?: string }) {
  const [styleIndex, setStyleIndex] = useState(0);
  const { prefix, suffix } = COMMENT_STYLES[styleIndex];
  const length = COMMENT_STYLES.length;

  return (
    <h1
      role="button"
      tabIndex={0}
      className="cursor-pointer text-center text-4xl leading-tight font-semibold select-none lg:text-5xl"
      onClick={() => setStyleIndex((prev) => (prev + 1) % length)}
    >
      {prefix}
      {text}
      {suffix}
    </h1>
  );
}
