import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@ReservaRestaurante:user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  async function signIn(email: string, password: string) {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    const { token, user: userData } = response.data;

    localStorage.setItem("@ReservaRestaurante:token", token);
    localStorage.setItem("@ReservaRestaurante:user", JSON.stringify(userData));

    setUser(userData);
  }

  function signOut() {
    localStorage.removeItem("@ReservaRestaurante:token");
    localStorage.removeItem("@ReservaRestaurante:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
