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
3. Install and run:
   ```bash
   npm run build
   npm start
   ```

## Development

```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

## API Endpoints

- `GET/POST/PUT/DELETE /api/notes` - Note CRUD operations
- `POST /api/ai/grammar-check` - Grammar and spelling check
- `POST /api/ai/tone-analysis` - Text tone analysis  
- `POST /api/ai/completions` - Generate text completions
