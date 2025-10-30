# API Integration Guide

## Expected Backend Endpoints

This document outlines the expected API endpoints that the frontend is configured to consume.

## Base URL

Configure in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Authentication Endpoints

### POST `/auth/register`
Register a new user

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user" | "activist" | "admin",
    "avatar": "string?",
    "createdAt": "string"
  },
  "token": "string"
}
```

### POST `/auth/login`
Authenticate user

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as register

### GET `/auth/me`
Get current user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "user" | "activist" | "admin",
  "avatar": "string?",
  "createdAt": "string"
}
```

## Pollution Endpoints

### GET `/pollution`
Get all pollution points with optional filters

**Query Parameters:**
- `status` - Filter by status (reported, in_progress, cleaned, verified)
- `type` - Filter by type (trash, oil_spill, industrial_waste, sewage, plastic, other)
- `region` - Filter by region name
- `limit` - Pagination limit
- `offset` - Pagination offset

**Response:**
```json
[
  {
    "id": "string",
    "latitude": "number",
    "longitude": "number",
    "type": "trash" | "oil_spill" | "industrial_waste" | "sewage" | "plastic" | "other",
    "status": "reported" | "in_progress" | "cleaned" | "verified",
    "description": "string",
    "photos": ["string"],
    "reportedBy": {
      "id": "string",
      "name": "string",
      "avatar": "string?"
    },
    "assignedTo": {
      "id": "string",
      "name": "string"
    },
    "createdAt": "string",
    "updatedAt": "string",
    "region": "string?"
  }
]
```

### GET `/pollution/:id`
Get single pollution point by ID

**Response:** Single pollution point object

### POST `/pollution`
Create new pollution point

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `latitude` - number
- `longitude` - number
- `type` - string (enum)
- `description` - string
- `region` - string (optional)
- `photos` - File[] (multiple files)

**Response:** Created pollution point object

### PATCH `/pollution/:id`
Update pollution point

**Request Body:**
```json
{
  "status": "in_progress" | "cleaned" | "verified",
  "assignedTo": "string?",
  "description": "string?"
}
```

**Response:** Updated pollution point object

### DELETE `/pollution/:id`
Delete pollution point (admin only)

**Response:** 204 No Content

### GET `/pollution/stats`
Get pollution statistics

**Response:**
```json
{
  "total": "number",
  "reported": "number",
  "inProgress": "number",
  "cleaned": "number",
  "byType": {
    "trash": "number",
    "oil_spill": "number",
    "industrial_waste": "number",
    "sewage": "number",
    "plastic": "number",
    "other": "number"
  },
  "byRegion": {
    "region_name": "number"
  }
}
```

### GET `/pollution/export`
Export pollution data as CSV

**Query Parameters:** Same as GET `/pollution`

**Response:** CSV file download

## Error Responses

All endpoints should return consistent error format:

```json
{
  "error": "string",
  "message": "string",
  "statusCode": "number"
}
```

### Common Status Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in cookie via `js-cookie`
4. Axios interceptor adds token to all requests
5. On 401 error, user is redirected to login

## File Upload

Photo uploads use `multipart/form-data`:
- Accept: `image/*`
- Max size: Configure on backend
- Multiple files supported

## CORS Configuration

Backend should allow:
```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true
}
```

## Rate Limiting

Consider implementing rate limiting:
- Auth endpoints: 5 requests/minute
- Pollution endpoints: 100 requests/minute
- Export endpoint: 10 requests/hour

## Testing

Use tools like:
- Postman for manual testing
- Jest + MSW for mocking
- Swagger/OpenAPI for documentation

## Next Steps

1. Receive actual API documentation from backend team
2. Update service files if endpoints differ
3. Add error handling for specific error codes
4. Implement retry logic for failed requests
5. Add request/response logging in development
