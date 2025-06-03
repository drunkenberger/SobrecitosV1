# Supabase Setup Guide for Sobrecitos

This guide will help you set up Supabase for the Sobrecitos application, enabling cloud storage functionality.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Access to the Sobrecitos codebase

## Step 1: Create a Supabase Project

1. Log in to your Supabase account
2. Create a new project by clicking "New Project"
3. Enter a name for your project (e.g., "Sobrecitos")
4. Set up a password for the database
5. Choose a region closest to your users
6. Click "Create New Project"

## Step 2: Get Project Credentials

1. Once your project is created, go to the project dashboard
2. Click on "Settings" in the sidebar
3. Select "API" from the settings menu
4. You'll find the following credentials:
   - Project URL (starts with `https://`)
   - `anon` public key
   - `service_role` key (keep this secret!)
   - Project Reference ID (in the URL: `https://app.supabase.com/project/{project-id}/settings/api`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following environment variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_API_KEY=your-service-role-key
```

3. Replace the placeholder values with your actual credentials from Step 2

## Step 4: Check Configuration

1. Install the dotenv package if you don't have it:
   ```
   npm install dotenv
   ```

2. Run the configuration check script:
   ```
   node check-supabase-config.js
   ```

3. Fix any issues reported by the script

## Step 5: Apply Database Migrations

1. Run one of the migration scripts:
   ```
   # For Bash/Shell
   ./deploy-migrations.sh
   
   # For Node.js
   node deploy-migrations.js
   ```

2. The script will prompt for your project ID and service role key if not in the environment variables
3. The script will apply all SQL migrations from the `migrations` directory

## Step 6: Generate TypeScript Types

After applying migrations, generate TypeScript types based on your database schema:

```
npm run types:supabase
```

Or manually:

```
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

## Step 7: Test the Connection

1. Start the Sobrecitos application:
   ```
   npm run dev
   ```

2. Create an account or log in
3. Go to the settings and check the storage options
4. Enable cloud storage and sync your data

## Troubleshooting

### Can't connect to Supabase

- Verify your environment variables are correct
- Check if your project is fully initialized (takes a few minutes after creation)
- Verify that your IP is not blocked by Supabase

### Migration errors

- Check the SQL files for syntax errors
- Make sure your service role key has the necessary permissions
- Check if tables already exist in your database

### Authentication issues

- Make sure Email auth provider is enabled in Supabase Auth settings
- Check if email confirmation is required (you may need to disable this for testing)

## Next Steps

Once you have successfully set up Supabase:

1. Set up storage bucket for receipt uploads
2. Configure authentication providers
3. Test the app with multiple devices
4. Monitor usage in the Supabase dashboard 