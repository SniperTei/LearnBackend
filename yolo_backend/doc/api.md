# YOLO Backend API Documentation

## Overview
This document provides detailed information about the YOLO Backend API endpoints, including authentication, user management, and other features.

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Protected endpoints require a valid JWT token to be included in the request header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this general format:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {
    // Response data (if any)
  }
}
```

## Error Handling
When an error occurs, the response will include:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## API Endpoints

### User Management

#### 1. Register User
Create a new user account.

```http
POST /users/register
Content-Type: application/json
```

Request Body:
```json
{
  "username": "string",
  "password": "string",
  "gender": "male|female|other",
  "birthDate": "YYYY-MM-DD",
  "avatarUrl": "string (optional)"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "username": "string",
    "gender": "string",
    "birthDate": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 2. User Login
Authenticate a user and receive a JWT token.

```http
POST /users/login
Content-Type: application/json
```

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "username": "string",
      "gender": "string",
      "birthDate": "string",
      "avatarUrl": "string"
    },
    "token": "string"
  }
}
```

#### 3. Get User Profile
Retrieve the current user's profile information.

```http
GET /users/profile
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "username": "string",
    "gender": "string",
    "birthDate": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 4. Update User Profile
Update the current user's profile information.

```http
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

Request Body (all fields optional):
```json
{
  "gender": "male|female|other",
  "birthDate": "YYYY-MM-DD",
  "avatarUrl": "string"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "username": "string",
    "gender": "string",
    "birthDate": "string",
    "avatarUrl": "string",
    "updatedAt": "string"
  }
}
```

#### 5. Soft Delete User
Mark the current user's account as deleted (logical deletion).

```http
DELETE /users/soft-delete
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "User soft deleted successfully"
}
```

#### 6. Hard Delete User
Permanently delete the current user's account.

```http
DELETE /users/hard-delete
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "User permanently deleted"
}
```

## Data Models

### User Model
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  avatarUrl: {
    type: String,
    default: 'default-avatar.png'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Security Considerations
1. Passwords are hashed using MD5 before storage
2. JWT tokens expire after 7 days
3. Sensitive information (password, deleted status) is never returned in responses
4. All endpoints are protected against unauthorized access
5. Input validation is performed on all requests
6. Rate limiting is recommended for production use

## Error Codes and Messages
Common error messages you might encounter:

1. Authentication Errors:
   - "No authentication token provided"
   - "Invalid authentication token"
   - "Authentication token has expired"
   - "User account has been deleted"

2. User Management Errors:
   - "Username already exists"
   - "Invalid username or password"
   - "User not found"
   - "Invalid input data"

## Development and Testing
To test the API endpoints, you can use tools like Postman or curl. Here's a sample curl command for user registration:

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "gender": "male",
    "birthDate": "1990-01-01"
  }'
```

## Rate Limiting
The API currently does not implement rate limiting, but it is recommended to add rate limiting in production using Express middleware like `express-rate-limit`.
