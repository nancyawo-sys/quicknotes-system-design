# QuickNotes API Design

## 1. Overview

The QuickNotes API allows users to create, view, update, and delete notes. It follows REST principles and uses HTTP methods to perform operations on note resources. Data is exchanged in JSON format.

Base URL: `/api/v1`

## 2. REST Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | Retrieve all notes belonging to the authenticated user | 200 OK |
| GET | `/notes/{id}` | Retrieve one note by its ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PUT | `/notes/{id}` | Replace an existing note | 200 OK |
| PATCH | `/notes/{id}` | Update selected fields of a note | 200 OK |
| DELETE | `/notes/{id}` | Delete a note by its ID | 204 No Content |

## 3. Create Note Request

Endpoint: `POST /api/v1/notes`

Request body:

```json
{
  "title": "My first note",
  "body": "This is the content of my note.",
  "tagIds": [1, 2]
}
```

The title is required and must not exceed 100 characters. The body contains the note content. The tag IDs are optional.

Successful response: `201 Created`

```json
{
  "id": 101,
  "userId": 1,
  "title": "My first note",
  "body": "This is the content of my note.",
  "createdAt": "2026-10-11T10:00:00Z",
  "updatedAt": "2026-10-11T10:00:00Z"
}
```

## 4. List Notes Request

Endpoint: `GET /api/v1/notes`

Optional query parameters include `page`, `limit`, and `search`.

Example request:

`GET /api/v1/notes?page=1&limit=10`

Successful response: `200 OK`

```json
{
  "data": [
    {
      "id": 101,
      "title": "My first note",
      "body": "This is the content of my note.",
      "createdAt": "2026-10-11T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

## 5. Error Handling

The API returns an appropriate HTTP status code and a JSON error message when a request fails.

| Status Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Missing title or invalid input |
| 401 | Unauthorized | User is not authenticated |
| 403 | Forbidden | User is not allowed to access a resource |
| 404 | Not Found | Requested note does not exist |
| 500 | Internal Server Error | Unexpected server failure |

Example error response:

```json
{
  "error": {
    "code": 400,
    "message": "Title is required."
  }
}
```

## 6. Authentication and Security

The production API should authenticate users before allowing access to their notes. Each note must belong to a user, and users must only access or modify notes they own. Input validation and parameterized database queries help prevent invalid data and SQL injection.

## 7. Pagination and Performance

The notes endpoint supports pagination so that the API does not return every note in one response. Search and filtering can be added to help users find notes efficiently. Database indexes on frequently queried fields can improve response times as the number of notes grows.

## 8. Design Decisions

- REST endpoints use standard HTTP methods and status codes.
- JSON provides a consistent format for requests and responses.
- Pagination helps the API handle large collections of notes.
- Authentication and ownership checks protect users' private notes.
- Clear error responses help clients understand and handle failures.