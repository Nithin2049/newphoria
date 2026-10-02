import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  AuthError,
} from 'firebase/auth';
import { auth, initError } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  isFirebaseReady: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
  isFirebaseReady: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  clearAuthError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || initError) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatAuthErrorMessage = (error: AuthError | any): string => {
    const code = error?.code;
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not enabled in your Firebase Console. Enable it under Authentication > Sign-in method.';
      case 'auth/configuration-not-found':
        return 'Firebase Authentication has not been initialized in the Firebase Console yet. Please visit the Firebase Console (Authentication > Get Started) and enable Email/Password provider.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Access temporarily blocked due to too many attempts. Please try again later.';
      default:
        return error?.message || 'Authentication failed. Please try again.';
    }
  };

  const signIn = async (email: string, pass: string) => {
    setAuthError(null);
    if (!auth) throw new Error('Firebase Auth is not initialized');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      const msg = formatAuthErrorMessage(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    if (!auth) throw new Error('Firebase Auth is not initialized');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim() && userCred.user) {
        await updateProfile(userCred.user, { displayName: name.trim() });
        // Force refresh user state with display name
        setUser({ ...userCred.user, displayName: name.trim() });
      }
    } catch (err: any) {
      const msg = formatAuthErrorMessage(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isFirebaseReady: !initError && !!auth,
        signIn,
        signUp,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
