import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "../ui/slider";
import { 
  AlertTriangle, 
  Shield, 
  Zap, 
  Brain, 
  Eye, 
  Code, 
  Globe, 
  DollarSign,
  Download,
  CheckCircle,
  XCircle,
  Info,
  Star,
  Copy,
  Settings
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AI_PROVIDERS, getAISettings, saveAISettings, AISettings, AIProvider, AIModel } from "@/lib/ai";

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
    model: "gpt-4o",
    apiKeys: {},
    baseUrl: "",
    autoSelectModel: true,
    temperature: 0.7,
    maxTokens: 2000
  });
  const [activeTab, setActiveTab] = React.useState("providers");
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  // Reset form when dialog opens
  React.useEffect(() => {
    const loadSettings = async () => {
      if (open) {
        const currentSettings = await getAISettings();
        setSettings(currentSettings);
        setValidationErrors({});
      }
    };
    loadSettings();
  }, [open]);

  const validateApiKey = (provider: string, apiKey: string): boolean => {
    if (!apiKey) return false;
    
    switch (provider) {
      case "openai":
        return apiKey.startsWith("sk-") && apiKey.length > 20;
      case "anthropic":
        return apiKey.startsWith("sk-ant-") && apiKey.length > 20;
      case "gemini":
        return apiKey.length > 20; // Google API keys are typically 39 characters
      case "ollama":
        return true; // Local model, no API key needed
      default:
        return false;
    }
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    
    if (settings.enabled) {
      const selectedProvider = AI_PROVIDERS.find(p => p.id === settings.provider);
      if (selectedProvider?.apiKeyName) {
        const apiKey = settings.apiKeys[settings.provider];
        if (!validateApiKey(settings.provider, apiKey || "")) {
          errors[settings.provider] = `Invalid ${selectedProvider.name} API key format`;
        }
      }
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      await saveAISettings(settings);
      onSave(settings);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    // You could add a toast notification here
  };

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === settings.provider);
  const selectedModel = selectedProvider?.models.find(m => m.id === settings.model);

  const CapabilityIcon = ({ capability, enabled }: { capability: string, enabled: boolean }) => {
    const icons = {
      webBrowsing: Globe,
      imageRecognition: Eye,
      codeGeneration: Code,
    };
    const Icon = icons[capability as keyof typeof icons] || Info;
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    );
  };

  const ModelCard = ({ model, provider }: { model: AIModel, provider: AIProvider }) => (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      settings.model === model.id ? 'ring-2 ring-primary' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {model.name}
            {model.isRecommended && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Recommended
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            {model.capabilities.costPer1kTokens === 0 ? 'Free' : `$${model.capabilities.costPer1kTokens}/1k`}
          </div>
        </div>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capabilities */}
        <div>
          <Label className="text-sm font-medium">Capabilities</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <CapabilityIcon capability="webBrowsing" enabled={model.capabilities.webBrowsing} />
                    <span className="text-xs">Web</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Web Browsing</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <CapabilityIcon capability="imageRecognition" enabled={model.capabilities.imageRecognition} />
                    <span className="text-xs">Vision</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Image Recognition</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <CapabilityIcon capability="codeGeneration" enabled={model.capabilities.codeGeneration} />
                    <span className="text-xs">Code</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Code Generation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Context Length</Label>
            <div className="font-medium">{(model.capabilities.contextLength / 1000).toFixed(0)}k tokens</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Cost</Label>
            <div className="font-medium">
              {model.capabilities.costPer1kTokens === 0 ? 'Free' : `$${model.capabilities.costPer1kTokens.toFixed(4)}/1k`}
            </div>
          </div>
        </div>

        {/* Local Model Info */}
        {model.localModel && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1">
              <Download className="h-3 w-3" />
              Local Deployment
            </Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Size: {model.localModel.size}</div>
              <div>RAM: {model.localModel.requirements.ram}</div>
              {model.localModel.requirements.vram && (
                <div>VRAM: {model.localModel.requirements.vram}</div>
              )}
              <div>Disk: {model.localModel.requirements.disk}</div>
            </div>
            {model.localModel.installCommand && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleCopyCommand(model.localModel!.installCommand)}
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy Install Command
              </Button>
            )}
          </div>
        )}

        {/* Select Model Button */}
        <Button
          variant={settings.model === model.id ? "default" : "outline"}
          className="w-full"
          onClick={() => setSettings({ ...settings, model: model.id })}
        >
          {settings.model === model.id ? "Selected" : "Select Model"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {/* Providers Tab */}
            <TabsContent value="providers" className="h-full">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Enable AI Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        AI Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ai-enabled" className="text-base">Enable AI Features</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow AI to analyze your financial data and provide insights
                          </p>
                        </div>
                        <Switch
                          id="ai-enabled"
                          checked={settings.enabled}
                          onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
                        />
                      </div>
                      
                      {settings.enabled && (
                        <Alert className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Your financial data will be processed by the selected AI provider. 
                            Ensure you trust the provider and understand their privacy policy.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {settings.enabled && (
                    <>
                      {/* Provider Selection */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Select AI Provider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4">
                            {AI_PROVIDERS.map((provider) => (
                              <Card
                                key={provider.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  settings.provider === provider.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => {
                                  setSettings({ 
                                    ...settings, 
                                    provider: provider.id,
                                    model: provider.models[0]?.id || settings.model
                                  });
                                }}
                              >
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center justify-between">
                                    <span>{provider.name}</span>
                                    {settings.provider === provider.id && (
                                      <Badge variant="default">Selected</Badge>
                                    )}
                                  </CardTitle>
                                  <CardDescription>{provider.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{provider.models.length} models available</span>
                                    {provider.id === "ollama" && (
                                      <Badge variant="secondary" className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Local
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* API Key Input */}
                          {selectedProvider?.apiKeyName && (
                            <div className="space-y-2">
                              <Label htmlFor="api-key">
                                {selectedProvider.name} API Key
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="api-key"
                                type="password"
                                value={settings.apiKeys[settings.provider] || ""}
                                onChange={(e) => {
                                  setSettings({
                                    ...settings,
                                    apiKeys: {
                                      ...settings.apiKeys,
                                      [settings.provider]: e.target.value
                                    }
                                  });
                                  // Clear validation error when user types
                                  if (validationErrors[settings.provider]) {
                                    setValidationErrors({
                                      ...validationErrors,
                                      [settings.provider]: ""
                                    });
                                  }
                                }}
                                placeholder={`Enter your ${selectedProvider.name} API key`}
                                className={validationErrors[settings.provider] ? "border-red-500" : ""}
                              />
                              {validationErrors[settings.provider] && (
                                <p className="text-sm text-red-500">{validationErrors[settings.provider]}</p>
                              )}
                            </div>
                          )}

                          {/* Base URL for local models */}
                          {selectedProvider?.baseUrl && (
                            <div className="space-y-2">
                              <Label htmlFor="base-url">Base URL</Label>
                              <Input
                                id="base-url"
                                type="text"
                                value={settings.baseUrl || selectedProvider.baseUrl}
                                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                                placeholder="Enter base URL"
                              />
                              <p className="text-xs text-muted-foreground">
                                Default: {selectedProvider.baseUrl}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Models Tab */}
            <TabsContent value="models" className="h-full">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {settings.enabled && selectedProvider ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedProvider.name} Models</h3>
                          <p className="text-sm text-muted-foreground">
                            Choose the model that best fits your needs
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="auto-select"
                            checked={settings.autoSelectModel}
                            onCheckedChange={(autoSelectModel) => 
                              setSettings({ ...settings, autoSelectModel })
                            }
                          />
                          <Label htmlFor="auto-select" className="text-sm">
                            Auto-select best model
                          </Label>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {selectedProvider.models.map((model) => (
                          <ModelCard key={model.id} model={model} provider={selectedProvider} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="flex items-center justify-center h-32">
                        <p className="text-muted-foreground">
                          Please enable AI features and select a provider first
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="h-full">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {settings.enabled ? (
                    <>
                      {/* Temperature Setting */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Model Parameters</CardTitle>
                          <CardDescription>
                            Fine-tune how the AI responds to your queries
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="temperature">
                                Temperature: {settings.temperature}
                              </Label>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Precise</span>
                                <span>Creative</span>
                              </div>
                            </div>
                            <Slider
                              id="temperature"
                              min={0}
                              max={1}
                              step={0.1}
                              value={[settings.temperature || 0.7]}
                              onValueChange={(value) => 
                                setSettings({ ...settings, temperature: value[0] })
                              }
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                              Lower values make responses more focused and deterministic. 
                              Higher values increase creativity and randomness.
                            </p>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label htmlFor="max-tokens">Max Tokens: {settings.maxTokens}</Label>
                            <Slider
                              id="max-tokens"
                              min={100}
                              max={4000}
                              step={100}
                              value={[settings.maxTokens || 2000]}
                              onValueChange={(value) => 
                                setSettings({ ...settings, maxTokens: value[0] })
                              }
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                              Maximum number of tokens in AI responses. Higher values allow longer responses but cost more.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Current Model Info */}
                      {selectedModel && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Current Configuration</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-xs text-muted-foreground">Provider</Label>
                                <div className="font-medium">{selectedProvider?.name}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Model</Label>
                                <div className="font-medium">{selectedModel.name}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Context Length</Label>
                                <div className="font-medium">{selectedModel.capabilities.contextLength.toLocaleString()} tokens</div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Cost per 1k tokens</Label>
                                <div className="font-medium">
                                  {selectedModel.capabilities.costPer1kTokens === 0 
                                    ? 'Free' 
                                    : `$${selectedModel.capabilities.costPer1kTokens.toFixed(4)}`
                                  }
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card>
                      <CardContent className="flex items-center justify-center h-32">
                        <p className="text-muted-foreground">
                          Please enable AI features first
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {settings.enabled && selectedProvider && (
              <>
                {selectedProvider.name} • {selectedModel?.name || 'No model selected'}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!settings.enabled}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
