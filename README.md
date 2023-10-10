# GigGenius AI

Full stack web app that helps "cut through the noise" on Upwork listings. Designed for freelancers who aren't chasing work, but only looking for specific types of projects. Will only show you projects that are in your wheelhouse, and help you auto-generate a first draft proposal. Spend less time searching & sorting, more time earning.

1) Fetches initial job feed from Upwork, based on your Upwork account search filters. This happens via Upwork's RSS feed - it does not scrape the site in any way that violates the Upwork TOS.
2) AI Bot analyzes results against user-defined strengths and preferences, only presenting the user with a list of job opportunities deemed a "strong match"
3) Job results & analysis stored in database, to prevent duplicate entries and ensure user only ever sees new content
4) User is able to provide feedback on AI's analysis on any given job listing, allowing user to incrementally fine-tune the AI model.
5) For jobs that are deemed a strong match, user can use AI to help generate a rough draft of a proposal catered specifically to that job.


## Backend
- Python/Flask server: URL endpoints that fetch data via API calls
- Google Firebase: Reatime Database

## Frontend
- Vue.js single page app, using Vuetify UI library

## Launching
From parent folder, run `npm start`
OR, from backend/ folder run `flask --app=server.py run` and from frontend/ folder run `npm run dev`