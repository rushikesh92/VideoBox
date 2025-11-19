# VideoBox


VideoBox is a robust backend service for a video-sharing platform, similar to YouTube. It provides a complete set of APIs for managing users, videos, subscriptions, comments, likes, tweets, and playlists.   
[Check Server status](https://videobox-prrk.onrender.com/api/v1/healthcheck)     (First request may take few seconds for server to start) 
## Features

-   **User Authentication**: Secure user registration and login with JWT (Access and Refresh tokens).
-   **Profile Management**: Users can update their account details, avatar, and cover images.
-   **Video Operations**: Upload, publish, update, and delete videos. Videos and thumbnails are stored using Cloudinary.
-   **Subscription System**: Users can subscribe to and unsubscribe from channels.
-   **Social Interactions**:
    -   **Likes**: Toggle likes on videos, tweets, and comments.
    -   **Comments**: Full CRUD functionality for comments on videos.
    -   **Tweets**: A simple Twitter-like feature for users to post short text updates.
-   **Playlists**: Users can create, update, delete, and manage playlists by adding or removing videos.
-   **Dashboard**: Get channel statistics including total subscribers, videos, likes, and views.
-   **Watch History**: Tracks videos watched by a user.
-   **Health Check**: An endpoint to monitor the application's status.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **File Storage**: Cloudinary for video and image hosting
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt
-   **File Handling**: Multer for handling `multipart/form-data`
-   **Pagination**: `mongoose-paginate-v2` for paginating API results

## API Documentation

You can find the full API reference here:

**[View API Documentation](./docs/api.md)**    
**[OpenAPI Specification](./openapi.yaml)**

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js
-   npm
-   MongoDB instance (local or remote)
-   Cloudinary account



### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/rushikesh92/VideoBox.git
    cd VideoBox
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the `.env.sample` file.
    ```sh
    cp .env.sample .env
    ```
    Fill in the required values in your new `.env` file:
    ```env
    PORT=8000
    MONGODB_URL=<your_mongodb_connection_string>
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The server will start on the port specified in  `.env`.