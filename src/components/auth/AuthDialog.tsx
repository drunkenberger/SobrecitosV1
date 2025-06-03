import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Cloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { signIn, signUp, error: authError, loading: authLoading, clearError, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear errors when switching between login and register
  useEffect(() => {
    setError("");
    clearError();
  }, [isLogin, clearError]);

  // Update local error when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
      
      // If error indicates email already exists, offer to switch to login
      if (authError.includes("already exists") && !isLogin) {
        setError("This email is already registered. Would you like to log in instead?");
      }
    }
  }, [authError, isLogin]);

  // Auto-navigate to the app if the user is already logged in
  useEffect(() => {
    if (open && user) {
      console.log("User already logged in while dialog is open, triggering success callback");
      onSuccess();
      onOpenChange(false);
    }
  }, [open, user, onSuccess, onOpenChange]);

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setName("");
        setError("");
        clearError();
      }, 300); // Small timeout to ensure dialog is closed first
    }
  }, [open, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        console.log("Attempting to sign in user...");
        // First check if inputs are valid
        if (!email || !password) {
          setError("Email and password are required");
          setLoading(false);
          return;
        }
        
        const result = await signIn(email, password);
        console.log("Sign in result:", result ? "Success" : "Failed");
        
        if (result) {
          console.log("Login successful for user:", result.email);
          toast({
            title: t('auth.welcomeBack'),
            description: t('auth.goodToSeeYou', { name: result.name }),
          });
          console.log("Calling onSuccess callback after login");
          onSuccess();
          onOpenChange(false);
        } else if (!error && !authError) {
          // If there's no specific error but login failed
          setError("Login failed. Please check your credentials and try again.");
        }
      } else {
        console.log("Attempting to sign up user...");
        // First check if inputs are valid
        if (!email || !password || !name) {
          setError("All fields are required");
          setLoading(false);
          return;
        }
        
        const result = await signUp(email, password, name);
        console.log("Sign up result:", result ? "Success" : "Failed");
        
        if (result) {
          console.log("Registration successful for user:", result.email);
          toast({
            title: t('auth.welcomeToSobrecitos'),
            description: t('auth.accountCreated', { name }),
            variant: "default",
          });
          console.log("Calling onSuccess callback after registration");
          onSuccess();
          onOpenChange(false);
        } else {
          // If signup failed and we don't have a specific error message
          if (!error && !authError) {
            setError("Registration failed. Please try again or contact support.");
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : t('auth.unknownError')
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to switch to login if email already exists
  const switchToLogin = () => {
    setIsLogin(true);
    clearError();
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? t('auth.login') : t('auth.register')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="border border-gray-300 bg-white text-black"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border border-gray-300 bg-white text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border border-gray-300 bg-white text-black"
            />
          </div>
          
          <div className="flex items-center gap-2 p-2 border rounded-md text-sm">
            <Cloud className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span>{t('auth.cloudStorage')}</span>
              <span className="text-xs text-muted-foreground">{t('auth.cloudStorageDescription')}</span>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500 space-y-2">
              <p>{error}</p>
              {error.includes("already exists") && !isLogin && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={switchToLogin}
                >
                  {t('auth.switchToLogin')}
                </Button>
              )}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              loading || 
              (isLogin ? !email || !password : !email || !password || !name)
            }
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {t('common.loading')}
              </div>
            ) : (
              isLogin ? t('auth.login') : t('auth.register')
            )}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin
              ? t('auth.needAccount')
              : t('auth.alreadyHaveAccount')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
