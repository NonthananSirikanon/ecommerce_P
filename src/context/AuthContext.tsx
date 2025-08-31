/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { AuthService } from '../utils/authService';
import { authEvents } from '../utils/events';

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
    const initializeAuth = () => {
      try {
        const storedUser = AuthService.getStoredUser();
        const token = AuthService.getToken();
        
        if (storedUser && token) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: storedUser });
        } else {
          AuthService.clearTokens();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        AuthService.clearTokens();
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await AuthService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      authEvents.emit('auth:login', response.user);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const adminLogin = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await AuthService.adminLogin(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      authEvents.emit('auth:login', response.user);
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
      
      const response = await AuthService.register(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      authEvents.emit('auth:login', response.user);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      authEvents.emit('auth:logout');
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    adminLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

