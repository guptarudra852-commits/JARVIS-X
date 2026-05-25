export type PageId =
  | "home"
  | "about"
  | "features"
  | "dashboard"
  | "assistant"
  | "search"
  | "memory"
  | "automation"
  | "integrations"
  | "voice"
  | "analytics"
  | "pricing"
  | "documentation"
  | "blog"
  | "login"
  | "signup"
  | "contact"
  | "settings"
  | "vaultshield"
  | "bloom";

export interface NavigationItem {
  id: PageId;
  label: string;
  iconName: string;
  category: "core" | "operating" | "services" | "auth";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  groundingSources?: { title: string; url: string }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "CORE" | "ERROR";
  message: string;
}

export interface MemoryCard {
  id: string;
  title: string;
  category: "personal" | "task" | "preference" | "system";
  content: string;
  timestamp: string;
  relevance: number; // 0-100%
  imageUrl?: string;
}

export interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  frequency: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  category: "workspace" | "developer" | "productivity" | "entertainment";
  iconName: string;
}
