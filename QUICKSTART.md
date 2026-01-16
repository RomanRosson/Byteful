# Byteful - Quick Start Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Frontend (React + Vite) on `http://localhost:3000`
   - Backend (Express API) on `http://localhost:3001`

3. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Click the "Admin" button to access the admin portal
   - Default credentials:
     - Username: `admin`
     - PIN: `1234`

## Adding Your First Item

1. Login to the admin portal
2. Click the "+ Add Item" button
3. Fill in the form:
   - **Type**: Choose from Link, Command, or Site
   - **Title**: A descriptive title
   - **Content**: The actual link URL, command, or site content
   - **Description**: Optional description
   - **Category**: Optional category for organization
   - **Tags**: Comma-separated tags (optional)
4. Click "Create"

## Features

- **Public View**: Browse all your items on the home page
- **Search**: Use the search bar to find items
- **Filter**: Filter by type (All, Link, Command, Site)
- **Admin Portal**: Full CRUD operations for managing items
- **Copy Commands**: Click the clipboard icon on command items to copy

## Database

The SQLite database is automatically created in the `database/` folder on first run. The database file (`byteful.db`) is gitignored and will be created locally.

## Troubleshooting

- **Port already in use**: If port 3000 or 3001 is in use, you can modify the ports in:
  - `vite.config.js` for the frontend port
  - `server/index.js` for the backend port

- **Database errors**: Delete the `database/` folder and restart the server to recreate the database

- **CORS issues**: Make sure both servers are running and the proxy is configured in `vite.config.js`
