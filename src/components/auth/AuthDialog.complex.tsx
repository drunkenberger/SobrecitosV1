import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

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
  const [isFormValid, setIsFormValid] = useState(false);

  // Form validation
  useEffect(() => {
    if (isLogin) {
      setIsFormValid(email.length > 0 && password.length > 0);
    } else {
      setIsFormValid(email.length > 0 && password.length >= 6 && name.length > 0);
    }
  }, [email, password, name, isLogin]);

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
        setShowPassword(false);
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
      <DialogContent 
        className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-0 shadow-2xl"
        aria-describedby={undefined}
      >
        <div className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-brand-600/10" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          
          {/* Header */}
          <DialogHeader className="relative p-8 pb-4">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Shield className="w-3 h-3 text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <DialogTitle className="text-2xl font-bold text-gradient-primary mb-2">
                {isLogin ? t('auth.login') : t('auth.register')}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {isLogin 
                  ? "Welcome back! Sign in to access your budget."
                  : "Join thousands managing their budgets smartly."
                }
              </p>
            </motion.div>
          </DialogHeader>

          {/* Form */}
          <div className="relative p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "register"}
                  initial={{ x: isLogin ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: isLogin ? 20 : -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-sm font-medium">
                        {t('auth.name')}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                          disabled={loading}
                          className="input-premium pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="input-premium pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="input-premium pl-10 pr-10"
                        placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {!isLogin && password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        {password.length >= 6 ? (
                          <CheckCircle2 className="w-3 h-3 text-success-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-warning-500" />
                        )}
                        Password strength: {password.length >= 6 ? "Good" : "Too short"}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Cloud Storage Info */}
              <motion.div 
                className="glass-card p-4 space-y-2"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                    <Cloud className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{t('auth.cloudStorage')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.cloudStorageDescription')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 rounded-xl"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-error-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
                        {error.includes("already exists") && !isLogin && (
                          <Button 
                            type="button" 
                            variant="link" 
                            className="p-0 h-auto mt-2 text-primary hover:text-primary/80"
                            onClick={switchToLogin}
                          >
                            {t('auth.switchToLogin')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  type="submit" 
                  className={cn(
                    "w-full btn-primary relative overflow-hidden",
                    !isFormValid && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <motion.div 
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>{t('common.loading')}</span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {isLogin ? t('auth.login') : t('auth.register')}
                    </span>
                  )}
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </Button>
              </motion.div>

              {/* Switch Mode */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                >
                  {isLogin
                    ? t('auth.needAccount')
                    : t('auth.alreadyHaveAccount')}
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
