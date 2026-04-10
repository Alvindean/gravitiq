export function Input({
  label,
  error,
  helperText,
  type = 'text',
  placeholder,
  className = '',
  icon,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={[
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 transition-colors',
            'placeholder:text-zinc-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
            error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-600 dark:focus:border-indigo-500',
            icon ? 'pl-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  placeholder,
  className = '',
  rows = 4,
  id,
  ...props
}) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 transition-colors',
          'placeholder:text-zinc-400 resize-y',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
          error
            ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
            : 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-600 dark:focus:border-indigo-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
