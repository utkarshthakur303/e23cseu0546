"use client";

/**
 * Pagination
 *
 * Previous / Next navigation with current page indicator.
 */
export default function Pagination({ currentPage, onPageChange, hasMore, totalShown }) {
  return (
    <div className="flex items-center justify-between pt-8 pb-4">
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-300">{currentPage}</span>
        {totalShown !== undefined && (
          <span> · {totalShown} shown</span>
        )}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`
            inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${
              currentPage <= 1
                ? "bg-white/[0.03] text-gray-600 cursor-not-allowed"
                : "bg-white/[0.06] text-gray-300 border border-white/[0.06] hover:bg-white/[0.1] hover:border-indigo-500/30"
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
          className={`
            inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${
              !hasMore
                ? "bg-white/[0.03] text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            }
          `}
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
