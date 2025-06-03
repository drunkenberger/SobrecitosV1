const https = require('https');
require('dotenv').config();

const apiKey = process.env.SUPABASE_API_KEY; // Service role key from your .env file
if (!apiKey) {
  console.error('Missing SUPABASE_API_KEY in environment.');
  process.exit(1);
}

const query = `
TRUNCATE TABLE
  budgets,
  categories,
  expenses,
  future_payments,
  incomes,
  profiles,
  savings_goals,
  user_settings
RESTART IDENTITY CASCADE;
`;

const data = JSON.stringify({ query });

const options = {
  hostname: 'api.supabase.com',
  path: '/database-sql?db=postgresql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => { console.log(body); });
});

req.on('error', error => { console.error(error); });
req.write(data);
req.end(); 