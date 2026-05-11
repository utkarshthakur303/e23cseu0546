"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import PrioritySection from "@/components/PrioritySection";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

import { sortByPriority, getTopPriority, computePriorityScore } from "@/lib/priority";

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  // ── State ──────────────────────────────────────────
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch All Notifications ────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch a large page to get all notifications for client-side operations
      const res = await axios.get("/api/notifications", {
        params: { page: 1, limit: 200 },
      });

      const data = res.data;
      const notifications = data.notifications || [];

      // Enrich with priority scores
      const enriched = notifications.map((n) => ({
        ...n,
        _priorityScore: computePriorityScore(n),
      }));

      setAllNotifications(enriched);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);

      if (err.response?.status === 401) {
        setError(
          "Authentication failed. Please add your token to NEXT_PUBLIC_AUTH_TOKEN in .env.local and restart the server."
        );
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to fetch notifications. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Derived Data ───────────────────────────────────

  // Filter notifications by type (client-side)
  const filteredNotifications =
    activeFilter === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.Type === activeFilter);

  // Sort filtered by priority
  const sorted = sortByPriority(filteredNotifications);

  // Paginate
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedNotifications = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Top 10 priority (across all, not filtered)
  const topPriority = getTopPriority(allNotifications, 10);

  // Counts for filter badges
  const counts = {
    total: allNotifications.length,
    Event: allNotifications.filter((n) => n.Type === "Event").length,
    Result: allNotifications.filter((n) => n.Type === "Result").length,
    Placement: allNotifications.filter((n) => n.Type === "Placement").length,
  };

  // ── Handlers ───────────────────────────────────────
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* ═══ Hero Section ═══ */}
      <header className="relative overflow-hidden border-b border-white/[0.04]">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.06),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Live Notification Feed
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
              Notification System
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
              Priority-based notification management with intelligent scoring.
              Built for the{" "}
              <span className="text-indigo-400 font-medium">
                Affordmed Campus Hiring Evaluation
              </span>
              .
            </p>

            {/* Quick Stats */}
            {!loading && !error && (
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  { label: "Total", value: counts.total, color: "text-white" },
                  { label: "Events", value: counts.Event, color: "text-indigo-400" },
                  { label: "Results", value: counts.Result, color: "text-emerald-400" },
                  { label: "Placements", value: counts.Placement, color: "text-amber-400" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-2"
                  >
                    <span className={`text-lg font-bold ${color}`}>{value}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Error State ── */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-300 mb-1">
                  Error Loading Notifications
                </h3>
                <p className="text-sm text-red-400/80">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div>
            <div className="mb-8">
              <div className="skeleton h-8 w-64 rounded-lg mb-2" />
              <div className="skeleton h-4 w-96 rounded" />
            </div>
            <Loading count={6} />
          </div>
        )}

        {/* ── Data Loaded ── */}
        {!loading && !error && (
          <>
            {allNotifications.length === 0 ? (
              <EmptyState
                message="No Notifications Available"
                suggestion="The notification feed is currently empty. Notifications will appear here once they are generated."
              />
            ) : (
              <>
                {/* ── Priority Section ── */}
                <PrioritySection notifications={topPriority} />

                {/* ── Divider ── */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-widest">
                    All Notifications
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ── Filter Bar ── */}
                <div className="mb-6">
                  <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    counts={counts}
                  />
                </div>

                {/* ── Notification Feed ── */}
                {filteredNotifications.length === 0 ? (
                  <EmptyState
                    message={`No ${activeFilter} Notifications`}
                    suggestion="Try selecting a different filter to see other notification types."
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedNotifications.map((notification, index) => (
                        <NotificationCard
                          key={notification.ID || index}
                          notification={notification}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* ── Pagination ── */}
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      hasMore={currentPage < totalPages}
                      totalShown={paginatedNotifications.length}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-white/[0.04] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>
              Affordmed Campus Hiring Evaluation ·{" "}
              <span className="text-gray-500">Notification System</span>
            </p>
            <p>
              Built with{" "}
              <span className="text-indigo-500">Next.js</span> +{" "}
              <span className="text-indigo-500">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
