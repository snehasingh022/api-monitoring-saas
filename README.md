<div align="center">

# 📡 API Monitoring Platform

### A microservices-based platform to monitor REST APIs in real time — uptime, response times, and alerts, all in one place.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

</div>

---

## ✨ Overview

**API Monitoring Platform** is a microservices-based observability platform that continuously monitors REST APIs by tracking uptime, response times, HTTP status codes, and availability. It sends real-time email alerts for incidents while leveraging Redis for caching and alert deduplication in a production-style containerized architecture.

---

## 📸 Dashboard Preview

A modern enterprise-grade monitoring dashboard inspired by Grafana, Datadog, Vercel, and GitHub.

<p align="center">
  <img src="./assets/dashboard.png" alt="API Pulse Dashboard" width="100%">
</p>

## 🚀 Features

| | |
|---|---|
| 🧩 **Microservices Architecture** | Dedicated Authentication, Monitoring, Notification, and API Gateway services — independently deployable |
| 🔐 **JWT Authentication** | Access + refresh tokens, with route protection enforced at the gateway level |
| ⏱️ **Background Scheduler** | Periodically pings registered APIs, logging response time, status code, and uptime history |
| ⚡ **Redis-Powered** | Dashboard caching + alert deduplication — no repeat emails, no redundant DB hits |
| 📧 **Smart Email Alerts** | Notifies you the instant a monitored API goes down or recovers |
| 🐳 **Fully Dockerized** | One command spins up every service with Docker Compose |

---

## 🏗️ Architecture

```
                        ┌───────────────────────┐
                        │      API Gateway      │
                        │  (JWT Auth + Routing) │
                        └───────────┬───────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼────────┐        ┌─────────▼─────────┐        ┌────────▼────────┐
│  Authentication  │        │     Monitoring     │        │   Notification   │
│     Service      │        │      Service       │        │      Service      │
└──────────────────┘        └─────────┬──────────┘        └────────┬─────────┘
                                       │                            │
                              ┌────────▼────────┐          ┌────────▼────────┐
                              │   PostgreSQL    │          │      Redis      │
                              │ (monitor history)│          │ (cache/dedup)  │
                              └─────────────────┘          └─────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Stack |
|:---:|:---:|
| Frontend | React · TypeScript |
| Backend | Node.js · Express.js |
| Database | PostgreSQL |
| Caching / Dedup | Redis |
| Auth | JWT (Access + Refresh) |
| Infra | Docker · Docker Compose |

</div>

---

## ⚙️ Getting Started

### Prerequisites
- 🐳 Docker & Docker Compose
- 🟢 Node.js (for local dev outside containers)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/api-monitoring-platform.git
cd api-monitoring-platform

# 2. Configure environment variables
cp .env.example .env

# 3. Launch all services
docker-compose up --build
```

### 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:password@postgres:5432/monitoring
REDIS_URL=redis://redis:6379
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.example.com
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/monitors` | Add a new API to monitor |
| `GET` | `/monitors` | List all monitored APIs |
| `GET` | `/monitors/:id/history` | Get uptime / response history |
| `DELETE` | `/monitors/:id` | Remove a monitored API |

---

## 🗺️ Roadmap

- [ ] Slack / Discord alert integrations
- [ ] Configurable monitoring intervals per endpoint
- [ ] Public status page generation
- [ ] Multi-region monitoring support

---

## 📄 License

Licensed under the **MIT License**.

---

<div align="center">

Made with ⚙️ and a lot of `docker-compose up`

</div>
