# QuickNotes System Design

## Project Overview

QuickNotes is a simple note-taking application and system design project. It demonstrates how a web client can communicate with a REST API to retrieve and create notes, alongside documentation describing a scalable backend architecture and relational data model.

## Features

- Retrieve and display notes from an API.
- Create notes using a form.
- Validate note titles before submission.
- Display loading, success, error, and empty states.
- Use reusable API request logic and handle HTTP errors.
- Document REST endpoints, database tables, and system architecture.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- JSONPlaceholder API
- Markdown
- Git and GitHub

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the Project

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using a local development server, such as the Live Server extension.
4. Ensure you have an internet connection because the application uses JSONPlaceholder.
5. Click the load button to retrieve notes and use the form to submit a new note.

Note: JSONPlaceholder is a testing API. Created notes are simulated and are not permanently stored on a real production backend.

## Documentation

- [API Design](docs/api-design.md) — REST endpoints, request and response examples, status codes, and error handling.
- [Data Model](docs/data-model.md) — Database tables, relationships, SQL queries, and indexing.
- [System Architecture](docs/architecture.md) — System components, request flows, scalability estimates, and design trade-offs.

## What I Learned

1. How to use JavaScript's Fetch API and async/await to make HTTP requests.
2. How to handle API errors and display useful feedback to users.
3. How REST APIs use HTTP methods and status codes to manage resources.
4. How relational databases use primary keys, foreign keys, and joins.
5. How caching, load balancing, read replicas, and message queues support scalability.
6. How Git and GitHub help track and share project work.

## Future Improvements

- Add a real backend API and database.
- Implement user registration and authentication.
- Add note editing and deletion to the user interface.
- Support searching, filtering, and tagging notes.
- Add automated tests and improve accessibility.

## Author

Created as a learning project to practise web development, API integration, database design, and system architecture.