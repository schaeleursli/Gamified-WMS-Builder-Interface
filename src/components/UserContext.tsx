import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  xpLevel: number;
}
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve(false),
  logout: () => {}
});
export const useUser = () => useContext(UserContext);
export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('wms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    return new Promise(resolve => {
      // Simulate network delay
      setTimeout(() => {
        // For demo purposes, accept any non-empty email/password
        if (email && password) {
          // Mock user data
          const userData: User = {
            id: '1',
            name: email.split('@')[0],
            email,
            role: 'Safety Manager',
            xpLevel: 3,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0D8ABC&color=fff`
          };
          setUser(userData);
          localStorage.setItem('wms_user', JSON.stringify(userData));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('wms_user');
  };
  return <UserContext.Provider value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }}>
      {children}
    </UserContext.Provider>;
};