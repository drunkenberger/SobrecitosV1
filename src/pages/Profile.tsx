import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { StorageType, getUserSettings, saveUserSettings } from "../lib/supabaseStore";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "../components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PieChart, Wallet, TrendingUp, Target, Cloud, Settings, Download, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseChart from "@/components/budget/ExpenseChart";
import { StorageSettingsDialog } from "@/components/forms/StorageSettingsDialog";
import SEO from "@/components/SEO";

export default function Profile() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: t("errors.signOutFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="My Profile - Sobrecitos Budget Manager"
        description="Manage your Sobrecitos profile settings, preferences, and personal budget configurations. Customize your family finance management experience."
        keywords="budget profile, personal settings, financial preferences, account management, budget customization, family finance settings"
      />
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t("profile.title")}</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">{t("profile.email")}</h2>
            <p>{user.email}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">{t("profile.name")}</h2>
            <p>{user.name}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">{t("profile.memberSince")}</h2>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">{t("profile.storageType")}</h2>
            <p>{t("profile.cloudStorage")}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">{t("profile.accountType")}</h2>
            <p>{user.isPremium ? t("profile.premium") : t("profile.basic")}</p>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? t("common.loading") : t("auth.signOut")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
