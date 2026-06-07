# YouTube Clone - Full Stack Video Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Better Auth](https://img.shields.io/badge/Better_Auth-Authentication-purple?style=for-the-badge)

A modern YouTube clone built with **Next.js App Router**, **React 19**, **Better Auth**, and a separate **Node.js/Express + MongoDB** backend. Users can create channels, upload videos, watch videos, like/dislike, comment, subscribe, and manage their own uploaded content.

## Live Demo

**Live Site:** [https://youtube-clon-client.vercel.app](https://youtube-clon-client.vercel.app)

## Features

- Email/password and Google authentication with Better Auth
- Channel creation with profile, avatar, cover image, and bio
- Video upload using external video and thumbnail URLs
- Dynamic watch page with video player, channel info, suggested videos, and description
- Like and dislike system for authenticated users
- Comment system with add, edit, and delete support
- Owner-only video edit and delete actions
- Subscribe and unsubscribe channel flow
- Library page for liked videos and subscribed channels
- Watch history page
- Responsive dark UI inspired by YouTube

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- HeroUI
- Better Auth
- React Hot Toast
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB native driver
- JWT verification with Better Auth JWKS

## Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js
- npm
- Git
- A running backend server
- MongoDB connection string

### Clone The Repository

```bash
git clone https://github.com/muhiuddinshanto/youtube_clon_client.git
cd youtube_clone
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API=http://localhost:3000
NEXT_PUBLIC_SERVER_API=http://localhost:5000

BETTER_AUTH_SECRET=your_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

For production deployment, update the values to match your live frontend and backend URLs.

### Run Locally

```bash
npm run dev
```

The frontend will run at [http://localhost:3000](http://localhost:3000).

Make sure the Express backend is also running, usually at [http://localhost:5000](http://localhost:5000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```txt
src/
  app/              Next.js App Router pages and API routes
  components/       Reusable UI and feature components
  lib/              Auth and helper utilities
public/             Static assets
```

## Important Backend Routes

The frontend expects these backend routes to exist:

```txt
GET    /videos
GET    /videos/:id
POST   /api/video/upload
PUT    /api/video/:id
DELETE /api/video/:id

GET    /videos/:id/comments
POST   /videos/:id/comments
PUT    /videos/:videoId/comments/:commentId
DELETE /videos/:videoId/comments/:commentId

POST   /api/channel/create
GET    /channels/:id
PUT    /users/:id/subscribe
GET    /api/library/liked-videos
GET    /api/library/subscribed-channels
```

## Deployment

This frontend is deployed on Vercel:

[https://youtube-clon-client.vercel.app](https://youtube-clon-client.vercel.app)

When deploying, set all required environment variables in the Vercel dashboard and make sure `NEXT_PUBLIC_SERVER_API` points to the deployed backend server.

## Author

Built by Mohiuddin Shanto.
