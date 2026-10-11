# QuickNotes Data Model

## 1. Overview

The QuickNotes application stores users, notes, tags, and the relationships between notes and tags. A relational database such as PostgreSQL is suitable because the data has clear relationships and needs reliable transactions.

## 2. Database Tables

### Users

Stores account information for each user.

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### Notes

Stores notes created by users.

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key referencing users(id) |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Nullable |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Tags

Stores labels that users can apply to their notes.

| Column | Data Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key referencing users(id) |
| name | VARCHAR(50) | NOT NULL |

### Note_Tags

Connects notes and tags to support a many-to-many relationship.

| Column | Data Type | Key / Constraint |
|---|---|---|
| note_id | INTEGER | Foreign Key referencing notes(id) |
| tag_id | INTEGER | Foreign Key referencing tags(id) |

The combination of `note_id` and `tag_id` is the composite primary key.

## 3. Relationships

- **Users to Notes:** One user can create many notes. Each note belongs to one user.
- **Users to Tags:** One user can create many tags.
- **Notes to Tags:** A note can have many tags, and a tag can be used on many notes. The `note_tags` junction table implements this many-to-many relationship.

## 4. SQL Table Creation

```sql
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Sample SQL Queries

### Query 1: Retrieve all notes belonging to a user

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

### Query 2: Retrieve one note by its ID

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE id = 101 AND user_id = 1;
```

### Query 3: Retrieve notes and their tags using a JOIN

```sql
SELECT notes.id, notes.title, tags.name AS tag_name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id
WHERE notes.user_id = 1
ORDER BY notes.id;
```

## 6. Indexing Strategy

The following index improves queries that retrieve a user's notes and sort them by update time.

```sql
CREATE INDEX idx_notes_user_updated
ON notes(user_id, updated_at DESC);
```

This index helps the database find a user's notes efficiently and return recently updated notes first.

## 7. SQL vs NoSQL

A SQL database such as PostgreSQL is a good choice for QuickNotes because users, notes, and tags have structured relationships. Foreign keys and transactions help maintain data integrity. A NoSQL database such as MongoDB offers flexible document structures and can be useful when data shapes change frequently. However, SQL is the better initial choice for this project because its relationships and constraints fit the application's needs.