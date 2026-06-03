# 📺 YouTube Clone - Full Stack Application

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Better-Auth](https://img.shields.io/badge/Better_Auth-Authentication-purple?style=for-the-badge)

A modern, fully functional YouTube clone built with **Next.js (App Router)** for the frontend and **Node.js/Express** with **MongoDB** for the backend. The application features a sleek dark-mode UI and includes essential video-sharing platform functionalities.

## ✨ Features

- **🔐 Authentication:** Secure email/password and Google login using `better-auth`.
- **🎬 Video Player:** Seamless video playback with dynamic URL routing and auto-cleanup.
- **💬 Comment System:** Authenticated users can post comments on videos in real-time.
- **👍 Like/Dislike System:** Users can interact with videos (optimistic UI updates).
- **📺 Channel Profiles:** Users can create and customize their own channels (avatar, cover, bio).
- **📤 Video Uploading:** Upload new videos to your channel.
- **🔔 Subscriptions:** Subscribe/unsubscribe to channels and view them in the Library.
- **📚 Library & Watch History:** Keep track of liked videos and view your subscribed channels.
- **📱 Responsive UI:** Mobile-friendly design with a clean, modern aesthetic.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** Tailwind CSS
- **Authentication:** `better-auth/react`
- **Icons:** `react-icons`
- **Notifications:** `react-hot-toast`

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via `mongodb` native driver)
- **Security/Auth:** JSON Web Tokens (JWT) via `jose-cjs` & Better-Auth

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/muhiuddinshanto/youtube_clon_client.git
cd youtube_clone
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
NEXT_PUBLIC_API=http://localhost:3000
NEXT_PUBLIC_SERVER_API=http://localhost:5000

BETTER_AUTH_SECRET=your_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

*(Note: Make sure your separate Express backend server is running on port 5000 for full functionality).*

## 📂 Project Structure

- `/src/app` - Next.js App Router pages (Home, Watch, Library, etc.)
- `/src/components` - Reusable UI components (VideoPlayer, Navbar, CommentSection, etc.)
- `/src/lib` - Utility functions and authentication configuration.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/muhiuddinshanto/youtube_clon_client/issues).
