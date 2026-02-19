# Deployment & API Configuration Guide

This project is optimized for security and performance. To ensure the Gemini AI features work correctly on both local development and production (Vercel), follow these steps:

## 1. Local Development Setup

1.  **Install Dependencies**:
    `npm install`
2.  **Environment Variables**:
    Create a file named `.env.local` in the root directory and add your Gemini API Key:
    `GEMINI_API_KEY=your_actual_api_key_here`
3.  **Run the App**:
    - For basic UI development: `npm run dev`
    - For full API testing, use Vercel CLI: `vercel dev`

## 2. Vercel Deployment (Recommended)

When you deploy to Vercel, the backend API in `/api/generate.ts` will automatically become active.

1.  **Go to your Vercel Project Settings**.
2.  Navigate to **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `GEMINI_API_KEY`
    *   **Value**: `your_actual_api_key_here`
4.  **Redeploy** your project for the changes to take effect.

## 3. GitHub Secrets (For CI/CD)

If you use GitHub Actions for deployment:
1.  Go to your Repository **Settings** > **Secrets and variables** > **Actions**.
2.  Add a **New repository secret** named `GEMINI_API_KEY`.

## Security Note
The API Key is **never** bundled with the frontend code. All AI requests are proxied through the `/api/generate` serverless function, keeping your credentials safe.
