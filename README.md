<<<<<<< HEAD
# Reprompting Profile™ App

A Vercel-ready Next.js app for The Reprompting Project.

## Features

- Branded Reprompting Project quiz experience
- Barlow Condensed, Inter, and Cormorant Garamond fonts
- Black/gold cinematic styling
- 11 profile questions
- “Something else” custom responses
- Final reflection question
- Contact capture
- AI-generated educational profile
- Optional GHL webhook submission
- Non-diagnostic disclaimers

## Environment Variables

Add these in Vercel:

```env
ANTHROPIC_API_KEY=your_anthropic_key_here
GHL_WEBHOOK_URL=your_ghl_webhook_url_here
```

`ANTHROPIC_API_KEY` is optional. If missing, the app uses a fallback result.

`GHL_WEBHOOK_URL` is optional. If missing, the app still works but does not send lead data anywhere.

## Local Development
=======
# The Reprompting Profile™ App

A Vercel-ready Next.js app for The Reprompting Project.

## What it includes

- 11-question Reprompting Profile assessment
- “Something else” free-text option for every question
- Final reflection question
- Contact capture screen
- Educational/non-diagnostic disclaimer language
- AI-generated profile using Anthropic Claude, if configured
- Fallback profile if no API key is configured
- Optional webhook POST to GHL, Zapier, Make, Pabbly, etc.

## Local setup
>>>>>>> 500feeeddcb2d7b385e592983f3f1383d7b88135

```bash
npm install
npm run dev
```

<<<<<<< HEAD
## Build

```bash
npm run build
```
=======
Open `http://localhost:3000`.

## Environment variables

Create `.env.local`:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
LEAD_WEBHOOK_URL=your_webhook_url
```

Both are optional. If `ANTHROPIC_API_KEY` is missing, the app will show a fallback result. If `LEAD_WEBHOOK_URL` is missing, leads will not be sent anywhere.

## Deploy to Vercel

1. Create a new GitHub repo.
2. Upload these files to the repo.
3. Go to Vercel and import the repo.
4. Add environment variables in Vercel Project Settings.
5. Deploy.

## Customise

- Questions: `src/app/data.ts`
- Main UI: `src/app/page.tsx`
- AI prompt: `src/app/api/profile/route.ts`
- Webhook capture: `src/app/api/lead/route.ts`
- Styling: `src/app/globals.css`

## CTA link

In `src/app/page.tsx`, replace:

```tsx
<a className="btn" href="#">Book a Reprompting Session</a>
```

with your booking/application URL.
>>>>>>> 500feeeddcb2d7b385e592983f3f1383d7b88135
