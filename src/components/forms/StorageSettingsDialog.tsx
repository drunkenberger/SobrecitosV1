import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Cloud, Database, Info } from "lucide-react";
import { StorageType, getUserSettings, saveUserSettings } from "@/lib/supabaseStore";
import { syncLocalToSupabase } from "@/lib/store";
import { isUserPremium, upgradeUserToPremium } from "@/lib/auth";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

interface StorageSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StorageSettingsDialog({
  open,
  onOpenChange,
}: StorageSettingsDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | undefined>(undefined);
  const [showUpgradePremium, setShowUpgradePremium] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Check if user is signed in
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      if (!user) {
        toast({
          title: t('errors.notSignedIn'),
          description: t('errors.signInRequired'),
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      // Para pruebas, consideramos a todos los usuarios como premium
      setIsPremium(true);
      
      // Load user settings
      const settings = await getUserSettings();
      setLastSynced(settings.lastSynced);
      setShowUpgradePremium(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: t('errors.loadingSettings'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      // Sincronizamos los datos
      await syncLocalToSupabase();
      
      // Actualizamos la fecha de última sincronización
      const now = new Date().toISOString();
      setLastSynced(now);
      
      // Guardamos la configuración
      await saveUserSettings({
        storageType: StorageType.CLOUD,
        syncEnabled: true,
        lastSynced: now,
      });
      
      toast({
        title: t('success.syncComplete'),
        description: t('success.dataUpdated'),
      });
    } catch (error) {
      console.error("Error syncing data:", error);
      toast({
        title: t('errors.syncFailed'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const success = await upgradeUserToPremium();
      if (success) {
        setIsPremium(true);
        setShowUpgradePremium(false);
        
        toast({
          title: t('success.upgradedToPremium'),
          description: t('success.premiumFeatures'),
        });
      } else {
        throw new Error(t('errors.upgradeFailed'));
      }
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      toast({
        title: t('errors.upgradeFailed'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('settings.cloudSyncSettings')}</DialogTitle>
        </DialogHeader>

        {showUpgradePremium ? (
          <div className="space-y-4">
            <Alert>
              <div className="font-semibold flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                {t('premium.requiredForCloudStorage')}
              </div>
            </Alert>
            
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">{t('premium.benefits.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-primary" />
                  <span>{t('premium.benefits.cloudSync')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span>{t('premium.benefits.multiDevice')}</span>
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? t('common.loading') : t('premium.upgrade')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <Cloud className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{t('settings.cloudStorageEnabled')}</span>
                <span className="text-sm text-muted-foreground">{t('settings.cloudStorageDescription')}</span>
              </div>
            </div>

            {lastSynced && (
              <p className="text-sm">
                <span className="font-medium">{t('settings.lastSynced')}:</span>{' '}
                {new Date(lastSynced).toLocaleString()}
              </p>
            )}
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('settings.cloudInfo')}
              </AlertDescription>
            </Alert>
            
            <Button 
              className="w-full" 
              onClick={handleSync} 
              disabled={loading}
            >
              {loading ? t('common.loading') : t('settings.syncNow')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 