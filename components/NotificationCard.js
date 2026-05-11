"use client";

import { getPriorityLabel, getPriorityClass } from "@/lib/priority";

/**
 * NotificationCard
 *
 * Renders a single notification with type badge, message,
 * timestamp, and priority score.
 */
export default function NotificationCard({ notification, index = 0 }) {
  const { Type, Message, Timestamp, _priorityScore } = notification;
  const score = _priorityScore ?? 0;
  const priorityLabel = getPriorityLabel(score);
  const priorityClass = getPriorityClass(score);

  // Format timestamp
  const formattedDate = new Date(Timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Badge class based on type
  const badgeClass =
    Type === "Placement"
      ? "badge-placement"
      : Type === "Result"
      ? "badge-result"
      : "badge-event";

  return (
    <div
      className={`animate-fade-in-up ${priorityClass} group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:translate-y-[-2px]`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle top shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        {/* Left: Badge + Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`${badgeClass} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs tracking-wide uppercase`}
            >
              {Type}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-400">
              {priorityLabel}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-gray-200 mb-3 line-clamp-3">
            {Message}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Right: Priority Score */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-sm font-bold text-indigo-400">
              {score.toFixed(1)}
            </span>
          </div>
          <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>
    </div>
  );
}
