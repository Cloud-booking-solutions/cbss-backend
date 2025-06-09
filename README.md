# Cloud Booking Solutions Backend

This is the backend API for the Cloud Booking Solutions application.

## Directory Structure

- `config/` - Configuration files including environment variables
- `middleware/` - Custom middleware functions
- `models/` - Mongoose data models
- `routes/` - API route definitions
- `server.js` - Main server entry point

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the `config` directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/blog` - Blog management
- `/api/career` - Career listings
- `/api/gallery` - Gallery items
- `/api/service` - Services
- `/api/team` - Team members