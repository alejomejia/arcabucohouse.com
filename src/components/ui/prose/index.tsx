import { cn } from '@/lib/utils/helpers';

const proseClasses = cn(
  /** Heading styles */
  "prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black",
  "prose-h1:text-5xl",
  "prose-h2:text-4xl",
  "prose-h3:text-3xl",
  "prose-h4:text-2xl",
  "prose-h5:text-xl",
  "prose-h6:text-lg",
  /** Link styles */
  "prose-a:text-bold prose-a:underline prose-a:hover:text-neutral-300",
  /** Strong styles */
  "prose-strong:text-bold",
  /** Ordered list styles */
  "prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6",
  /** Unordered list styles */
  "prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6"
)

type ProseProps = {
  html: string
  className?: string
}

export function Prose({ html, className }: ProseProps) {
  return (
    <div
      className={cn(
        'prose text-lg text-zinc-500',
        proseClasses,
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
