# DriveNow 🚗
<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/7c14f2a1-4296-491c-a33c-ab7765a94a8c" />

A car rental management web app built with React, Vite, and Supabase.

## Screenshots

<!-- Add your screenshots below. Save images in a `screenshots/` folder in the repo root, then reference them like this: -->

| Sign Up 
<img width="1917" height="928" alt="image" src="https://github.com/user-attachments/assets/f11419d2-126d-4a9f-8e3f-aa955de72fdd" />
| Dashboard 
<img width="1888" height="817" alt="Screenshot 2026-07-25 151811" src="https://github.com/user-attachments/assets/0ace400c-f4d0-424e-b575-da82561ef97b" />
Vehicles
<img width="1905" height="815" alt="Screenshot 2026-07-25 152055" src="https://github.com/user-attachments/assets/906aa571-87d5-487f-af40-9b6dd96e23ae" />
<img width="1897" height="802" alt="Screenshot 2026-07-25 152450" src="https://github.com/user-attachments/assets/b038f086-3822-44e5-90b4-fb4d424e2fe8" />
Rentals
<img width="1902" height="812" alt="Screenshot 2026-07-25 152414" src="https://github.com/user-attachments/assets/28bb404d-f483-44b6-b25d-61dd70de30b3" />

<img width="1907" height="826" alt="Screenshot 2026-07-25 152632" src="https://github.com/user-attachments/assets/12070599-f330-4d7c-83bd-6c96c7c34ca9" />
<img width="1906" height="808" alt="Screenshot 2026-07-25 152652" src="https://github.com/user-attachments/assets/4661421f-fe12-41ea-b91f-5e81a369c309" />

<img width="1902" height="807" alt="Screenshot 2026-07-25 152716" src="https://github.com/user-attachments/assets/47e118e0-0f08-4842-b67b-81a3c17b54de" />





|---|---|---|
| ![Home](./screenshots/home.png) | ![Sign Up](./screenshots/signup.png) | ![Dashboard](./screenshots/dashboard.png) |

<!-- To add a screenshot:
1. Take a screenshot of the page
2. Save it in a `screenshots/` folder in your repo (create it if it doesn't exist)
3. Reference it with: ![Alt text](./screenshots/filename.png)
-->

## Features

- User authentication (email/password sign up & login) powered by Supabase Auth
- Car rental management dashboard
- Real-time data backed by a Supabase Postgres database

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend / Auth / Database:** [Supabase](https://supabase.com)
- **Hosting:** [Vercel](https://vercel.com)

## Project Structure

> Update this section once the directory restructuring is complete.

```
drive-now/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/           # Route-level views
│   ├── lib/              # Supabase client & helpers
│   └── types/           # TypeScript types/interfaces
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([create one here](https://supabase.com/dashboard))

### Installation

```bash
git clone https://github.com/dishavreddy/drive-now.git
cd drive-now
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

You can find these values in your Supabase dashboard under **Settings → API**.

> **Note:** If deploying to Vercel, these same variables must also be added under **Project Settings → Environment Variables** in the Vercel dashboard, and the project redeployed for changes to take effect.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Supabase Setup Notes

- Make sure **Email** auth provider is enabled under **Authentication → Providers**.
- By default, Supabase requires email confirmation before a new user can sign in. For local development/testing, you can disable this (or configure a custom SMTP provider like [Resend](https://resend.com) to avoid hitting Supabase's default email rate limit of a few emails per hour).
- Row Level Security (RLS) policies should be reviewed and enabled on any tables storing user data before going to production.

## Deployment

This project is deployed on Vercel. Any push to the main branch triggers a new deployment automatically (if connected via Vercel's Git integration).

## License

This project currently has no license specified. Add one here if you plan to open source it.
