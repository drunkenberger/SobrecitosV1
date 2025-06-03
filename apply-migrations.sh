#!/bin/bash

# Set your Supabase credentials here
SUPABASE_PROJECT_ID="iyrhkdrblbaiyiftgrhv"
# You'll need to add your service role key below

# Apply migrations using the curl API directly
echo "Applying migrations to Supabase project $SUPABASE_PROJECT_ID..."

for migration_file in migrations/*.sql; do
  echo "Applying migration: $migration_file"
  
  # Read the SQL file and escape it for JSON
  migration_sql=$(cat "$migration_file" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n')
  
  # Execute SQL against the database
  response=$(curl -s -X POST \
    -H "apikey: $SUPABASE_API_KEY" \
    -H "Authorization: Bearer $SUPABASE_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$migration_sql\"}" \
    "https://api.supabase.com/database-sql?db=postgresql")
  
  # Check for errors
  if [[ "$response" == *"error"* ]]; then
    echo "Error applying migration: $migration_file"
    echo "$response"
    exit 1
  fi
  
  echo "Migration applied successfully: $migration_file"
done

echo "All migrations applied successfully!"

# Generate TypeScript types
echo "Generating TypeScript types..."
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts

echo "Deployment complete!" 