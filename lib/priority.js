/**
 * Priority Scoring Utility
 *
 * Implements a weighted scoring system for notifications.
 * Priority order: Placement (3) > Result (2) > Event (1)
 * Recency is factored via an exponential decay function.
 */

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Returns the type weight for a given notification type.
 * Defaults to 0 for unknown types.
 */
export function getTypeWeight(type) {
  return TYPE_WEIGHTS[type] ?? 0;
}

/**
 * Calculates a recency score based on how recent the timestamp is.
 * Uses exponential decay — notifications older than ~7 days
 * receive diminishing recency bonuses.
 *
 * Returns a value between 0 and 1.
 */
export function getRecencyScore(timestamp) {
  const now = Date.now();
  const notifTime = new Date(timestamp).getTime();
  const diffHours = (now - notifTime) / (1000 * 60 * 60);

  // Exponential decay with half-life of ~48 hours
  return Math.exp(-diffHours / 48);
}

/**
 * Computes a combined priority score.
 * Score = typeWeight + recencyScore (normalized 0–1)
 *
 * Max possible: 4.0 (Placement + brand-new)
 * Min possible: ~0 (unknown type + very old)
 */
export function computePriorityScore(notification) {
  const typeWeight = getTypeWeight(notification.Type);
  const recency = getRecencyScore(notification.Timestamp);
  return typeWeight + recency;
}

/**
 * Sorts notifications by priority score (descending).
 * Returns a new array — does not mutate the original.
 */
export function sortByPriority(notifications) {
  return [...notifications]
    .map((n) => ({
      ...n,
      _priorityScore: computePriorityScore(n),
    }))
    .sort((a, b) => b._priorityScore - a._priorityScore);
}

/**
 * Returns the top N priority notifications.
 */
export function getTopPriority(notifications, count = 10) {
  return sortByPriority(notifications).slice(0, count);
}

/**
 * Returns a human-readable priority label based on score.
 */
export function getPriorityLabel(score) {
  if (score >= 3) return "Critical";
  if (score >= 2) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

/**
 * Returns a CSS class suffix for priority-based styling.
 */
export function getPriorityClass(score) {
  if (score >= 3) return "priority-high";
  if (score >= 2) return "priority-medium";
  return "priority-low";
}
