# JontroHaat --- Frontend

JontroHaat is a Bangladesh-focused agricultural equipment rental
marketplace. This repository contains the Next.js frontend for browsing
equipment and accessing customer, equipment-owner, and admin
experiences.

## Live links

-   **Live application:** https://jontrohaat.vercel.app
-   **Frontend repository:** https://github.com/shamsu082277/jontrohaat
-   **Backend repository:**
    https://github.com/shamsu082277/jontrohaat-server
-   **Backend service:** https://jontrohaat-server.onrender.com

## Technology

-   Next.js 16.4.6 (App Router)
-   React 19
-   TypeScript
-   Tailwind CSS 4
-   Better Auth
-   Zod and React Hook Form
-   Radix UI primitives, Lucide icons, Sonner, Framer Motion and
    Recharts

## Features

-   Agricultural equipment discovery and browsing
-   Equipment details and rental information
-   Customer, equipment-owner and admin dashboards
-   Better Auth authentication
-   Google OAuth when configured
-   Rental and payment workflows, including Stripe integration
-   Responsive layouts and light/dark theme support

Some features depend on the backend and correctly configured third-party
services.

## Getting started

### Requirements

-   Node.js compatible with the installed Next.js release
-   npm
-   Required authentication and database configuration

### 1. Clone the repository

``` bash
git clone https://github.com/shamsu082277/jontrohaat.git
cd jontrohaat
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root. Use the exact variable names
referenced by the application and any supplied `.env.example`.

Example:

``` env
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

GOOGLE_CLIENT_ID=replace_with_google_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_client_secret
```

For production, set the application URLs to the deployed HTTPS domains
and set the API URL to the deployed backend. Confirm the API variable
name against the frontend source code before configuring it.

If the Better Auth server configuration connects directly to MongoDB,
configure the required MongoDB variables in the frontend environment as
well. Never expose database credentials, OAuth secrets, or private keys
through `NEXT_PUBLIC_` variables.

Do not commit `.env`, `.env.local`, or files containing real
credentials.

### 4. Run locally

``` bash
npm run dev
```

Open http://localhost:3000.

### 5. Build and run for production

``` bash
npm run build
npm run start
```

The current production build script is `next build`. Keep the build
configuration compatible with this project's Tailwind CSS integration.

## Deployment on Vercel

1.  Import this repository into Vercel.

2.  Set the project root directory to the repository root.

3.  Use `npm install` as the install command and `npm run build` as the
    build command.

4.  Add required production environment variables in **Project →
    Settings → Environment Variables**.

5.  Set the production application URL and backend API URL to the
    correct HTTPS domains.

6.  Register the Google OAuth callback URL in Google Cloud Console.
    Confirm the callback path against the Better Auth configuration; the
    expected URL for this project is:

    `https://jontrohaat.vercel.app/api/auth/callback/google`

7.  Deploy or redeploy after changing environment variables.

## Backend connection

-   **Backend base URL:** https://jontrohaat-server.onrender.com
-   **Health endpoint:**
    https://jontrohaat-server.onrender.com/api/health

The backend CORS configuration must allow this frontend origin:

`https://jontrohaat.vercel.app`

The frontend API base URL must match the environment variable actually
read by the frontend code.

## Useful scripts

  Command           Purpose
  ----------------- ------------------------------------
  `npm run dev`     Start the local development server
  `npm run build`   Create the production build
  `npm run start`   Start the production server
  `npm run lint`    Run ESLint

## Repository structure

The project uses the Next.js App Router. Common areas include:

-   `src/app` --- routes, layouts and pages
-   `src/components` --- reusable UI components
-   `src/lib` --- shared utilities and integrations
-   `public` --- static assets

Exact paths may vary as the project evolves.

## Troubleshooting

### The deployed page looks unstyled

-   Confirm the latest commit is deployed.
-   Check that emitted production CSS contains Tailwind utility rules.
-   Confirm the global stylesheet is imported by the root layout.
-   Check the Tailwind CSS 4 and Turbopack integration configuration.
-   Hard-refresh the browser or test in a private window.

### Equipment or API data does not load

-   Open the backend health endpoint and confirm it reports
    `database: connected`.
-   Confirm the frontend API base URL points to the Render service.
-   Check Render logs and browser Network requests.
-   Confirm CORS allows the Vercel origin.

### Authentication or Google login fails

-   Check the Better Auth production URL and secret.
-   Confirm Google OAuth credentials are configured as server-side
    secrets.
-   Confirm the authorized redirect URI matches the Better Auth callback
    URL.
-   Confirm the backend JWKS URL, JWT issuer and audience match the
    frontend's actual Better Auth JWT configuration.

## Security

-   Never commit real environment files or secrets.
-   Never use `NEXT_PUBLIC_` for private credentials.
-   Use HTTPS for production URLs.
-   Restrict database credentials and permissions.
-   Rotate any secret that has been exposed.

## Related repository

Backend source code: https://github.com/shamsu082277/jontrohaat-server
