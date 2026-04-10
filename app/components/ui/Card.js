export default function Card({
  title,
  description,
  footer,
  children,
  className = '',
}) {
  return (
    <div
      className={[
        'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || description) && (
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          {title && (
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
          {footer}
        </div>
      )}
    </div>
  );
}
