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

export function AIChatWindow() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [minimized, setMinimized] = React.useState(false);
  const handleMinimize = () => setMinimized((prev) => !prev);
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
    if (!settings.enabled || !settings.apiKeys[settings.provider]) {
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
      const totalBudget = store.monthlyBudget + (store.additionalIncomes || []).reduce(
        (sum, inc) => sum + inc.amount,
        0,
      );
      const spentAmount = (store.expenses || []).reduce(
        (sum, exp) => sum + exp.amount,
        0,
      );
      const remainingBalance = totalBudget - spentAmount;

      // Calculate additional incomes
      const additionalIncomesTotal = (store.additionalIncomes || []).reduce(
        (sum, inc) => sum + inc.amount,
        0
      );

      // Process expenses with dates and categories
      const expenses = (store.expenses || []).map(exp => ({
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        date: new Date(exp.date).toLocaleDateString(),
        isRecurring: exp.isRecurring,
        recurringType: exp.recurringType,
      }));

      // Get recent expenses (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentExpenses = expenses.filter(
        exp => new Date(exp.date) >= thirtyDaysAgo
      );

      // Calculate category spending
      const categorySpending = (store.categories || []).map((cat) => ({
        name: cat.name,
        budget: cat.budget,
        spent: expenses
          .filter((exp) => exp.category === cat.name)
          .reduce((sum, exp) => sum + exp.amount, 0),
        isRecurring: cat.isRecurring,
      }));

      // Process savings goals
      const savingsGoals = (store.savingsGoals || []).map(goal => ({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: new Date(goal.deadline).toLocaleDateString(),
        progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1) + '%'
      }));

      // Process future payments
      const futurePayments = (store.futurePayments || []).map(payment => ({
        description: payment.description,
        amount: payment.amount,
        dueDate: new Date(payment.dueDate).toLocaleDateString(),
        category: payment.category,
        isPaid: payment.isPaid
      }));

      // Calculate recurring expenses total
      const recurringExpensesTotal = expenses
        .filter(exp => exp.isRecurring)
        .reduce((sum, exp) => sum + exp.amount, 0);

      const context = `Here's your complete financial data. Please provide specific advice based on this information:

💰 Financial Overview
• Monthly Base Budget: ${store.monthlyBudget.toLocaleString()}
• Additional Income: ${additionalIncomesTotal.toLocaleString()}
• Total Monthly Budget: ${totalBudget.toLocaleString()}
• Total Spent: ${spentAmount.toLocaleString()}
• Remaining Balance: ${remainingBalance.toLocaleString()}
• Recurring Expenses: ${recurringExpensesTotal.toLocaleString()}

📊 Category Breakdown
${categorySpending
  .map(
    (cat) => `• ${cat.name}${cat.isRecurring ? ' (Recurring)' : ''}
  Budget: ${cat.budget.toLocaleString()}
  Spent: ${cat.spent.toLocaleString()} (${((cat.spent / cat.budget) * 100).toFixed(1)}%)`
  )
  .join("\n")}

🎯 Savings Goals
${savingsGoals.length > 0 ? savingsGoals
  .map(
    (goal) => `• ${goal.name}
  Target: ${goal.targetAmount.toLocaleString()}
  Current: ${goal.currentAmount.toLocaleString()}
  Progress: ${goal.progress}
  Deadline: ${goal.deadline}`
  )
  .join("\n") : "No savings goals set"}

📅 Upcoming Payments
${futurePayments.length > 0 ? futurePayments
  .filter(payment => !payment.isPaid)
  .map(
    (payment) => `• ${payment.description}
  Amount: ${payment.amount.toLocaleString()}
  Due: ${payment.dueDate}
  Category: ${payment.category}`
  )
  .join("\n") : "No upcoming payments"}

📈 Recent Activity (Last 30 Days)
• Number of Transactions: ${recentExpenses.length}
• Total Recent Spending: ${recentExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}

💱 Currency: ${store.currency?.name || 'US Dollar'} (${store.currency?.symbol || '$'})

❓ User Question: ${input}

Please analyze this data and provide specific, actionable advice. Format your response with clear sections using emojis and bullet points for readability. Consider:
• Budget utilization and overspending risks
• Savings goals progress and recommendations
• Upcoming payment planning
• Spending patterns and areas for improvement
• Long-term financial health suggestions`;

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
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        text: `Error: ${error.message}. Please check your AI settings and try again.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
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
