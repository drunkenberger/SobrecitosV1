import { useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { StorageType, getUserSettings } from "../lib/supabaseStore";
import { useStore } from "../lib/store";
import { toast } from "./ui/use-toast";

interface DataSyncButtonProps {
  onSyncComplete?: () => Promise<void>;
}

export function DataSyncButton({ onSyncComplete }: DataSyncButtonProps) {
  const { t } = useTranslation();
  const [syncing, setSyncing] = useState(false);
  const saveToCloud = useStore((state) => state.saveToCloud);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const settings = await getUserSettings();
      
      if (settings.storageType !== StorageType.CLOUD) {
        toast({
          title: t("errors.cloudRequired"),
          description: t("errors.enableCloudFirst"),
          variant: "destructive",
        });
        return;
      }

      await saveToCloud();
      
      if (onSyncComplete) {
        await onSyncComplete();
      }
      
      toast({
        title: t("success.synced"),
        description: t("success.dataUpdated"),
      });
    } catch (error) {
      console.error("Error syncing data:", error);
      toast({
        title: t("errors.syncFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={syncing}
    >
      {syncing ? t("common.syncing") : t("common.sync")}
    </Button>
  );
} 