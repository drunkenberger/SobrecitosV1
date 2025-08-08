import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyrhkdrblbaiyiftgrhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cmhrZHJibGJhaXlpZnRncmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTgzMzMsImV4cCI6MjA2MTYzNDMzM30.xAYvRSdzj8FQbZ9kHGjYzmo710U-VnedSpy8GtVb2QM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistration() {
  console.log('Testing Supabase registration...');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';
  
  try {
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { name: testName }
      }
    });
    
    if (error) {
      console.error('Registration error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Registration successful!');
      console.log('User:', data.user);
      console.log('Session:', data.session);
      
      // Check if email confirmation is required
      if (!data.session) {
        console.log('Email confirmation required. Check your email.');
      }
    }
    
    // Test if profiles table exists and is accessible
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.error('Profiles table error:', profileError.message);
      console.error('This might indicate the profiles table doesn\'t exist or has incorrect RLS policies');
    } else {
      console.log('Profiles table is accessible');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testRegistration();