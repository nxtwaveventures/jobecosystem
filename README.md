# AI/ML Freelance Placement Platform

A full-stack platform connecting AI/ML freelancers with clients through web dashboards and Telegram bot integration. Built with Next.js 14, Google Sheets API, and simple authentication - 100% free to deploy and run.

## 🚀 Features

- **Web Dashboards**: Separate interfaces for freelancers and clients
- **Simple Authentication**: Easy signup/login without complex auth systems
- **Job Management**: Post, browse, and apply to AI/ML projects
- **Google Sheets Backend**: Visual data management with spreadsheets
- **Telegram Integration**: Real-time notifications via Telegram bots (optional)
- **Free Deployment**: Completely free - no database costs

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Google Sheets API + localStorage (demo mode)
- **Integration**: Telegram Bot API (optional)
- **Hosting**: Vercel (frontend) + Google Sheets (free backend)

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd aiml-freelance-platform
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.io](https://supabase.io) and create a new project
2. Copy your project URL and anon key
3. In the SQL Editor, run the following queries to create the database schema:

```sql
-- Create freelancers table
CREATE TABLE freelancers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_id TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
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

-- Create applications table
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES freelancers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, freelancer_id)
);

-- Enable Row Level Security
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to read/write their own data)
CREATE POLICY "Allow authenticated users to manage freelancers" ON freelancers
    FOR ALL USING (auth.uid()::text = email OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage clients" ON clients
    FOR ALL USING (auth.uid()::text = email OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read jobs" ON jobs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow clients to manage their jobs" ON jobs
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE email = auth.uid()::text));

CREATE POLICY "Allow authenticated users to manage applications" ON applications
    FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Set Up Telegram Bots

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create two bots:
   - `/newbot` → Name: "AI/ML Freelancer Bot" → Username: "your_freelancer_bot"
   - `/newbot` → Name: "AI/ML Client Bot" → Username: "your_client_bot"
3. Save the bot tokens provided by BotFather

### 4. Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot Tokens
FREELANCER_BOT_TOKEN=your_freelancer_bot_token
CLIENT_BOT_TOKEN=your_client_bot_token

NODE_ENV=development
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your platform!

## 🤖 Telegram Bot Commands

### Freelancer Bot (@your_freelancer_bot)
- `/start` - Welcome message and command list
- `/register` - Register as a freelancer
- `/jobs` - View available jobs
- `/apply_<job_id>` - Apply to a specific job
- `/profile` - View your profile

### Client Bot (@your_client_bot)
- `/start` - Welcome message and command list
- `/register` - Register as a client
- `/post_project` - Post a new project (follow the format)
- `/my_jobs` - View your posted jobs
- `/view_<job_id>` - View applications for a job
- `/accept_<app_id>` - Accept an application

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Set Up Telegram Webhooks (Production)

After deploying to Vercel, set up webhooks for your bots:

```bash
# Set webhook for freelancer bot
curl -F "url=https://your-app.vercel.app/api/bot/freelancer" \
     https://api.telegram.org/bot<FREELANCER_BOT_TOKEN>/setWebhook

# Set webhook for client bot
curl -F "url=https://your-app.vercel.app/api/bot/client" \
     https://api.telegram.org/bot<CLIENT_BOT_TOKEN>/setWebhook
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── auth/login/page.tsx      # Authentication
│   ├── dashboard/
│   │   ├── freelancer/page.tsx  # Freelancer dashboard
│   │   └── client/page.tsx      # Client dashboard
│   └── api/
│       ├── jobs/route.ts        # Jobs API
│       ├── apply/route.ts       # Applications API
│       └── notify/route.ts      # Notifications API
├── bots/
│   ├── freelancerBot.ts         # Freelancer Telegram bot
│   └── clientBot.ts             # Client Telegram bot
├── lib/
│   └── supabaseClient.ts        # Supabase configuration
└── components/                  # Reusable UI components
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Authenticated routes with Supabase Auth
- Environment variables for sensitive data
- CORS protection for API routes

## 🧪 Testing

```bash
# Run type checking
npm run lint

# Build for production
npm run build
```

## 📈 Scaling

This platform is designed to start free and scale:

- **Supabase**: 50,000 monthly active users free
- **Vercel**: 100GB bandwidth free
- **Telegram**: Unlimited bot messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 🆘 Support

- Create an issue for bugs
- Join our [Telegram channel](https://t.me/your_support_channel) for support
- Email: support@your-domain.com

---

**Built with ❤️ for the AI/ML community**