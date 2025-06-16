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
