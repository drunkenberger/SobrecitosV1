import { supabase } from "./supabase";
import { getUserSettings } from "./supabaseStore";

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiKeyName: string;
  baseUrl?: string;
  models: AIModel[];
}

export interface AIModelCapabilities {
  webBrowsing: boolean;
  imageRecognition: boolean;
  codeGeneration: boolean;
  contextLength: number;
  costPer1kTokens: number;
}

export interface AIModel {
  id: string;
  name: string;
  capabilities: AIModelCapabilities;
  description: string;
  isRecommended?: boolean;
  localModel?: LocalModelInfo;
}

export interface LocalModelInfo {
  size: string;
  downloadUrl: string;
  requirements: {
    ram: string;
    vram?: string;
    disk: string;
  };
  installCommand: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Advanced AI models for comprehensive financial analysis",
    apiKeyName: "OPENAI_API_KEY",
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        isRecommended: true,
        capabilities: {
          webBrowsing: true,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0.005,
        },
        description: "Latest flagship model with superior reasoning, coding, and multimodal capabilities",
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0.00015,
        },
        description: "Cost-effective model with strong performance for most tasks",
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        capabilities: {
          webBrowsing: true,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0.01,
        },
        description: "Previous generation flagship with web browsing and image analysis",
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 8192,
          costPer1kTokens: 0.03,
        },
        description: "Original GPT-4 model with excellent reasoning capabilities",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 16000,
          costPer1kTokens: 0.001,
        },
        description: "Fast and cost-effective for basic financial insights",
      },
    ],
  },

  {
    id: "anthropic",
    name: "Anthropic",
    description: "Constitutional AI models optimized for helpfulness, harmlessness, and honesty",
    apiKeyName: "ANTHROPIC_API_KEY",
    models: [
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        isRecommended: true,
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 200000,
          costPer1kTokens: 0.003,
        },
        description: "Most intelligent model with superior analysis and reasoning for financial data",
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 200000,
          costPer1kTokens: 0.015,
        },
        description: "Top-tier model for complex analysis and detailed financial planning",
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 200000,
          costPer1kTokens: 0.003,
        },
        description: "Balanced model with excellent performance across all financial tasks",
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 200000,
          costPer1kTokens: 0.00025,
        },
        description: "Fast and cost-efficient model for quick financial insights",
      },
    ],
  },

  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's advanced multimodal AI models with strong analytical capabilities",
    apiKeyName: "GEMINI_API_KEY",
    models: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        isRecommended: true,
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 2097152,
          costPer1kTokens: 0.0035,
        },
        description: "Latest Pro model with massive context window for comprehensive financial analysis",
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 1048576,
          costPer1kTokens: 0.00035,
        },
        description: "Fast and efficient model with large context for quick financial insights",
      },
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 32000,
          costPer1kTokens: 0.0005,
        },
        description: "Reliable model for text-based financial analysis and recommendations",
      },
      {
        id: "gemini-pro-vision",
        name: "Gemini Pro Vision",
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 16000,
          costPer1kTokens: 0.00025,
        },
        description: "Specialized for analyzing charts, graphs, and financial documents",
      },
    ],
  },

  {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Run AI models locally for complete privacy and data control",
    apiKeyName: "",
    baseUrl: "http://localhost:11434",
    models: [
      {
        id: "llama3.1:8b",
        name: "Llama 3.1 8B",
        isRecommended: true,
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0,
        },
        description: "Latest Llama model optimized for local deployment with good financial analysis",
        localModel: {
          size: "4.7GB",
          downloadUrl: "https://ollama.com/library/llama3.1",
          requirements: {
            ram: "8GB",
            vram: "6GB",
            disk: "8GB",
          },
          installCommand: "ollama pull llama3.1:8b",
        },
      },
      {
        id: "phi3:mini",
        name: "Phi-3 Mini",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0,
        },
        description: "Compact Microsoft model, efficient for basic financial tasks",
        localModel: {
          size: "2.3GB",
          downloadUrl: "https://ollama.com/library/phi3",
          requirements: {
            ram: "4GB",
            vram: "3GB",
            disk: "4GB",
          },
          installCommand: "ollama pull phi3:mini",
        },
      },
      {
        id: "deepseek-coder",
        name: "DeepSeek Coder",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 16000,
          costPer1kTokens: 0,
        },
        description: "Specialized coding model that can help with financial calculations and analysis",
        localModel: {
          size: "3.8GB",
          downloadUrl: "https://ollama.com/library/deepseek-coder",
          requirements: {
            ram: "8GB",
            vram: "4GB",
            disk: "6GB",
          },
          installCommand: "ollama pull deepseek-coder",
        },
      },
    ],
  },
];

// AI settings interface
export interface AISettings {
  enabled: boolean;
  provider: string;
  model: string;
  apiKeys: Record<string, string>;
  baseUrl?: string;
  autoSelectModel?: boolean;
  temperature?: number;
  maxTokens?: number;
}

// Default AI settings
export const defaultAISettings: AISettings = {
  enabled: false,
  provider: "openai",
  model: "gpt-4o",
  apiKeys: {},
  baseUrl: "",
  autoSelectModel: true,
  temperature: 0.7,
  maxTokens: 2000,
};

// Get AI settings from Supabase
export const getAISettings = async (): Promise<AISettings> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user) {
      return defaultAISettings;
    }

    const { data: settings, error } = await supabase
      .from("ai_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !settings) {
      // Create default settings if they don't exist
      const { error: insertError } = await supabase
        .from("ai_settings")
        .insert({
          user_id: user.id,
          ...defaultAISettings,
        });

      if (insertError) {
        console.error("Error creating AI settings:", insertError);
      }

      return defaultAISettings;
    }

    return {
      enabled: settings.enabled !== undefined ? settings.enabled : defaultAISettings.enabled,
      provider: settings.provider || defaultAISettings.provider,
      model: settings.model || defaultAISettings.model,
      apiKeys: settings.api_keys || defaultAISettings.apiKeys,
      baseUrl: settings.base_url || defaultAISettings.baseUrl,
      autoSelectModel: settings.auto_select_model !== undefined ? settings.auto_select_model : defaultAISettings.autoSelectModel,
      temperature: settings.temperature || defaultAISettings.temperature,
      maxTokens: settings.max_tokens || defaultAISettings.maxTokens,
    };
  } catch (error) {
    console.error("Error getting AI settings:", error);
    return defaultAISettings;
  }
};

// Save AI settings to Supabase
export const saveAISettings = async (settings: AISettings): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user) {
      console.error("No authenticated user to save AI settings for");
      return;
    }

    const { error } = await supabase
      .from("ai_settings")
      .upsert({
        user_id: user.id,
        enabled: settings.enabled,
        provider: settings.provider,
        model: settings.model,
        api_keys: settings.apiKeys,
        base_url: settings.baseUrl,
        auto_select_model: settings.autoSelectModel,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving AI settings:", error);
    }
  } catch (error) {
    console.error("Error in saveAISettings:", error);
  }
};

export const getAIInsights = async (): Promise<string> => {
  const settings = await getAISettings();
  if (!settings.enabled) {
    return "AI insights are not available at the moment. Please configure your AI settings first.";
  }

  const store = JSON.parse(localStorage.getItem("budget_store") || "{}");

  // Analyze the data
  const insights = [
    "Based on your spending patterns:",
    "",
    "🎯 Budget Overview:",
    `- You've spent ${(((store.expenses || []).reduce((sum: number, exp: any) => sum + exp.amount, 0) / store.monthlyBudget) * 100).toFixed(1)}% of your monthly budget`,
    "",
    "💡 Top Spending Categories:",
    ...(store.categories || []).map((cat: any) => {
      const spent = (store.expenses || [])
        .filter((exp: any) => exp.category === cat.name)
        .reduce((sum: number, exp: any) => sum + exp.amount, 0);
      return `- ${cat.name}: ${spent.toLocaleString()} (${((spent / cat.budget) * 100).toFixed(1)}% of budget)`;
    }),
    "",
    "🔍 Recommendations:",
    "- Consider setting up automatic savings for your goals",
    "- Review recurring expenses for potential savings",
    "- Track your daily spending to stay within budget",
  ].join("\n");

  return insights;
};
