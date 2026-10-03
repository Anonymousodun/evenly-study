# Evenly Study

A calm, science-informed app that helps students avoid burnout.

## Tech Stack

- **Frontend:** React Native + Expo
- **Database:** PostgreSQL (local via Docker)
- **Auth:** Better Auth
- **Storage:** Cloudflare R2
- **Language:** TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Expo Go](https://expo.dev/client) (on your phone for testing)

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Anonymousodun/evenly-study.git
   cd evenly-study/evenly-study
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL**
   - Make sure the `postgresql-x64-16` Windows service is running
   - Create user `evenly_user` and database `evenly_study` (see `src/db/schema.sql`)

4. **Create tables**
   ```bash
   psql -U evenly_user -h localhost -d evenly_study -f src/db/schema.sql
   psql -U evenly_user -h localhost -d evenly_study -f src/db/auth-schema.sql
   ```

5. **Start the API server**
   ```bash
   npm run server
   ```
   The API runs on `http://localhost:3001` (health check: `/health`).
   Copy `server/.env` values from the example in this README if needed.

6. **Start the app**
   ```bash
   npx expo start
   ```

6. **Open on your phone**
   - Scan the QR code with Expo Go (Android) or Camera (iOS)

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checker |

## Project Structure

```
evenly-study/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Full-page views
│   ├── hooks/          # Custom React hooks
│   ├── context/        # State management
│   ├── db/             # Database layer
│   ├── auth/           # Authentication
│   ├── storage/        # File storage (R2)
│   ├── utils/          # Helper functions
│   ├── data/           # Static data
│   ├── types/          # TypeScript types
│   └── navigation/     # Navigation config
├── scripts/            # Build/deploy scripts
└── Docs/               # Documentation
```

## License

MIT
