/**
 * Google Sheets API Client
 * Simple backend using Google Sheets for data storage
 */

const GOOGLE_SHEETS_API_KEY = 'AIzaSyDlPW0qv_k7ynZPheCD_1hrCHFowXhIv2I';

// Google Sheets IDs for data storage
const SHEET_IDS = {
  USERS: '1-B-N17JWI3B8-FP6IgV42QG9yBn5TEXFu8Oi9LGgfdM',
  JOBS: '1RMrqEzcAheZVmfIc-dHA5AWZ9xpTJUSosLuO5sJOoRs', 
  APPLICATIONS: '1bYRgVqnqpzs8W7r734txexhqE4F43DnTseZtcy3L9Zw'
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'freelancer' | 'client';
  company?: string;
  skills?: string[];
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  status: 'applied' | 'accepted' | 'rejected';
  createdAt: string;
}

class GoogleSheetsClient {
  private apiKey: string;
  
  constructor() {
    this.apiKey = GOOGLE_SHEETS_API_KEY;
  }

  /**
   * Get data from a specific sheet
   */
  async getSheetData(sheetId: string, range: string = 'A:Z'): Promise<any[][]> {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return [];
    }
  }

  /**
   * Simulate appending data to a sheet (for demo purposes)
   * In production, this would require OAuth authentication
   */
  async appendToSheet(sheetId: string, values: any[][], range: string = 'A:Z'): Promise<boolean> {
    try {
      console.log('Simulating append to sheet:', sheetId, values);
      // For now, we'll simulate success
      // In production, you'd need OAuth or service account authentication
      return true;
    } catch (error) {
      console.error('Error appending to sheet:', error);
      return false;
    }
  }

  /**
   * Convert sheet rows to User objects
   */
  private parseUsers(rows: any[][]): User[] {
    if (rows.length <= 1) return []; // No data or just headers
    
    const [headers, ...dataRows] = rows;
    return dataRows.map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      role: row[3] as 'freelancer' | 'client' || 'freelancer',
      company: row[4] || '',
      skills: row[5] ? row[5].split(',') : [],
      createdAt: row[6] || new Date().toISOString()
    }));
  }

  /**
   * Convert sheet rows to Job objects
   */
  private parseJobs(rows: any[][]): Job[] {
    if (rows.length <= 1) return [];
    
    const [headers, ...dataRows] = rows;
    return dataRows.map(row => ({
      id: row[0] || '',
      clientId: row[1] || '',
      title: row[2] || '',
      description: row[3] || '',
      skills: row[4] ? row[4].split(',') : [],
      budget: parseFloat(row[5]) || 0,
      status: row[6] as 'open' | 'closed' || 'open',
      createdAt: row[7] || new Date().toISOString()
    }));
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    const rows = await this.getSheetData(SHEET_IDS.USERS);
    return this.parseUsers(rows);
  }

  /**
   * Add a new user (demo mode - stores in localStorage)
   */
  async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    const newUser: User = {
      id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      skills: user.skills || [],
      createdAt
    };

    // Store in localStorage for demo
    const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(existingUsers));
    
    console.log('User added to demo storage:', newUser);
    
    // Also try to append to sheet (will succeed in simulation)
    const row = [id, user.name, user.email, user.role, user.company || '', user.skills?.join(',') || '', createdAt];
    await this.appendToSheet(SHEET_IDS.USERS, [row]);
    
    return id;
  }

  /**
   * Find user by email (checks both localStorage demo data and sheets)
   */
  async findUserByEmail(email: string): Promise<User | null> {
    // First check localStorage demo data
    const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]') as User[];
    const demoUser = demoUsers.find(user => user.email === email);
    if (demoUser) {
      return demoUser;
    }
    
    // Then check sheets (if any data exists there)
    const users = await this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Get all jobs
   */
  async getJobs(): Promise<Job[]> {
    const rows = await this.getSheetData(SHEET_IDS.JOBS);
    return this.parseJobs(rows);
  }

  /**
   * Add a new job (demo mode - stores in localStorage)
   */
  async addJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<string> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    const newJob: Job = {
      id,
      clientId: job.clientId,
      title: job.title,
      description: job.description,
      skills: job.skills,
      budget: job.budget,
      status: job.status,
      createdAt
    };

    // Store in localStorage for demo
    const existingJobs = JSON.parse(localStorage.getItem('demo_jobs') || '[]');
    existingJobs.push(newJob);
    localStorage.setItem('demo_jobs', JSON.stringify(existingJobs));
    
    console.log('Job added to demo storage:', newJob);
    
    // Also try to append to sheet (will succeed in simulation)
    const row = [id, job.clientId, job.title, job.description, job.skills.join(','), job.budget.toString(), job.status, createdAt];
    await this.appendToSheet(SHEET_IDS.JOBS, [row]);
    
    return id;
  }

  /**
   * Get jobs by client (checks both localStorage demo data and sheets)
   */
  async getJobsByClient(clientId: string): Promise<Job[]> {
    // First check localStorage demo data
    const demoJobs = JSON.parse(localStorage.getItem('demo_jobs') || '[]') as Job[];
    const clientDemoJobs = demoJobs.filter(job => job.clientId === clientId);
    
    // Then check sheets (if any data exists there)
    const sheetJobs = await this.getJobs();
    const clientSheetJobs = sheetJobs.filter(job => job.clientId === clientId);
    
    // Combine both sources
    return [...clientDemoJobs, ...clientSheetJobs];
  }
}

export const sheetsClient = new GoogleSheetsClient();