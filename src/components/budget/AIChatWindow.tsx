import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Send,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Image,
  Globe,
  Settings,
  Paperclip,
} from "lucide-react";
import { getAISettings, AI_PROVIDERS, setAISettings } from "@/lib/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AISettingsDialog } from "./AISettingsDialog";
import { ErrorBoundary } from "../ErrorBoundary";
import { getStore } from "@/lib/store";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface Income {
  amount: number;
}

interface Expense {
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
}

interface Category {
  name: string;
  budget: number;
  isRecurring: boolean;
}

interface SavingsGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface FuturePayment {
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  model?: string;
  messages: ChatMessage[];
  [key: string]: any;
}

export function AIChatWindow() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [minimized, setMinimized] = React.useState(() => {
    // Get minimized state from localStorage, default to true (minimized)
    const saved = localStorage.getItem("ai_chat_minimized");
    return saved === null ? true : saved === "true";
  });
  
  const handleMinimize = () => {
    const newState = !minimized;
    setMinimized(newState);
    localStorage.setItem("ai_chat_minimized", newState.toString());
  };

  const [loading, setLoading] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const settings = getAISettings();
  const apiKey = settings.apiKeys[settings.provider];
  const baseUrl = settings.baseUrl || ""; // Add default empty string
  const selectedProvider = AI_PROVIDERS.find((p) => p.id === settings.provider);
  const selectedModel = selectedProvider?.models.find(
    (m) => m.id === settings.model,
  );

  // Show settings dialog if AI is not configured
  React.useEffect(() => {
    // Only show settings dialog automatically on first load if AI was previously enabled
    if (settings.enabled && !settings.apiKeys[settings.provider]) {
      setShowSettings(true);
    }
  }, [settings.enabled, settings.apiKeys, settings.provider]);

  React.useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Welcome message
  React.useEffect(() => {
    if (settings.enabled && settings.apiKeys[settings.provider] && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "👋 Hello! I'm your AI financial assistant. I can help you analyze your budget, track expenses, and provide personalized financial advice. Feel free to ask me anything about your finances!",
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [settings.enabled, settings.apiKeys, settings.provider]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
  
    // Create and add user message first
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input; // Store current input
    setInput(""); // Clear input
    setLoading(true);

    try {
      // Get actual financial data from the store
      const store = getStore();
      const financialData = {
        monthlyBudget: store.monthlyBudget,
        expenses: store.expenses,
        categories: store.categories,
        savingsGoals: store.savingsGoals,
        futurePayments: store.futurePayments,
        incomes: store.incomes
      };

      // Create context string with real data
      const context = `User message: ${currentInput}\n\nAvailable financial data: ${JSON.stringify(
        financialData,
        null,
        2
      )}`;

      console.log('AI Provider:', settings.provider);
      console.log('Selected Model:', settings.model);
      console.log('Base URL:', baseUrl);
      console.log('API Key exists:', Boolean(apiKey));

      let apiEndpoint = '';
      let requestBody: RequestBody;

      // Format request body based on provider
      if (settings.provider === "gemini") {
        requestBody = {
          contents: [{
            parts: [{
              text: messages.map(msg => 
                `${msg.sender === "user" ? "Human" : "Assistant"}: ${msg.text}`
              ).join('\n') + `\nHuman: ${context}`
            }]
          }]
        };
      } else {
        requestBody = {
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for a budget management app. You help users understand their finances and make better financial decisions. Always provide specific advice based on their actual financial data."
            } as ChatMessage,
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            } as ChatMessage)),
            {
              role: "user",
              content: context
            } as ChatMessage
          ]
        };

        if (settings.provider === "openai") {
          requestBody.model = settings.model;
        }
      }

      switch (settings.provider) {
        case "openai":
          apiEndpoint = "https://api.openai.com/v1/chat/completions";
          break;

        case "gemini":
          apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/${settings.model}:generateContent?key=${apiKey}`;
          break;

        case "ollama":
          apiEndpoint = `${baseUrl}/api/chat`;
          break;

        default:
          throw new Error("Unsupported AI provider");
      }

      console.log('Making request to:', apiEndpoint);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (settings.provider === "openai") {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const fetchResponse = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        console.log('Response status:', fetchResponse.status);
        const responseData = await fetchResponse.json();
        console.log('Response data:', JSON.stringify(responseData, null, 2));

        if (!fetchResponse.ok) {
          throw new Error(`API error: ${responseData.error?.message || 'Unknown error'}`);
        }

        let aiMessage = '';
        if (settings.provider === "openai") {
          aiMessage = responseData.choices[0]?.message?.content || '';
        } else if (settings.provider === "gemini") {
          aiMessage = responseData.candidates[0]?.content?.parts[0]?.text || '';
        } else if (settings.provider === "ollama") {
          aiMessage = responseData.message || '';
        }

        if (!aiMessage) {
          throw new Error('No message content in response');
        }

        const assistantMessage: Message = {
          id: Date.now().toString(),
          text: aiMessage,
          sender: "assistant",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  return (
    <ErrorBoundary>
      <Card
        className={`fixed bottom-4 right-4 w-[400px] ${minimized ? "h-[60px]" : "h-[500px]"} shadow-xl transition-all duration-300 ease-in-out z-50 bg-background`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/90"
              onClick={handleMinimize}
            >
              {minimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/90"
              onClick={() => setMessages([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!minimized && (
          <>
            {!settings.enabled || !settings.apiKeys[settings.provider] ? (
              <div className="p-4 text-center space-y-4">
                <p className="text-muted-foreground">
                  AI assistant needs to be configured before use.
                </p>
                <Button onClick={() => setShowSettings(true)}>
                  Configure AI Settings
                </Button>
              </div>
            ) : (
              <>
                <div className="p-2 border-b flex items-center gap-2">
                  <Select
                    value={settings.model}
                    onValueChange={(value) => {
                      const newSettings = { ...settings, model: value };
                      setAISettings(newSettings);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider?.models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea
                  className="flex-1 p-4 h-[330px]"
                  ref={scrollRef}
                  scrollable={true}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <div className="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none">
                            {message.text.split("\n").map((line, i) => (
                              <p key={i} className="mb-1">
                                {line}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t space-y-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 justify-end">
                    {selectedModel?.capabilities.imageRecognition && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Image className="h-4 w-4" />
                      </Button>
                    )}
                    {selectedModel?.capabilities.webBrowsing && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </Card>

      <AISettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={() => {
          setShowSettings(false);
          // Refresh settings after save
          const newSettings = getAISettings();
          if (newSettings.enabled && messages.length === 0) {
            setMessages([
              {
                id: "welcome",
                text: "👋 Hello! I'm your AI financial assistant. I can help you analyze your budget, track expenses, and provide personalized financial advice. Feel free to ask me anything about your finances!",
                sender: "ai",
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        }}
      />
    </ErrorBoundary>
  );
}
