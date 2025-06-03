import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Sparkles, AlertTriangle, Settings } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { getAIInsights, getAISettings, AISettings } from "@/lib/ai";
import { AISettingsDialog } from "./AISettingsDialog";

export function AIInsightsDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [settings, setSettings] = React.useState<AISettings>({
    enabled: false,
    provider: "openai",
    model: "gpt-3.5-turbo",
    apiKeys: {},
    baseUrl: "",
    autoSelectModel: true,
    temperature: 0.7,
    maxTokens: 1000
  });

  React.useEffect(() => {
    const loadSettings = async () => {
      const aiSettings = await getAISettings();
      setSettings(aiSettings);
    };
    loadSettings();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAIInsights();
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: AISettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    if (newSettings.enabled) {
      setOpen(true);
      fetchInsights();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold"
            onClick={() => {
              if (!settings.enabled) {
                setShowSettings(true);
                return;
              }
              setOpen(true);
              fetchInsights();
            }}
          >
            <Sparkles className="w-4 h-4" />
            {t('dashboard.header.buttons.aiInsights')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI Financial Insights
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {!settings.enabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                AI insights are not enabled. Configure your AI settings to get
                personalized financial advice.
              </AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">
                  Analyzing your financial data...
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {insights?.split("\n").map((line, i) => <p key={i}>{line}</p>)}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={fetchInsights}
              disabled={loading || !settings.enabled}
            >
              Refresh Insights
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AISettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={handleSettingsUpdate}
      />
    </>
  );
}
