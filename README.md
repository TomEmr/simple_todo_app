# Simple Todo App

Full-stack todo application built with React and Spring Boot.

## Features

- User registration and authentication (JWT)
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Drag & drop reordering
- Filter by status (all, active, completed)
- Search tasks by text
- Bulk actions (complete all, clear completed)

## Tech Stack

**Frontend:** React, TypeScript, Material UI, Redux Toolkit (RTK Query)

**Backend:** Java 17, Spring Boot, Spring Security, JPA/Hibernate

**Database:** PostgreSQL

## Running Locally

Requires [Docker](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

Open http://localhost:3000
