# Notification System Design — Stages 1–5

## Stage 1: Notification API Design

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Fetch paginated notifications |
| GET | `/notifications/:id` | Fetch single notification |
| POST | `/notifications` | Create a notification |
| PUT | `/notifications/:id/read` | Mark as read |
| DELETE | `/notifications/:id` | Delete notification |

### Request Schema (GET /notifications)

```
Query Parameters:
  page: integer (default: 1)
  limit: integer (default: 20)
  notification_type: string (Event | Result | Placement)
```

### Response Schema

```json
{
  "notifications": [
    {
      "ID": "string",
      "Type": "Event | Result | Placement",
      "Message": "string",
      "Timestamp": "ISO8601"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 100
}
```

### Authentication

All endpoints are protected via Bearer token in the Authorization header.

---

## Stage 2: Database Design

### Database Choice: PostgreSQL

**Why PostgreSQL:**
- Strong indexing (B-tree, GIN, GiST)
- JSONB for flexible metadata
- Excellent read performance at scale
- ACID compliance for reliability

### Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('Event', 'Result', 'Placement')),
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexing Strategy

```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp DESC);
CREATE INDEX idx_notifications_composite ON notifications(user_id, type, timestamp DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
```

### Scaling

- **Read replicas** for read-heavy workloads
- **Table partitioning** by month on timestamp
- **Connection pooling** via PgBouncer
- **Archival** of old notifications to cold storage

---

## Stage 3: SQL Optimization

### Problem: Slow Query

```sql
SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC;
```

### Why It's Slow

1. Full table scan without proper index
2. `SELECT *` fetches unnecessary columns
3. No LIMIT causes full result materialization
4. Sorting large datasets in memory

### Optimized Query

```sql
SELECT id, type, message, timestamp
FROM notifications
WHERE user_id = $1
  AND timestamp > NOW() - INTERVAL '30 days'
ORDER BY timestamp DESC
LIMIT 20 OFFSET 0;
```

### Index Recommendation

```sql
CREATE INDEX idx_notifications_user_time
  ON notifications(user_id, timestamp DESC)
  INCLUDE (id, type, message);
```

This is a **covering index** — the query can be answered entirely from the index without touching the heap.

### Complexity

- **Without index**: O(n log n) — full scan + sort
- **With composite index**: O(log n + k) — index seek + k result rows

---

## Stage 4: High Load Handling

### Architecture for 10K+ notifications/second

```
Clients → Load Balancer → API Servers (horizontally scaled)
                              ↓
                      Message Queue (Redis Streams / Kafka)
                              ↓
                      Worker Pool (async processing)
                              ↓
                      PostgreSQL (with read replicas)
                              ↓
                      Redis Cache (hot data)
```

### Key Strategies

**1. Message Queues**
- Decouple notification creation from delivery
- Use Redis Streams or Apache Kafka
- Producers push to queue; workers consume asynchronously

**2. Async Processing**
- Worker pool processes notifications in batches
- Batch inserts to DB (reduce I/O)
- Non-blocking delivery (email, push, in-app)

**3. Caching**
- Redis cache for recent notifications per user
- Cache invalidation on new notification
- TTL-based expiry (e.g., 5 minutes)

**4. Horizontal Scaling**
- Stateless API servers behind load balancer
- Auto-scaling based on queue depth
- Database read replicas for query distribution

**5. Rate Limiting**
- Token bucket per user
- Prevents notification flooding
- Protects downstream services

---

## Stage 5: Notification Reliability

### Problems in Naive Pseudocode

```
function sendNotification(user, message):
  save_to_db(notification)
  send_email(user, message)
  send_push(user, message)
  return success
```

**Issues:**
1. No error handling — one failure loses everything
2. Synchronous — blocks on slow email/push
3. No retries — transient failures are permanent
4. No idempotency — retries create duplicates
5. No delivery tracking

### Reliable Architecture

```
1. API receives notification request
2. Save to DB with status = "PENDING" + idempotency key
3. Publish event to message queue
4. Worker picks up event
5. Attempt delivery (email, push, in-app)
6. On success: update status = "DELIVERED"
7. On failure: increment retry count, re-queue with backoff
8. After max retries: status = "FAILED", alert ops
```

### Retry System

```
Retry Strategy: Exponential backoff with jitter
  Attempt 1: immediate
  Attempt 2: 1s + random(0-500ms)
  Attempt 3: 4s + random(0-1000ms)
  Attempt 4: 16s + random(0-2000ms)
  Max retries: 5
  Dead letter queue for permanent failures
```

### Event Queue Architecture

```
Producer → Redis Streams / Kafka Topic
              ↓
Consumer Group (multiple workers)
              ↓
Delivery Service (email, push, SMS)
              ↓
Delivery Log (audit trail)
```

### Distributed Architecture Considerations

- **Idempotency keys** prevent duplicate processing
- **Exactly-once semantics** via consumer group acknowledgments
- **Circuit breakers** for external service failures
- **Health checks** and automatic failover
- **Distributed tracing** (OpenTelemetry) for debugging
- **Monitoring & alerting** on delivery rates and latencies
