import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] via-[#556B2F]/90 to-transparent z-10" />
        <img
          src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafybeid6a3dmhdwvmy727glvwmwxy3yrcy5yvhtvtic2k4lohdatqxuzb4"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafkreiairtotli5wav7jovqyea4b76kzsvnnccqwvo5ihvnwec426pgqz4"
              alt="Sobrecitos"
              className="h-32 w-auto"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold sm:text-6xl text-white">
                Family Budget Manager
              </h1>
              <p className="text-xl text-white/80 max-w-xl">
                Take control of your family's finances with our easy-to-use,
                privacy-first, self-contained budget tracker. Perfect for busy
                moms managing household expenses.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/app" className="flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -left-12 -bottom-12 bg-[#FFD700] p-6 rounded-lg shadow-xl transform rotate-6">
              <img
                src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafkreiairtotli5wav7jovqyea4b76kzsvnnccqwvo5ihvnwec426pgqz4"
                alt="Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <img
              src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafybeid6a3dmhdwvmy727glvwmwxy3yrcy5yvhtvtic2k4lohdatqxuzb4"
              alt="Shopping"
              className="rounded-lg shadow-2xl border-8 border-white/10"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
