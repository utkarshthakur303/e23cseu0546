"use client";

/**
 * Loading
 *
 * Animated skeleton loader cards to show while data is being fetched.
 */
export default function Loading({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <div className="skeleton h-5 w-20 rounded-full" />
                <div className="skeleton h-5 w-14 rounded-full" />
              </div>
              <div className="skeleton h-4 w-full rounded mb-2" />
              <div className="skeleton h-4 w-3/4 rounded mb-3" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="skeleton w-11 h-11 rounded-xl" />
              <div className="skeleton h-2 w-8 mt-1 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
