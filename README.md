# Sharing Vision 2023 - Article Test

Complete starter implementation based on the supplied Backend and Frontend test specifications.

## Stack
- Backend: Go + Gin + MySQL
- Frontend: React + Vite
- API testing: Postman
- Database migration: SQL

## Requirements
- Go 1.22+
- Node.js 18+
- MySQL 8+

## Backend

1. Create the database:
   `CREATE DATABASE article;`

2. Copy `.env.example` to `.env` and configure MySQL.

3. Run the migration:
   `mysql -u root -p article < migrations/001_create_posts.sql`

4. Install dependencies:
   `go mod tidy`

5. Start:
   `go run ./cmd`

API runs on `http://localhost:8080`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite development URL, normally `http://localhost:5173`.

## Postman

Import:
`postman/Sharing-Vision-Article.postman_collection.json`

The frontend uses PUT `/article/:id` to move an article to `thrash`, as required by the dashboard behavior. DELETE is retained for the backend's delete endpoint.

## Notes

The original test specifies `status` values:
- `publish`
- `draft`
- `thrash`

Validation:
- title: required, minimum 20 characters
- content: required, minimum 200 characters
- category: required, minimum 3 characters
- status: required and one of the three values above
