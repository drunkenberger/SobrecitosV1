import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AI_PROVIDERS, getAISettings, saveAISettings, AISettings } from "@/lib/ai";

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: AISettings) => void;
}

export function AISettingsDialog({
  open,
  onOpenChange,
  onSave,
}: AISettingsDialogProps) {
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

  // Reset form when dialog opens
  React.useEffect(() => {
    const loadSettings = async () => {
      if (open) {
        const currentSettings = await getAISettings();
        setSettings(currentSettings);
      }
    };
    loadSettings();
  }, [open]);

  const handleSave = async () => {
    await saveAISettings(settings);
    onSave(settings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDownload = (localModel: any) => {
    if (localModel.installCommand) {
      navigator.clipboard.writeText(localModel.installCommand);
      alert("Install command copied to clipboard!");
    }
  };

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === settings.provider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Enabling AI features means your financial data will be processed by
            the selected AI provider. Make sure you trust the provider and
            understand their privacy policy.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-enabled">Enable AI Features</Label>
            <Switch
              id="ai-enabled"
              checked={settings.enabled}
              onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
            />
          </div>

          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select 
              value={settings.provider} 
              onValueChange={(provider) => setSettings({ ...settings, provider })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedProvider?.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-select"
                    checked={settings.autoSelectModel}
                    onCheckedChange={(autoSelectModel) => setSettings({ ...settings, autoSelectModel })}
                  />
                  <Label htmlFor="auto-select">
                    Auto-select best model for each task
                  </Label>
                </div>

                {!settings.autoSelectModel && (
                  <div className="space-y-2">
                    <Label>Select Model</Label>
                    <Select
                      value={settings.model}
                      onValueChange={(model) => setSettings({ ...settings, model })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProvider?.models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                            {model.isRecommended && " (Recommended)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedProvider?.apiKeyName && (
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={settings.apiKeys[settings.provider] || ""}
                      onChange={(e) => setSettings({
                        ...settings,
                        apiKeys: {
                          ...settings.apiKeys,
                          [settings.provider]: e.target.value
                        }
                      })}
                      placeholder={`Enter your ${selectedProvider.name} API key`}
                    />
                  </div>
                )}

                {selectedProvider?.baseUrl && (
                  <div className="space-y-2">
                    <Label>Base URL</Label>
                    <Input
                      type="text"
                      value={settings.baseUrl || ""}
                      onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                      placeholder="Enter base URL"
                    />
                  </div>
                )}

                <p className="text-sm font-medium">Available Models:</p>
                {selectedProvider?.models.map((model) => (
                  <div
                    key={model.name}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {model.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {model?.localModel && (
                        <div className="col-span-2 mb-2 p-2 bg-muted/50 rounded-lg">
                          <p className="font-medium mb-1">Local Deployment:</p>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {model.localModel.size && (
                              <li>• Model Size: {model.localModel.size}</li>
                            )}
                            {model.localModel.requirements?.ram && (
                              <li>• RAM Required: {model.localModel.requirements.ram}</li>
                            )}
                            {model.localModel.requirements?.vram && (
                              <li>• GPU VRAM: {model.localModel.requirements.vram}</li>
                            )}
                            {model.localModel.requirements?.disk && (
                              <li>• Disk Space: {model.localModel.requirements.disk}</li>
                            )}
                            {model.localModel.installCommand && (
                              <li className="pt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleDownload(model.localModel)}
                                >
                                  Copy Install Command
                                </Button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-medium">Capabilities:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li
                            className={
                              model.capabilities.webBrowsing
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {model.capabilities.webBrowsing ? "✓" : "✗"} Web
                            Browsing
                          </li>
                          <li
                            className={
                              model.capabilities.imageRecognition
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {model.capabilities.imageRecognition ? "✓" : "✗"}{" "}
                            Image Recognition
                          </li>
                          <li
                            className={
                              model.capabilities.codeGeneration
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {model.capabilities.codeGeneration ? "✓" : "✗"} Code
                            Generation
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Specs:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>
                            Context:{" "}
                            {(model.capabilities.contextLength / 1000).toFixed(
                              1,
                            )}
                            k tokens
                          </li>
                          <li>
                            Cost: $
                            {model.capabilities.costPer1kTokens.toFixed(4)}/1k
                            tokens
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
