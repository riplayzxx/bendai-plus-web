# BendAI Plus - Web Version

Web version of BendAI Plus for Vercel deployment.

## Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Install dependencies:**
   ```bash
   cd web-version
   npm install
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

## Development

Run locally with Vercel dev server:
```bash
npm run dev
```

## Environment Variables

No server-side environment variables needed - API keys are entered by users in the web interface.

## Files

- `index.html` - Main web app
- `api/openai.js` - OpenAI API endpoint
- `api/claude.js` - Claude API endpoint  
- `api/gemini.js` - Gemini API endpoint
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies and scripts