# Planet Web

Planet Web is a backend application built with Node.js, Express, and PostgreSQL (via Sequelize). It manages user authentication, user progression (levels, XP), and game-related data like Planets and Gases.

## Features

- **Authentication**:
  - User Registration with Email Verification.
  - Login (JWT-based Access & Refresh Tokens).
  - Password Reset (Forgot Password).
  - Change Password.
  - Logout.
- **User Management**:
  - Profile management.
  - XP and Leveling system.
- **Game Data Management**:
  - Planets, Gases, and Levels.
  - Tracking user attempts and progress.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcryptjs
- **Email Service**: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL installed and running

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Planet_Web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=3000
    
    # Database Config
    DB_HOST=127.0.0.1
    DB_USER=postgres
    DB_PASS=your_password
    DB_NAME=planet_web_db
    DB_DIALECT=postgres

    # JWT Config
    JWT_ACCESS_KEY=your_super_secret_access_key
    JWT_REFRESH_KEY=your_super_secret_refresh_key
    JWT_ACCESS_EXPIRE=15m
    JWT_REFRESH_EXPIRE=7d

    # Email Config (Nodemailer)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    
    # Frontend URL (for email links)
    FRONTEND_URL=http://localhost:3000
    ```

4.  **Database Setup:**
    Run migrations (if applicable) or ensure the database exists. The application uses Sequelize, so it may sync models on startup depending on configuration.

## Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Start Production:**
  ```bash
  npm start
  ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/change-password` - Change password

*(Note: Add more endpoints as developed)*

## License

ISC
