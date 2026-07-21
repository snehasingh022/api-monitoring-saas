# API Monitoring SaaS

A production-ready SaaS application for monitoring websites and REST APIs. Built with a microservices architecture, Docker, PostgreSQL, Redis, and JWT authentication.

## Architecture

| Service              | Responsibility                                      |
| -------------------- | --------------------------------------------------- |
| **API Gateway**      | Routing, JWT verification, rate limiting, logging |
| **Auth Service**     | Register, login, refresh token, user profile        |
| **Monitor Service**  | CRUD monitors, health checks, history, dashboard    |
| **Notification Service** | Email alerts on status changes                |

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (one instance per domain service)
- **Cache:** Redis
- **Auth:** JWT (access + refresh tokens)
- **Containers:** Docker, Docker Compose

## Project Structure

```
API_TRACKER/
├── frontend/                  # React SPA
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── monitor-service/
│   └── notification-service/
├── scripts/                   # Utility scripts
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- Git
- Node.js (v18+)
- Docker Desktop (with engine running)
- Docker Compose

## Getting Started

> Full setup instructions will be added as services are implemented.

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Run `docker compose up --build`

## Development Status

| Phase | Description              | Status      |
| ----- | ------------------------ | ----------- |
| 1     | Foundation & scaffolding | In progress |
| 2     | Auth Service             | Pending     |
| 3     | API Gateway              | Pending     |
| 4     | Monitor Service          | Pending     |
| 5     | Notification Service     | Pending     |
| 6     | Frontend                 | Pending     |
| 7     | Production polish        | Pending     |

## License

Portfolio project — not licensed for commercial use.
