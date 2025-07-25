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

## Screenshots

<img width="1907" height="958" alt="8175cc92d9c73779a59cf04e9a2c9a47" src="https://github.com/user-attachments/assets/3e667ba0-d639-4cf8-9cfd-93584405be12" />
<img width="1921" height="964" alt="edbe02cf7cd8718fb98decbe7cb2f63d" src="https://github.com/user-attachments/assets/5e5b8105-0098-4baa-8d8a-2f2753703e63" />
<img width="1914" height="951" alt="2d9917ccea8c8e89f8be4caf42c2ee9a" src="https://github.com/user-attachments/assets/b3f0c660-1640-425a-bf9d-cb3406c1c2a6" />
<img width="1830" height="932" alt="304ac639e17eb072f2e36d040fd5c978" src="https://github.com/user-attachments/assets/ba764dc3-a851-4b49-ab2a-c007a9546839" />

