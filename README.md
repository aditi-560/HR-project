# 🎯 HR Harmony Hub

A modern, full-stack HR Management System for Leave and Attendance Management with role-based access control. Built with React, TypeScript, Node.js, and MongoDB.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hr-project-mrhz.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 Employee Features
- **Dashboard**: Overview of leave balance, attendance stats, and recent activities
- **Leave Management**: 
  - Apply for leaves (Casual, Sick, Paid)
  - View leave history and status
  - Edit/Cancel pending leave requests
  - Real-time leave balance tracking
- **Attendance Management**:
  - Mark daily attendance (Present/Absent)
  - View attendance history with calendar view
  - Track attendance statistics

### 👨‍💼 Admin Features
- **Admin Dashboard**: 
  - Total employees count
  - Pending leave requests overview
  - Today's attendance summary
  - System-wide statistics
- **Leave Approval System**:
  - View all employee leave requests
  - Approve/Reject leave applications
  - Filter and search capabilities
- **Attendance Management**:
  - View all employee attendance records
  - Mark/Update attendance for employees
  - Filter by date and employee name
  - Bulk attendance tracking
- **Employee Management**:
  - View all registered employees
  - Employee details and statistics

### 🔐 Authentication & Security
- JWT-based authentication
- Google OAuth integration
- Role-based access control (Admin/Employee)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Session management with automatic token refresh

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- shadcn/ui component library
- Dark mode support
- Mobile-first approach
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: 
  - Tailwind CSS 3.4
  - shadcn/ui components
  - Radix UI primitives
- **State Management**: 
  - React Context API (Auth)
  - TanStack Query (React Query) for server state
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - JWT (jsonwebtoken)
  - bcryptjs for password hashing
  - Google OAuth (google-auth-library)
- **Security**: 
  - Helmet.js for HTTP headers
  - CORS configuration
- **Environment**: dotenv

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier (via ESLint)
- **Deployment**: Render (Backend)

---

## 🏗 Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (49 components)
│   ├── DashboardLayout.tsx
│   └── NavLink.tsx
├── pages/              # Route pages
│   ├── Auth.tsx
│   ├── EmployeeDashboard.tsx
│   ├── EmployeeLeave.tsx
│   ├── EmployeeAttendance.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminLeaves.tsx
│   ├── AdminAttendance.tsx
│   ├── AdminEmployees.tsx
│   └── NotFound.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.tsx     # Authentication context & hooks
├── lib/                # Utilities and configurations
│   ├── api.ts          # Axios API client with interceptors
│   └── utils.ts        # Helper functions
└── App.tsx             # Root component with routing
```

### Backend Architecture
```
backend/
├── controllers/        # Business logic
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Leave.js
│   ├── Attendance.js
│   └── LeaveBalance.js
├── routes/            # API endpoints
│   ├── auth.js
│   ├── leaves.js
│   ├── attendance.js
│   ├── users.js
│   ├── leaveBalance.js
│   └── stats.js
├── middleware/        # Custom middleware (auth, etc.)
├── scripts/           # Utility scripts
│   └── seedAdmin.js   # Admin user seeding
├── db.js             # MongoDB connection
└── server.js         # Express app entry point
```

### API Client Design
The frontend uses **Axios** with custom interceptors for:
- Automatic JWT token injection in request headers
- Global error handling and user-friendly error messages
- Automatic token cleanup on 401 (Unauthorized)
- 30-second request timeout
- Type-safe API methods with TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials (optional, for Google Sign-In)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hr-harmony-hub.git
cd hr-harmony-hub
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/hr-harmony?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@hrharmony.com
ADMIN_PASSWORD=Admin123!
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
PORT=9000
EOF

# Seed admin user (run once)
npm run seed:admin

# Start backend server
npm start
```

The backend will run on **http://localhost:9000**

#### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=/api
EOF

# Start development server
npm run dev
```

The frontend will run on **http://localhost:8080**

### 🎯 Quick Start with Demo Account

After seeding the admin user, you can login with:
- **Email**: admin@hrharmony.com
- **Password**: Admin123!

Or register a new employee account from the Auth page.

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:9000/api`
- **Production**: `https://hr-project-mrhz.onrender.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "employee"  // Optional: "employee" | "admin"
}

Response: {
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "employee",
    "date_of_joining": "2026-02-11"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: {
  "token": "jwt-token",
  "user": { ... }
}
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-oauth-token"
}

Response: {
  "token": "jwt-token",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {jwt-token}

Response: {
  "id": "user-id",
  "email": "john@example.com",
  "full_name": "John Doe",
  "role": "employee",
  "date_of_joining": "2026-02-11"
}
```

### Leave Management Endpoints

#### Get My Leaves
```http
GET /api/leaves/my
Authorization: Bearer {jwt-token}

Response: [
  {
    "id": "leave-id",
    "user_id": "user-id",
    "leave_type": "casual",
    "start_date": "2026-02-15",
    "end_date": "2026-02-16",
    "total_days": 2,
    "status": "pending",
    "reason": "Personal work",
    "applied_date": "2026-02-11",
    "created_at": "2026-02-11T10:30:00Z"
  }
]
```

#### Apply for Leave
```http
POST /api/leaves
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "leave_type": "casual",  // "casual" | "sick" | "paid"
  "start_date": "2026-02-15",
  "end_date": "2026-02-16",
  "reason": "Personal work"  // Optional
}
```

#### Update Leave (Pending only)
```http
PUT /api/leaves/{leave-id}
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "leave_type": "sick",
  "start_date": "2026-02-15",
  "end_date": "2026-02-17",
  "reason": "Medical appointment"
}
```

#### Cancel Leave (Pending only)
```http
DELETE /api/leaves/{leave-id}
Authorization: Bearer {jwt-token}
```

#### Get Leave Balance
```http
GET /api/leave-balance/my
Authorization: Bearer {jwt-token}

Response: {
  "total_balance": 20,
  "used_balance": 5
}
```

### Admin Leave Endpoints

#### Get All Leaves (Admin)
```http
GET /api/leaves/admin/all
Authorization: Bearer {jwt-token}

Response: [
  {
    "id": "leave-id",
    "user_id": "user-id",
    "leave_type": "casual",
    "start_date": "2026-02-15",
    "end_date": "2026-02-16",
    "total_days": 2,
    "status": "pending",
    "reason": "Personal work",
    "applied_date": "2026-02-11",
    "profiles": {
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### Approve/Reject Leave (Admin)
```http
PATCH /api/leaves/admin/{leave-id}
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "status": "approved"  // "approved" | "rejected"
}
```

### Attendance Endpoints

#### Get My Attendance
```http
GET /api/attendance/my?limit=30
Authorization: Bearer {jwt-token}

Response: [
  {
    "id": "attendance-id",
    "user_id": "user-id",
    "date": "2026-02-11",
    "status": "present",
    "reason": null,
    "created_at": "2026-02-11T09:00:00Z"
  }
]
```

#### Get Today's Attendance
```http
GET /api/attendance/my/today
Authorization: Bearer {jwt-token}

Response: {
  "id": "attendance-id",
  "user_id": "user-id",
  "date": "2026-02-11",
  "status": "present",
  "reason": null,
  "created_at": "2026-02-11T09:00:00Z"
}
```

#### Mark Attendance
```http
POST /api/attendance
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "date": "2026-02-11",
  "status": "present"  // "present" | "absent"
}
```

### Admin Attendance Endpoints

#### Get All Attendance (Admin)
```http
GET /api/attendance/admin/all?date=2026-02-11&name=John
Authorization: Bearer {jwt-token}

Response: {
  "date": "2026-02-11",
  "totalEmployees": 50,
  "presentCount": 45,
  "absentCount": 5,
  "attendanceData": [
    {
      "id": "attendance-id",
      "user_id": "user-id",
      "date": "2026-02-11",
      "status": "present",
      "reason": null,
      "profiles": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### Update Attendance (Admin)
```http
PATCH /api/attendance/update/{attendance-id}
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "status": "present",
  "reason": "Late arrival"  // Optional
}
```

#### Mark Attendance for Employee (Admin)
```http
POST /api/attendance/admin/mark
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "user_id": "user-id",
  "date": "2026-02-11",
  "status": "present",
  "reason": "Marked by admin"  // Optional
}
```

### Admin Endpoints

#### Get All Employees
```http
GET /api/users/admin/all
Authorization: Bearer {jwt-token}

Response: [
  {
    "id": "user-id",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "employee",
    "date_of_joining": "2026-01-15"
  }
]
```

#### Get Dashboard Stats
```http
GET /api/stats/admin
Authorization: Bearer {jwt-token}

Response: {
  "totalEmployees": 50,
  "pendingLeaves": 8,
  "todayAttendance": 45
}
```

---

## 📁 Project Structure

```
hr-harmony-hub/
├── backend/                    # Node.js + Express backend
│   ├── controllers/           # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── scripts/              # Utility scripts
│   ├── db.js                 # Database connection
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables (not in git)
│   └── package.json
│
├── src/                       # React frontend
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   └── NavLink.tsx
│   ├── pages/               # Page components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # Axios API client
│   │   └── utils.ts        # Helper functions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                   # Static assets
├── .env                      # Frontend env variables (not in git)
├── .env.production          # Production env variables (not in git)
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Frontend dependencies
└── README.md                # This file
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/hr-harmony

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Admin Seed
ADMIN_EMAIL=admin@hrharmony.com
ADMIN_PASSWORD=Admin123!

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Server
PORT=9000
```

### Frontend (.env)
```env
# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# API Base URL (for development - uses Vite proxy)
VITE_API_BASE_URL=/api
```

### Frontend (.env.production)
```env
# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# API Base URL (for production - direct backend URL)
VITE_API_BASE_URL=https://hr-project-mrhz.onrender.com/api
```

---

## 🚢 Deployment

### Backend Deployment (Render)

The backend is deployed on Render at: **https://hr-project-mrhz.onrender.com**

**Steps:**
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `.env`
6. Deploy!

### Frontend Deployment

**Build for Production:**
```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

**Deploy to:**
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Upload `dist/` contents

**Important**: Make sure `.env.production` has the correct backend URL!

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📜 Available Scripts

### Frontend
```bash
npm run dev          # Start development server (http://localhost:8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server
npm run seed:admin   # Seed admin user (run once)
```

---

## 🎨 Design System

The project uses **shadcn/ui** with a custom theme:

- **Base Color**: Slate
- **CSS Variables**: Enabled for easy theming
- **Components**: 49+ pre-built components
- **Dark Mode**: Class-based dark mode support
- **Animations**: Custom Tailwind animations
- **Typography**: System font stack with fallbacks

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Vite](https://vitejs.dev/) for blazing fast development
- [React Query](https://tanstack.com/query) for server state management

---

## 📞 Support

For support, email support@hrharmony.com or open an issue on GitHub.

---

**Made with ❤️ using React, TypeScript, and Node.js**
