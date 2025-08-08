import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap,
  Play,
  Star,
  CheckCircle2
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Floating animation for the background elements
const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 20 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number; 
}) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

export default function Hero() {
  const { t } = useTranslations();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-white via-neutral-50 to-brand-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950/30">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        
        {/* Floating Shapes */}
        <FloatingElement delay={0} duration={25}>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl" />
        </FloatingElement>
        
        <FloatingElement delay={5} duration={30}>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-brand-400/20 rounded-full blur-3xl" />
        </FloatingElement>
        
        <FloatingElement delay={10} duration={35}>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-brand-300/30 to-purple-300/30 rounded-full blur-3xl" />
        </FloatingElement>

        {/* Dotted Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.neutral.400)_1px,transparent_0)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 w-fit"
            >
              <div className="glass-light px-4 py-2 rounded-full flex items-center gap-2 border border-brand-200/50">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">
                  Trusted by 10,000+ families
                </span>
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient-primary">
                  Smart Budget
                </span>
                <br />
                <span className="text-neutral-800 dark:text-neutral-200">
                  Management
                </span>
                <br />
                <span className="text-gradient-primary">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                Take control of your family finances with intelligent insights, 
                beautiful visualizations, and AI-powered recommendations.
              </p>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: Shield, text: "100% Private" },
                { icon: Zap, text: "AI-Powered" },
                { icon: TrendingUp, text: "Smart Insights" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass-light px-4 py-2 rounded-full flex items-center gap-2 border border-neutral-200/50 hover:border-brand-300/50 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-brand-600" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                asChild
                className="btn-primary text-lg px-8 py-4 group"
              >
                <Link to="/app" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {t('common.getStarted')} 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="btn-secondary text-lg px-8 py-4 group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 border-t border-neutral-200/50 dark:border-neutral-700/50"
            >
              <p className="text-sm text-neutral-500 mb-4">
                Trusted by families worldwide
              </p>
              <div className="flex items-center gap-6 opacity-60">
                {/* Placeholder for company logos */}
                <div className="text-xs font-semibold text-neutral-400">FEATURED IN</div>
                <div className="flex items-center gap-4 text-neutral-400">
                  <span className="font-medium">TechCrunch</span>
                  <span className="font-medium">ProductHunt</span>
                  <span className="font-medium">Forbes</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main Dashboard Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-3xl blur-3xl transform -rotate-6 scale-110" />
              
              {/* Dashboard Preview */}
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  rotateY: -5,
                  rotateX: 5
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="card-premium p-8 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-0 shadow-2xl relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl" />
                    <span className="font-semibold text-lg">Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-error-400 rounded-full" />
                    <div className="w-3 h-3 bg-warning-400 rounded-full" />
                    <div className="w-3 h-3 bg-success-400 rounded-full" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Budget", value: "$5,240", trend: "+12%" },
                    { label: "Spent", value: "$3,180", trend: "-5%" },
                    { label: "Saved", value: "$2,060", trend: "+25%" },
                    { label: "Goals", value: "3/5", trend: "60%" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="glass-light p-3 rounded-xl border border-neutral-200/30"
                    >
                      <div className="text-xs text-neutral-500 mb-1">{stat.label}</div>
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-success-500">{stat.trend}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Preview */}
                <div className="glass-light p-4 rounded-xl border border-neutral-200/30 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Spending Overview</span>
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    {[60, 40, 80, 30].map((width, index) => (
                      <motion.div
                        key={index}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                        className={cn(
                          "h-2 rounded-full",
                          index === 0 && "bg-gradient-to-r from-brand-400 to-brand-600",
                          index === 1 && "bg-gradient-to-r from-purple-400 to-purple-600",
                          index === 2 && "bg-gradient-to-r from-success-400 to-success-600",
                          index === 3 && "bg-gradient-to-r from-warning-400 to-warning-600"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
              </motion.div>

              {/* Floating Elements */}
              <FloatingElement delay={2} duration={15}>
                <div className="absolute -top-4 -right-4 glass-light p-3 rounded-2xl border border-success-200/50 shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-success-600" />
                </div>
              </FloatingElement>

              <FloatingElement delay={4} duration={12}>
                <div className="absolute -bottom-6 -left-6 glass-light p-4 rounded-2xl border border-brand-200/50 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-brand-600" />
                </div>
              </FloatingElement>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
