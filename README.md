# VideoBox
![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

VideoBox is a robust backend service for a video-sharing platform, similar to YouTube. It provides a complete set of APIs for managing users, videos, subscriptions, comments, likes, tweets, and playlists.

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
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:8000`).

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### User Routes (`/users`)

| Method | Endpoint                    | Description                                  |
| :----- | :-------------------------- | :------------------------------------------- |
| `POST` | `/register`                 | Register a new user.                         |
| `POST` | `/login`                    | Log in a user.                               |
| `POST` | `/logout`                   | Log out the current user.                    |
| `POST` | `/refresh-token`            | Get a new access token using a refresh token.|
| `PATCH`| `/change-password`          | Change the current user's password.          |
| `GET`  | `/current-user`             | Get details of the logged-in user.           |
| `PATCH`| `/update-account`           | Update user's full name and email.           |
| `PATCH`| `/avatar`                   | Update user's avatar image.                  |
| `PATCH`| `/cover-image`              | Update user's cover image.                   |
| `GET`  | `/channel/:username`        | Get a user's channel profile details.        |
| `GET`  | `/history`                  | Get the watch history of the logged-in user. |

### Video Routes (`/videos`)

| Method  | Endpoint                  | Description                             |
| :------ | :------------------------ | :-------------------------------------- |
| `POST`  | `/publish`                | Publish a new video.                    |
| `GET`   | `/`                       | Get all videos with pagination.         |
| `GET`   | `/:videoId`               | Get a specific video by its ID.         |
| `DELETE`| `/:videoId`               | Delete a video.                         |
| `PATCH` | `/:videoId`               | Update video details (title, description). |
| `PATCH` | `/thumbnail/:videoId`     | Update a video's thumbnail.             |
| `GET`   | `/channel/:channelId`     | Get all videos for a specific channel.  |

### Subscription Routes (`/subscriptions`)

| Method  | Endpoint                  | Description                                        |
| :------ | :------------------------ | :------------------------------------------------- |
| `POST`  | `/subscribe/:channelId`   | Subscribe to a channel.                            |
| `DELETE`| `/unsubscribe/:channelId` | Unsubscribe from a channel.                        |
| `GET`   | `/`                       | Get all channels the current user is subscribed to.|
| `GET`   | `/my-subscribers`         | Get all subscribers of the current user's channel. |

### Comment Routes (`/comments`)

| Method  | Endpoint           | Description                      |
| :------ | :----------------- | :------------------------------- |
| `GET`   | `/video/:videoId`  | Get all comments for a video.    |
| `POST`  | `/video/:videoId`  | Add a comment to a video.        |
| `PATCH` | `/:commentId`      | Update a specific comment.       |
| `DELETE`| `/:commentId`      | Delete a comment.                |

### Tweet Routes (`/tweets`)

| Method  | Endpoint        | Description                         |
| :------ | :-------------- | :---------------------------------- |
| `POST`  | `/`             | Create a new tweet.                 |
| `GET`   | `/all`          | Get all tweets with pagination.     |
| `GET`   | `/user/:userId` | Get all tweets from a specific user.|
| `GET`   | `/:tweetId`     | Get a tweet by its ID.              |
| `PATCH` | `/:tweetId`     | Update a tweet.                     |
| `DELETE`| `/:tweetId`     | Delete a tweet.                     |

### Playlist Routes (`/playlists`)

| Method  | Endpoint               | Description                             |
| :------ | :--------------------- | :-------------------------------------- |
| `POST`  | `/`                    | Create a new playlist.                  |
| `GET`   | `/:playlistId`         | Get a playlist by its ID.               |
| `PATCH` | `/:playlistId`         | Update playlist details.                |
| `DELETE`| `/:playlistId`         | Delete a playlist.                      |
| `PATCH` | `/add/:playlistId`     | Add videos to a playlist.               |
| `PATCH` | `/remove/:playlistId`  | Remove videos from a playlist.          |
| `GET`   | `/user/:userId`        | Get all playlists of a specific user.   |

### Like Routes (`/likes`)

| Method | Endpoint     | Description                                           |
| :----- | :----------- | :---------------------------------------------------- |
| `POST` | `/toggle`    | Toggle a like on a video, comment, or tweet.          |
| `GET`  | `/videos`    | Get all videos liked by the current user.             |
| `GET`  | `/tweets`    | Get all tweets liked by the current user.             |
| `GET`  | `/count`     | Get the like count for a specific content item.       |

### Dashboard & Healthcheck Routes

| Method | Endpoint                  | Description                               |
| :----- | :------------------------ | :---------------------------------------- |
| `GET`  | `/dashboard/channel/:channelId` | Get statistics for a specific channel.  |
| `GET`  | `/healthcheck`            | Check the application's health status.  |