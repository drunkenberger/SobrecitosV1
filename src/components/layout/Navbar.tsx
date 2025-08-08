import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Home,
  HelpCircle,
  LifeBuoy,
  Menu,
  LogIn,
  Sparkles,
  X,
  Wallet,
  LayoutDashboard,
  LayoutList,
  TrendingUp,
  BarChart3,
  Clock,
  LineChart
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AuthDialog } from "../auth/AuthDialog";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isApp = location.pathname.startsWith("/app");
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const navbarBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    console.log("Auth success in Navbar, navigating to /app");
    setShowAuthDialog(false);
    navigate('/app');
  };

  const navItems = [
    { to: "/blog", icon: MessageSquare, label: t('navigation.blog') },
    { to: isApp ? "/app/help" : "/help-center", icon: LifeBuoy, label: t('common.help') },
    { to: isApp ? "/app/faq" : "/faq", icon: HelpCircle, label: "FAQ" },
  ];

  const sidebarNavItems = [
    { to: "/app", icon: LayoutDashboard, label: t('navigation.dashboard') },
    { to: "/app/transactions", icon: LayoutList, label: t('navigation.transactions') },
    { to: "/app/cash-flow", icon: TrendingUp, label: t('navigation.cashFlow') },
    { to: "/app/categories", icon: BarChart3, label: t('navigation.categories') },
    { to: "/app/recurrings", icon: Clock, label: t('navigation.recurring') },
    { to: "/app/investments", icon: LineChart, label: "Investments" },
  ];

  return (
    <>
      {/* Premium Navbar */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50" 
            : "backdrop-blur-md bg-white/60 dark:bg-neutral-900/60"
        )}
        style={{
          backdropFilter: `blur(${navbarBlur}px)`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/"
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet className="w-5 h-5 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-2 h-2 text-white" />
                  </motion.div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-gradient-primary">
                    Sobrecitos
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">
                    Smart Budget Management
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 group"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Theme & Language Controls */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl backdrop-blur-sm">
                <ThemeToggle />
                <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600" />
                <LanguageSwitcher />
              </div>

              {/* Auth Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isApp ? (
                  <UserMenu />
                ) : user ? (
                  <Button
                    className="btn-primary group"
                    asChild
                  >
                    <Link to="/app" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      {t('common.dashboard')}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="btn-primary group"
                    onClick={handleLoginClick}
                  >
                    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {t('common.login')}
                  </Button>
                )}
              </motion.div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-700"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Show sidebar navigation if in app */}
              {isApp && (
                <>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4">
                    Navigation
                  </div>
                  {sidebarNavItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          location.pathname === item.to
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 my-4" />
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4">
                    Support
                  </div>
                </>
              )}
              
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (isApp ? sidebarNavItems.length : 0) + index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <ThemeToggle />
                  <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600" />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
        onSuccess={handleAuthSuccess} 
      />
    </>
  );
}
