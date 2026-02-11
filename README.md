# HR Harmony Hub

A comprehensive Human Resource Management System for Leave and Attendance Management with role-based access control.

---

## 📌 Project Overview

**HR Harmony Hub** is a full-stack web application designed to streamline HR operations in organizations by automating leave and attendance management. The system provides separate interfaces for employees and administrators, enabling efficient tracking, approval workflows, and reporting.

### Key Features

**For Employees:**
- Apply for leaves (Casual, Sick, Paid) with automatic balance tracking
- Mark daily attendance (Present/Absent)
- View leave history and status (Pending/Approved/Rejected)
- Edit or cancel pending leave requests
- Track attendance records with calendar view
- Real-time leave balance updates

**For Administrators:**
- Comprehensive dashboard with system-wide statistics
- Approve or reject employee leave requests
- View and manage all employee attendance records
- Mark/update attendance for employees
- Generate monthly attendance reports with filtering
- Employee management and overview
- Search and filter capabilities across all modules

**Authentication & Security:**
- JWT-based authentication with secure token management
- Google OAuth integration for seamless sign-in
- Role-based access control (Admin/Employee)
- Password hashing with bcrypt
- Protected API routes and frontend pages
- Automatic session management

---

## 🛠 Tech Stack & Justification

### Frontend Technologies

| Technology | Version | Justification |
|------------|---------|---------------|
| **React** | 18.3.1 | Industry-standard library for building interactive UIs with component reusability and virtual DOM for performance |
| **TypeScript** | 5.8.3 | Type safety reduces runtime errors, improves code maintainability, and provides better IDE support |
| **Vite** | 5.4.19 | Lightning-fast build tool with Hot Module Replacement (HMR) for superior developer experience |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework for rapid UI development with consistent design system |
| **shadcn/ui** | Latest | High-quality, accessible component library built on Radix UI primitives with customizable design |
| **Axios** | 1.13.5 | Powerful HTTP client with interceptors for automatic token injection and centralized error handling |
| **React Query** | 5.83.0 | Efficient server state management with automatic caching, refetching, and optimistic updates |
| **React Router** | 6.30.1 | Declarative routing with protected routes and role-based navigation |
| **React Hook Form** | 7.61.1 | Performant form handling with minimal re-renders |
| **Zod** | 3.25.76 | TypeScript-first schema validation for forms and API responses |
| **date-fns** | 3.6.0 | Modern date utility library with tree-shaking support |
| **Recharts** | 2.15.4 | Composable charting library for data visualization |
| **Lucide React** | 0.462.0 | Beautiful, consistent icon set with tree-shaking |

### Backend Technologies

| Technology | Version | Justification |
|------------|---------|---------------|
| **Node.js** | Latest | JavaScript runtime for building scalable server-side applications |
| **Express.js** | 5.2.1 | Minimal and flexible web framework with robust middleware support |
| **MongoDB** | Latest | NoSQL database for flexible schema design and horizontal scalability |
| **Mongoose** | 9.2.0 | Elegant MongoDB object modeling with schema validation and middleware |
| **JWT** | 9.0.3 | Stateless authentication with secure token-based sessions |
| **bcryptjs** | 3.0.3 | Industry-standard password hashing algorithm (12 rounds) |
| **Google Auth Library** | 10.5.0 | Official Google OAuth integration for social login |
| **Helmet** | 8.1.0 | Security middleware for setting HTTP headers |
| **CORS** | 2.8.6 | Cross-Origin Resource Sharing configuration |
| **dotenv** | 17.2.4 | Environment variable management |

### Development Tools

- **ESLint** - Code quality and consistency
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

---

## 🚀 Installation Steps

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Google OAuth Credentials** (Optional) - [Google Cloud Console](https://console.cloud.google.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/hr-harmony-hub.git
cd hr-harmony-hub
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

**Create `.env` file in the `backend` directory:**

```bash
# Create .env file
touch .env
```

**Add the following environment variables to `backend/.env`:**

```env
# MongoDB Connection
MONGO_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/hr-harmony?retryWrites=true&w=majority

# JWT Secret (use a strong, random string - minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Admin Seed Credentials
ADMIN_EMAIL=admin@hrharmony.com
ADMIN_PASSWORD=Admin123!

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Server Port
PORT=9000
```

**Seed the admin user (run once):**

```bash
npm run seed:admin
```

**Start the backend server:**

```bash
npm start
```

The backend will run on **http://localhost:9000**

### Step 3: Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install
```

**Create `.env` file in the root directory:**

```bash
touch .env
```

**Add the following environment variables to `.env`:**

```env
# Google OAuth Client ID (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# API Base URL (for development - uses Vite proxy)
VITE_API_BASE_URL=/api
```

**Create `.env.production` file for production builds:**

```bash
touch .env.production
```

**Add the following to `.env.production`:**

```env
# Google OAuth Client ID (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# API Base URL (for production - direct backend URL)
VITE_API_BASE_URL=https://hr-project-mrhz.onrender.com/api
```

**Start the development server:**

```bash
npm run dev
```

The frontend will run on **http://localhost:8080**

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

Login with the seeded admin credentials (see Admin Credentials section below).

---

## 🔐 Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGO_URL` | ✅ Yes | MongoDB connection string from MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/hr-harmony` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT token signing (min 32 characters) | `your-super-secret-jwt-key-min-32-characters` |
| `ADMIN_EMAIL` | ✅ Yes | Email for the seeded admin account | `admin@hrharmony.com` |
| `ADMIN_PASSWORD` | ✅ Yes | Password for the seeded admin account | `Admin123!` |
| `GOOGLE_CLIENT_ID` | ❌ No | Google OAuth Client ID for Google Sign-In | `123456-abc.apps.googleusercontent.com` |
| `PORT` | ❌ No | Port for backend server (default: 9000) | `9000` |

### Frontend Environment Variables (`.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_GOOGLE_CLIENT_ID` | ❌ No | Google OAuth Client ID (must match backend) | `123456-abc.apps.googleusercontent.com` |
| `VITE_API_BASE_URL` | ✅ Yes | API base URL for development (use `/api` for proxy) | `/api` |

### Frontend Production Variables (`.env.production`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_GOOGLE_CLIENT_ID` | ❌ No | Google OAuth Client ID | `123456-abc.apps.googleusercontent.com` |
| `VITE_API_BASE_URL` | ✅ Yes | Production backend URL | `https://hr-project-mrhz.onrender.com/api` |

### How to Get Environment Variables

**MongoDB Connection String:**
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" → "Connect your application"
3. Copy the connection string and replace `<username>` and `<password>`

**Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:8080` and your production URL
6. Copy the Client ID

---

## 📡 API Endpoints

### Base URL
- **Development:** `http://localhost:9000/api`
- **Production:** `https://hr-project-mrhz.onrender.com/api`

### Authentication Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/auth/register` | Register new user (employee/admin) | ❌ No |
| `POST` | `/auth/login` | Login with email and password | ❌ No |
| `POST` | `/auth/google` | Login with Google OAuth token | ❌ No |
| `GET` | `/auth/me` | Get current authenticated user | ✅ Yes |

**Request/Response Examples:**

```javascript
// POST /auth/register
Request Body:
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "employee"  // Optional: "employee" or "admin"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "employee",
    "date_of_joining": "2026-02-11T00:00:00.000Z"
  }
}

// POST /auth/login
Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: (Same as register)

// GET /auth/me
Headers:
Authorization: Bearer {jwt-token}

Response:
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "full_name": "John Doe",
  "role": "employee",
  "date_of_joining": "2026-02-11T00:00:00.000Z"
}
```

### Leave Management Endpoints (Employee)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/leaves/my` | Get all my leave requests | ✅ Yes |
| `POST` | `/leaves` | Apply for a new leave | ✅ Yes |
| `PUT` | `/leaves/:id` | Update pending leave request | ✅ Yes |
| `DELETE` | `/leaves/:id` | Cancel pending leave request | ✅ Yes |
| `GET` | `/leave-balance/my` | Get my leave balance | ✅ Yes |

**Request/Response Examples:**

```javascript
// POST /leaves
Request Body:
{
  "leave_type": "casual",  // "casual" | "sick" | "paid"
  "start_date": "2026-02-15",
  "end_date": "2026-02-16",
  "reason": "Personal work"  // Optional
}

Response:
{
  "id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011",
  "leave_type": "casual",
  "start_date": "2026-02-15T00:00:00.000Z",
  "end_date": "2026-02-16T00:00:00.000Z",
  "total_days": 2,
  "status": "pending",
  "reason": "Personal work",
  "applied_date": "2026-02-11T10:30:00.000Z",
  "created_at": "2026-02-11T10:30:00.000Z"
}

// GET /leave-balance/my
Response:
{
  "total_balance": 20,
  "used_balance": 5
}
```

### Leave Management Endpoints (Admin)

| Method | Endpoint | Purpose | Auth Required | Admin Only |
|--------|----------|---------|---------------|------------|
| `GET` | `/leaves/admin/all` | Get all employee leave requests | ✅ Yes | ✅ Yes |
| `PATCH` | `/leaves/admin/:id` | Approve or reject leave request | ✅ Yes | ✅ Yes |

**Request/Response Examples:**

```javascript
// PATCH /leaves/admin/:id
Request Body:
{
  "status": "approved"  // "approved" | "rejected"
}

Response:
{
  "id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011",
  "leave_type": "casual",
  "start_date": "2026-02-15T00:00:00.000Z",
  "end_date": "2026-02-16T00:00:00.000Z",
  "total_days": 2,
  "status": "approved",
  "reason": "Personal work",
  "applied_date": "2026-02-11T10:30:00.000Z"
}
```

### Attendance Endpoints (Employee)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/attendance/my?limit=30` | Get my attendance records | ✅ Yes |
| `GET` | `/attendance/my/today` | Get today's attendance record | ✅ Yes |
| `POST` | `/attendance` | Mark attendance for a date | ✅ Yes |

**Request/Response Examples:**

```javascript
// POST /attendance
Request Body:
{
  "date": "2026-02-11",
  "status": "present"  // "present" | "absent"
}

Response:
{
  "id": "507f1f77bcf86cd799439013",
  "user_id": "507f1f77bcf86cd799439011",
  "date": "2026-02-11T00:00:00.000Z",
  "status": "present",
  "reason": null,
  "created_at": "2026-02-11T09:00:00.000Z"
}
```

### Attendance Endpoints (Admin)

| Method | Endpoint | Purpose | Auth Required | Admin Only |
|--------|----------|---------|---------------|------------|
| `GET` | `/attendance/admin/all?date=&name=` | Get all attendance records with filters | ✅ Yes | ✅ Yes |
| `PATCH` | `/attendance/update/:id` | Update attendance record | ✅ Yes | ✅ Yes |
| `POST` | `/attendance/admin/mark` | Mark attendance for an employee | ✅ Yes | ✅ Yes |
| `GET` | `/attendance/admin/monthly-report?month=&year=&name=` | Get monthly attendance report | ✅ Yes | ✅ Yes |

**Request/Response Examples:**

```javascript
// GET /attendance/admin/all?date=2026-02-11
Response:
{
  "date": "2026-02-11",
  "totalEmployees": 50,
  "presentCount": 45,
  "absentCount": 5,
  "attendanceData": [
    {
      "id": "507f1f77bcf86cd799439013",
      "user_id": "507f1f77bcf86cd799439011",
      "date": "2026-02-11T00:00:00.000Z",
      "status": "present",
      "reason": null,
      "profiles": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}

// POST /attendance/admin/mark
Request Body:
{
  "user_id": "507f1f77bcf86cd799439011",
  "date": "2026-02-11",
  "status": "present",
  "reason": "Marked by admin"  // Optional
}

// GET /attendance/admin/monthly-report?month=2&year=2026
Response:
{
  "month": 2,
  "year": 2026,
  "totalEmployees": 50,
  "report": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "totalDays": 28,
      "present": 25,
      "absent": 3,
      "percentage": 89.29,
      "dailyRecords": [
        { "date": "2026-02-01", "status": "present" },
        { "date": "2026-02-02", "status": "present" }
      ]
    }
  ]
}
```

### User Management Endpoints (Admin)

| Method | Endpoint | Purpose | Auth Required | Admin Only |
|--------|----------|---------|---------------|------------|
| `GET` | `/users/admin/all` | Get all registered employees | ✅ Yes | ✅ Yes |

### Statistics Endpoints (Admin)

| Method | Endpoint | Purpose | Auth Required | Admin Only |
|--------|----------|---------|---------------|------------|
| `GET` | `/stats/admin` | Get dashboard statistics | ✅ Yes | ✅ Yes |

**Response Example:**

```javascript
// GET /stats/admin
Response:
{
  "totalEmployees": 50,
  "pendingLeaves": 8,
  "todayAttendance": 45
}
```

---

## 🗄 Database Models

The application uses **MongoDB** with **Mongoose ODM** for data modeling. Below are the four main models:

### 1. User Model

**Collection:** `users`

**Schema:**

```javascript
{
  full_name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required if no googleId, min 6 chars, hashed with bcrypt),
  googleId: String (unique, sparse - for Google OAuth users),
  role: String (enum: ['employee', 'admin'], default: 'employee'),
  date_of_joining: Date (default: current date),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `email` (unique)
- `googleId` (unique, sparse)

**Methods:**
- `comparePassword(candidatePassword)` - Compare plain password with hashed password

**Middleware:**
- Pre-save hook to hash password with bcrypt (12 rounds)

**Relationships:**
- One-to-Many with Leave (user can have multiple leaves)
- One-to-Many with Attendance (user can have multiple attendance records)
- One-to-One with LeaveBalance (user has one leave balance)

---

### 2. Leave Model

**Collection:** `leaves`

**Schema:**

```javascript
{
  user_id: ObjectId (ref: 'User', required),
  leave_type: String (enum: ['casual', 'sick', 'paid'], required),
  start_date: Date (required),
  end_date: Date (required),
  total_days: Number (required, min: 1),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  reason: String (optional, default: null),
  applied_date: Date (default: current date),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Relationships:**
- Many-to-One with User (referenced by `user_id`)

**Business Logic:**
- `total_days` is calculated from `start_date` and `end_date`
- Only `pending` leaves can be edited or cancelled
- Approved leaves deduct from user's leave balance

---

### 3. Attendance Model

**Collection:** `attendances`

**Schema:**

```javascript
{
  user_id: ObjectId (ref: 'User', required),
  date: Date (required),
  status: String (enum: ['present', 'absent'], required, default: 'present'),
  reason: String (optional, default: null),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- Compound unique index on `(user_id, date)` - prevents duplicate attendance for same user on same date

**Relationships:**
- Many-to-One with User (referenced by `user_id`)

**Business Logic:**
- One attendance record per user per day
- Can be marked by employee or admin
- Admin can update any attendance record

---

### 4. LeaveBalance Model

**Collection:** `leavebalances`

**Schema:**

```javascript
{
  user_id: ObjectId (ref: 'User', required, unique),
  total_balance: Number (default: 20),
  used_balance: Number (default: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `user_id` (unique)

**Relationships:**
- One-to-One with User (referenced by `user_id`)

**Business Logic:**
- Created automatically when user registers (default: 20 days)
- `used_balance` increases when leave is approved
- Available balance = `total_balance - used_balance`

---

### Database Relationships Diagram

```
User (1) ──────< (Many) Leave
  │
  │
  ├──────< (Many) Attendance
  │
  │
  └────── (1) LeaveBalance
```

---

## 👤 Admin Credentials

After running the seed script (`npm run seed:admin` in the backend directory), you can login with the following credentials:

**Email:** `admin@hrharmony.com`  
**Password:** `Admin123!`

**Note:** These credentials are defined in your `backend/.env` file and can be customized:

```env
ADMIN_EMAIL=admin@hrharmony.com
ADMIN_PASSWORD=Admin123!
```

### Creating Additional Admin Users

You can create additional admin users in two ways:

1. **Via Registration:** Register a new user and manually set `role: "admin"` in the request body
2. **Via Database:** Update an existing user's `role` field to `"admin"` in MongoDB

---

## 🤖 AI Tools Declaration

This project was developed with the assistance of the following AI tools:

### 1. **Google Gemini (Antigravity AI Assistant)**
- **Contribution:** 
  - Code architecture and structure design
  - Implementation of frontend components (React, TypeScript)
  - Backend API development (Express.js, MongoDB)
  - Integration of authentication (JWT, Google OAuth)
  - Axios API client setup with interceptors
  - Database schema design and relationships
  - Bug fixing and optimization
  - Documentation and README creation
  - Code refactoring and best practices implementation

### 2. **GitHub Copilot** (if used)
- **Contribution:**
  - Code completion and suggestions
  - Boilerplate code generation
  - Function implementations

### 3. **ChatGPT** (if used)
- **Contribution:**
  - Problem-solving and debugging assistance
  - API design consultation
  - Documentation writing

### Developer Contribution

While AI tools significantly accelerated development, all code was:
- ✅ Reviewed and understood by the developer
- ✅ Tested thoroughly for functionality
- ✅ Customized to meet specific project requirements
- ✅ Debugged and optimized manually
- ✅ Integrated and deployed by the developer

**Transparency Statement:** This project demonstrates the effective collaboration between human developers and AI assistants to build production-ready applications efficiently.

---

## ⚠️ Known Limitations

### Current Limitations

1. **Email Notifications**
   - No email notifications for leave approvals/rejections
   - No email reminders for pending attendance
   - **Workaround:** Users must check the dashboard for updates

2. **Leave Balance Management**
   - Leave balance is not automatically restored when leave is rejected
   - Admin cannot manually adjust leave balances
   - **Workaround:** Database-level updates required

3. **Attendance Bulk Operations**
   - No bulk attendance marking for multiple employees
   - No import/export functionality for attendance data
   - **Workaround:** Mark attendance individually

4. **Reporting**
   - Monthly report export to CSV is not implemented (button removed)
   - No PDF export functionality
   - Limited date range filtering
   - **Workaround:** Use browser print or screenshot

5. **User Management**
   - Admin cannot deactivate/delete user accounts from UI
   - No user role modification from admin panel
   - **Workaround:** Database-level operations required

6. **Mobile Responsiveness**
   - Some complex tables may require horizontal scrolling on small screens
   - **Workaround:** Use landscape mode on mobile devices

7. **Real-time Updates**
   - No WebSocket implementation for real-time notifications
   - Changes require manual page refresh
   - **Workaround:** Use React Query's auto-refetch (configured at 30s intervals)

8. **File Uploads**
   - No support for leave request attachments (medical certificates, etc.)
   - No profile picture uploads
   - **Future Enhancement:** Planned for v2.0

9. **Performance**
   - Large datasets (1000+ employees) may cause slower load times
   - No pagination on some list views
   - **Workaround:** Use search and filter features

10. **Backend Deployment**
    - Free tier Render deployment may have cold start delays (30-60 seconds)
    - **Workaround:** First request may be slow; subsequent requests are fast

### Security Considerations

- **Environment Variables:** Ensure `.env` files are never committed to version control
- **JWT Secret:** Use a strong, random secret key (minimum 32 characters)
- **MongoDB:** Use MongoDB Atlas with IP whitelisting and strong passwords
- **CORS:** Configure allowed origins properly in production

---

## ⏱ Time Spent

**Total Development Time:** Approximately **40-50 hours**

### Breakdown:

| Phase | Time Spent | Details |
|-------|------------|---------|
| **Planning & Design** | 4-5 hours | Requirements gathering, database schema design, UI/UX wireframing |
| **Backend Development** | 12-15 hours | Express setup, MongoDB models, API endpoints, authentication, middleware |
| **Frontend Development** | 18-22 hours | React components, routing, state management, API integration, UI styling |
| **Authentication & Security** | 4-5 hours | JWT implementation, Google OAuth, protected routes, role-based access |
| **Testing & Debugging** | 5-6 hours | Manual testing, bug fixes, edge case handling |
| **Deployment** | 2-3 hours | Backend deployment to Render, environment configuration |
| **Documentation** | 3-4 hours | README creation, API documentation, code comments |

### Development Timeline:

- **Week 1:** Backend setup, database models, authentication
- **Week 2:** Frontend setup, core components, API integration
- **Week 3:** Admin features, reporting, UI polish
- **Week 4:** Testing, bug fixes, deployment, documentation

**Note:** Time estimates include learning, research, and AI-assisted development. Pure coding time was optimized through AI tool usage.

---

## 📜 Available Scripts

### Frontend (Root Directory)

```bash
npm run dev          # Start development server (http://localhost:8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Backend (`backend/` Directory)

```bash
npm start            # Start production server
npm run dev          # Start development server
npm run seed:admin   # Seed admin user (run once)
```

---

## 🚢 Deployment

### Backend (Deployed on Render)

**Live URL:** https://hr-project-mrhz.onrender.com

**Deployment Steps:**
1. Create a new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `backend/.env`
6. Deploy

### Frontend Deployment Options

**Build for Production:**
```bash
npm run build
```

**Deploy to:**
- **Vercel:** `vercel --prod`
- **Netlify:** Drag & drop `dist/` folder
- **GitHub Pages:** Use `gh-pages` package

---

## 📞 Support & Contact

For questions, issues, or contributions:

- **Email:** support@hrharmony.com
- **GitHub Issues:** [Create an issue](https://github.com/yourusername/hr-harmony-hub/issues)

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, TypeScript, Node.js, and MongoDB**

**Developed with AI assistance from Google Gemini (Antigravity)**
