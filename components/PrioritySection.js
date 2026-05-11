"use client";

import NotificationCard from "./NotificationCard";

/**
 * PrioritySection
 *
 * Displays the top 10 priority notifications in a visually distinct
 * section with a gradient header and glow effect.
 */
export default function PrioritySection({ notifications }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Top Priority Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Highest importance based on type weight &amp; recency
          </p>
        </div>
      </div>

      {/* Priority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.map((notification, index) => (
          <div key={notification.ID || index} className="glow-pulse">
            <NotificationCard notification={notification} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
