# Affordmed Notification System

> Priority-based notification system — **Next.js** + **Tailwind CSS**

## Features

- Priority Scoring Engine (Placement > Result > Event + recency decay)
- Top 10 Priority Section
- Client-Side Filtering (All / Event / Result / Placement)
- Pagination with Previous / Next controls
- Server-Side API Proxy (avoids CORS)
- Skeleton loading animations
- Error handling with retry
- Empty states
- Fully responsive dark UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS |
| HTTP | Axios |

## Setup

```bash
cd affordmed-frontend
npm install
```

Edit `.env.local`:

```
NEXT_PUBLIC_AUTH_TOKEN=your_token_here
```

Run:

```bash
npm run dev
```

Open: http://localhost:3000

## Project Structure

```
app/
  api/notifications/route.js
  globals.css
  layout.js
  page.js
components/
  NotificationCard.js
  FilterBar.js
  PrioritySection.js
  Pagination.js
  Loading.js
  EmptyState.js
lib/
  priority.js
```

## Priority Algorithm

`Score = TypeWeight + RecencyScore`

| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

Recency: exponential decay (~48h half-life), value 0–1.

## Screenshots

_Screenshots to be added after deployment._

## Docs

See `notification_system_design.md` for Stage 1–5 documentation.
