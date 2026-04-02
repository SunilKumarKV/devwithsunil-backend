# DevWithSunil Backend

Production-ready Node.js + Express + PostgreSQL API for the DevWithSunil personal brand.

## Features

- JWT authentication (register/login)
- User profile endpoints
- Courses CRUD with admin guard
- Contact form submission with email notifications
- Newsletter subscription with rate limiting
- Blog system with dynamic posts
- Input validation (express-validator)
- Rate limiting (contact: 5/hour, newsletter: 3/hour, global: 120/15min)
- Security headers (Helmet)
- CORS protection
- Request logging (Morgan)
- Structured error logging
- Email notifications (Nodemailer)
- API documentation (Swagger/OpenAPI)
- Comprehensive test suite (Jest)
- Production-ready error handling

## Quick Start

### Local Development

1. Copy .env.example to .env and fill values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create database and run SQL init:
   ```bash
   psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -f ./sql/init.sql
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

Access API docs at `http://localhost:5000/api-docs`

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions:

- **Database**: Neon PostgreSQL
- **Hosting**: Render
- Complete setup guide with environment variables and testing

## API Documentation

Interactive Swagger UI available at `/api-docs`

### Core Endpoints

- `GET /api`: health check
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (auth required)
- `PUT /api/users/me` (auth required)
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)
- `POST /api/contact` (rate limited)
- `GET /api/contact` (admin)
- `POST /api/newsletter/subscribe` (rate limited)
- `GET /api/blog/posts`
- `POST /api/blog/posts` (admin)

## Examples

POST /api/newsletter/subscribe
{
"email": "user@example.com"
}

POST /api/contact
{
"name": "Sunil",
"email": "sunil@example.com",
"message": "Hello!"
}

POST /api/blog/posts
{
"slug": "hello-world",
"title": "Hello World",
"tag": "personal",
"date": "2026-04-02",
"excerpt": "Intro post",
"content": "...",
"read_time": 3
}
