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

## POST `/captains/register`

### Description

Registers a new captain in the system. On successful registration, returns the created captain object.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "vehicle": {
    "color": "string (min 3 chars, required)",
    "plate": "string (min 3 chars, required)",
    "capacity": "number (required)",
    "vehicleType": "string (one of: car, motorcycle, auto, required)"
  }
}
```

#### Example

```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "password": "captainPass123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

- **201 Created**
  - Registration successful.
  - Returns: `{ "captain": { ...captainData } }`

- **400 Bad Request**
  - Validation failed (e.g., missing fields, invalid email, short password, invalid vehicle data).
  - Returns: `{ "errors": [ ... ] }`

- **500 Internal Server Error**
  - Unexpected server error.

### Notes

- The `fullname.firstname`, `email`, `password`, and all `vehicle` fields are required.
- The `vehicleType` must be one of: `car`, `motorcycle`, or `auto`.
- The password is securely hashed before storage.

---
