# MockData 

Fake REST APIs with real JSON — a docs-first playground for frontends, demos, and prototypes.

Hit live endpoints, get predictable seeded responses, try auth flows, then wire the same URLs into your UI. No backend scaffolding required.

## Features

- **10 live resources** — Auth, Users, Posts, Comments, Albums, Photos, Todos, Products, Notifications, Countries
- **Full CRUD** — list, create, read, update, delete with pagination, search, and filters
- **Persian data** — add `?lang=fa` for Iranian names and copy (English is default)
- **Docs + Playground** — per-resource docs, live examples, and an in-browser request runner
- **Mock controls** — `?delay=` and `?status=` for loading and error UI demos
- **OpenAPI 3.1** — downloadable at `/openapi.json` for Postman, Insomnia, or codegen
- **Shared demo DB** — production seed data resets automatically once per day

## Quick start

```bash
cp .env.example .env.local
# set DATABASE_URL (Neon Postgres recommended)

npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_SECRET` | For manual reset | Protects `POST /api/admin/reset` and the Docs reset panel |
| `CRON_SECRET` | Production cron | Protects `GET /api/cron/reset` (Vercel sends it as `Authorization: Bearer …`) |
| `RESEND_API_KEY` | Contact form | Resend API key |
| `CONTACT_TO` | Contact form | Inbox address |
| `CONTACT_FROM` | Optional | Sender, e.g. `MockData <onboarding@resend.com>` |

## Product surfaces

| Path | Purpose |
|------|---------|
| `/` | Resource catalog + search |
| `/docs` | Platform guide (requests, errors, rate limit, reset) |
| `/playground` | Try live requests in the browser |
| `/users`, `/posts`, … | Per-resource docs |
| `/contact` | Contact form |
| `/api/…` | Live JSON APIs |
| `/openapi.json` | OpenAPI 3.1 document |

## Shared demo data

Everyone shares one production database. You can create, update, and delete freely.

On Vercel, seed data **resets once per day** via `GET /api/cron/reset`. Treat it as a disposable demo — not private storage.

Locally, re-seed with:

```bash
npm run db:seed
```

Or use the Docs reset panel / `POST /api/admin/reset` with `ADMIN_SECRET`.

## Resources

| Resource | Base path | Notes |
|----------|-----------|--------|
| Auth | `/api/auth` | Login + current user |
| Users | `/api/users` | Search, role filters |
| Posts | `/api/posts` | Tags, published flag |
| Comments | `/api/comments` | Filter by `postId` |
| Albums | `/api/albums` | Filter by `userId` |
| Photos | `/api/photos` | Filter by `albumId` |
| Todos | `/api/todos` | Filter by `completed`, `userId` |
| Products | `/api/products` | Price, stock, category |
| Notifications | `/api/notifications` | Type + read flags |
| Countries | `/api/countries` | ISO code, region, population |

### Auth

```bash
# password is always "password" for seeded users
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"avachen","password":"password"}'

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### CRUD pattern

Most resources follow the same shape:

```
GET|POST           /api/<resource>
GET|PATCH|DELETE   /api/<resource>/:id
```

Lists return `{ data, pagination }`. Single items return `{ data }`. Errors return `{ error: { code, message } }`.

### Example

```bash
curl "http://localhost:3000/api/posts?limit=6&published=true"
```

```js
const res = await fetch("/api/posts?limit=6");
const { data, pagination } = await res.json();
```

## Mock controls

Append to any API request:

| Query | Effect |
|-------|--------|
| `?delay=800` | Artificial latency (0–5000 ms) |
| `?status=500` | Force an HTTP error (400–599) |

```bash
curl "http://localhost:3000/api/users?delay=1000"
curl "http://localhost:3000/api/posts/1?status=404"
```

## Persian (`lang=fa`)

Responses are **English by default**. For Persian (Iranian names, usernames, emails, and copy), add `lang=fa`:

```bash
curl "http://localhost:3000/api/users?limit=3&lang=fa"
```

```js
const res = await fetch("/api/users?limit=3&lang=fa");
const { data, font } = await res.json();
// font.family / font.cssUrl → Vazirmatn for rendering Persian text
```

- Works on list, single-item, create/update, and auth responses
- FA responses set `Content-Language: fa` and include a `font` object
- The site header **EN | FA** toggle only appends `?lang=fa` in the Playground — the API does not read cookies

See also [Docs → Language](https://mockdata.ir/docs#language).

## Rate limit

`/api/*` allows about **60 requests per IP per minute**.

Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Over limit returns `429` with `Retry-After`.

## Admin & cron reset

**Manual** (local or production):

```bash
curl -X POST http://localhost:3000/api/admin/reset \
  -H "x-admin-key: $ADMIN_SECRET"
```

Also accepts `Authorization: Bearer <ADMIN_SECRET>`.

**Automatic** (production):

1. Set `CRON_SECRET` in the Vercel project env (16+ random characters).
2. Deploy so `vercel.json` registers the daily cron (`0 0 * * *` → `/api/cron/reset`, around midnight UTC).
3. Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically.

> On Hobby, cron runs at most once per day (this project matches that). Timing may drift by up to ~59 minutes.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Wipe seed tables and reload defaults |
| `npm run db:studio` | Drizzle Studio |

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Drizzle ORM** + Neon / Postgres
- **Zod** request validation
- **Resend** for the contact form
- Deployed on **Vercel** (optional daily cron reset)

## Roadmap

- Orders (`/api/orders`) — related to users and products
