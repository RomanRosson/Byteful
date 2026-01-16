# Byteful

A personal knowledge base for storing and managing links, commands, and technical resources.

## Overview

Byteful is a modern, performant web application built with React and Vite that serves as a personal repository for technical knowledge. It features an intuitive interface with fluid animations and an admin portal for managing content.

## Tech Stack

- **Frontend**: ReactJS + Vite
- **Backend**: Express.js
- **Database**: SQLite (for local testing, will migrate to cloud solution for production)
- **Animations**: Framer Motion
- **Deployment**: GitHub Pages / Firebase Hosting (local development first)

## Features

- Modern, responsive UI with fluid animations
- Admin authentication system (username + PIN)
- Admin portal for CRUD operations (Create, Read, Update, Delete)
- Fast and performant user experience
- Local SQLite database for development and testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server (starts both frontend and backend)
npm run dev

# Or run separately:
# Frontend only (port 3000)
npm run client

# Backend only (port 3001)
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note**: The `npm run dev` command runs both the frontend (Vite) and backend (Express) servers concurrently. The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

## Project Structure

```
Byteful/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── styles/         # CSS/styling files
├── server/             # Express backend server
│   └── index.js        # API routes and database setup
├── public/             # Static assets
└── database/           # SQLite database files (auto-created)
```

## Development

The project uses SQLite for local development. The database will be initialized automatically on first run of the backend server.

### Default Admin Credentials

- **Username**: `admin`
- **PIN**: `1234`

**Important**: Change these credentials in production! You can update them directly in the database or modify the server code.

## Future Plans

- Migrate from SQLite to cloud-based database solution
- Deploy to Firebase Hosting
- Additional features as outlined in PLAN.md

## License

Personal project - All rights reserved
