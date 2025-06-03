#!/usr/bin/env node
// Script to clean duplicate expenses from Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables with reload option for fresh configs
dotenv.config({ override: true });

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in .env file.');
  console.log('Please run "node supabase-login.js" first to set up the correct Supabase connection.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to confirm we're connected to the right database
const confirmConnection = async () => {
  console.log(`Connected to Supabase project: ${supabaseUrl}`);
  
  try {
    // Try to get database info
    const { data, error } = await supabase.from('expenses').select('count(*)');
    
    if (error) {
      console.error('Connection error:', error.message);
      console.log('Please make sure you are connected to the correct Supabase project.');
      return false;
    }
    
    console.log(`Successfully connected to Supabase project.`);
    console.log(`Found ${data[0]?.count || 0} expenses in the database.`);
    
    // Ask for confirmation
    if (process.argv.includes('--skip-confirmation')) {
      return true;
    }
    
    console.log('\nIs this the correct database you want to work with?');
    console.log('To proceed, run the script with the --confirm-db flag');
    
    if (!process.argv.includes('--confirm-db')) {
      console.log('Operation cancelled. Please run "node supabase-login.js" to connect to a different database.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error while confirming connection:', error);
    return false;
  }
};

const cleanDuplicateExpenses = async () => {
  try {
    // First confirm we're on the right database
    const confirmed = await confirmConnection();
    if (!confirmed) return;
    
    console.log('Starting cleanup of duplicate expenses...');
    
    // First, let's check if we can connect to the database
    const { data: tableInfo, error: tableError } = await supabase
      .from('expenses')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.error('Error connecting to expenses table:', tableError.message);
      console.log('Checking available tables...');
      
      // Check what tables are available
      const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
      
      if (tablesError) {
        console.error('Error listing tables:', tablesError.message);
        return;
      }
      
      console.log('Available tables:', tables);
      return;
    }
    
    // Get all expenses to analyze duplicates
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (expensesError) {
      console.error('Error fetching expenses:', expensesError.message);
      return;
    }
    
    console.log(`Found ${expenses.length} total expenses`);
    
    // Create a backup of all expenses before deletion
    fs.writeFileSync('expenses-backup.json', JSON.stringify(expenses, null, 2));
    console.log('Created backup in expenses-backup.json');
    
    // Find duplicates (same description, amount, category and date)
    const uniqueExpenses = new Map();
    const duplicates = [];
    
    expenses.forEach(expense => {
      // Create a unique key for each expense
      const key = `${expense.description}-${expense.amount}-${expense.category_id}-${expense.date.split('T')[0]}`;
      
      if (uniqueExpenses.has(key)) {
        // This is a duplicate
        duplicates.push(expense.id);
      } else {
        // This is the first occurrence
        uniqueExpenses.set(key, expense.id);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate expenses`);
    
    // Confirm deletion with the user
    console.log('To delete all duplicates, run this script with the --confirm flag');
    
    // Check if the --confirm flag is present
    if (process.argv.includes('--confirm')) {
      console.log('Deleting duplicate expenses...');
      
      // Delete in batches to avoid API limits
      const batchSize = 20;
      for (let i = 0; i < duplicates.length; i += batchSize) {
        const batch = duplicates.slice(i, i + batchSize);
        const { error: deleteError } = await supabase
          .from('expenses')
          .delete()
          .in('id', batch);
        
        if (deleteError) {
          console.error(`Error deleting batch ${i / batchSize + 1}:`, deleteError.message);
        } else {
          console.log(`Successfully deleted batch ${i / batchSize + 1} (${batch.length} expenses)`);
        }
      }
      
      console.log('Duplicate cleanup complete');
    } else {
      console.log('Dry run complete. No expenses were deleted.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

const deleteAllExpenses = async () => {
  try {
    console.log('Getting ready to delete all expenses...');
    
    // First, let's check if we can connect to the database
    const { data: tableInfo, error: tableError } = await supabase
      .from('expenses')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.error('Error connecting to expenses table:', tableError.message);
      return;
    }
    
    // Get all expenses first for backup
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*');
    
    if (expensesError) {
      console.error('Error fetching expenses:', expensesError.message);
      return;
    }
    
    console.log(`Found ${expenses.length} total expenses to delete`);
    
    // Create a backup of all expenses before deletion
    fs.writeFileSync('expenses-backup.json', JSON.stringify(expenses, null, 2));
    console.log('Created backup in expenses-backup.json');
    
    // Confirm deletion with the user
    console.log('To delete ALL expenses, run this script with the --delete-all flag');
    
    // Check if the --delete-all flag is present
    if (process.argv.includes('--delete-all')) {
      console.log('Deleting ALL expenses...');
      
      const { error: deleteError } = await supabase
        .from('expenses')
        .delete()
        .gte('id', 0); // Delete all rows
      
      if (deleteError) {
        console.error('Error deleting expenses:', deleteError.message);
      } else {
        console.log('Successfully deleted all expenses');
      }
    } else {
      console.log('Dry run complete. No expenses were deleted.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Main function to handle different operations
const main = async () => {
  // First confirm we're on the right database, unless we're just checking tables
  if (!process.argv.includes('--check-tables')) {
    const confirmed = await confirmConnection();
    if (!confirmed) return;
  }

  if (process.argv.includes('--check-tables')) {
    // Just check available tables
    try {
      const { data, error } = await supabase.rpc('get_tables');
      if (error) {
        // Try alternative approach
        const { data: schemas, error: schemasError } = await supabase.rpc('get_schemas');
        if (schemasError) {
          console.error('Error listing schemas:', schemasError.message);
          return;
        }
        console.log('Available schemas:', schemas);
        return;
      }
      console.log('Available tables:', data);
    } catch (error) {
      console.error('Error checking tables:', error);
    }
  } else if (process.argv.includes('--delete-all')) {
    await deleteAllExpenses();
  } else {
    await cleanDuplicateExpenses();
  }
};

// Run the main function
main().catch(console.error); 