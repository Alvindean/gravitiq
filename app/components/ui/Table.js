'use client';

export default function Table({ columns = [], data = [], onRowClick }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
              >
                No data available
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={[
                'border-b border-zinc-100 transition-colors dark:border-zinc-800',
                idx % 2 === 1
                  ? 'bg-zinc-50/50 dark:bg-zinc-800/25'
                  : 'bg-white dark:bg-zinc-900',
                onRowClick
                  ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
              ].join(' ')}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-zinc-900 dark:text-zinc-100"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
