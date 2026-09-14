# MockData

Fake REST APIs with real JSON. Docs-first platform.

## Product surfaces

| Path | Purpose |
|------|---------|
| `/` | Resource catalog + search |
| `/docs` | How to use the platform |
| `/playground` | Try live requests in the browser |
| `/users`, `/posts`, … | Per-resource docs |
| `/api/users`, `/api/posts`, … | Live CRUD APIs |

## Setup

```bash
cp .env.example .env.local   # set DATABASE_URL
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Database scripts

- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:studio`

## API

```
POST   /api/auth/login
GET    /api/auth/me

GET|POST           /api/users
GET|PATCH|DELETE   /api/users/:id

GET|POST           /api/posts
GET|PATCH|DELETE   /api/posts/:id

GET|POST           /api/comments
GET|PATCH|DELETE   /api/comments/:id

GET|POST           /api/albums
GET|PATCH|DELETE   /api/albums/:id

GET|POST           /api/photos
GET|PATCH|DELETE   /api/photos/:id

GET|POST           /api/todos
GET|PATCH|DELETE   /api/todos/:id

GET|POST           /api/products
GET|PATCH|DELETE   /api/products/:id

GET|POST           /api/notifications
GET|PATCH|DELETE   /api/notifications/:id

GET|POST           /api/countries
GET|PATCH|DELETE   /api/countries/:id

POST   /api/admin/reset
```
