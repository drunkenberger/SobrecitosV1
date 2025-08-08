import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Cloud, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when switching between login and register
  useEffect(() => {
    setError("");
    clearError();
  }, [isLogin, clearError]);

  // Update local error when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Auto-navigate to the app if the user is already logged in
  useEffect(() => {
    if (open && user) {
      console.log("User already logged in, navigating to app");
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
        setShowPassword(false);
        clearError();
      }, 300);
    }
  }, [open, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          setError("Email and password are required");
          setLoading(false);
          return;
        }
        
        const result = await signIn(email, password);
        
        if (result) {
          toast({
            title: t('auth.welcomeBack'),
            description: t('auth.goodToSeeYou', { name: result.name }),
          });
          onSuccess();
          onOpenChange(false);
        } else if (!error && !authError) {
          setError("Login failed. Please check your credentials and try again.");
        }
      } else {
        if (!email || !password || !name) {
          setError("All fields are required");
          setLoading(false);
          return;
        }
        
        const result = await signUp(email, password, name);
        
        if (result) {
          toast({
            title: t('auth.welcomeToSobrecitos'),
            description: t('auth.accountCreated', { name }),
          });
          onSuccess();
          onOpenChange(false);
        } else {
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

  const switchToLogin = () => {
    setIsLogin(true);
    clearError();
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-0" aria-describedby={undefined}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center text-gradient-primary">
            {isLogin ? t('auth.login') : t('auth.register')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('auth.name')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-brand-500 focus:ring-brand-500/20"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-brand-500 focus:ring-brand-500/20"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t('auth.password')}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-brand-500 focus:ring-brand-500/20 pr-12"
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-neutral-500" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-500" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Cloud Storage Info */}
          <div className="flex items-center gap-3 p-4 bg-brand-50/50 dark:bg-brand-950/20 rounded-xl border border-brand-200 dark:border-brand-800">
            <Cloud className="h-5 w-5 text-brand-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                {t('auth.cloudStorage')}
              </p>
              <p className="text-xs text-brand-600/80 dark:text-brand-400/80">
                {t('auth.cloudStorageDescription')}
              </p>
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-error-50 dark:bg-error-950/50 border border-error-200 dark:border-error-800 rounded-xl">
              <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
              {error.includes("already exists") && !isLogin && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-brand-600 dark:text-brand-400 mt-2"
                  onClick={switchToLogin}
                >
                  {t('auth.switchToLogin')}
                </Button>
              )}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 btn-primary text-base font-semibold" 
            disabled={loading || (isLogin ? !email || !password : !email || !password || !name)}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('common.loading')}
              </div>
            ) : (
              isLogin ? t('auth.login') : t('auth.register')
            )}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full text-neutral-600 dark:text-neutral-400"
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