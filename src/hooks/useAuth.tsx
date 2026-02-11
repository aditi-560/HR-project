import { useState, useEffect, createContext, useContext } from "react";
import { authApi, type AuthUser } from "@/lib/api";

interface AuthContext {
  user: { id: string; email: string; user_metadata?: { full_name?: string } } | null;
  role: "admin" | "employee" | null;
  profile: { full_name: string; email: string; date_of_joining: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleSignIn: (token: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, password: string, role?: "employee" | "admin") => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  role: null,
  profile: null,
  loading: true,
  signIn: async () => ({ success: false }),
  googleSignIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }) as unknown as Promise<{ success: boolean; error?: string }>,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContext["user"]>(null);
  const [role, setRole] = useState<"admin" | "employee" | null>(null);
  const [profile, setProfile] = useState<AuthContext["profile"]>(null);
  const [loading, setLoading] = useState(true);

  const setUserFromAuth = (u: AuthUser | null) => {
    if (!u) {
      setUser(null);
      setRole(null);
      setProfile(null);
      return;
    }
    setUser({ id: u.id, email: u.email, user_metadata: { full_name: u.full_name } });
    setRole(u.role);
    setProfile({
      full_name: u.full_name,
      email: u.email,
      date_of_joining: typeof u.date_of_joining === "string" ? u.date_of_joining : new Date(u.date_of_joining).toISOString().split("T")[0],
    });
  };

  useEffect(() => {
    authApi.me()
      .then((u) => setUserFromAuth(u))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      setUserFromAuth(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const googleSignIn = async (token: string) => {
    try {
      const res = await authApi.googleLogin(token);
      setUserFromAuth(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const signUp = async (fullName: string, email: string, password: string, role: "employee" | "admin" = "employee") => {
    try {
      const res = await authApi.register(fullName, email, password, role);
      setUserFromAuth(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const signOut = async () => {
    authApi.logout();
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, signIn, googleSignIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
