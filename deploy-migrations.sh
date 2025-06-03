#!/bin/bash

# Supabase Migration Deployment Script
# This script applies SQL migrations to a Supabase project

# Get Supabase project ID and API key from environment or user input
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Enter your Supabase Project ID:"
  read SUPABASE_PROJECT_ID
fi

if [ -z "$SUPABASE_API_KEY" ]; then
  echo "Enter your Supabase service_role key (not anon key):"
  read SUPABASE_API_KEY
fi

# Validate inputs
if [ -z "$SUPABASE_PROJECT_ID" ] || [ -z "$SUPABASE_API_KEY" ]; then
  echo "Error: Project ID and API key are required"
  exit 1
fi

# Set Supabase API URL
SUPABASE_URL="https://api.supabase.com"
SUPABASE_REST_URL="https://$SUPABASE_PROJECT_ID.supabase.co/rest/v1"

# Check if npx is available
if ! command -v npx &> /dev/null; then
  echo "Error: npx is required but not found"
  exit 1
fi

# Apply migrations using Supabase SQL API
echo "Applying migrations to Supabase project $SUPABASE_PROJECT_ID..."

for migration_file in migrations/*.sql; do
  echo "Applying migration: $migration_file"
  
  # Read the SQL file
  migration_sql=$(cat "$migration_file")
  
  # Create a temporary JSON file for the request
  temp_file=$(mktemp)
  cat > "$temp_file" << EOF
{
  "query": "$migration_sql"
}
EOF
  
  # Execute SQL against the database
  response=$(curl -s -X POST \
    -H "apikey: $SUPABASE_API_KEY" \
    -H "Authorization: Bearer $SUPABASE_API_KEY" \
    -H "Content-Type: application/json" \
    -d @"$temp_file" \
    "$SUPABASE_URL/database-sql?db=postgresql")
  
  # Clean up
  rm "$temp_file"
  
  # Check for errors
  if [[ "$response" == *"error"* ]]; then
    echo "Error applying migration: $migration_file"
    echo "$response"
    exit 1
  fi
done

echo "All migrations applied successfully!"

# Generate TypeScript types
echo "Generating TypeScript types..."
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts

echo "Deployment complete!" 