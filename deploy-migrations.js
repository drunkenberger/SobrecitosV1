#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to execute HTTP request
function executeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function main() {
  try {
    // Get Supabase project ID and API key
    let projectId = process.env.SUPABASE_PROJECT_ID;
    let apiKey = process.env.SUPABASE_API_KEY;
    
    if (!projectId) {
      projectId = await prompt('Enter your Supabase Project ID: ');
    }
    
    if (!apiKey) {
      apiKey = await prompt('Enter your Supabase service_role key (not anon key): ');
    }
    
    if (!projectId || !apiKey) {
      console.error('Error: Project ID and API key are required');
      process.exit(1);
    }
    
    // Set Supabase API URLs
    const supabaseUrl = 'api.supabase.com';
    
    console.log(`Applying migrations to Supabase project ${projectId}...`);
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Apply each migration
    for (const migrationFile of migrationFiles) {
      console.log(`Applying migration: ${migrationFile}`);
      
      // Read the SQL file
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      
      // Prepare request options
      const options = {
        hostname: supabaseUrl,
        path: '/database-sql?db=postgresql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      };
      
      // Prepare request data
      const requestData = JSON.stringify({
        query: migrationSql
      });
      
      // Execute request
      const response = await executeRequest(options, requestData);
      
      // Check for errors
      if (response.error) {
        console.error(`Error applying migration: ${migrationFile}`);
        console.error(response.error);
        process.exit(1);
      }
    }
    
    console.log('All migrations applied successfully!');
    
    // Generate TypeScript types
    console.log('Generating TypeScript types...');
    try {
      execSync(`npx supabase gen types typescript --project-id ${projectId} > src/types/supabase.ts`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error generating TypeScript types:');
      console.error(error.message);
    }
    
    console.log('Deployment complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 