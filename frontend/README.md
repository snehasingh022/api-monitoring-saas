# API Monitoring SaaS — Frontend

React + TypeScript + Vite + TailwindCSS client for the API Monitoring platform.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Environment

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Dev server runs on port **5173** and proxies `/api` to the API Gateway.
