# CareerFlow

CareerFlow is a full-stack job application tracking web application built to help students and recent graduates organize their internship and job search in one place.

It allows users to track applications, update application statuses, manage follow-up dates, search and filter applications, and monitor their overall application progress through a dashboard.

## Features

- Create, view, edit and delete job applications
- Track application status including Applied, Interview, Offer, Rejected and Withdrwan
- Automatically suggest a follow-up date 14 days after applying
- Highlight overdue follow-ups
- Search application by company or role
- Filter applications by status or follow-up statuts
- Sort applications by date added, application date or company name
- View dashboard statistics for application progress
- Responsive design with light and dark mode support
- User-facing loading, success, error, and empty states

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Maven

### Database

- PostgreSQL

### Tools

- Git
- GitHub
- VS Code

## Project Architecture

CareerFlow follows a full-stack client-server architecture:

```text
React + TypeScript Frontend
        ↓ HTTP / REST API
Spring Boot Backend
        ↓ Spring Data JPA
PostgreSQL Database


### Why this section matters

It explains the full flow:

```text
browser
→ frontend
→ backend
→ database

React
→ fetch()
→ Spring Controller
→ Service
→ Repository
→ PostgreSQL

Controller
→ receives HTTP request

Service
→ handles application logic

Repository
→ talks to the database

PostgreSQL
→ stores the data

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/applications` | Create a new application |
| GET | `/applications` | Get all applications |
| GET | `/applications/{id}` | Get one application by ID |
| PUT | `/applications/{id}` | Update an existing application |
| DELETE | `/applications/{id}` | Delete an application |

Method
→ what kind of HTTP request?
Endpoint
→ where is the request sent?
Purpose
→ what does it do?

## Running Locally

### Prerequisites
Make sure you have installed:

- Java
- Node.js and npm
- PostgreSQL
- Git

### Backend

1. Navigate to the backend folder:

```powershell
cd careerflow-backend

```md
### Database

Create a PostgreSQL database named:
careerflow

2. Set the PostgreSQL environmnet variables:
$env:DB_USERNAME = "your-postgresql-username"
$env:DB_PASSWORD = "your-postgresql-password"


3. Start the Spring Boot backend:
.\mvnw.cmd spring-boot:run

4. Nvaigate to the frontend folder:
cd careerflow-frontend

install dependencies:
npm install

Start the Vite development server:
npm run dev

## Screenshots

### Application Form

![CareerFlow application form](screenshots/careerflow-form.png)

### Dashboard and Application Controls

![CareerFlow dashboard](screenshots/careerflow-dashboard.png)

### Application Tracking

![CareerFlow application cards](screenshots/careerflow-applications.png)

## Future Improvements

Planned improvements for future versions include:

- User authentication and individual accounts
- Personalized application data for each user
- Follow-up reminders and notifications
- Additional dashboard analytics
- Expanded application tracking features