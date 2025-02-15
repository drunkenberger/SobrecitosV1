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
} from "lucide-react";
import { getAISettings, AI_PROVIDERS } from "@/lib/ai";
import { AISettingsDialog } from "./AISettingsDialog";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Expense {
  amount: number;
  category: string;
}

export function AIChatWindow() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [minimized, setMinimized] = React.useState(() => {
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
  const selectedProvider = AI_PROVIDERS.find((p) => p.id === settings.provider);

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
          timestamp: new Date(),
        },
      ]);
    }
  }, [settings.enabled, settings.apiKeys, settings.provider]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let response;
      const apiKey = settings.apiKeys[settings.provider];
      const baseUrl = settings.baseUrl || selectedProvider?.baseUrl;

      // Get budget data for context
      const store = JSON.parse(localStorage.getItem("budget_store") || "{}");
      const totalBudget = store.monthlyBudget;
      const spentAmount = (store.expenses || []).reduce(
        (sum: number, exp: Expense) => sum + exp.amount,
        0
      );

      // Use only what's needed for the AI context
      const context = {
        totalBudget,
        spentAmount,
        message: input
      };

      switch (settings.provider) {
        case "openai":
          response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: settings.model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful AI assistant for a budget management app. You help users understand their finances and make better financial decisions. Always provide specific advice based on their actual financial data.",
                },
                {
                  role: "user",
                  content: context,
                },
              ],
              max_tokens: 1000,
            }),
          });
          break;

        case "gemini":
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${settings.model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `You are a helpful AI assistant for a budget management app. Based on the following financial data, provide specific advice and insights:

${context}`,
                      },
                    ],
                  },
                ],
              }),
            },
          );
          break;

        case "ollama":
          response = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: settings.model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful AI assistant for a budget management app. You help users understand their finances and make better financial decisions. Always provide specific advice based on their actual financial data.",
                },
                {
                  role: "user",
                  content: context,
                },
              ],
              stream: false,
            }),
          });
          break;

        default:
          throw new Error("Unsupported AI provider");
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      let aiResponse = "";

      switch (settings.provider) {
        case "openai":
          aiResponse = data.choices[0].message.content;
          break;

        case "gemini":
          aiResponse = data.candidates[0].content.parts[0].text;
          break;
        case "ollama":
          aiResponse = data.response;
          break;
      }

      const aiMessage: Message = {
        id: Math.random().toString(36).substring(7),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            text: `Error: ${error.message}. Please check your AI settings and try again.`,
            sender: "ai",
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            text: "An unknown error occurred. Please try again.",
            sender: "ai",
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className={`fixed bottom-4 right-4 w-[400px] ${minimized ? "h-[60px]" : "h-[500px]"} shadow-xl transition-all duration-300 ease-in-out z-50 bg-background`}>
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
                <ScrollArea className="flex-1 p-4 h-[330px]" ref={scrollRef}>
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
                            {message.timestamp.toLocaleTimeString()}
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

                <div className="p-4 border-t">
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
          const newSettings = getAISettings();
          if (newSettings.enabled && messages.length === 0) {
            setMessages([
              {
                id: "welcome",
                text: "👋 Hello! I'm your AI financial assistant. I can help you analyze your budget, track expenses, and provide personalized financial advice. Feel free to ask me anything about your finances!",
                sender: "ai",
                timestamp: new Date(),
              },
            ]);
          }
        }}
      />
    </>
  );
}