/**
 * Core type definitions for the AI/ML Freelance Platform
 * 
 * This file contains all shared TypeScript interfaces and types
 * used throughout the application.
 */

/**
 * Database table row types - exact matches to Supabase schema
 */

/** Freelancer profile information */
export interface Freelancer {
  id: string;
  name: string;
  email: string;
  telegram_id: string | null;
  skills: string[];
  created_at: string;
}

/** Client/company information */
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  telegram_id: string | null;
  created_at: string;
}

/** Job posting information */
export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  skills_required: string[];
  budget: number;
  status: 'open' | 'closed' | 'in-progress';
  created_at: string;
  applications?: JobApplication[];
  client?: {
    name: string;
    company: string;
  };
}

/** Job application information */
export interface JobApplication {
  id: string;
  job_id: string;
  freelancer_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  freelancer?: {
    id: string;
    name: string;
    skills: string[];
  };
  job?: {
    title: string;
    budget: number;
    client?: {
      company: string;
    };
  };
}

/** Extended job application with full details */
export interface JobApplicationWithDetails extends JobApplication {
  job: Job;
  freelancer: {
    id: string;
    name: string;
    skills: string[];
    telegram_id?: string;
  }
}

/** Job posting information */
export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  skills_required: string[];
  budget: number;
  status: 'open' | 'closed' | 'in-progress';
  created_at: string;
}

/** Job application information */
export interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  status: 'applied' | 'accepted' | 'rejected';
  created_at: string;
}

/**
 * Extended types with relations (for API responses)
 */

/** Job with client information populated */
export interface JobWithClient extends Job {
  clients: Pick<Client, 'name' | 'company'>;
}

/** Application with freelancer information populated */
export interface ApplicationWithFreelancer extends Application {
  freelancers: Pick<Freelancer, 'name' | 'email' | 'skills'>;
}

/** Application with both job and freelancer information */
export interface ApplicationWithDetails extends Application {
  jobs: Pick<Job, 'title' | 'budget'>;
  freelancers: Pick<Freelancer, 'name' | 'email' | 'skills'>;
}

/**
 * Form and UI types
 */

/** User authentication form data */
export interface AuthFormData {
  email: string;
  password: string;
  role?: 'freelancer' | 'client';
}

/** Job creation form data */
export interface JobFormData {
  title: string;
  description: string;
  skills_required: string;
  budget: string;
}

/** Freelancer profile form data */
export interface FreelancerFormData {
  name: string;
  skills: string[];
  telegram_id?: string;
}

/** Client profile form data */
export interface ClientFormData {
  name: string;
  company: string;
  telegram_id?: string;
}

/**
 * API response types
 */

/** Generic API success response */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Authentication response */
export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: any;
}

/**
 * Component prop types
 */

/** Props for job listing components */
export interface JobListProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onSelect?: (job: Job) => void;
  loading?: boolean;
}

/** Props for application listing components */
export interface ApplicationListProps {
  applications: ApplicationWithFreelancer[];
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  loading?: boolean;
}

/** Props for profile display components */
export interface ProfileProps {
  freelancer?: Freelancer;
  client?: Client;
  editable?: boolean;
  onUpdate?: (data: FreelancerFormData | ClientFormData) => void;
}

/**
 * Utility types
 */

/** Database insert types (without auto-generated fields) */
export type FreelancerInsert = Omit<Freelancer, 'id' | 'created_at'>;
export type ClientInsert = Omit<Client, 'id' | 'created_at'>;
export type JobInsert = Omit<Job, 'id' | 'created_at'>;
export type ApplicationInsert = Omit<Application, 'id' | 'created_at'>;

/** Database update types (all fields optional except id) */
export type FreelancerUpdate = Partial<Omit<Freelancer, 'id'>> & { id: string };
export type ClientUpdate = Partial<Omit<Client, 'id'>> & { id: string };
export type JobUpdate = Partial<Omit<Job, 'id'>> & { id: string };
export type ApplicationUpdate = Partial<Omit<Application, 'id'>> & { id: string };

/**
 * Enum-like constants
 */

/** Available job statuses */
export const JOB_STATUS = {
  OPEN: 'open' as const,
  PLACED: 'placed' as const,
  CLOSED: 'closed' as const,
} as const;

/** Available application statuses */
export const APPLICATION_STATUS = {
  APPLIED: 'applied' as const,
  ACCEPTED: 'accepted' as const,
  REJECTED: 'rejected' as const,
} as const;

/** User roles */
export const USER_ROLES = {
  FREELANCER: 'freelancer' as const,
  CLIENT: 'client' as const,
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Supabase Database Schema Type
 * 
 * This type definition matches the database structure in Supabase
 * and provides type safety for database operations.
 */
export type Database = {
  public: {
    Tables: {
      freelancers: {
        Row: Freelancer;
        Insert: FreelancerInsert;
        Update: Partial<FreelancerInsert>;
      };
      clients: {
        Row: Client;
        Insert: ClientInsert;
        Update: Partial<ClientInsert>;
      };
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: Partial<JobInsert>;
      };
      applications: {
        Row: Application;
        Insert: ApplicationInsert;
        Update: Partial<ApplicationInsert>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};