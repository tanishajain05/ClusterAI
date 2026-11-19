import { uid } from '@utils/format'

export const MOCK_USER = {
  uid: 'mock-uid-001',
  name: 'Tanisha Jain',
  email: 'tanisha@clusterai.dev',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanisha',
  role: 'user',
}

export const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter', credits: 100,  priceINR: 99,  popular: false, description: 'Perfect for trying out ClusterAI' },
  { id: 'pro',     name: 'Pro',     credits: 500,  priceINR: 399, popular: true,  description: 'Best value for regular use' },
  { id: 'max',     name: 'Max',     credits: 1500, priceINR: 999, popular: false, description: 'Power users and teams' },
]

export const AGENT_PRICES = {
  chat:    { label: 'Chat message',    credits: 2 },
  coding:  { label: 'Code generation', credits: 5 },
  search:  { label: 'Web search',      credits: 3 },
  pdf:     { label: 'PDF report',      credits: 15 },
  ppt:     { label: 'PPT deck',        credits: 20 },
  image:   { label: 'AI image',        credits: 8 },
}

const now = Date.now()
export const MOCK_TRANSACTIONS = [
  { id: uid(), type: 'bonus',    amount: 100, balanceAfter: 100, reference: 'BONUS-WELCOME', note: 'Welcome bonus credits', createdAt: new Date(now - 86400000 * 5).toISOString() },
  { id: uid(), type: 'usage',    amount: -2,  balanceAfter: 98,  reference: 'AGT-CHAT-001',  note: 'Chat: General query',   createdAt: new Date(now - 86400000 * 4).toISOString() },
  { id: uid(), type: 'usage',    amount: -5,  balanceAfter: 93,  reference: 'AGT-CODE-001',  note: 'Code: pricing page',    createdAt: new Date(now - 86400000 * 3).toISOString() },
  { id: uid(), type: 'purchase', amount: 500, balanceAfter: 593, reference: 'RZP-ORDER-001', note: 'Pro pack purchase',     createdAt: new Date(now - 86400000 * 2).toISOString() },
  { id: uid(), type: 'usage',    amount: -15, balanceAfter: 578, reference: 'AGT-DOC-001',   note: 'PDF: AI report',        createdAt: new Date(now - 86400000 * 1).toISOString() },
]

export const MOCK_ASSETS = [
  { id: uid(), name: 'AI-Market-Report.pdf', type: 'pdf',   size: 245000, creditsUsed: 15, agentType: 'docmedia', createdAt: new Date(now - 86400000 * 3).toISOString(), url: '#' },
  { id: uid(), name: 'ClusterAI-Pitch.pptx', type: 'ppt',   size: 512000, creditsUsed: 20, agentType: 'docmedia', createdAt: new Date(now - 86400000 * 2).toISOString(), url: '#' },
  { id: uid(), name: 'futuristic-city.png',  type: 'image', size: 189000, creditsUsed: 8,  agentType: 'docmedia', createdAt: new Date(now - 86400000 * 1).toISOString(), url: 'https://picsum.photos/seed/city/800/600' },
  { id: uid(), name: 'pricing-page.html',    type: 'code',  size: 12000,  creditsUsed: 5,  agentType: 'coding',   createdAt: new Date(now - 3600000).toISOString(),       url: '#' },
]

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-001', title: 'What is LangChain?', agentType: 'chat', pinned: true,
    createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 3600000).toISOString(),
    messages: [
      { id: uid(), role: 'user',      content: 'What is LangChain?', createdAt: new Date(now - 3700000).toISOString() },
      { id: uid(), role: 'assistant', content: '**LangChain** is an open-source framework for building applications powered by large language models (LLMs).\n\nKey features:\n- **Chains**: Compose multiple LLM calls\n- **Agents**: LLMs that use tools to take actions\n- **Memory**: Persist context across turns\n- **RAG**: Retrieval-Augmented Generation for grounding responses\n\n```python\nfrom langchain.chat_models import ChatOpenAI\nllm = ChatOpenAI(model="gpt-4")\nresponse = llm.invoke("Hello!")\n```', creditsUsed: 2, createdAt: new Date(now - 3600000).toISOString() },
    ],
  },
  {
    id: 'conv-002', title: 'Build a pricing page', agentType: 'coding', pinned: false,
    createdAt: new Date(now - 7200000).toISOString(), updatedAt: new Date(now - 1800000).toISOString(),
    messages: [],
  },
]

export const MOCK_ADMIN_USERS = [
  { uid: 'mock-uid-001', name: 'Tanisha Jain',  email: 'tanisha@clusterai.dev', role: 'user',  status: 'active',  credits: 85,  joinedAt: new Date(now - 86400000 * 10).toISOString() },
  { uid: 'mock-uid-002', name: 'Arjun Mehta',   email: 'arjun@example.com',     role: 'user',  status: 'active',  credits: 320, joinedAt: new Date(now - 86400000 * 8).toISOString() },
  { uid: 'mock-uid-003', name: 'Priya Sharma',  email: 'priya@example.com',     role: 'admin', status: 'active',  credits: 999, joinedAt: new Date(now - 86400000 * 6).toISOString() },
  { uid: 'mock-uid-004', name: 'Rohan Das',     email: 'rohan@example.com',     role: 'user',  status: 'blocked', credits: 0,   joinedAt: new Date(now - 86400000 * 3).toISOString() },
]

export const MOCK_METRICS = {
  totalUsers: 1284,
  activeToday: 87,
  totalRevenue: 48920,
  creditsConsumed: { chat: 12400, coding: 8700, search: 5200, docmedia: 9100 },
  errorRate: 1.2,
  providerCost: 3240,
  dailyUsage: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(now - 86400000 * (13 - i)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    chat: Math.floor(Math.random() * 300 + 100),
    coding: Math.floor(Math.random() * 200 + 50),
    search: Math.floor(Math.random() * 150 + 30),
    docmedia: Math.floor(Math.random() * 100 + 20),
  })),
}

export const SEARCH_CITATIONS = [
  { id: 1, title: 'OpenAI releases GPT-5 with enhanced reasoning', url: 'https://openai.com', domain: 'openai.com', snippet: 'OpenAI has announced GPT-5, featuring significant improvements in multi-step reasoning and code generation...', image: 'https://picsum.photos/seed/ai1/120/80' },
  { id: 2, title: 'Google DeepMind Gemini Ultra benchmark results', url: 'https://deepmind.google', domain: 'deepmind.google', snippet: 'Gemini Ultra achieves state-of-the-art results across 57 academic benchmarks including MMLU and HumanEval...', image: 'https://picsum.photos/seed/ai2/120/80' },
  { id: 3, title: 'The race to AGI: Where are we in 2026?', url: 'https://techcrunch.com', domain: 'techcrunch.com', snippet: 'Major AI labs are reporting unprecedented progress in general intelligence benchmarks, sparking debate...', image: 'https://picsum.photos/seed/ai3/120/80' },
  { id: 4, title: 'Anthropic Claude 4 safety report released', url: 'https://anthropic.com', domain: 'anthropic.com', snippet: 'Anthropic has published its comprehensive safety evaluation for Claude 4, covering robustness and alignment...', image: null },
]
