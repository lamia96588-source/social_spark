# SocialSpark

SocialSpark helps neighbours organize and join local development events in Dhaka.

**Live URL:** https://social-spark-ten.vercel.app

## Features

- Browse upcoming events, search by name or location, and filter by category.
- Discover the next six events on the home page, queried from MongoDB by the API.
- Create an account with email and password, or sign in through GitHub when OAuth is configured.
- Create, edit, and delete your own events in a private workspace.
- Join events and see your participation history, stored in MongoDB.
- Edit your profile and switch between light and dark themes.
- Use the responsive layout on phones, tablets, and desktop screens.

## Local setup

1. Set up the [SocialSpark API](https://github.com/lamia96588-source/social_spark_server) and start it on port 5000.
2. Copy `.env.example` to `.env.local`; set `API_ORIGIN` to the API origin.
3. Run `npm ci`, then `npm run dev`.

The browser calls the Next.js `/api/*` proxy so session cookies and authenticated API requests use the same site. The server verifies JWTs and enforces event ownership.

## Routes

- `/` — public home and six recent upcoming events
- `/upcoming-events` — searchable public event directory
- `/events/[id]` — public event details and join action
- `/login`, `/register` — account forms
- `/dashboard`, `/create-event`, `/manage-events`, `/joined-events`, `/profile` — private workspace

## Verification

Run `npm run lint` and `npm run build`. The backend has its own checks and setup instructions.
