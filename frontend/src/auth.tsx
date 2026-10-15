import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "./api";
import { api, getStoredUser, setStoredToken, setStoredUser } from "./api";
import { supabase } from "./lib/supabase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      const data = await api.me();
      if (data?.user) {
        setUser(data.user);
        setStoredUser(data.user);
      }
    } catch {
      // If token expired or invalid
      setStoredUser(null);
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial verification
    void refresh();

    // Listen for Supabase auth state changes (e.g. Google OAuth redirect)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        try {
          const res = await api.syncOAuth({
            id: session.user.id,
            email: session.user.email,
          });
          if (res?.user) {
            setUser(res.user);
            setStoredUser(res.user);
          }
        } catch (err) {
          console.warn("OAuth sync error:", err);
          // Fast-track user state from Supabase session
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email,
            role: "STUDENT",
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
          setStoredUser(fallbackUser);
        }
        await refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (_) {}
        try {
          await api.logout();
        } catch (_) {}
        setStoredToken(null);
        setStoredUser(null);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
