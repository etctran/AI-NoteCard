# NoteCard

A note-taking application with AI-powered writing assistance.

## Features

- Create, edit, and delete notes
- AI grammar checking and tone analysis
- Smart text completions
- Clean, responsive interface

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Google Gemini AI  
**Frontend:** React, Vite, TailwindCSS, DaisyUI

## Setup

1. Clone the repository
2. Set up environment variables in `backend/.env`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Recommended: Use Vercel Dev (Full-Stack)
```bash
vercel dev
```
This runs both frontend and backend together, mimicking the production environment.

### Alternative: Separate Development Servers
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

**Note:** If running separately, the frontend will be available at `http://localhost:5173` and backend at `http://localhost:5001`.

## Production

The app is deployed on Vercel at: [https://notecard-app.vercel.app/](https://notecard-app.vercel.app/)

## API Endpoints

- `GET/POST/PUT/DELETE /api/notes` - Note CRUD operations
- `POST /api/ai/grammar-check` - Grammar and spelling check
- `POST /api/ai/tone-analysis` - Text tone analysis  
- `POST /api/ai/completions` - Generate text completions
