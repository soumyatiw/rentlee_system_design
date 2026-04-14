# Rentlee – System Design Optimized Rental Platform

## Project Overview

Rentlee is a full-stack rental property platform redesigned using System Design principles.  
The system separates frontend and backend using layered architecture and applies OOP concepts, SOLID principles, and Design Patterns to ensure scalability, maintainability, and modularity.

The frontend is built using Next.js, while the backend is developed using Node.js, Express, and TypeScript. The system is designed to simulate a production-ready rental listing platform.

---

## Tech Stack

### Frontend
- Next.js
- React.js
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB (or JSON-based storage)

### Tools & Others
- Firebase Authentication
- REST API
- Git & GitHub
- Postman
- VS Code

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/soumyatiw/rentlee_system_design.git
cd rentlee_system_design
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## How to Run the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on:
http://localhost:5000

### Start Frontend Application

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on:
http://localhost:3000


## Architecture Explanation

The system follows a **Layered Architecture**:

- **Presentation Layer** – Next.js frontend handling UI and client interactions.
- **Controller Layer** – Handles HTTP requests and responses.
- **Service Layer** – Contains business logic and application rules.
- **Repository Layer** – Manages data access operations.
- **Data Layer** – Database or structured data storage.

### This structure ensures:

- Separation of concerns  
- Scalability  
- Maintainability  
- Clear responsibility distribution  

### Design Patterns Implemented:

- **Singleton Pattern** – Used for managing database connection.
- **Factory Pattern** – Used for dynamic property object creation.
- **Observer Pattern** – Used for authentication state handling.

The backend is implemented in **TypeScript** to enforce strong typing and maintain clean, maintainable code following **SOLID principles**.


## Team Members

- Soumya Tiwari  
- Harshita Joshi  
- Shreya Suman  
- Mansi Agarwal  
- Vaidehi Sahu  
