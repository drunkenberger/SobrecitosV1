export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiKeyName: string;
  baseUrl?: string;
}

export interface AIModelCapabilities {
  webBrowsing: boolean;
  imageRecognition: boolean;
  codeGeneration: boolean;
  contextLength: number;
  costPer1kTokens: number;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiKeyName: string;
  baseUrl?: string;
  models: {
    name: string;
    capabilities: AIModelCapabilities;
    description: string;
  }[];
}

export interface AIModel {
  id: string;
  name: string;
  capabilities: AIModelCapabilities;
  description: string;
  isRecommended?: boolean;
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
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        isRecommended: true,
        capabilities: {
          webBrowsing: true,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 128000,
          costPer1kTokens: 0.01,
        },
        description:
          "Most advanced model with web browsing and image analysis capabilities",
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
    id: "ollama",
    name: "Ollama (Local)",
    description: "Run AI models locally for complete privacy",
    apiKeyName: "",
    baseUrl: "http://localhost:11434",
    models: [
      {
        id: "deepseek-8b",
        name: "DeepSeek 8B (Local)",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 8192,
          costPer1kTokens: 0,
        },
        description:
          "Efficient 8B parameter model optimized for local deployment",
        localModel: {
          size: "8GB",
          downloadUrl:
            "https://huggingface.co/deepseek-ai/deepseek-llm-8b-base",
          requirements: {
            ram: "16GB",
            vram: "12GB",
            disk: "16GB",
          },
          installCommand: "ollama pull deepseek-8b",
        },
      },
      {
        id: "llama2",
        name: "Llama 2",
        capabilities: {
          webBrowsing: false,
          imageRecognition: false,
          codeGeneration: true,
          contextLength: 4096,
          costPer1kTokens: 0,
        },
        description: "Open-source model running locally with no data sharing",
      },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's advanced multimodal AI model",
    apiKeyName: "GEMINI_API_KEY",
    models: [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        isRecommended: true,
        capabilities: {
          webBrowsing: false,
          imageRecognition: true,
          codeGeneration: true,
          contextLength: 32000,
          costPer1kTokens: 0.0005,
        },
        description: "Balanced model with image understanding capabilities",
      },
    ],
  },
];

export interface AISettings {
  enabled: boolean;
  provider: string;
  model: string;
  apiKeys: Record<string, string>;
  baseUrl?: string;
  autoSelectModel?: boolean;
}

const AI_SETTINGS_KEY = "budget_ai_settings";

export const getAISettings = (): AISettings => {
  try {
    const stored = localStorage.getItem(AI_SETTINGS_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          enabled: false,
          provider: "openai",
          apiKeys: {},
          model: "gpt-4-turbo",
          baseUrl: "",
        };
  } catch {
    return {
      enabled: false,
      provider: "openai",
      apiKey: "",
      baseUrl: "",
    };
  }
};

export const setAISettings = (settings: AISettings) => {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
};

export const getAIInsights = async (): Promise<string> => {
  const settings = getAISettings();
  if (!settings.enabled || !settings.apiKeys[settings.provider]) {
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
