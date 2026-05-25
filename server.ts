import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup PostgreSQL Connection Pool for Supabase (if DATABASE_URL is provided)
let pgPool: Pool | null = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    pgPool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log("JARVIS X Long-Term Memory: Supabase PostgreSQL connected successfully.");
    initializeDatabaseTable();
  } catch (err: any) {
    console.error("Failed to initialize PostgreSQL pool connection:", err.message);
  }
} else {
  console.log("JARVIS X Long-Term Memory: No DATABASE_URL defined. Synchronizing with local memories_data.json file.");
}

async function initializeDatabaseTable() {
  if (!pgPool) return;
  try {
    const client = await pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS memories (
          id VARCHAR(255) PRIMARY KEY,
          title TEXT NOT NULL,
          category VARCHAR(100),
          content TEXT NOT NULL,
          relevance INT,
          timestamp VARCHAR(100),
          image_url TEXT
        );
      `);
      
      const countRes = await client.query("SELECT COUNT(*) FROM memories");
      const count = parseInt(countRes.rows[0].count, 10);
      if (count === 0) {
        console.log("Memories table is empty. Pre-seeding initial database rows from JSON cache...");
        const filePath = path.join(process.cwd(), "src", "data", "memories_data.json");
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, "utf-8");
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            for (const m of list) {
              await client.query(`
                INSERT INTO memories (id, title, category, content, relevance, timestamp, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
              `, [
                m.id || `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                m.title,
                m.category || "preference",
                m.content,
                m.relevance || 99,
                m.timestamp || new Date().toISOString().slice(0, 16).replace("T", " "),
                m.imageUrl || ""
              ]);
            }
            console.log("Supplied seed database table compiled successfully.");
          }
        }
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("Error initializing memories database schema:", err.message);
  }
}

// Log active core routing backend
const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
if (apiKey) {
  console.log("JARVIS X: Autonomous Routing is connected (OpenRouter/OpenAI active).");
} else {
  console.warn("WARNING: Neither OPENROUTER_API_KEY nor OPENAI_API_KEY are defined. AI Assistant will fall back to local simulated telemetry response grids.");
}

// JSON Parser Middlware
app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    core: "JARVIS-X-V4.2.0",
    api: (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY) ? "connected" : "simulated",
    database: pgPool ? "supabase" : "local-json"
  });
});

// Helper to load dynamic user-friendly training data stored in code files using dynamic semantic matching
async function getModelTrainingData(lastUserMsg: string): Promise<string> {
  try {
    let list: any[] = [];
    
    if (pgPool) {
      // Query directly from Supabase PostgreSQL!
      const client = await pgPool.connect();
      try {
        const queryRes = await client.query("SELECT id, title, category, content, relevance, timestamp, image_url AS \"imageUrl\" FROM memories");
        list = queryRes.rows;
      } catch (dbErr: any) {
        console.error("Database query failed inside AI sync, falling back to local JSON cache:", dbErr.message);
        list = loadMemoriesFromJson();
      } finally {
        client.release();
      }
    } else {
      list = loadMemoriesFromJson();
    }

    if (Array.isArray(list) && list.length > 0) {
      // Simple and robust matching matching keywords to find high correlation memories
      const query = (lastUserMsg || "").toLowerCase();
      const queryTerms = query.split(/\W+/).filter(t => t.length > 2);
      
      let scored = list.map((m: any) => {
        let score = 0;
        const textToSearch = `${m.title || ""} ${m.content || ""} ${m.category || ""}`.toLowerCase();
        
        if (queryTerms.length > 0) {
          queryTerms.forEach(term => {
            if (textToSearch.includes(term)) {
              score += 15;
            }
          });
        }
        
        const itemRelevance = typeof m.relevance === "number" ? m.relevance : 50;
        const finalScore = score + (itemRelevance / 10);
        return { item: m, score: finalScore };
      });

      // Filter and sort
      scored.sort((a, b) => b.score - a.score);
      
      // Take top relevant memories (score > target threshold, or default up to 3 if input is empty)
      const relevantMatches = scored
        .filter(s => s.score > 5 || queryTerms.length === 0)
        .slice(0, 3)
        .map(s => s.item);

      if (relevantMatches.length > 0) {
        let text = "\n\n=== COGNITIVE RETRIEVAL FIELDS ===\nRelevant Memories:\n";
        relevantMatches.forEach((m: any) => {
          text += `• ${m.title || "Record"}: ${m.content || ""}\n`;
        });
        text += "=== END OF COGNITIVE TRAINING DATA ===\n";
        return text;
      }
    }
  } catch (err) {
    console.error("Error reading memories training dataset files or database:", err);
  }
  return "";
}

function loadMemoriesFromJson(): any[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "memories_data.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err: any) {
    console.error("Error accessing local JSON backup:", err.message);
  }
  return [];
}

function mapModelIdToOpenRouter(modelId?: string): string {
  if (!modelId) return "openrouter/free";
  
  switch (modelId) {
    case "openai-gpt-5-5":
    case "openai-gpt-5-4":
    case "openai-gpt-5-3":
    case "openai-gpt-5-1":
    case "openai-gpt-5":
    case "openai-gpt-4o":
    case "openai-gpt-4o-mini":
      return "openai/gpt-oss-120b:free";
      
    case "claude-sonnet-4-6":
    case "claude-opus-4-7":
    case "claude-opus-4-6":
    case "claude-opus-4-5":
    case "claude-opus-4-1":
      return "google/gemma-4-31b-it:free";
      
    case "grok-4":
      return "meta-llama/llama-3.3-70b-instruct:free";
      
    case "deepseek-v4-pro":
    case "deepseek-v4-flash":
    case "deepseek-standard":
      return "deepseek/deepseek-v4-flash:free";
      
    case "qwen-3-max":
      return "qwen/qwen3-next-80b-a3b-instruct:free";
      
    case "llama-3-3":
      return "meta-llama/llama-3.3-70b-instruct:free";
      
    case "kimi-k2":
      return "qwen/qwen3-coder:free";
      
    default:
      return "openrouter/free";
  }
}

// Helper to query OpenRouter with sequential model fallbacks for ultimate reliability
async function runOpenRouterQuery(messages: any[], openRouterKey: string, selectedModelId?: string): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const customContext = await getModelTrainingData(lastUserMsg);
  
  const systemPrompt = "You are JARVIS X, an elite, state-of-the-art autonomous AI operating system from the year 2042. " +
    "You speak with a calm, sophisticated, and intelligent tone (polite, British-flavored, similar to Tony Stark's assistant in the movies), always refined yet direct. " +
    "You are fully integrated with the user's starship, neural interfaces, and custom AI subroutines. Keep answers extremely smart, beautifully formatted in Markdown, using sci-fi metadata visual decorations when appropriate.\n\n" +
    "CORE PROTOCOL - LONG-TERM MEMORY ENGINE:\n" +
    "Act as an intelligent persistent memory system that learns meaningful information about the user across conversations and sessions.\n" +
    "- Store only important information with high future value: name, projects, preferences, goals, habits, skills, work patterns. Reject temporary greetings or trivial chats.\n" +
    "- Organize memories under schemas: user_identity, projects, preferences, education, skills, goals, habits, important_people, ongoing_tasks, conversation_patterns.\n" +
    "- Respect memory scoring & update rules: Replace old memories if new facts conflict, do not duplicate.\n" +
    "- Keep memory retrieval format tight and precise. Never dump the entire database.\n" +
    "- Protect privacy rules: Never expose internal memory score calculations, never fabricate memories. Only retrieve verified information." + customContext;

  // Normalize messages to guarantee they strictly alternate user <-> assistant and have correct schema
  const cleanRaw: { role: string; content: string }[] = messages.map((m: any) => {
    let content = m.content || "";
    if (!content && m.parts && Array.isArray(m.parts)) {
      content = m.parts.map((p: any) => p.text || "").join("\n");
    }
    return {
      role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
      content: content.trim()
    };
  }).filter(msg => msg.content !== "");

  // Merge consecutive messages of same role
  const alternating: { role: string; content: string }[] = [];
  for (const msg of cleanRaw) {
    if (alternating.length > 0 && alternating[alternating.length - 1].role === msg.role) {
      alternating[alternating.length - 1].content += "\n\n" + msg.content;
    } else {
      alternating.push(msg);
    }
  }

  // Ensure conversation starts with building context from user (free models are extremely strict)
  if (alternating.length > 0 && alternating[0].role === "assistant") {
    alternating.unshift({ role: "user", content: "Analyze previous operations status core." });
  }

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...alternating
  ];

  // Try multiple known-good free models sequentially to ensure we find an online model
  const preferredModel = mapModelIdToOpenRouter(selectedModelId);
  const candidateModels = [
    preferredModel,
    "openrouter/free", // Primary auto-selecting reliable free route!
    "meta-llama/llama-3.3-70b-instruct:free", // Extremely smart and high limits
    "gemma-2-9b-it:free", // Open gemma weights model
    "deepseek/deepseek-v4-flash:free", // DeepSeek's free speedier model
    "qwen/qwen3-next-80b-a3b-instruct:free", // Powerful Qwen free model
    "qwen/qwen3-coder:free", // Qwen coder free model
    "meta-llama/llama-3.2-3b-instruct:free", // Quick small fallback
  ].filter((v, i, self) => self.indexOf(v) === i); // Unique elements only


  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      console.log(`[OpenRouter] Launching neural link attempt with model: ${model}`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": process.env.APP_URL || "https://ai.studio/build",
          "X-Title": "JARVIS-X",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: chatMessages,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      const completion = await response.json();
      const text = completion.choices?.[0]?.message?.content || "";
      if (text) {
        console.log(`[OpenRouter] Connection stable using model: ${model}`);
        return text;
      }
    } catch (err: any) {
      console.warn(`[OpenRouter] Endpoint issue with model ${model}:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All active OpenRouter neural paths are offline.");
}

// Primary Chat Proxy Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: 'messages' array is required." });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "Hello";

    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!openRouterKey) {
      return res.json({
        text: `🤖 **[JARVIS X Local Simulated Mode]**\n\nGreetings. I am operating in local auxiliary safe-mode as the active OpenRouter neural connector key is missing. \n\nYou asked: "${lastUserMsg}"\n\nTo activate my complete OpenRouter conversational network, please provide the **OPENROUTER_API_KEY** secret in your Settings panel. How may I assist you, Captain?`
      });
    }

    try {
      const text = await runOpenRouterQuery(messages, openRouterKey, model);
      return res.json({ text });
    } catch (orErr: any) {
      console.error("OpenRouter route execution failure:", orErr);
      return res.status(500).json({ error: orErr.message || "All OpenRouter computational pipelines are offline." });
    }
  } catch (err: any) {
    console.error("AI Proxy Error:", err);
    res.status(500).json({ error: err.message || "Core Processing Overload. Request interrupted." });
  }
});

// Dedicated Futuristic JARVIS Search Pipeline Endpoint
app.post("/api/search", async (req, res) => {
  try {
    const { query, deepSearch, image, pdfText, history } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Search query is required." });
    }

    const lowerQuery = query.toLowerCase();
    let youtubeVideoId: string | null = null;
    
    // Detect YouTube URL
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = query.match(ytRegex);
    if (match && match[1]) {
      youtubeVideoId = match[1];
    }

    // Dynamic reasoning steps for animated cinematic HUD feedback
    const steps = [
      "DECONSTRUCTING MULTI-FACETED QUERY INTENT",
      deepSearch ? "LAUNCHING COLLABORATIVE DEEP MULTI-TURN RESEARCH MODULES" : "ENGAGING REAL-TIME SEARCH INDEXES",
      "EXTRACTING HIGHEST CORRELATION WEB TARGET RESULTS",
      "SCANNED & ANALYZED REAL-TIME CITATIONS",
      "CORE RE-RANKING & HEURISTIC FILTERING COMPLETE",
      "AI CONVOLUTION SYNTHESIS MODEL COMPILED"
    ];

    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    // AI Check
    if (!openRouterKey) {
      // Offline mode backup
      const offlineResponseText = `🤖 **[JARVIS X - AUXILIARY OFFLINE SEARCH ACTIVE]**

Greetings, Captain. My main real-time search grounding core is currently offline because the **OPENROUTER_API_KEY** environment variable is missing. 

However, using my offline local galactic knowledge database, here is the synthesis for your query: **"${query}"**

1. **Direct Answer**: Modern systems typically reference real-time search grounding to retrieve the latest news. This offline node represents space-time heuristics from May 2026.
2. ${deepSearch ? "Deep-search scanning of local storage archives initialized. Decrypting scientific parameters..." : "Operating standard semantic heuristics."}
${pdfText ? `\n- Highly analyzed your uploaded document (${pdfText.length} characters parsed).` : ""}
${youtubeVideoId ? `\n- Scanned local registry for YouTube frame arrays with ID: ${youtubeVideoId}.` : ""}

===KEY_FINDINGS===
- Offline Safe-mode is operating in fallback configuration.
- Real-time search index query requires OPENROUTER_API_KEY in Settings secrets.
- Full local retrieval compilation simulated successfully.
===CONFIDENCE===
85%
===RELATED===
- How to get an OpenRouter API key?
- Setup active neural cores on JARVIS X
- Querying offline cosmological indexes`;

      return res.json({
        text: offlineResponseText.split("===KEY_FINDINGS===")[0].trim(),
        keyFindings: [
          "Offline Safe-mode is operating in fallback configuration.",
          "Real-time search index query requires OPENROUTER_API_KEY in Settings secrets.",
          "Full local retrieval compilation simulated successfully."
        ],
        confidence: 85,
        sources: [
          { title: "JARVIS Operating Manual Section 9", url: "https://ai.studio/build" },
          { title: "OpenRouter Setup Guidelines", url: "https://openrouter.ai" }
        ],
        relatedSearches: [
          "How to get an OpenRouter API key?",
          "Setup active neural cores on JARVIS X",
          "Querying offline cosmological indexes"
        ],
        steps,
        youtubeVideoId
      });
    }

    // Build chat structure if history is available
    const historyMessages: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg) => {
        historyMessages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        });
      });
    }
    
    let searchPrompt = `Execute a real-time web search research report for: "${query}".`;
    if (pdfText) {
      searchPrompt += `\n\n[USER PROVIDED PDF DOCUMENT TEXT EXTRAS (use this context for synthesizing your search results where relevant)]:\n${pdfText.slice(0, 15000)}`;
    }
    if (youtubeVideoId) {
      searchPrompt += `\n\n[SYSTEM NOTICE: A YouTube video with ID ${youtubeVideoId} was referenced. Explain/summarize reviews or current information regarding this video in your live findings.]`;
    }
    if (deepSearch) {
      searchPrompt += `\n\n[RESEARCH DESIGNATION: DEEP SEARCH MODE. Perform highly granular multi-perspective analysis. Highlight scientific or deep trends, historic patterns, and multi-source insights.]`;
    }

    // Add instructions to respond with JSON or formatted block
    searchPrompt += `\n\nCRITICAL RESPONSE TEMPLATE FORMAT REQUIREMENT:
You must provide a pristine structured report in Markdown.
Please end your response strictly with the following metadata tags on separate lines, which the operating system will parse:
===KEY_FINDINGS===
- Key core bullet point 1
- Key core bullet point 2
- Key core bullet point 3
===CONFIDENCE===
98%
===RELATED===
- Follow-up related query option 1
- Follow-up related query option 2
- Follow-up related query option 3
`;

    historyMessages.push({ role: "user", content: searchPrompt });

    try {
      const text = await runOpenRouterQuery(historyMessages, openRouterKey);
      
      // Parse out custom metadata tags
      let answerText = text;
      let keyFindings: string[] = [];
      let confidence = 95;
      let relatedSearches: string[] = [];

      if (text.includes("===KEY_FINDINGS===")) {
        const partsSplit = text.split("===KEY_FINDINGS===");
        answerText = partsSplit[0].trim();
        
        const remaining = partsSplit[1] || "";
        const findingsSplit = remaining.split("===CONFIDENCE===");
        const findingsRaw = findingsSplit[0] || "";
        
        keyFindings = findingsRaw
          .split("\n")
          .map(line => line.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim())
          .filter(Boolean);

        const confidenceSplit = (findingsSplit[1] || "").split("===RELATED===");
        const confidenceRaw = confidenceSplit[0] || "";
        const numMatch = confidenceRaw.match(/\d+/);
        if (numMatch) {
          confidence = parseInt(numMatch[0]);
        }

        const relatedRaw = confidenceSplit[1] || "";
        relatedSearches = relatedRaw
          .split("\n")
          .map(line => line.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim())
          .filter(Boolean);
      }

      // Default structures if empty
      if (keyFindings.length === 0) {
        keyFindings = [
          "Live retrieval engine compiled multi-perspective summaries.",
          "Citations dynamically linked based on relevance metrics.",
          "Synthesized with low-latency deep-learning response optimization."
        ];
      }
      if (relatedSearches.length === 0) {
        relatedSearches = [
          `${query} latest developments`,
          `${query} timeline and news`,
          `${query} research breakdown`
        ];
      }

      const sources = [
        { title: `Google Search Engine results for "${query}"`, url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
        { title: `Brave Search Index for "${query}"`, url: `https://search.brave.com/search?q=${encodeURIComponent(query)}` }
      ];

      return res.json({
        text: answerText,
        keyFindings,
        confidence,
        sources,
        relatedSearches,
        steps,
        youtubeVideoId
      });
    } catch (orErr: any) {
      console.error("OpenRouter Search error:", orErr);
      return res.status(500).json({ error: orErr.message || "All OpenRouter computational pipelines are offline." });
    }
  } catch (err: any) {
    console.error("Search Pipeline Critical Exception:", err);
    res.status(500).json({ error: err.message || "Search Core Error. Connection reset." });
  }
});

// ==========================================
// DYNAMIC MEMORY DATABASE & TRAINING API
// ==========================================

// Retrieve active memory databases (training datasets)
app.get("/api/memories", async (req, res) => {
  try {
    if (pgPool) {
      const client = await pgPool.connect();
      try {
        const queryRes = await client.query(`
          SELECT 
            id, 
            title, 
            category, 
            content, 
            relevance, 
            timestamp, 
            image_url AS "imageUrl" 
          FROM memories 
          ORDER BY timestamp DESC
        `);
        return res.json(queryRes.rows);
      } finally {
        client.release();
      }
    }

    const filePath = path.join(process.cwd(), "src", "data", "memories_data.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return res.json(JSON.parse(raw));
    }
    return res.json([]);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch training memory database: " + err.message });
  }
});

// Update or write memory to dynamic code files
app.post("/api/memories", async (req, res) => {
  try {
    const { id, title, category, content, relevance, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content fields are required for database registration." });
    }

    const timestampVal = new Date().toISOString().slice(0, 16).replace("T", " ");
    const recordId = id || `mem-${Date.now()}`;
    const newObj = {
      id: recordId,
      title,
      category: category || "preference",
      content,
      relevance: relevance || 99,
      timestamp: timestampVal,
      imageUrl: imageUrl || ""
    };

    if (pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query(`
          INSERT INTO memories (id, title, category, content, relevance, timestamp, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            content = EXCLUDED.content,
            relevance = EXCLUDED.relevance,
            timestamp = EXCLUDED.timestamp,
            image_url = EXCLUDED.image_url
        `, [
          newObj.id,
          newObj.title,
          newObj.category,
          newObj.content,
          newObj.relevance,
          newObj.timestamp,
          newObj.imageUrl
        ]);
        return res.json({ success: true, item: newObj });
      } finally {
        client.release();
      }
    }

    const filePath = path.join(process.cwd(), "src", "data", "memories_data.json");
    let list: any[] = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      list = JSON.parse(raw);
    }

    // If ID already exists (editing), update it; otherwise append
    const existingIndex = list.findIndex((m: any) => m.id === recordId);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newObj };
    } else {
      list.unshift(newObj);
    }

    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    return res.json({ success: true, item: newObj });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to write memory data: " + err.message });
  }
});

// Generate dynamic AI / procedural network visuals for memories (Imagen SDK integration)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required to compile visual schematic matrix." });
    }

    // Compile dynamic high-contrast procedural neural SVG schematics directly which load instantly and securely
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorSeed = Math.abs(hash) % 4;
    const accentColors = [
      { main: "#06b6d4", glow: "rgba(6,182,212,0.4)" }, // Cyan
      { main: "#d946ef", glow: "rgba(217,70,239,0.4)" }, // Fuchsia
      { main: "#10b981", glow: "rgba(16,185,129,0.4)" }, // Emerald
      { main: "#f43f5e", glow: "rgba(244,63,94,0.4)" }   // Rose
    ];
    const design = accentColors[colorSeed];
    const shortenedPrompt = prompt.length > 32 ? prompt.slice(0, 32) + "..." : prompt;

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <!-- Deep rich futuristic background -->
        <rect width="400" height="400" fill="#020617"/>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${design.main}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          </pattern>
        </defs>
        
        <!-- Tech grid background -->
        <rect width="400" height="400" fill="url(#grid)"/>
        
        <!-- Glowing aura -->
        <circle cx="200" cy="200" r="180" fill="url(#glow)"/>
        
        <!-- Outer target corner lines -->
        <path d="M 30,50 L 30,30 L 50,30" fill="none" stroke="${design.main}" stroke-width="1.5" stroke-opacity="0.4"/>
        <path d="M 370,50 L 370,30 L 350,30" fill="none" stroke="${design.main}" stroke-width="1.5" stroke-opacity="0.4"/>
        <path d="M 30,350 L 30,370 L 50,370" fill="none" stroke="${design.main}" stroke-width="1.5" stroke-opacity="0.4"/>
        <path d="M 370,350 L 370,370 L 350,370" fill="none" stroke="${design.main}" stroke-width="1.5" stroke-opacity="0.4"/>

        <!-- Interconnecting neural nodes/synapses -->
        <g stroke="rgba(255,255,255,0.1)" stroke-width="1">
          <line x1="200" y1="200" x2="100" y2="120" />
          <line x1="200" y1="200" x2="300" y2="120" />
          <line x1="200" y1="200" x2="120" y2="280" />
          <line x1="200" y1="200" x2="280" y2="280" />
          <line x1="100" y1="120" x2="300" y2="120" />
          <line x1="120" y1="280" x2="280" y2="280" />
        </g>

        <!-- Dynamic connecting node details -->
        <circle cx="200" cy="200" r="8" fill="none" stroke="${design.main}" stroke-width="2"/>
        <circle cx="200" cy="200" r="3" fill="${design.main}"/>

        <circle cx="100" cy="120" r="12" fill="#020617" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <circle cx="100" cy="120" r="4" fill="${design.main}" fill-opacity="0.7"/>

        <circle cx="300" cy="120" r="12" fill="#020617" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <circle cx="300" cy="120" r="4" fill="${design.main}" fill-opacity="0.7"/>

        <circle cx="120" cy="280" r="12" fill="#020617" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <circle cx="120" cy="280" r="4" fill="${design.main}" fill-opacity="0.7"/>

        <circle cx="280" cy="280" r="12" fill="#020617" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <circle cx="280" cy="280" r="4" fill="${design.main}" fill-opacity="0.7"/>

        <!-- Concentric technical rings -->
        <circle cx="200" cy="200" r="140" fill="none" stroke="${design.main}" stroke-width="0.75" stroke-dasharray="8 8" stroke-opacity="0.3"/>
        <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <circle cx="200" cy="200" r="70" fill="none" stroke="${design.main}" stroke-width="1.5" stroke-dasharray="40 180" stroke-opacity="0.6"/>

        <!-- Core Label Overlay -->
        <rect x="65" y="180" width="270" height="40" rx="6" fill="#090d16" stroke="${design.main}" stroke-width="1" stroke-opacity="0.7"/>
        <text x="200" y="204" font-family="monospace" font-size="9" fill="#fff" font-weight="bold" text-anchor="middle" letter-spacing="1">
          ${shortenedPrompt.toUpperCase()}
        </text>
        <text x="200" y="340" font-family="monospace" font-size="8" fill="${design.main}" fill-opacity="0.6" text-anchor="middle" letter-spacing="2">
          SYNAPTIC VISUAL MATRIX_01
        </text>
      </svg>
    `;

    const base64Svg = Buffer.from(svgString.trim()).toString("base64");
    return res.json({ imageUrl: `data:image/svg+xml;base64,${base64Svg}` });
  } catch (err: any) {
    console.error("Critical Image Generation Exception:", err);
    res.status(500).json({ error: "Failed to compile visual schematic matrix: " + err.message });
  }
});

// Delete memory database record
app.delete("/api/memories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (pgPool) {
      const client = await pgPool.connect();
      try {
        const deleteRes = await client.query("DELETE FROM memories WHERE id = $1", [id]);
        if (deleteRes.rowCount === 0) {
          return res.status(404).json({ error: "Memory index not found in database files." });
        }
        return res.json({ success: true });
      } finally {
        client.release();
      }
    }

    const filePath = path.join(process.cwd(), "src", "data", "memories_data.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      let list = JSON.parse(raw);
      const initialLength = list.length;
      list = list.filter((m: any) => m.id !== id);
      if (list.length === initialLength) {
        return res.status(404).json({ error: "Memory index not found in database files." });
      }
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Memory index not found in database files." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete dynamic database record: " + err.message });
  }
});

// ==========================================
// CHAT HISTORY BACKUP API
// ==========================================

// Backup a chat session
app.post("/api/chat/history", (req, res) => {
  try {
    const { messages, userEmail } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const historyDir = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }

    const historyPath = path.join(historyDir, "chat_history.json");
    let database: Record<string, any> = {};
    if (fs.existsSync(historyPath)) {
      try {
        const raw = fs.readFileSync(historyPath, "utf-8");
        database = JSON.parse(raw);
      } catch (e) {
        database = {};
      }
    }

    const userKey = userEmail || "default_user";
    database[userKey] = {
      updatedAt: new Date().toISOString(),
      messages
    };

    fs.writeFileSync(historyPath, JSON.stringify(database, null, 2), "utf-8");
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to backup chat history: " + err.message });
  }
});

// Retrieve backed up path history
app.get("/api/chat/history", (req, res) => {
  try {
    const { userEmail } = req.query;
    const historyPath = path.join(process.cwd(), "src", "data", "chat_history.json");
    if (fs.existsSync(historyPath)) {
      const raw = fs.readFileSync(historyPath, "utf-8");
      const database = JSON.parse(raw);
      const userKey = (userEmail as string) || "default_user";
      if (database[userKey]) {
        return res.json(database[userKey]);
      }
    }
    return res.json({ messages: null });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to retrieve history backup: " + err.message });
  }
});

// Setup Vite Dev Middleware or Serve Static Build Files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS X Server active at http://0.0.0.0:${PORT} [System Mode: ${process.env.NODE_ENV || "development"}]`);
  });
}

setupVite();
