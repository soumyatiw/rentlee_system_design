# Rentlee – System Design Optimized Rental Platform

## Project Overview

Rentlee is a full-stack rental property platform redesigned using System Design principles.  
The system separates frontend and backend using layered architecture and applies OOP concepts, SOLID principles, and Design Patterns to ensure scalability, maintainability, and modularity.

The frontend is built using Next.js, while the backend is developed using Node.js, Express, and TypeScript. The system is designed to simulate a production-ready rental listing platform.

---
## Folder Structure

backend/
├── .env                         # Secrets: MONGO_URI, JWT_SECRET, PORT, CLIENT_URL
├── nodemon.json                 # Auto-restart config for ts-node
├── package.json                 # Dependencies & npm scripts
├── tsconfig.json                # TypeScript compiler config
└── src/
    ├── server.ts                # 🚀 App entry point — bootstrap, middleware, routes, DB connect
    │
    ├── config/
    │   └── db.ts                # connectDB() helper (not used directly, logic inlined in server.ts)
    │
    ├── models/
    │   ├── user.model.ts        # IUser interface + UserSchema + bcrypt pre-save + comparePassword()
    │   ├── property.model.ts    # IProperty interface + PropertySchema + indexes
    │   ├── blog.model.ts        # IBlog interface + BlogSchema + indexes
    │   └── enquiry.model.ts     # IEnquiry interface + EnquirySchema + indexes
    │
    ├── repositories/
    │   ├── user.repository.ts   # UserRepository class — all User DB queries
    │   ├── listing.repository.ts# PropertyRepository class — all Property DB queries + filter/pagination
    │   ├── blog.repository.ts   # BlogRepository class — all Blog DB queries
    │   └── enquiry.repository.ts# EnquiryRepository class — all Enquiry DB queries
    │
    ├── services/
    │   ├── user.service.ts      # UserService — profile CRUD, saved properties
    │   ├── listing.service.ts   # PropertyService — property CRUD with ownership checks
    │   ├── blog.service.ts      # BlogService — blog CRUD with slug & readingTime generation
    │   ├── notification.service.ts # NotificationService (EventEmitter) — email event dispatch
    │   └── user.factory.ts      # UserFactory — static factory for role-based user object creation
    │
    ├── controllers/
    │   ├── auth.controller.ts   # register, registerLister, login
    │   ├── user.controller.ts   # getMe, updateMe, saveProperty, unsaveProperty, getSavedProperties
    │   ├── listing.controller.ts# getAllProperties, getPropertyById, createProperty, update, delete, getMyProperties, getListerStats
    │   ├── blog.controller.ts   # getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog
    │   ├── enquiry.controller.ts# createEnquiry, getMyEnquiries, markEnquiryAsRead
    │   └── admin.controller.ts  # getPendingListers, getAllListers, approve/reject/suspend, getAdminStats, getAllUsers, deleteListing
    │
    ├── middlewares/
    │   ├── auth.middleware.ts   # protect() (JWT, stateless), restrictTo() — lightweight version
    │   ├── role.middleware.ts   # protect() (DB-verified JWT), requireRole(), requireApprovedLister()
    │   ├── error.middleware.ts  # Global error handler — AppError, ValidationError, CastError, Duplicate
    │   └── logger.middleware.ts # requestLogger — timestamps every request
    │
    ├── routes/
    │   ├── auth.routes.ts       # POST /register/user, /register/lister, /login (+ rate limit + validation)
    │   ├── user.routes.ts       # GET/PUT /me, GET/POST/DELETE /me/saved/:propertyId
    │   ├── listing.routes.ts    # CRUD for /listings, lister-specific dashboard & stats
    │   ├── blog.routes.ts       # Public GET, lister POST/PUT/DELETE
    │   ├── enquiry.routes.ts    # All protected: POST /, GET /my, PATCH /:id/read
    │   └── admin.routes.ts      # All admin-only: stats, users, listers, listings
    │
    ├── utils/
    │   ├── AppError.ts          # AppError class — operational errors with HTTP status
    │   ├── ListerStatusStateMachine.ts # State machine — valid lister status transitions
    │   ├── asyncHandler.ts      # Higher-order fn — wraps async handlers, auto-forwards errors
    │   ├── jwt.ts               # generateToken() + verifyToken()
    │   ├── response.ts          # sendSuccess() + sendError() — enforce uniform JSON shape
    │   └── slugify.ts           # slugify() — converts blog titles to URL-safe slugs
    │
    └── scripts/
        ├── seed.ts              # Seed DB with sample properties & users
        ├── check_owners.ts      # Audit script — find properties with missing/invalid owners
        └── reassign_owner.ts    # Data migration — reassign property owner to a valid user


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
