import { supabase } from "./supabase";
import { StorageType, saveUserSettings } from "./supabaseStore";

// Combined user type for Supabase
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Supabase auth methods
export const registerSupabaseUser = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthUser | null> => {
  try {
    console.log("Attempting to register user:", email);
    // Try to sign in first to check if user exists
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in was successful, user already exists
      if (!signInError && signInData.user) {
        console.log("User already exists, login successful");
        
        // Get profile to check premium status
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, is_premium")
          .eq("id", signInData.user.id)
          .single();
        
        // Make sure user settings are set
        await saveUserSettings({
          storageType: StorageType.CLOUD,
          syncEnabled: true,
          lastSynced: new Date().toISOString(),
        });

        return {
          id: signInData.user.id,
          email: signInData.user.email || email,
          name: profile?.name || signInData.user.user_metadata?.name || "User",
          avatar_url: signInData.user.user_metadata?.avatar_url || '',
          createdAt: signInData.user.created_at || new Date().toISOString(),
          updatedAt: signInData.user.updated_at || new Date().toISOString(),
          isPremium: true, // For testing, consider all as premium
        };
      }
    } catch (signInError) {
      // If there's an error signing in, could be wrong password
      // or user doesn't exist, continue with registration
      console.log("Error trying to login, attempting to register:", signInError);
    }

    // If user doesn't exist, proceed with registration
    console.log("Registering new user");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("Error registering user:", error.message);
      return null;
    }

    if (!data.user) {
      return null;
    }

    console.log("User registered successfully, setting storage preferences");
    // Set default storage type for new users
    await saveUserSettings({
      storageType: StorageType.CLOUD,
      syncEnabled: true,
      lastSynced: new Date().toISOString(),
    });

    return {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.name || name,
      avatar_url: data.user.user_metadata?.avatar_url || '',
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString(),
      isPremium: true, // For testing, consider all as premium
    };
  } catch (error) {
    console.error("Error in registerSupabaseUser:", error);
    return null;
  }
};

export const loginSupabaseUser = async (
  email: string,
  password: string,
): Promise<AuthUser | null> => {
  try {
    console.log("Attempting to login user:", email);
    
    // Set a timeout promise to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Login operation timed out')), 10000);
    });
    
    // Use Promise.race to apply a timeout to the login request
    const authResult = await Promise.race([
      supabase.auth.signInWithPassword({
        email,
        password,
      }),
      timeoutPromise
    ]);
    
    // Type assertion since we know the result is from signInWithPassword
    const { data, error } = authResult as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

    if (error) {
      console.error("Error logging in user:", error.message);
      return null;
    }

    if (!data.user) {
      console.log("No user data returned from login");
      return null;
    }

    console.log("Login successful, fetching user profile");
    
    // Create a default profile object in case we can't fetch it
    let profile = {
      name: data.user.user_metadata?.name || "User",
      avatar_url: data.user.user_metadata?.avatar_url || '',
      is_premium: true
    };
    
    try {
      // Get profile to check premium status with timeout
      const { data: profileData, error: profileError } = await Promise.race([
        supabase
          .from("profiles")
          .select("name, is_premium, avatar_url")
          .eq("id", data.user.id)
          .single(),
        new Promise<{ data: null; error: Error }>((_, reject) => 
          setTimeout(() => reject({ data: null, error: new Error('Profile fetch timed out') }), 5000)
        )
      ]);
      
      // If profile fetch was successful, use that data
      if (!profileError && profileData) {
        profile = profileData;
      }
    } catch (profileError) {
      console.warn("Couldn't fetch user profile, using default values:", profileError);
      // Continue with the default profile
    }
    
    // Try to update user settings
    try {
      console.log("Updating user storage preferences...");
      await saveUserSettings({
        storageType: StorageType.CLOUD, 
        syncEnabled: true,
        lastSynced: new Date().toISOString(),
      });
    } catch (settingsError) {
      console.warn("Failed to update user settings:", settingsError);
    }

    // Return user data even if profile or settings fetch failed
    return {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.name || data.user.user_metadata?.name || "User",
      avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url || '',
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString(),
      isPremium: true, // For testing, consider all as premium
    };
  } catch (error) {
    console.error("Error in loginSupabaseUser:", error);
    return null;
  }
};

export const logoutSupabaseUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error in logoutSupabaseUser:", error);
  }
};

// Simplified methods that use only Supabase
export const registerUser = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthUser | null> => {
  return await registerSupabaseUser(email, password, name);
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthUser | null> => {
  return await loginSupabaseUser(email, password);
};

export const logoutUser = async (): Promise<void> => {
  await logoutSupabaseUser();
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return null;
    }

    const user = session.session.user;
    let profile = null;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileError && profileData) {
      profile = profileData;
    }

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.user_metadata?.name || '',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
      isPremium: profile?.is_premium || false,
      createdAt: profile?.created_at || user.created_at || '',
      updatedAt: profile?.updated_at || user.updated_at || '',
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper to determine if a user is premium
export const isUserPremium = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Get current premium status from Supabase
  const { data } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();
    
  return data?.is_premium || true; // For testing, always return true
};

// Function to upgrade a user to premium
export const upgradeUserToPremium = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Update premium status in Supabase
  const { error } = await supabase
    .from("profiles")
    .update({ is_premium: true })
    .eq("id", user.id);
    
  if (error) {
    console.error("Error upgrading user to premium:", error);
    return false;
  }
  
  // Set storage type to cloud for premium users
  await saveUserSettings({
    storageType: StorageType.CLOUD,
    syncEnabled: true,
    lastSynced: new Date().toISOString(),
  });
  
  return true;
};

// Function to downgrade a user from premium
export const downgradeUserFromPremium = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Update premium status in Supabase
  const { error } = await supabase
    .from("profiles")
    .update({ is_premium: false })
    .eq("id", user.id);
    
  if (error) {
    console.error("Error downgrading user from premium:", error);
    return false;
  }
  
  return true;
};
