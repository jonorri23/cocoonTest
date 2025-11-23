# GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named "cocoon" (or your preferred name)
3. **Do NOT** initialize with README, .gitignore, or license (we already have a repo locally)
4. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, run these commands in your terminal:

```bash
cd /Users/jonorri/Desktop/doyourbest
git remote add origin https://github.com/YOUR_USERNAME/cocoon.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. **Build Settings** (should be auto-detected):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

Your site will be live at: `https://your-project-name.vercel.app`

## Future Updates

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically redeploy on every push to main!
