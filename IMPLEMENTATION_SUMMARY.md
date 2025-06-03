# Dual Storage Implementation Summary

This document provides an overview of the dual storage implementation in the Sobrecitos application.

## Architecture Overview

The dual storage system allows users to:
1. Store data locally in the browser's localStorage (default)
2. Store data in the cloud using Supabase (premium feature)
3. Synchronize data between local and cloud storage

## Key Components

### 1. Database Schema (Supabase)

- **`profiles`**: User profiles linked to Supabase Auth
- **`budgets`**: Monthly budget data
- **`incomes`**: Additional income entries
- **`categories`**: Expense categories with budgets
- **`expenses`**: User expenses linked to categories
- **`savings_goals`**: Savings targets and progress
- **`future_payments`**: Upcoming payment obligations
- **`user_settings`**: Configuration for storage preferences

All tables are protected with Row Level Security (RLS) to ensure users can only access their own data.

### 2. Storage Abstraction Layer

- **`src/lib/store.ts`**: Core storage functions for managing local data
- **`src/lib/supabaseStore.ts`**: Functions for interacting with Supabase
- **`getUserSettings()`**: Gets user storage preferences
- **`saveUserSettings()`**: Updates storage preferences
- **`syncLocalToSupabase()`**: Exports local data to cloud
- **`syncSupabaseToLocal()`**: Imports cloud data to local storage

### 3. Authentication System

- **`src/lib/auth.ts`**: Unified authentication handling both local and Supabase
- Supports account creation and login via both methods
- Manages premium status for feature gating
- Handles session persistence

### 4. User Interface Components

- **`StorageSettingsDialog`**: UI for managing storage preferences
- Premium feature promotion
- Sync controls
- Storage type selection

## Data Flow

1. **Initial Load**:
   - Check if user is authenticated
   - Read user storage preferences
   - Load data from appropriate source (local or cloud)

2. **Data Modifications**:
   - Always update local storage first
   - If cloud storage is enabled, update Supabase

3. **Synchronization**:
   - On-demand syncing in both directions
   - Updates last sync timestamp
   - Error handling for sync failures

## Premium Feature Control

- Cloud storage is restricted to premium users
- Local users can upgrade to premium
- Premium users can choose between storage types
- Non-premium users are automatically restricted to local storage

## Migration Scripts

- `deploy-migrations.sh`: Shell script for applying SQL migrations to Supabase
- `deploy-migrations.js`: Node.js alternative for migration deployment
- `check-supabase-config.js`: Configuration verification script

## Setup and Configuration

1. Supabase project creation
2. Environment variable configuration
3. Migration deployment
4. TypeScript type generation

## Error Handling

- Network error handling
- Authentication error handling
- Synchronization conflict resolution
- Fallback to local storage on cloud errors

## Security Considerations

- Service role key protected and not exposed to frontend
- RLS policies for data protection
- Proper authentication validation

## Future Improvements

1. **Conflict Resolution**: More sophisticated merging of data from two sources
2. **Offline Mode**: Better handling of offline operations with queued sync
3. **Data Versioning**: Track changes for better sync reliability
4. **Selective Sync**: Allow synchronizing only specific data types 