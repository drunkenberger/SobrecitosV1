# Fix Registration Issue - Supabase Database Error

## Problem Identified
The registration is failing with "Database error saving new user" because the Supabase database is missing the required trigger/function to create a profile entry when a new user registers.

## Solution
Run the SQL script `fix-supabase-auth.sql` in your Supabase SQL Editor to fix the issue.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/iyrhkdrblbaiyiftgrhv
   - Sign in with your Supabase account

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Fix Script**
   - Copy the entire contents of `fix-supabase-auth.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

4. **Verify the Fix**
   - After running the script, try registering a new user in your app
   - The registration should now work properly

## What the Script Does:

1. **Creates the profiles table** (if it doesn't exist)
   - Stores user profile information like name, avatar, and premium status

2. **Sets up Row Level Security (RLS)**
   - Ensures users can only access their own profile data

3. **Creates a trigger function**
   - Automatically creates a profile entry when a new user registers
   - This was the missing piece causing the registration error

4. **Creates user_settings table**
   - Stores user preferences for storage type and sync settings

5. **Grants necessary permissions**
   - Ensures the tables are accessible to authenticated and anonymous users

## Alternative: Email Confirmation

If you want to disable email confirmation for testing (not recommended for production):

1. Go to Supabase Dashboard > Authentication > Settings
2. Under "Email Auth" section, toggle OFF "Enable email confirmations"
3. Save the changes

## Testing After Fix

After applying the fix, test registration with:
- Email: test@example.com
- Password: Test123!
- Name: Test User

The user should be created successfully and automatically logged in.