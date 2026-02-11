// API client for HR Harmony backend
import axios, { AxiosError, AxiosInstance } from "axios";

const API_BASE = 'https://hr-project-mrhz.onrender.com/api'
const TOKEN_KEY = "hr-harmony-token";

// Token management functions
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - automatically add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Handle network errors
    if (!error.response) {
      throw new Error("Network error - please check your connection");
    }

    // Handle 401 Unauthorized - clear token
    if (error.response.status === 401) {
      clearToken();
      throw new Error("Session expired - please login again");
    }

    // Extract error message from response
    const message = error.response.data?.message || error.message || "Request failed";
    throw new Error(message);
  }
);

// Export the axios instance for direct use if needed
export { apiClient };

// Generic request function (used internally by all API methods)
async function request<T>(path: string, options: any = {}): Promise<T> {
  const response = await apiClient.request<T>({
    url: path,
    ...options,
  });
  return response.data;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "employee";
  date_of_joining: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/auth/login", {
      method: "POST",
      data: { email, password },
    });
    setToken(res.token);
    return res;
  },

  async register(full_name: string, email: string, password: string, role: "employee" | "admin" = "employee"): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/auth/register", {
      method: "POST",
      data: { full_name, email, password, role: role || "employee" },
    });
    setToken(res.token);
    return res;
  },

  async googleLogin(token: string): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/auth/google", {
      method: "POST",
      data: { token },
    });
    setToken(res.token);
    return res;
  },

  async me(): Promise<AuthUser | null> {
    const token = getToken();
    if (!token) return null;
    try {
      return await request<AuthUser>("/auth/me");
    } catch {
      clearToken();
      return null as AuthUser | null;
    }
  },

  logout() {
    clearToken();
  },

  getToken,
  setToken,
  clearToken,
};

// Leave balance
export const leaveBalanceApi = {
  async getMy() {
    return request<{ total_balance: number; used_balance: number }>("/leave-balance/my");
  },
};

// Leaves
export interface Leave {
  id: string;
  user_id: string;
  leave_type: "casual" | "sick" | "paid";
  start_date: string;
  end_date: string;
  total_days: number;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
  applied_date: string;
  created_at: string;
}

export const leavesApi = {
  async getMy() {
    return request<Leave[]>("/leaves/my");
  },

  async create(data: { leave_type: string; start_date: string; end_date: string; reason?: string }) {
    return request<Leave>("/leaves", {
      method: "POST",
      data,
    });
  },

  async update(id: string, data: Partial<{ leave_type: string; start_date: string; end_date: string; reason: string }>) {
    return request<Leave>(`/leaves/${id}`, {
      method: "PUT",
      data,
    });
  },

  async delete(id: string) {
    return request<{ message: string }>(`/leaves/${id}`, { method: "DELETE" });
  },

  async adminGetAll() {
    return request<(Leave & { profiles: { full_name: string; email: string } })[]>("/leaves/admin/all");
  },

  async adminUpdateStatus(id: string, status: "approved" | "rejected") {
    return request<Leave>(`/leaves/admin/${id}`, {
      method: "PATCH",
      data: { status },
    });
  },
};

// Attendance
export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  status: "present" | "absent";
  reason?: string | null;
  created_at: string;
}

export const attendanceApi = {
  async getMy(limit = 30) {
    return request<Attendance[]>(`/attendance/my?limit=${limit}`);
  },

  async getMyToday() {
    return request<Attendance | null>("/attendance/my/today");
  },

  async mark(date: string, status: "present" | "absent") {
    return request<Attendance>("/attendance", {
      method: "POST",
      data: { date, status },
    });
  },

  async adminGetAll(filters?: { date?: string; name?: string }) {
    const params = new URLSearchParams();
    if (filters?.date) params.set("date", filters.date);
    if (filters?.name) params.set("name", filters.name);
    const q = params.toString();
    return request<(Attendance & { profiles: { full_name: string; email: string } })[]>(
      `/attendance/admin/all${q ? `?${q}` : ""}`
    );
  },

  async adminUpdate(id: string, status: "present" | "absent", reason?: string) {
    return request<Attendance & { profiles: { full_name: string; email: string } }>(
      `/attendance/update/${id}`,
      {
        method: "PATCH",
        data: { status, reason },
      }
    );
  },
};

// Users (admin)
export const usersApi = {
  async adminGetAll() {
    return request<unknown[]>("/users/admin/all");
  },
};

// Stats (admin)
export const statsApi = {
  async adminGet() {
    return request<{ totalEmployees: number; pendingLeaves: number; todayAttendance: number }>("/stats/admin");
  },
};
