# Live Polling System

A real-time polling system with Teacher and Student personas built with React, Express.js, and Socket.io.

## Features

### Teacher Features

- Create new polls with multiple choice questions
- View live polling results in real-time
- Control poll flow (only ask new questions when appropriate)
- Manage student participants

### Student Features

- Enter name on first visit (unique per browser tab)
- Submit answers to active polls
- View live results after submission
- 60-second timer for each question

### Technical Features

- Real-time updates using WebSocket (Socket.io)
- Responsive design following Figma specifications
- Professional code structure with security best practices
- Redux state management for complex state handling
- Input validation and error handling

## Technology Stack

- **Frontend**: React, Redux Toolkit, Socket.io-client, Tailwind CSS
- **Backend**: Express.js, Socket.io, CORS, Rate Limiting
- **Real-time**: WebSocket communication
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all projects:

   ```bash
   npm run install-deps
   ```

3. Start the development servers:

   ```bash
   npm run dev
   ```

   This will start:

   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

### Environment Variables

Create `.env` files in both client and server directories:

**server/.env**

```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**client/.env**

```
REACT_APP_SERVER_URL=http://localhost:5000
```

## Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   └── utils/          # Utility functions
└── README.md
```

## API Endpoints

### REST API

- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls/:id` - Get specific poll
- `POST /api/polls/:id/vote` - Submit vote

### WebSocket Events

- `join-room` - Join polling room
- `new-poll` - Teacher creates new poll
- `submit-vote` - Student submits answer
- `poll-results` - Real-time results update
- `timer-update` - Timer synchronization

## Security Features

- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Error handling and logging
- XSS protection

## Deployment

### Frontend (Vercel)

1. Build the client: `cd client && npm run build`
2. Deploy to Vercel

### Backend (Railway/Heroku)

1. Set up environment variables
2. Deploy the server directory

## License

MIT License - see LICENSE file for details
