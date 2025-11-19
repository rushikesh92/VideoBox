# Videobox API Documentation
[Check Server status](https://videobox-prrk.onrender.com/api/v1/healthcheck)     (First request may take few seconds for server to start)  
Base URL:
```
https://videobox-prrk.onrender.com/api/v1
```

---

## Note
- Protected endpoints require an `Authorization` header:
  ```
  Authorization: Bearer <ACCESS_TOKEN>
  ```


---

## User Routes (`/users`)

### POST `/register`
Register a new user.

**Request (form-data / multipart):**
- `fullName` (text, required)
- `email` (text, required)
- `username` (text, required)
- `password` (text, required)
- `avatar` (file, required)
- `coverImage` (file, optional)

---

### POST `/login`
Log in a user.

**Request (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### POST `/logout`
Log out user.

---

### POST `/refresh-token`
Refresh the access token 

---

### PATCH `/change-password`
Change the password  of current user

**Request (JSON):**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

### GET `/current-user`
Get details of current logged in user

---

### PATCH `/update-account`
Update account details

**Request (JSON):**
```json
{
  "newEmail": "<new@example.com>",
  "newFullName": "<New Name>"
}
```

---

### PATCH `/avatar`
Upload single file in `avatar` form field (multipart/form-data).

---

### PATCH `/cover-image`
Upload single file in `coverImage` form field (multipart/form-data).

---

### GET `/channel/:username`
Public: Returns profile info for a specified channel.

---

### GET `/history`
Returns watch history of current user.

---

##  Video Routes (`/videos`)

### POST `/publish`
Requires authentication.

**Request (multipart/form-data):**
- `title` (text) required
- `description` (text) required
- `video` (file) required
- `thumbnail` (file) required

---

### GET `/`
Public: Get list of all videos.

Query params:
- `page` (default 1)
- `limit` (default 10)

---

### GET `/:videoId`
Public : get single video.

---

### DELETE `/:videoId`
Delete video

---

### PATCH `/:videoId`
Update video details

**Request (JSON):**
```json
{
  "title": "<Updated title>",
  "description": "<Updated description>"
}
```

---

### PATCH `/thumbnail/:videoId`
Update thumbnail of video  
 Form-data with `thumbnail` file.

---

### GET `/channel/:channelId`
Public: Get all videos of channel.

---

## Subscription Routes (`/subscriptions`)

All subscription endpoints require authentication.

### POST `/subscribe/:channelId`
Subscribe to a channel.

### DELETE `/unsubscribe/:channelId`
Unsubscribe from a channel.

### GET `/`
Get channels current user is subscribed to.

### GET `/my-subscribers`
Get subscribers of the current user's channel.

---

## Comment Routes (`/comments`)  
All comment endpoints require authentication.
### GET `/video/:videoId`
Get all comments of video.

### POST `/video/:videoId`
Post a comment on video.

**Request (JSON):**
```json
{
  "comment": "<comment>"
}
```

### PATCH `/:commentId`
Update comment.

**Request (JSON):**
```json
{
  "comment": "<updated comment>"
}
```

### DELETE `/:commentId`  
Delete comment

---

## Tweet Routes (`/tweets`)
All tweet endpoints require authentication.
### POST `/`
Create a tweet.

**Request (JSON):**
```json
{
  "content": "<tweet>"
}
```

### GET `/all`
Returns list of all tweets.

### GET `/user/:userId`
Returns list of all tweets of specific user.

### GET `/:tweetId`
Get a single tweet by id.

### PATCH `/:tweetId`
Update tweet

**Request (JSON):**
```json
{
  "content": "<updated tweet>"
}
```

### DELETE `/:tweetId`
Delete tweet.

---

## Playlist Routes (`/playlists`)
All playlist endpoints require authentication.
### POST `/`
Create a playlist.

**Request (JSON):**
```json
{
  "name": "<playlist name>",
  "description": "<description>"
}
```

### GET `/:playlistId`
Get playlist by id

### PATCH `/:playlistId`
Update playlist details    
**Request (JSON):**
```json
{
  "name": "<updated playlist name>",
  "description": "<updated description>"
}
```

### DELETE `/:playlistId`
Delete playlist

### PATCH `/add/:playlistId`
Add videos to playlist

**Request (JSON):**
```json
{
  "videoIds": ["690a0d7014a176f1ae0d719c", "6909ffa3331d158af6ebebe1"]
}
```

### PATCH `/remove/:playlistId`
Remove videos from playlist.     
**Request (JSON):**
```json
{
  "videoIds": ["6907902fad8a5e41aedc84ab", "6909ffa3331d158af6ebebe1"]
}
```

### GET `/user/:userId`
Get all playlists of a user.

---

## Like Routes (`/likes`)
 like endpoints require authentication.  
### POST `/toggle`
Add / remove like on content  
**Request (JSON):**
```json
{
  "contentId": "690a0d7014a176f1ae0d719c",
  "model": "Video"
}
```

### GET `/videos`
Returns liked video list.

### GET `/tweets`
Returns liked tweet list.

### GET `/count`
Public: returns like count for a content item.

Request body :
```json
{
  "contentId": "690a0d7014a176f1ae0d719c",
  "model": "Video"
}
```
---

## Dashboard & Healthcheck

### GET `/dashboard/channel/:channelId`
Get channel stats and information (Requires authentication)

### GET `/healthcheck`
Get server status



