const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require("helmet");

dotenv.config();

const db = require('./db');
const authRoutes = require('./routes/auth');
const leavesRoutes = require('./routes/leaves');
const attendanceRoutes = require('./routes/attendance');
const usersRoutes = require('./routes/users');
const leaveBalanceRoutes = require('./routes/leaveBalance');
const statsRoutes = require('./routes/stats');

const PORT = process.env.PORT || 9000;
const app = express();
app.use(
  helmet({
    crossOriginOpenerPolicy: false, 
  })
);


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/leave-balance', leaveBalanceRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
