import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  Mail,
  Facebook,
  X,
  MessageSquare,
  Home,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const location = useLocation();
  const isApp = location.pathname.startsWith("/app");
  const { t } = useTranslation();

  return (
    <div className="bg-[#FFD700]">
      {/* Top Bar */}
      <div className="border-b border-[#556B2F]/30 bg-[#FFD700] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12 items-center text-[#556B2F] text-sm">
            <div className="flex items-center gap-6">
              <a
                href="mailto:info@sobrecitos.net"
                className="flex items-center gap-2 hover:text-[#556B2F]/80 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" /> info@sobrecitos.net
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hover:text-[#556B2F]/80 transition-colors duration-200 p-1.5 rounded-full hover:bg-[#556B2F]/10"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="hover:text-[#556B2F]/80 transition-colors duration-200 p-1.5 rounded-full hover:bg-[#556B2F]/10"
              >
                <X className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="hover:text-[#556B2F]/80 transition-colors duration-200 p-1.5 rounded-full hover:bg-[#556B2F]/10"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="relative shadow-md">
        <div className="absolute inset-0 bg-[#556B2F] skew-x-12 -translate-x-1/2 w-[120%] -z-10 opacity-95" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center relative z-20">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-white/80 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <Home className="w-6 h-6" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 bg-[#556B2F]/40 px-3 py-2 rounded-md">
                <ThemeToggle />
                <div className="border-l border-white/20 h-6 mx-2" />
                <LanguageSwitcher />
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/blog"
                  className="text-white hover:text-white/80 flex items-center gap-2 bg-[#556B2F]/40 px-3 py-2 rounded-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{t('navigation.blog')}</span>
                </Link>
                <Link
                  to={isApp ? "/app/help" : "/help-center"}
                  className="text-white hover:text-white/80 flex items-center gap-2 bg-[#556B2F]/40 px-3 py-2 rounded-md"
                >
                  <LifeBuoy className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{t('common.help')}</span>
                </Link>
                <Link
                  to={isApp ? "/app/faq" : "/faq"}
                  className="text-white hover:text-white/80 flex items-center gap-2 bg-[#556B2F]/40 px-3 py-2 rounded-md"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">FAQ</span>
                </Link>
              </div>
              {!isApp ? (
                <Button
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-medium rounded-full px-6 border-2 border-[#556B2F] shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/app">{t('common.dashboard')}</Link>
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
