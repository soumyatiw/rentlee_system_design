# Rentlee System Design

Rentlee is a modern rental property platform built with a robust separation of concerns, utilizing Next.js for the frontend and Node.js/Express.js for the backend. The platform serves three distinct roles: Users (tenants seeking properties), Listers (property owners/agents managing listings), and Admins (platform moderators).

## Live Links
- **Frontend (Vercel)**: [https://rentlee-system-design.vercel.app/](https://rentlee-system-design.vercel.app/)
- **Backend (Render)**: [https://rentlee-system-design.onrender.com](https://rentlee-system-design.onrender.com)

## Test Credentials

| Role | Email | Password |
|---|---|---|
| User | shreya@gmail.com | 123456 |
| Lister | lister@gmail.com | 123456 |

---

## Folder Structure

The project adopts a Monorepo-style structure separating the frontend and backend, ensuring clear boundaries between client and server logic.

### Full Project Tree
```text
rentlee_system_design/
├── backend/                  # Node.js + Express Backend
│   ├── src/
│   │   ├── config/           # Environment & DB configurations
│   │   ├── controllers/      # Request handlers & response formatting
│   │   ├── middlewares/      # Express middlewares (Auth, Error handling)
│   │   ├── models/           # Mongoose Database Schemas
│   │   ├── repositories/     # Data Access Layer (Repository Pattern)
│   │   ├── routes/           # API Endpoint definitions
│   │   ├── services/         # Business Logic Layer (Service Pattern)
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Main Application Entry Point
│   ├── .env                  # Backend Environment Variables
│   └── package.json          # Backend Dependencies
└── frontend/                 # Next.js Frontend
    ├── src/
    │   ├── app/              # Next.js App Router Pages
    │   ├── assets/           # Static assets (images, icons)
    │   ├── components/       # Reusable React components
    │   ├── context/          # React Context (State Management)
    │   ├── data/             # Mock data / Static JSON
    │   ├── firebase/         # Firebase configuration & utilities
    │   ├── hooks/            # Custom React Hooks
    │   └── lib/              # API clients & utilities
    ├── .env.local            # Frontend Environment Variables
    └── package.json          # Frontend Dependencies
```

---

## Role-Based Authentication

Rentlee implements strict Role-Based Access Control (RBAC) to ensure security and privacy.

| Role | Responsibilities & Permissions |
|------|--------------------------------|
| **User** | Can browse properties, filter/search listings, view property details, save/bookmark properties, and send enquiries to listers. |
| **Lister** | Can do everything a User does, **plus**: create new property listings, edit/delete their own listings, view enquiries received on their properties, and manage their lister dashboard. Requires approval (status: pending/approved). |
| **Admin** | Has full system access. Can approve/reject pending listers, manage all users, manage all property listings, and oversee platform activity via the Admin dashboard. |

---

## Pages Overview (Frontend)

The frontend utilizes the Next.js `app` router for optimal routing and server-side rendering support.

| Path | Description | Access Level |
|------|-------------|--------------|
| `/` | Landing page featuring hero section, search bar, and featured properties. | Public |
| `/browse` | Property discovery page with advanced filters (location, price, category). | Public |
| `/about` | Information about the Rentlee platform and its mission. | Public |
| `/login` | Authentication portal (Firebase email/password integration). | Public |
| `/register` | Registration portal for new users. | Public |
| `/profile` | User profile management (update details, avatar). | Authenticated |
| `/saved` | Displays properties the user has bookmarked. | Authenticated (User/Lister) |
| `/lister/dashboard` | Main hub for Listers to see stats (views, active listings). | Lister |
| `/lister/listings` | Table view of all properties owned by the Lister with edit/delete actions. | Lister |
| `/lister/listings/create` | Form to publish a new rental property. | Lister |
| `/lister/enquiries` | Inbox showing messages/enquiries from interested tenants. | Lister |
| `/admin/dashboard` | High-level metrics for platform administrators. | Admin |
| `/admin/users` | List of all registered users with moderation controls. | Admin |
| `/admin/listers` | Approval queue and management for property listers. | Admin |
| `/admin/listings` | Global view of all properties across the platform. | Admin |

---

## Architecture, Design Patterns, and Principles

The application is engineered using enterprise-grade design patterns to ensure scalability, maintainability, and clean code.

| Pattern / Principle | Where it is used | Description |
|---------------------|------------------|-------------|
| **Model-View-Controller (MVC)** | `backend/src/` | Separates the application into Models (Mongoose), Views (Next.js Frontend), and Controllers (Express), decoupling data access from business logic and routing. |
| **Repository Pattern** | `backend/src/repositories/` | Abstracts direct database queries (Mongoose) away from the business logic. Controllers interact with Repositories instead of direct DB calls, making unit testing and database swapping easier. |
| **Service Layer Pattern** | `backend/src/services/` | Encapsulates complex business logic (e.g., `notification.service.ts`) outside of the controllers. Keeps controllers "thin" (handling only HTTP requests/responses). |
| **Factory Pattern** | `backend/src/services/user.factory.ts` | Used to dynamically create different types of user objects (User vs. Lister) based on the registration role, centralizing the object creation logic. |
| **Provider / Context Pattern** | `frontend/src/context/` | Uses React Context (`AuthContext.js`) to provide global authentication state across the entire React component tree without prop-drilling. |
| **Singleton Pattern** | `backend/src/config/` | Database connection instances and external service clients (like Firebase Admin) are instantiated once and reused globally. |
| **Middleware Pattern** | `backend/src/middlewares/` | Express middlewares intercept requests for Logging, Error Handling, and JWT Authentication/Authorization before they reach the controllers. |
| **Separation of Concerns (SoC)** | Entire Project | Strict boundaries between Frontend (UI/UX) and Backend (API/Data), as well as between Routes, Controllers, and Services. |
| **DRY (Don't Repeat Yourself)** | `frontend/src/components/` & `backend/src/utils/` | Reusable UI components (buttons, cards, forms) and backend helper functions (error formatters, JWT generators). |

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- Vanilla CSS / CSS Modules
- Firebase Authentication (Client)

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB Atlas & Mongoose
- JSON Web Tokens (JWT) for API Authorization

### Deployment
- **Frontend**: Vercel
- **Backend**: Render

## Team Members
- Soumya Tiwari  
- Harshita Joshi  
- Shreya Suman  
- Mansi Agarwal  
- Vaidehi Sahu  
