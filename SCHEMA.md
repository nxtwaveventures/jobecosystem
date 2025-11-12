# AI/ML Freelance Platform - Database Schema

This document outlines the complete database schema for the AI/ML freelance placement platform.

## Tables Overview

### 1. freelancers
Stores freelancer profile information.

```sql
CREATE TABLE freelancers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_id TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Freelancer's display name
- `email`: Email address (used for authentication)
- `telegram_id`: Telegram user ID for bot integration
- `skills`: Array of skills (e.g., ['Python', 'Machine Learning'])
- `created_at`: Registration timestamp

### 2. clients
Stores client/company information.

```sql
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Client's name
- `company`: Company name
- `email`: Email address (used for authentication)
- `telegram_id`: Telegram user ID for bot integration
- `created_at`: Registration timestamp

### 3. jobs
Stores job postings from clients.

```sql
CREATE TABLE jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    budget DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `client_id`: Reference to the client who posted the job
- `title`: Job title
- `description`: Detailed job description
- `skills_required`: Array of required skills
- `budget`: Job budget in USD
- `status`: Job status ('open', 'placed', 'closed')
- `created_at`: Job posting timestamp

### 4. applications
Stores job applications from freelancers.

```sql
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES freelancers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, freelancer_id)
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `job_id`: Reference to the job being applied to
- `freelancer_id`: Reference to the applying freelancer
- `status`: Application status ('applied', 'accepted', 'rejected')
- `created_at`: Application timestamp
- **Constraint**: Unique combination of job_id and freelancer_id (prevents duplicate applications)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Freelancers Table
```sql
CREATE POLICY "Allow authenticated users to manage freelancers" ON freelancers
    FOR ALL USING (auth.uid()::text = email OR auth.role() = 'authenticated');
```

### Clients Table
```sql
CREATE POLICY "Allow authenticated users to manage clients" ON clients
    FOR ALL USING (auth.uid()::text = email OR auth.role() = 'authenticated');
```

### Jobs Table
```sql
-- Allow all authenticated users to read jobs
CREATE POLICY "Allow authenticated users to read jobs" ON jobs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow only clients to manage their own jobs
CREATE POLICY "Allow clients to manage their jobs" ON jobs
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE email = auth.uid()::text));
```

### Applications Table
```sql
CREATE POLICY "Allow authenticated users to manage applications" ON applications
    FOR ALL USING (auth.role() = 'authenticated');
```

## Indexes for Performance

```sql
-- Index on email for faster authentication lookups
CREATE INDEX idx_freelancers_email ON freelancers(email);
CREATE INDEX idx_clients_email ON clients(email);

-- Index on telegram_id for bot operations
CREATE INDEX idx_freelancers_telegram_id ON freelancers(telegram_id);
CREATE INDEX idx_clients_telegram_id ON clients(telegram_id);

-- Index on job status for filtering
CREATE INDEX idx_jobs_status ON jobs(status);

-- Index on foreign keys for joins
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_freelancer_id ON applications(freelancer_id);
```

## Sample Data

### Insert Sample Freelancers
```sql
INSERT INTO freelancers (name, email, skills) VALUES
    ('Alice Johnson', 'alice@example.com', ARRAY['Python', 'Machine Learning', 'TensorFlow']),
    ('Bob Smith', 'bob@example.com', ARRAY['Deep Learning', 'PyTorch', 'Computer Vision']),
    ('Carol Davis', 'carol@example.com', ARRAY['NLP', 'Transformers', 'BERT']);
```

### Insert Sample Clients
```sql
INSERT INTO clients (name, company, email) VALUES
    ('John Doe', 'TechCorp Inc.', 'john@techcorp.com'),
    ('Jane Wilson', 'AI Startup Ltd.', 'jane@aistartup.com');
```

### Insert Sample Jobs
```sql
INSERT INTO jobs (client_id, title, description, skills_required, budget) VALUES
    ((SELECT id FROM clients WHERE email = 'john@techcorp.com'),
     'Predictive Analytics Model',
     'Build a machine learning model to predict customer churn',
     ARRAY['Python', 'Machine Learning', 'Scikit-learn'],
     2500.00),
    ((SELECT id FROM clients WHERE email = 'jane@aistartup.com'),
     'Computer Vision System',
     'Develop an image classification system for product recognition',
     ARRAY['Deep Learning', 'Computer Vision', 'TensorFlow'],
     3000.00);
```

## Useful Queries

### Get all open jobs with client information
```sql
SELECT 
    j.id,
    j.title,
    j.description,
    j.skills_required,
    j.budget,
    c.name as client_name,
    c.company
FROM jobs j
JOIN clients c ON j.client_id = c.id
WHERE j.status = 'open'
ORDER BY j.created_at DESC;
```

### Get applications for a specific job
```sql
SELECT 
    a.id,
    a.status,
    a.created_at,
    f.name as freelancer_name,
    f.email as freelancer_email,
    f.skills
FROM applications a
JOIN freelancers f ON a.freelancer_id = f.id
WHERE a.job_id = 'your-job-id'
ORDER BY a.created_at ASC;
```

### Get freelancer's application history
```sql
SELECT 
    j.title,
    j.budget,
    a.status,
    a.created_at,
    c.company
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN clients c ON j.client_id = c.id
WHERE a.freelancer_id = 'your-freelancer-id'
ORDER BY a.created_at DESC;
```