const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const fallbackColors = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
];

function getColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}

export default function Avatar({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}) {
  const initials =
    fallback ||
    alt
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={[
          'inline-block shrink-0 rounded-full object-cover',
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    );
  }

  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white',
        sizeStyles[size],
        getColorFromName(initials || 'U'),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={alt}
    >
      {initials || '?'}
    </span>
  );
}
