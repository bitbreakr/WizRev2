# Game Management Application

This repository contains a technical test project for a game management application that allows users to view, search, add, edit, and delete mobile games.

## Project Overview

This application features a Vue.js frontend with a backend services infrastructure using PostgreSQL for data storage, MeiliSearch for fast search capabilities, and Redis for caching. The project demonstrates a modern full-stack application with robust search functionality, form validation, and state management.

## Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Modern, fast build tool
- **Vuex** - State management
- **Vue Router** - Client-side routing
- **Bootstrap & FastBootstrap** - Responsive UI components and styling
- **Vee-validate & Zod** - Form validation
- **Axios** - HTTP client for API requests
- **MeiliSearch client** - Integration with the MeiliSearch engine

### Backend Services
- **PostgreSQL 14** - Relational database
- **MeiliSearch** - Search engine
- **Redis 7** - In-memory data store/cache

## Prerequisites

To run this project, you'll need:

- Docker and Docker Compose
- Node.js (>=16) and npm or yarn
- Git

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### Start backend services

First, launch the required backend services using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL, MeiliSearch, and Redis services.

### Frontend setup
v
Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
# or with yarn
yarn
```

### Run the frontend application

```bash
npm run dev
# or with yarn
yarn dev
```

This will start the development server. Visit `http://localhost:5173` in your browser to access the application.

### Build for production

To build the frontend for production:

```bash
npm run build
# or with yarn
yarn build
```

## Features

### Game Management
- View a list of mobile games
- Add new games
- Edit existing games
- Delete games
- Pagination support

### Search and Filtering
- Search games by name
- Filter by platform (iOS/Android)
- Real-time search results using MeiliSearch

### Form Validation
- Client-side validation with helpful error messages
- Required fields validation
- Format validation (bundle ID, version number)

### User Experience
- Toast notifications for success/error messages
- Responsive design for different screen sizes
- Modal dialogs for editing/creating games

## Database Configuration

The PostgreSQL database is configured with the following credentials:
- Username: voodoo
- Database: voodoo_db
- Port: 5432

## MeiliSearch Configuration

MeiliSearch is running with the following configuration:
- Host: localhost
- Port: 7700
- Master Key: wizGj762Kja98UxzPqLm53sBn45DfR

## API Endpoints

The frontend communicates with a backend API (expected to run on `http://localhost:3000/api`) with the following endpoints:

- `GET /games` - List games with pagination
- `POST /games` - Create a new game
- `PATCH /games/:id` - Update a game
- `DELETE /games/:id` - Delete a game
- `PUT /games/populate` - Populate the database with sample games

## Notes

This is a technical test project demonstrating frontend development skills with Vue 3 and TypeScript, along with the integration of various services. The backend API implementation is not included in this repository and would need to be implemented separately.
