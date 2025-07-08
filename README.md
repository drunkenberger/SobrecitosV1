# Sobrecitos - Budget Management App
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/drunkenberger/SobrecitosV1?utm_source=oss&utm_medium=github&utm_campaign=drunkenberger%2FSobrecitosV1&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
Sobrecitos is a personal budget management application that helps you track expenses, savings goals, and future payments. The app supports both local storage and cloud storage via Supabase.

## Features

- Monthly budget management
- Expense tracking with categories
- Income management
- Savings goals
- Future payments planning
- Dual storage (local and cloud)
- Premium subscription for cloud storage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.example` file to `.env` and fill in your Supabase credentials
4. Start the development server:
   ```
   npm run dev
   ```

## Supabase Setup

This application uses Supabase for cloud storage. To set up your Supabase project:

1. Create a project at [Supabase](https://supabase.com)
2. Get your project ID and API keys from the project settings
3. Apply the database migrations:

   Using the shell script:
   ```
   ./deploy-migrations.sh
   ```

   Or using the Node.js script:
   ```
   node deploy-migrations.js
   ```

   You will be prompted to enter your Supabase project ID and service role key.

4. Generate TypeScript types for your database schema:
   ```
   npm run types:supabase
   ```

## Dual Storage Implementation

The application implements a dual storage system allowing data to be stored both locally and in the cloud:

1. **Local Storage**: All data is stored in the browser's localStorage by default, allowing the app to work offline.

2. **Cloud Storage (Supabase)**: Premium users can sync their data to Supabase, enabling access across multiple devices.

The storage abstraction layer allows seamless switching between storage types and synchronization of data in both directions.

## Authentication

The app supports both local authentication and Supabase authentication:

- Local users are stored in localStorage
- Cloud users are authenticated via Supabase Auth

Premium features, including cloud storage, are only available to authenticated users with premium status.

## Building for Production

```
npm run build
```

## License

[MIT](LICENSE)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
