import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Home,
  HelpCircle,
} from "lucide-react";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
  const location = useLocation();
  const isApp = location.pathname === "/app";

  return (
    <div className="bg-[#FFD700]">
      {/* Top Bar */}
      <div className="border-b border-[#556B2F]/30 bg-[#FFD700]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-10 items-center text-[#556B2F] text-sm">
            <div className="flex items-center gap-6">
              <a
                href="mailto:info@sobrecitos.com"
                className="flex items-center gap-2 hover:text-[#556B2F]/80"
              >
                <Mail className="w-4 h-4" /> info@sobrecitos.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-[#556B2F]/80"
              >
                <Phone className="w-4 h-4" /> (123) 456-7890
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#556B2F]/80">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#556B2F]/80">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#556B2F]/80">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="relative">
        <div className="absolute inset-0 bg-[#556B2F] skew-x-12 -translate-x-1/2 w-[120%] -z-10 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link to="/">
                <img
                  src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafkreiairtotli5wav7jovqyea4b76kzsvnnccqwvo5ihvnwec426pgqz4"
                  alt="Sobrecitos"
                  className="h-8 w-auto"
                />
              </Link>
              {isApp && (
                <Link to="/" className="text-[#FFD700] hover:text-[#FFD700]/80">
                  <Home className="w-5 h-5" />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/faq"
                className="text-[#FFD700] hover:text-[#FFD700]/80 flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">FAQ</span>
              </Link>
              {!isApp ? (
                <Button
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-medium rounded-full px-6 border-2 border-[#556B2F] shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/app">Dashboard</Link>
                </Button>
              ) : (
                <UserMenu />
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
