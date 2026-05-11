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

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async (pageToFetch) => {
    setLoading(true);
    setError(null);

    try {
      // API limit is max 10
      const res = await axios.get("/api/notifications", {
        params: { page: pageToFetch, limit: ITEMS_PER_PAGE },
      });

      const data = res.data;
      const fetchedNotifications = data.notifications || [];

      const enriched = fetchedNotifications.map((n) => ({
        ...n,
        _priorityScore: computePriorityScore(n),
      }));

      setNotifications(enriched);
      
      // If we got fewer items than limit, there are no more pages
      setHasMore(fetchedNotifications.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please check your token in .env.local");
      } else {
        setError("Failed to fetch notifications. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  // Client-side filtering
  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.Type === activeFilter);

  // Sorting
  const sorted = sortByPriority(filteredNotifications);

  // Priority Section
  const topPriority = getTopPriority(notifications, 10);

  const counts = {
    total: notifications.length,
    Event: notifications.filter((n) => n.Type === "Event").length,
    Result: notifications.filter((n) => n.Type === "Result").length,
    Placement: notifications.filter((n) => n.Type === "Placement").length,
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePageChange = (page) => {
    if (page >= 1) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
              Notification System
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <Loading count={4} />
        ) : !error && (
          <>
            <PrioritySection notifications={topPriority} />
            <div className="mb-6 mt-8">
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={counts}
              />
            </div>
            
            {sorted.length === 0 ? (
              <EmptyState message="No Notifications Found" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sorted.map((notification, index) => (
                  <NotificationCard
                    key={notification.ID || index}
                    notification={notification}
                    index={index}
                  />
                ))}
              </div>
            )}
            
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={hasMore}
              totalShown={sorted.length}
            />
          </>
        )}
      </main>
    </div>
  );
}
