# Development Guide

## Quick Start

1. **Install dependencies**

   ```bash
   npm run install-deps
   ```

2. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── socket/        # Socket.io handlers
│   │   └── utils/         # Utility functions
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install-deps` - Install dependencies for all projects
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Backend (server/)

- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon for development
- `npm test` - Run tests

### Frontend (client/)

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/polls` - Get all polls
- `GET /api/polls/current` - Get current active poll
- `GET /api/polls/history` - Get poll history
- `POST /api/polls` - Create a new poll
- `POST /api/polls/:id/vote` - Submit vote
- `DELETE /api/polls/current` - End current poll
- `POST /api/polls/validate-student` - Validate student name

### WebSocket Events

#### Client to Server

- `join-teacher` - Teacher joins session
- `join-student` - Student joins with name
- `create-poll` - Create new poll
- `submit-vote` - Submit vote
- `end-poll` - End current poll
- `get-poll-history` - Request poll history
- `get-stats` - Request statistics
- `send-chat-message` - Send chat message

#### Server to Client

- `teacher-joined` - Teacher successfully joined
- `student-joined` - Student successfully joined
- `student-connected` - New student connected
- `student-disconnected` - Student disconnected
- `new-poll` - New poll created
- `poll-results` - Poll results updated
- `timer-update` - Timer countdown update
- `vote-submitted` - Vote successfully submitted
- `poll-ended` - Poll ended
- `poll-history` - Poll history data
- `stats-update` - Statistics update
- `chat-message` - Chat message received
- `error` - Error occurred

## Development Features

### Hot Reload

- Frontend: Automatic reload on file changes
- Backend: Nodemon restarts server on changes

### State Management

- Redux Toolkit for state management
- Real-time state sync via Socket.io
- Persistent state for user authentication

### Styling

- Tailwind CSS for utility-first styling
- Custom components with proper design system
- Responsive design out of the box

### Error Handling

- Error boundaries for React components
- Comprehensive error handling in backend
- User-friendly error messages

## Testing the Application

### Manual Testing Checklist

1. **Teacher Flow**

   - [ ] Login as teacher
   - [ ] Create poll with 2-6 options
   - [ ] View live results
   - [ ] End poll manually
   - [ ] View poll history
   - [ ] Use chat functionality

2. **Student Flow**

   - [ ] Login with unique name
   - [ ] See active poll
   - [ ] Submit vote within time limit
   - [ ] View results after voting
   - [ ] Use chat functionality

3. **Real-time Features**

   - [ ] Multiple students voting simultaneously
   - [ ] Live results update
   - [ ] Timer synchronization
   - [ ] Chat messages appear instantly

4. **Edge Cases**
   - [ ] Timer expiration
   - [ ] All students vote before timer
   - [ ] Teacher creates new poll
   - [ ] Connection loss and reconnection
   - [ ] Duplicate student names

## Environment Configuration

### Development

Create `.env` files:

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

### Production

Update for production URLs and security settings.

## Debugging

### Backend Debugging

- Logs are output to console with colors
- Use browser dev tools for API calls
- Check Socket.io connection in Network tab

### Frontend Debugging

- Redux DevTools Extension for state inspection
- Console logs for Socket.io events
- React Developer Tools for component debugging

## Common Issues

### Port Conflicts

If ports 3000 or 5000 are in use:

```bash
# Kill processes using ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Socket Connection Issues

- Verify both frontend and backend are running
- Check CORS configuration
- Ensure WebSocket support in environment

### Build Issues

- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

## Contributing

1. Follow the existing code style
2. Add TypeScript types where beneficial
3. Write tests for new features
4. Update documentation
5. Test across different browsers

## Performance Considerations

### Frontend

- Component memoization for expensive renders
- Virtual scrolling for large lists
- Lazy loading for routes

### Backend

- Connection pooling
- Rate limiting implemented
- Efficient data structures for poll management

## Security

### Implemented

- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- XSS protection

### Additional Recommendations

- Implement authentication for teachers
- Add session management
- Use HTTPS in production
- Implement proper logging
