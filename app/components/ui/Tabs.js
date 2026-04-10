'use client';

import { useState } from 'react';

export default function Tabs({ tabs = [], defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      {/* Tab list */}
      <div
        role="tablist"
        className="flex border-b border-zinc-200 dark:border-zinc-700"
      >
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={activeTab === idx}
            onClick={() => setActiveTab(idx)}
            className={[
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset',
              activeTab === idx
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300',
            ].join(' ')}
          >
            {tab.label}
            {activeTab === idx && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div role="tabpanel" className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
