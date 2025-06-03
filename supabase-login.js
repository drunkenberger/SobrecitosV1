#!/usr/bin/env node
// Script to help connect to the correct Supabase project
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';

// Create interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions in the terminal
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    console.log('Sobrecitos Supabase Connection Manager');
    console.log('====================================');
    
    // Check for existing .env file
    let existingConfig = {};
    if (fs.existsSync('.env')) {
      console.log('Found existing .env file with the following configuration:');
      dotenv.config();
      
      if (process.env.VITE_SUPABASE_URL) {
        console.log(`Current Supabase URL: ${process.env.VITE_SUPABASE_URL}`);
        existingConfig.url = process.env.VITE_SUPABASE_URL;
      }
      
      if (process.env.VITE_SUPABASE_ANON_KEY) {
        console.log(`Current Supabase Anon Key: ${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 8)}...`);
        existingConfig.anonKey = process.env.VITE_SUPABASE_ANON_KEY;
      }
      
      console.log('');
    } else {
      console.log('No existing .env file found.');
    }
    
    // Ask for new credentials
    console.log('Please enter your Supabase project credentials:');
    const newUrl = await question('Supabase Project URL: ');
    const newAnonKey = await question('Supabase Anon Key: ');
    
    // Validate input
    if (!newUrl || !newAnonKey) {
      console.log('Error: Both URL and Anon Key are required.');
      rl.close();
      return;
    }
    
    // Test the connection
    console.log('\nTesting connection to Supabase...');
    const supabase = createClient(newUrl, newAnonKey);
    
    try {
      // Simple query to test connection
      const { data, error } = await supabase.from('expenses').select('count(*)').limit(1);
      
      if (error) {
        console.log('Connection test failed:', error.message);
        
        // Try to list available tables to help debugging
        console.log('Attempting to list available tables...');
        try {
          const { data: tables } = await supabase.rpc('get_tables');
          if (tables && tables.length) {
            console.log('Available tables:', tables);
          }
        } catch (e) {
          console.log('Could not list tables:', e.message);
        }
        
        const proceed = await question('\nConnection test failed. Do you still want to save these credentials? (y/n): ');
        if (proceed.toLowerCase() !== 'y') {
          console.log('Operation cancelled.');
          rl.close();
          return;
        }
      } else {
        console.log('Connection successful!');
      }
    } catch (error) {
      console.log('Error testing connection:', error.message);
      const proceed = await question('\nConnection test failed. Do you still want to save these credentials? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        rl.close();
        return;
      }
    }
    
    // Create or update .env file
    const envContent = `VITE_SUPABASE_URL=${newUrl}
VITE_SUPABASE_ANON_KEY=${newAnonKey}
`;
    
    // Backup existing .env if it exists
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', '.env.backup');
      console.log('Created backup of existing .env file as .env.backup');
    }
    
    // Write new .env file
    fs.writeFileSync('.env', envContent);
    console.log('Successfully updated .env file with new Supabase credentials.');
    
    // Also update .env.local with the same credentials for local development
    fs.writeFileSync('.env.local', envContent);
    console.log('Also updated .env.local with the same credentials.');
    
    console.log('\nYou are now connected to your Supabase project!');
    console.log('You can now run your application or scripts with the new connection.');
    
    rl.close();
  } catch (error) {
    console.error('Unexpected error:', error);
    rl.close();
  }
}

main(); 