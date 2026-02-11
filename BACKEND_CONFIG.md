# Backend Configuration

## Environment Setup

The frontend connects to the backend using environment variables:

### Development Mode
- Uses Vite proxy configuration
- API calls go to `/api` which is proxied to `https://hr-project-mrhz.onrender.com`
- Configuration in `.env`:
  ```
  VITE_API_BASE_URL=/api
  ```

### Production Mode
- Direct connection to deployed backend
- Configuration in `.env.production`:
  ```
  VITE_API_BASE_URL=https://hr-project-mrhz.onrender.com/api
  ```

## How It Works

1. **Development**: Run `npm run dev` - the Vite dev server proxies `/api` requests to your deployed backend
2. **Production**: Run `npm run build` - the built app directly calls `https://hr-project-mrhz.onrender.com/api`

## Backend URL
Your backend is deployed at: **https://hr-project-mrhz.onrender.com**

## Testing the Connection

To verify the backend connection is working:

1. Start the dev server: `npm run dev`
2. Open the browser console
3. Try logging in or registering
4. Check the Network tab to see API requests

## Updating the Backend URL

If you deploy your backend to a different URL:

1. Update `.env.production` with the new URL
2. Update the proxy target in `vite.config.ts` (line 16)
3. Rebuild your frontend: `npm run build`
