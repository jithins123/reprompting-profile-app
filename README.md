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

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
