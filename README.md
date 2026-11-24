# kelianc-portfolio

Personal portfolio website of **Kélian Chalier** — BUT Informatique student at IUT de Montpellier-Sète.

Public bilingual site (English default, French via `/fr/...` paths), a separate non-indexed admin app, and all visible text stored in PostgreSQL so it can be edited without touching code. Built for the Semester 3 PPP graded portfolio.

## Stack

- **PERN in TypeScript**: PostgreSQL, Express.js, React, Node.js
- **Vite** for both React apps (public site and admin)
- Monorepo with npm workspaces

## Architecture

```
apps/
  api/        Express API — layered: routes → controllers → services → repositories
  web/        Public site — Vite + React + TS, organized by feature
  admin/      Admin app — its own Vite build, served on a separate subdomain (noindex)
packages/
  shared/     Types and Zod schemas shared between the API and the frontends
db/
  migrations/ node-pg-migrate migrations — schema changes live only here, never ad-hoc SQL
scripts/      create-admin.mjs — one-off creation of the initial admin account
```

**Why this shape.** The API is layered so each layer has a single responsibility: routes parse HTTP, controllers orchestrate, services hold business logic, repositories own SQL. Services depend on repository *interfaces* (dependency inversion), which makes the business logic unit-testable with in-memory fakes and keeps PostgreSQL swappable. The frontends are split by audience: the public site and the admin are separate builds so the admin can be deployed on its own subdomain, with its own `robots: noindex` / `X-Robots-Tag` headers and no link from the public site.

**Deliberate deviations from textbook SOLID.** No interface ceremony for single-implementation cases, and no DI container — wiring is explicit and readable in `apps/api/src/app.ts`. Over-abstraction would slow down a student project without buying testability we don't use.

## Run locally

Prerequisites: Docker, Node.js 22+, npm 10+.

```bash
cp .env.example .env      # then fill in the values yourself — see below
docker compose up -d      # PostgreSQL (api/web/admin services are added with the apps)
npm install
npm run migrate           # apply db/migrations to the database
npm run dev               # starts api + web + admin concurrently
```

- Public site: http://localhost:5173
- Admin app: http://localhost:4001 (not linked from the public site)
- API: http://localhost:4000

## Environment variables

Every variable is documented in [`.env.example`](.env.example). **Never commit real values** — `.env` is gitignored. Anything only you can provide (local PostgreSQL password, SMTP credentials, contact-form recipient, admin bootstrap credentials, API keys) is filled in by you in `.env`; nothing is hardcoded or invented in the repo.

## Creating the first admin account

```bash
# with ADMIN_EMAIL and ADMIN_PASSWORD set in your .env (never committed)
npm run admin:create
```

The password is hashed with **argon2id** before it is stored. There is no default password anywhere in the repository.

## Branching model and commits

See [CONTRIBUTING.md](CONTRIBUTING.md). Summary:

- `main` is protected: merges only through pull requests, CI checks must pass, no force-push, no deletion.
- Short-lived branches off `main`: `feature/<slug>`, `fix/<slug>`, `chore/<slug>`; deleted after merge.
- [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, …). No `wip` commits on `main`, no merge commits of half-finished work (squash or rebase).

## Privacy

The site is public. No email address, phone number, home address or birth date appears in the code, the UI, the database seeds, or the git history. Contact goes through the on-site form (honeypot field, rate limiting, server-side validation; delivery via self-hosted SMTP with a transactional-API fallback — credentials and recipient live only in `.env`) and through professional profile links (GitHub, LinkedIn). The downloadable CVs are redacted, public-safe PDFs reviewed and approved before publication.

## Deployment

Self-hosted on a home server behind a reverse proxy: the API and the two built frontends run as separate processes/containers; the admin app is exposed only on its own subdomain with `noindex` directives. Detailed deployment instructions are produced in the delivery phase.
