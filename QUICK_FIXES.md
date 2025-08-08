# Quick Fixes for Layout and Auth Issues

## Issues Identified:

1. **Missing CSS Classes**: Components reference classes like `text-gradient-primary` and `btn-primary` that aren't defined
2. **AuthDialog Import Issues**: Potential issues with framer-motion imports and complex animations
3. **Navbar Layout**: Complex animations might be causing layout shifts

## Quick Fixes:

### 1. Fix CSS Classes
Add these missing utility classes to `src/index.css`:

```css
/* Add to @layer utilities section */
@layer utilities {
  .text-gradient-primary {
    @apply text-gradient bg-gradient-to-r from-brand-600 to-purple-600;
  }
  
  .btn-primary {
    @apply bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0;
  }
}
```

### 2. Simplify AuthDialog (if needed)
If framer-motion is causing issues, we can fallback to simpler CSS transitions.

### 3. Test Authentication
Make sure to:
1. Run the Supabase SQL fix first (from `fix-supabase-auth.sql`)
2. Check browser console for specific JavaScript errors
3. Verify environment variables are loaded

### 4. Browser Console Check
Look for these common errors:
- Module import failures
- CSS class not found warnings
- Authentication API errors
- Network connectivity issues

## Testing Steps:
1. Open browser dev tools (F12)
2. Check Console tab for errors
3. Try to register/login and monitor network requests
4. Check if API calls to Supabase are successful