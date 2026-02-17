---
title: "Design a URL Shortener"
date: 2025-02-01
description: "Classic system design problem: building a scalable URL shortening service."
---

## Problem Statement

Design a service like bit.ly that takes long URLs and returns short, unique aliases. When users visit the short URL, they are redirected to the original.

## Functional Requirements

- Given a long URL, generate a short unique alias
- Redirect short URL to original URL
- Optional: custom aliases, expiration, analytics

## Non-Functional Requirements

- High availability (redirects must always work)
- Low latency redirects (< 50ms p99)
- Short URLs should be as short as possible
- 100:1 read-to-write ratio

## Capacity Estimation

- 100M new URLs per month
- 10B redirects per month
- ~3,800 writes/sec, ~380,000 reads/sec
- Storage: 100M * 500 bytes = ~50GB/month

## High-Level Design

```
Client → Load Balancer → API Servers → Cache (Redis) → Database (DynamoDB / Postgres)
```

### URL Generation

Use Base62 encoding on an auto-incrementing ID or a hash-based approach:

- **Counter-based**: Sequential ID → Base62. Simple, no collisions. Risk: predictable.
- **Hash-based**: MD5/SHA256 of URL → take first 7 chars. Risk: collisions require retry.

Recommended: Counter-based with a distributed ID generator (e.g., Twitter Snowflake pattern).

## Database Schema

```
urls:
  id          BIGINT PRIMARY KEY
  short_code  VARCHAR(10) UNIQUE INDEX
  long_url    TEXT NOT NULL
  created_at  TIMESTAMP
  expires_at  TIMESTAMP NULL
```

## Key Tradeoffs

| Decision | Option A | Option B |
|----------|----------|----------|
| ID generation | Counter (simple, fast) | Hash (no coordination) |
| Database | SQL (ACID, joins) | NoSQL (scale, simple reads) |
| Cache | Redis (speed) | No cache (simplicity) |

## References

- [System Design Primer - URL Shortener](https://github.com/donnemartin/system-design-primer)
