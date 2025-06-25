# 🌍 EXPLORA - Travel Story App

A full-stack travel storytelling platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js), enabling users to document, share, and relive their travel experiences. The app features secure authentication, Cloudinary for image management, and personalized story management.

## ✨ Features

- 🔐 **Secure User Authentication**: Robust sign-up and login system using JWT and bcrypt for password hashing.
- 📝 **Full CRUD Functionality**: Create, read, update, and delete personal travel stories.
- 🖼️ **Cloudinary Image Uploads**: Seamless image uploads and management handled by Cloudinary.
- 🔍 **Dynamic Search & Filtering**: Instantly search for stories by keyword.
- ⭐ **Favorites System**: Mark and easily access your most cherished travel entries.
- 🎨 **Responsive & Modern UI**: A clean, responsive interface built with Tailwind CSS, featuring modals for a smooth user experience.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Image Management**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Key Libraries**: Axios, React Modal, React Toastify, Moment.js

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [NPM](https://www.npmjs.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.
- A free [Cloudinary](https://cloudinary.com/) account for image storage.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/explora-travel-app.git
cd explora-travel-app
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory and add the following environment variables. Replace the placeholder values with your actual credentials.

    ```env
   # Backend Environment Variables
ACCESS_TOKEN_SECRET=""
MONGO_CONNECTION_STRING=""


# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
    ```

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:8000`.

### 3. Frontend Setup

1.  In a new terminal, navigate to the frontend directory:
    ```bash
    cd frontend/travel_app
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `frontend/travel_app` directory and add the following variable:

    ```env
    # URL of your running backend server
    VITE_API_BASE_URL="http://localhost:8000"
    ```

4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
