import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  createUserFromSignUp: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
  signInUser: (email: string, password: string) => { success: boolean; error?: string };
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper to get all registered users from localStorage
const getRegisteredUsers = (): Array<User & { storedPassword: string }> => {
  const users = localStorage.getItem('mia_registered_users');
  if (users) {
    try {
      return JSON.parse(users);
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Helper to save registered users to localStorage
const saveRegisteredUsers = (users: Array<User & { storedPassword: string }>) => {
  localStorage.setItem('mia_registered_users', JSON.stringify(users));
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a currently logged-in user in localStorage
    const savedUser = localStorage.getItem('mia_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('mia_current_user');
      }
    }

    // No saved user, check if any registered users exist
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.length === 0) {
      // No users registered yet, fall back to API mock user for demo
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/user");
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('mia_current_user', JSON.stringify(updatedUser));
    }
  };

  const createUserFromSignUp = (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: data.email,
      password: '', // Don't expose password in User object
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      profilePicture: null,
    };
    
    // Save to registered users list (with password for sign-in validation)
    const registeredUsers = getRegisteredUsers();
    const userWithPassword = { ...newUser, storedPassword: data.password };
    registeredUsers.push(userWithPassword);
    saveRegisteredUsers(registeredUsers);
    
    // Set as current user
    setUser(newUser);
    localStorage.setItem('mia_current_user', JSON.stringify(newUser));
  };

  const signInUser = (email: string, password: string): { success: boolean; error?: string } => {
    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find(u => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: "No account found with this email. Please sign up first." };
    }
    
    if (foundUser.storedPassword !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    
    // Sign in successful - set current user (without password)
    const { storedPassword, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('mia_current_user', JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserProfile, createUserFromSignUp, signInUser, isLoading }}>
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
