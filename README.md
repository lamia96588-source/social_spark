# SocialSpark

SocialSpark is a frontend preview for a community driven local events platform, starting with neighbourhood initiatives in Dhaka.

**Live URL:** Pending deployment.

## Features

- Browse a curated set of upcoming community events and filter by category or search term.
- Open event detail pages and join events in the browser demo.
- Create, update, and delete events from a private workspace with ownership checks in demo state.
- View joined events and keep a profile with a display name and picture.
- Switch between light and dark themes across public, account, and workspace pages.
- Responsive public navigation and a collapsible workspace sidebar for mobile.
- Form validation, loading placeholders, accessible empty states, and in-app toast feedback.
- Newsletter signup preview, community gallery, and image credit details.

## Routes

- `/` — public home
- `/upcoming-events` — public event directory
- `/events/[id]` — public event details
- `/login` and `/register` — demo account forms
- `/dashboard`, `/create-event`, `/manage-events`, `/joined-events`, `/profile` — demo private workspace

## Local setup

```bash
npm install
npm run dev
```

The frontend currently stores demo accounts, events, RSVPs, and theme preferences in local storage. No server, database, API, JWT, newsletter delivery, email verification, or password recovery is connected. Replace the local demo adapter with the service API before using it with real accounts or event data.

## Technology

Next.js App Router, React, TypeScript, and locally authored shadcn-style UI primitives.
