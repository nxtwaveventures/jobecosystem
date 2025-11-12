/**
 * Simple Authentication System using Google Sheets
 * No complex auth - just stores user data in sheets
 */

import { sheetsClient, User } from './googleSheetsClient';

export type UserRole = 'freelancer' | 'client';

export type AuthResult = {
  success: boolean;
  error?: string;
  userId?: string;
  role?: UserRole;
  user?: User;
}

// Simple in-memory session storage for demo
let currentUser: User | null = null;

/**
 * Sign up a new user (stores in Google Sheets)
 */
export async function signUpWithEmail(
  email: string,
  password: string, // We'll ignore password for now in this simple version
  role: UserRole,
  name: string,
  company?: string
): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await sheetsClient.findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const userId = await sheetsClient.addUser({
      name,
      email,
      role,
      company,
      skills: []
    });

    if (!userId) {
      return { success: false, error: 'Failed to create user account' };
    }

    // Get the created user
    const user = await sheetsClient.findUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User created but could not be retrieved' };
    }

    // Set as current user (simple session)
    currentUser = user;

    return {
      success: true,
      userId,
      role,
      user
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

/**
 * Sign in an existing user
 */
export async function signInWithEmail(
  email: string,
  password: string // We'll ignore password for now
): Promise<AuthResult> {
  try {
    const user = await sheetsClient.findUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Set as current user (simple session)
    currentUser = user;

    return {
      success: true,
      userId: user.id,
      role: user.role,
      user
    };
  } catch (error) {
    console.error('Signin error:', error);
    return { success: false, error: 'Failed to sign in' };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  return currentUser;
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
  currentUser = null;
  return { success: true };
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  return currentUser?.role || null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
}