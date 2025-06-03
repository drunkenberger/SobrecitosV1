#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}Checking Supabase configuration...${colors.reset}\n`);

// Check for required environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_PROJECT_ID',
];

let missingVars = [];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log(`${colors.red}Missing required environment variables:${colors.reset}`);
  missingVars.forEach(varName => {
    console.log(`  - ${varName}`);
  });
  console.log(`\nPlease create a .env file with these variables or set them in your environment.`);
  process.exit(1);
}

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we can connect to Supabase
async function checkConnection() {
  try {
    console.log(`${colors.cyan}Testing connection to Supabase...${colors.reset}`);
    const { data, error } = await supabase.from('migrations').select('*').limit(1);
    
    if (error) {
      console.log(`${colors.red}Error connecting to Supabase:${colors.reset}`);
      console.log(`  ${error.message}`);
      console.log(`\nPossible causes:`);
      console.log(`  - Incorrect URL or API key`);
      console.log(`  - 'migrations' table doesn't exist yet (you may need to run migrations)`);
      console.log(`  - Network issues or Supabase service is down`);
      
      return false;
    }
    
    console.log(`${colors.green}Successfully connected to Supabase!${colors.reset}`);
    console.log(`  URL: ${supabaseUrl}`);
    console.log(`  Project ID: ${process.env.SUPABASE_PROJECT_ID}`);
    
    return true;
  } catch (error) {
    console.log(`${colors.red}Error connecting to Supabase:${colors.reset}`);
    console.log(`  ${error.message}`);
    return false;
  }
}

// Check if migration files exist
function checkMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log(`${colors.red}Migrations directory not found:${colors.reset} ${migrationsDir}`);
    return false;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
  
  if (migrationFiles.length === 0) {
    console.log(`${colors.red}No SQL migration files found in:${colors.reset} ${migrationsDir}`);
    return false;
  }
  
  console.log(`${colors.green}Found ${migrationFiles.length} migration files:${colors.reset}`);
  migrationFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  return true;
}

// Main function
async function main() {
  const connectionSuccess = await checkConnection();
  const migrationsExist = checkMigrations();
  
  console.log('\n---------------------------------');
  
  if (connectionSuccess && migrationsExist) {
    console.log(`${colors.green}✓ Your Supabase configuration is valid!${colors.reset}`);
    console.log(`\nYou can now run migrations using:`);
    console.log(`  ${colors.yellow}./deploy-migrations.sh${colors.reset}  or  ${colors.yellow}node deploy-migrations.js${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ There are issues with your Supabase configuration.${colors.reset}`);
    console.log(`\nPlease fix the above errors before running migrations.`);
  }
}

main(); 