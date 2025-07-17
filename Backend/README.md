# User Registration Endpoint Documentation

## POST `/users/register`

### Description

Registers a new user in the system. On successful registration, returns a JWT authentication token and the created user object.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (min 3 chars, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

- **201 Created**
  - Registration successful.
  - Returns: `{ "token": "<jwt_token>", "user": { ...userData } }`

- **400 Bad Request**
  - Validation failed (e.g., missing fields, invalid email, short password).
  - Returns: `{ "errors": [ ... ] }`

- **500 Internal Server Error**
  - Unexpected server error.

### Notes

- The `firstname`, `email`, and `password` fields are required.
- The `lastname` field is optional but must be at least 3 characters if provided.
- The password is securely hashed before storage.

---

## POST `/users/login`

### Description

Authenticates a user with email and password. Returns a JWT authentication token and the user object on successful login.

### Request Body

Send a JSON object with the following structure:

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

- **200 OK**
  - Login successful.
  - Returns: `{ "token": "<jwt_token>", "user": { ...userData } }`

- **400 Bad Request**
  - Validation failed (e.g., missing fields, invalid email, short password).
  - Returns: `{ "errors": [ ... ] }`

- **401 Unauthorized**
  - Invalid email or password.
  - Returns: `{ "message": "Invalid email or password" }`

- **500 Internal Server Error**
  - Unexpected server error.

### Notes

- Both `email` and `password` are required.
- The password is compared securely using hashing.

---

## GET `/users/profile`

### Description

Returns the authenticated user's profile information. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Authentication

- **Required**: Yes (JWT token)

### Request

- No request body required.
- Send the JWT token as a Bearer token in the `Authorization` header or as a `token` cookie.

#### Example Header

```
Authorization: Bearer <jwt_token>
```

### Responses

- **200 OK**
  - Returns the user profile object.

- **401 Unauthorized**
  - Missing or invalid token.

---

## GET `/users/logout`

### Description

Logs out the authenticated user by blacklisting the current JWT token and clearing the authentication cookie.

### Authentication

- **Required**: Yes (JWT token)

### Request

- No request body required.
- Send the JWT token as a Bearer token in the `Authorization` header or as a `token` cookie.

### Responses

- **200 OK**
  - Returns: `{ "message": "Logged out successfully" }`

- **401 Unauthorized**
  - Missing or invalid token.

---

## Captain Endpoints

### POST `/captains/register`

Registers a new captain in the system.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string", // required, min 3 chars
    "lastname": "string"   // optional
  },
  "email": "string",        // required, valid email
  "password": "string",     // required, min 6 chars
  "vehicle": {
    "color": "string",      // required, min 3 chars
    "plate": "string",      // required, min 3 chars
    "capacity": 4,          // required, number
    "vehicleType": "car"    // required, one of: "car", "motorcycle", "auto"
  }
}
```

#### Successful Response (`201 Created`)

```json
{
  "token": "<jwt_token>", // JWT authentication token
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields
  }
}
```

#### Error Response (`400 Bad Request`)

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long", // example error message
      "param": "fullname.firstname",
      "location": "body"
    }
    // ...other validation errors
  ]
}
```

#### Error Response (`500 Internal Server Error`)

```json
{
  "error": "Internal server error"
}
```

---

### POST `/captains/login`

Authenticates a captain with email and password.

#### Request Body

```json
{
  "email": "string",    // required, valid email
  "password": "string"  // required, min 6 chars
}
```

#### Successful Response (`200 OK`)

```json
{
  "token": "<jwt_token>", // JWT authentication token
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields
  }
}
```

#### Error Response (`400 Bad Request`)

```json
{
  "errors": [
    {
      "msg": "Invalid email address", // example error message
      "param": "email",
      "location": "body"
    }
    // ...other validation errors
  ]
}
```

#### Error Response (`401 Unauthorized`)

```json
{
  "message": "Invalid email or password"
}
```

---

### GET `/captains/profile`

Returns the authenticated captain's profile.

- **Authentication:** Required (JWT token in `Authorization` header or `token` cookie)

#### Successful Response (`200 OK`)

```json
{
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields
  }
}
```

#### Error Response (`401 Unauthorized`)

```json
{
  "message": "Unauthorized"
}
```

---

### GET `/captains/logout`

Logs out the authenticated captain by blacklisting the current JWT token and clearing the authentication cookie.

- **Authentication:** Required (JWT token in `Authorization` header or `token` cookie)

#### Successful Response (`200 OK`)

```json
{
  "message": "Logged out successfully"
}
```

#### Error Response (`401 Unauthorized`)

```json
{
  "message": "Unauthorized"
}
```

---

## GET `/get-fare`

### Description

Calculates and returns the estimated fare for a ride based on the provided origin, destination, and vehicle type.

### Request Query Parameters

- `origin`: string (required) — The starting location (address or coordinates).
- `destination`: string (required) — The ending location (address or coordinates).
- `vehicleType`: string (required) — One of: `"car"`, `"motorcycle"`, `"auto"`.

#### Example

```
GET /get-fare?origin=Downtown&destination=Airport&vehicleType=car
```

### Responses

- **200 OK**
  - Returns: `{ "fare": 250.0, "distance": 12.5, "duration": 25 }`
    - `fare`: number — Estimated fare amount.
    - `distance`: number — Distance in kilometers.
    - `duration`: number — Estimated duration in minutes.

- **400 Bad Request**
  - Missing or invalid parameters.
  - Returns: `{ "errors": [ ... ] }`

- **500 Internal Server Error**
  - Unexpected server error.

### Notes

- All parameters are required.
- Fare calculation may depend on distance, duration, and vehicle type.

---

## Captain Fare Endpoint

### GET `/captains/get-fare`

Calculates and returns the estimated fare for a ride for captains, based on the provided origin, destination, and vehicle type.

### Request Query Parameters

- `origin`: string (required)
- `destination`: string (required)
- `vehicleType`: string (required)

#### Example

```
GET /captains/get-fare?origin=Downtown&destination=Airport&vehicleType=car
```

### Responses

- **200 OK**
  - Returns: `{ "fare": 250.0, "distance": 12.5, "duration": 25 }`

- **400 Bad Request**
  - Missing or invalid parameters.

- **500 Internal Server Error**
  - Unexpected server error.

### Notes

- Parameters and response structure are the same as the user `/get-fare` endpoint.

---
