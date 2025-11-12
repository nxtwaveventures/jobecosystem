# Quick GitHub Actions Setup

## Method 1: Automatic Setup (Recommended)
Your repository already has the workflow file. Just:

1. **Push commits to GitHub**:
   ```bash
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to: https://github.com/nxtwaveventures/hirefast/settings/pages
   - Set **Source** to: **GitHub Actions**
   - Save

## Method 2: Manual Workflow Creation
If you need to create the workflow manually at https://github.com/nxtwaveventures/hirefast/actions/new:

**Workflow Name:** `Deploy to GitHub Pages`

**Copy this YAML:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Next.js app
        run: npm run build
        env:
          NODE_ENV: production
          GITHUB_PAGES: true
          
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
          
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Your Live Site:
🌐 **https://nxtwaveventures.github.io/hirefast**

## Status:
✅ Build configuration fixed  
✅ Static export working  
✅ API routes disabled for GitHub Pages  
✅ Development mode still has full functionality  
✅ Ready for deployment!