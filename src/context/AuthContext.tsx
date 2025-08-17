/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('รหัสผ่านไม่ตรงกัน');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

