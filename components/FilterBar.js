"use client";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Event", value: "Event" },
  { label: "Result", value: "Result" },
  { label: "Placement", value: "Placement" },
];

/**
 * FilterBar
 *
 * Horizontal filter buttons for notification type.
 * Active filter is visually highlighted with gradient background.
 */
export default function FilterBar({ activeFilter, onFilterChange, counts = {} }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeFilter === value;
        const count = value === "all" ? counts.total : counts[value] ?? 0;

        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`
              relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-200"
              }
            `}
          >
            {label}
            {count > 0 && (
              <span
                className={`inline-flex items-center justify-center h-5 min-w-[20px] rounded-full px-1.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.06] text-gray-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
