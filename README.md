# Student Management App

A full-stack student CRUD application built with Spring Boot, MySQL, React, Vite, and Bootstrap.

The app lets you add, view, search, edit, and delete student records. Each student record stores a name, course, and marks.

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Web MVC, Spring Data JPA
- Database: MySQL
- Frontend: React, Vite, Bootstrap
- Build tools: Maven and npm

## Project Structure

```text
student-management-app/
├── src/                         # Spring Boot backend
│   ├── main/java/...             # Controllers, entity, repository
│   └── main/resources/           # Backend configuration
├── frontend/                     # React + Vite frontend
│   ├── src/
│   └── package.json
├── pom.xml                       # Maven backend dependencies
└── README.md
```

## Features

- Add new students
- View all student records
- Search students by name, course, or marks
- Edit existing student details
- Delete student records
- Display total student count and average marks

## Backend Setup

1. Create a MySQL database:

```sql
CREATE DATABASE student_demo_db;
```

2. Update `src/main/resources/application.properties` with your local MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_demo_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

3. Start the Spring Boot backend:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8087
```

## Frontend Setup

1. Move into the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/students` | Get all students |
| `POST` | `/students/add` | Add a new student |
| `PUT` | `/students/edit/{id}` | Update a student |
| `DELETE` | `/students/{id}` | Delete a student |

Example student JSON:

```json
{
  "name": "Aarav Sharma",
  "course": "Computer Science",
  "marks": 88
}
```

## Build

Build the backend:

```bash
./mvnw clean package
```

Build the frontend:

```bash
cd frontend
npm run build
```

