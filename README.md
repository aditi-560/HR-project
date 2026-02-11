# HR Harmony Hub

HR Portal for Leave and Attendance Management.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, bcrypt

## Setup

### Backend

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies (already done if you ran npm install):
   ```bash
   npm install
   ```

3. Create `.env` with:
   ```
   MONGO_URL=mongodb+srv://your-connection-string/your-database
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@test.com
   ADMIN_PASSWORD=Admin123!
   ```

4. Seed admin user (run once):
   ```bash
   npm run seed:admin
   ```

5. Start server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:9000

### Frontend

1. From project root:
   ```bash
   npm install
   npm run dev
   ```
   App runs on http://localhost:8080

## API Endpoints

### Auth
- `POST /api/auth/register` - Register (full_name, email, password)
- `POST /api/auth/login` - Login (email, password)
- `GET /api/auth/me` - Current user (Bearer token)

### Leaves (auth required)
- `GET /api/leaves/my` - My leaves
- `POST /api/leaves` - Apply leave
- `PUT /api/leaves/:id` - Update pending leave
- `DELETE /api/leaves/:id` - Cancel pending leave

### Admin Leaves
- `GET /api/leaves/admin/all` - All leaves
- `PATCH /api/leaves/admin/:id` - Approve/reject (body: { status })

### Attendance (auth required)
- `GET /api/attendance/my` - My attendance
- `GET /api/attendance/my/today` - Today's record
- `POST /api/attendance` - Mark attendance (date, status)

### Admin
- `GET /api/users/admin/all` - All employees
- `GET /api/stats/admin` - Dashboard stats
- `GET /api/attendance/admin/all?date=&name=` - All attendance

## Demo Admin

After running `npm run seed:admin` in backend:
- Email: admin@test.com
- Password: Admin123!
