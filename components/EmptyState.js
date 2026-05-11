"use client";

/**
 * EmptyState
 *
 * Displayed when no notifications match the current filter
 * or when the API returns an empty result set.
 */
export default function EmptyState({ message, suggestion }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/10 mb-6">
        <svg
          className="w-10 h-10 text-indigo-400/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        {message || "No Notifications Found"}
      </h3>

      <p className="text-sm text-gray-500 max-w-md">
        {suggestion ||
          "There are no notifications matching your current filter. Try selecting a different category or check back later."}
      </p>
    </div>
  );
}
