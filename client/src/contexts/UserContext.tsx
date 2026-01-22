import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, type User as APIUser, type RegisterData, type LoginData } from "../services/auth.api";

// Map API User to our internal User type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  profilePicture?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const apiUser = await authAPI.getMe();
          const mappedUser: User = {
            id: apiUser.id,
            email: apiUser.email,
            firstName: apiUser.firstName,
            lastName: apiUser.lastName,
            name: `${apiUser.firstName} ${apiUser.lastName}`,
          };
          setUser(mappedUser);
        } catch (error) {
          console.error("Failed to load user:", error);
          authAPI.removeToken();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await authAPI.register(data);
      authAPI.saveToken(response.accessToken);

      const mappedUser: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        name: `${response.user.firstName} ${response.user.lastName}`,
      };

      setUser(mappedUser);

      // Dispatch custom event to trigger subscription refresh
      window.dispatchEvent(new Event('user-logged-in'));
    } catch (error) {
      throw error;
    }
  };

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await authAPI.login(data);
      authAPI.saveToken(response.accessToken);

      const mappedUser: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        name: `${response.user.firstName} ${response.user.lastName}`,
      };

      setUser(mappedUser);

      // Dispatch custom event to trigger subscription refresh
      window.dispatchEvent(new Event('user-logged-in'));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.removeToken();
    setUser(null);
  };

  const loginWithGoogle = () => {
    authAPI.loginWithGoogle();
  };

  const loginWithFacebook = () => {
    authAPI.loginWithFacebook();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
