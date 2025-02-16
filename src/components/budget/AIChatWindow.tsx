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

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
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

      // Debug logging
      console.log('AI Provider:', settings.provider);
      console.log('Selected Model:', settings.model);
      console.log('Base URL:', baseUrl);
      console.log('API Key exists:', !!apiKey);

      // Validate API key and base URL
      if (!apiKey && settings.provider !== "ollama") {
        throw new Error(`API key is required for ${selectedProvider?.name}`);
      }

      if (settings.provider === "ollama" && !baseUrl) {
        throw new Error("Base URL is required for Ollama");
      }

      // Get budget data for context
      const store = JSON.parse(localStorage.getItem("budget_store") || "{}");
      
      // Prepare financial data
      const totalBudget = store.monthlyBudget + (store.additionalIncomes as Income[] || []).reduce(
        (sum: number, inc: Income) => sum + inc.amount,
        0
      );
      const spentAmount = (store.expenses as Expense[] || []).reduce(
        (sum: number, exp: Expense) => sum + exp.amount,
        0
      );
      const remainingBalance = totalBudget - spentAmount;
      const additionalIncomesTotal = (store.additionalIncomes as Income[] || []).reduce(
        (sum: number, inc: Income) => sum + inc.amount,
        0
      );

      // Format overview section
      const overview = [
        `Monthly Base Budget: ${store.monthlyBudget?.toLocaleString() || '0'}`,
        `Additional Income: ${additionalIncomesTotal.toLocaleString()}`,
        `Total Monthly Budget: ${totalBudget.toLocaleString()}`,
        `Total Spent: ${spentAmount.toLocaleString()}`,
        `Remaining Balance: ${remainingBalance.toLocaleString()}`
      ].map(line => `• ${line}`).join('\n');

      // Process expenses
      const expenses: Expense[] = (store.expenses || []).map((exp: any): Expense => ({
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        date: new Date(exp.date).toLocaleDateString(),
        isRecurring: exp.isRecurring
      }));

      // Calculate category spending
      const categorySpending = (store.categories as Category[] || []).map((cat: Category) => {
        const spent = expenses
          .filter((exp: Expense) => exp.category === cat.name)
          .reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
        return {
          name: cat.name,
          budget: cat.budget,
          spent,
          isRecurring: cat.isRecurring,
          percentage: ((spent / cat.budget) * 100).toFixed(1)
        };
      });

      // Format category breakdown
      const categoryBreakdown = categorySpending
        .map(cat => 
          `• ${cat.name}${cat.isRecurring ? ' (Recurring)' : ''}\n  Budget: ${cat.budget.toLocaleString()}\n  Spent: ${cat.spent.toLocaleString()} (${cat.percentage}%)`
        )
        .join('\n');

      // Format savings goals
      const savingsGoals = (store.savingsGoals as SavingsGoal[] || []).map(goal => ({
        ...goal,
        progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
      }));

      const savingsSection = savingsGoals.length > 0 
        ? savingsGoals
            .map(goal => 
              `• ${goal.name}\n  Target: ${goal.targetAmount.toLocaleString()}\n  Current: ${goal.currentAmount.toLocaleString()}\n  Progress: ${goal.progress}%\n  Deadline: ${new Date(goal.deadline).toLocaleDateString()}`
            )
            .join('\n')
        : 'No savings goals set';

      // Format upcoming payments
      const futurePayments = (store.futurePayments as FuturePayment[] || [])
        .filter((payment: FuturePayment) => !payment.isPaid)
        .map((payment: FuturePayment) => 
          `• ${payment.description}\n  Amount: ${payment.amount.toLocaleString()}\n  Due: ${new Date(payment.dueDate).toLocaleDateString()}\n  Category: ${payment.category}`
        )
        .join('\n') || 'No upcoming payments';

      // Calculate recent activity
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentExpenses = expenses.filter((exp: Expense) => new Date(exp.date) >= thirtyDaysAgo);
      const recentTotal = recentExpenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

      // Build the complete context
      const context = `Here's your complete financial data. Please provide specific advice based on this information:

💰 Financial Overview
${overview}

📊 Category Breakdown
${categoryBreakdown}

🎯 Savings Goals
${savingsSection}

📅 Upcoming Payments
${futurePayments}

📈 Recent Activity (Last 30 Days)
• Number of Transactions: ${recentExpenses.length}
• Total Recent Spending: ${recentTotal.toLocaleString()}

💱 Currency: ${store.currency?.name || 'US Dollar'} (${store.currency?.symbol || '$'})

❓ User Question: ${input}

Please analyze this data and provide specific, actionable advice. Format your response with clear sections using emojis and bullet points for readability. Consider:
• Budget utilization and overspending risks
• Savings goals progress and recommendations
• Upcoming payment planning
• Spending patterns and areas for improvement
• Long-term financial health suggestions`;

      let apiEndpoint = '';
      let requestBody = {};

      switch (settings.provider) {
        case "openai":
          apiEndpoint = "https://api.openai.com/v1/chat/completions";
          requestBody = {
            model: settings.model,
            messages: [
              {
                role: "system",
                content: "You are a helpful AI assistant for a budget management app. You help users understand their finances and make better financial decisions. Always provide specific advice based on their actual financial data.",
              },
              {
                role: "user",
                content: context,
              },
            ],
            max_tokens: 1000,
          };
          break;

        case "gemini":
          apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/${settings.model}:generateContent?key=${apiKey}`;
          requestBody = {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are a helpful AI assistant for a budget management app. Based on the following financial data, provide specific advice and insights:\n\n${context}`,
                  },
                ],
              },
            ],
          };
          // Remove model from request body for Gemini as it's in the URL
          delete requestBody.model;
          break;

        case "ollama":
          apiEndpoint = `${baseUrl}/api/chat`;
          requestBody = {
            model: settings.model,
            messages: [
              {
                role: "system",
                content: "You are a helpful AI assistant for a budget management app. You help users understand their finances and make better financial decisions. Always provide specific advice based on their actual financial data.",
              },
              {
                role: "user",
                content: context,
              },
            ],
            stream: false,
          };
          break;

        default:
          throw new Error("Unsupported AI provider");
      }

      console.log('Making request to:', apiEndpoint);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Set the Authorization header for OpenAI
        if (settings.provider === 'openai') {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
        // Set base URL for Ollama
        else if (settings.provider === 'ollama' && baseUrl) {
          headers['x-base-url'] = baseUrl;
        }

        // Log the request details (excluding sensitive data)
        console.log('Request details:', {
          url: apiEndpoint.split('?')[0], // Log URL without API key
          method: 'POST',
          headers: { ...headers, Authorization: headers.Authorization ? '[HIDDEN]' : undefined },
          bodyLength: JSON.stringify(requestBody).length,
          provider: settings.provider,
          model: settings.model
        });

        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        console.log('Response details:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
            console.log('Parsed error data:', errorData);
          } catch (e) {
            console.log('Could not parse error response as JSON');
            errorData = null;
          }

          let errorMessage = `API request failed (${response.status}): ${response.statusText}`;
          
          if (errorData) {
            switch (settings.provider) {
              case "openai":
                errorMessage = errorData.error?.message || errorMessage;
                break;
              case "gemini":
                errorMessage = errorData.error?.message || errorMessage;
                break;
              case "ollama":
                errorMessage = errorData.error || errorMessage;
                break;
            }
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Success response:', {
          dataType: typeof data,
          hasChoices: !!data.choices,
          hasCandidates: !!data.candidates,
          hasResponse: !!data.response
        });

        let aiResponse = "";

        switch (settings.provider) {
          case "openai":
            if (!data.choices?.[0]?.message?.content) {
              console.error('Unexpected OpenAI response format:', data);
              throw new Error('Invalid response format from OpenAI');
            }
            aiResponse = data.choices[0].message.content;
            break;
          case "gemini":
            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
              console.error('Unexpected Gemini response format:', data);
              throw new Error('Invalid response format from Gemini');
            }
            aiResponse = data.candidates[0].content.parts[0].text;
            break;
          case "ollama":
            if (!data.response) {
              console.error('Unexpected Ollama response format:', data);
              throw new Error('Invalid response format from Ollama');
            }
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

      } catch (fetchError: any) {
        console.error('Fetch error details:', {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack
        });

        if (fetchError.message.includes('Failed to fetch')) {
          if (fetchError.message.includes('Content Security Policy')) {
            throw new Error(`Connection blocked by security policy. Please check your network settings or try a different AI provider.`);
          } else {
            throw new Error(`Unable to connect to ${settings.provider === "ollama" ? "local Ollama server" : "AI service"}. Please check your connection and ensure your API key is valid.`);
          }
        }

        throw new Error(`Connection error: ${fetchError.message}`);
      }

    } catch (error) {
      console.error("Error getting AI response:", error);
      let errorMessage = "An error occurred while getting the AI response. ";
      
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('security policy')) {
          errorMessage = error.message;
        } else if (error.message.includes('API key')) {
          errorMessage = "Invalid or missing API key. Please check your AI settings.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = `Unable to connect to ${settings.provider === "ollama" ? "local Ollama server" : "AI service"}. Please check your connection and settings.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        text: errorMessage,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  return (
    <>
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
                timestamp: new Date(),
              },
            ]);
          }
        }}
      />
    </>
  );
}
