import { sleep, randInt } from '@utils/format'

/**
 * Async generator that yields tokens one-by-one, simulating SSE streaming.
 * Replace the body with a real ReadableStream reader when connecting the backend.
 *
 * @param {string} fullText - Complete response text to stream
 * @yields {string} - Next token (word + space or punctuation chunk)
 */
export async function* streamResponse(fullText) {
  // Split into word-level tokens (preserves spaces)
  const tokens = fullText.match(/\S+\s*/g) || []
  for (const token of tokens) {
    yield token
    await sleep(randInt(18, 55))  // simulate network jitter
  }
}

/** Simulate a background job with progress updates (PDF/PPT/Image) */
export async function* streamProgress(steps) {
  for (let i = 0; i < steps.length; i++) {
    yield { step: i, label: steps[i], progress: Math.round(((i + 1) / steps.length) * 100) }
    await sleep(randInt(600, 1400))
  }
}

export const CHAT_RESPONSES = {
  default: `That's a great question! Let me walk you through it.

**ClusterAI** uses a multi-agent architecture where each specialised agent handles a distinct task type:

| Agent | Capability | Credits/use |
|-------|-----------|-------------|
| Chat | Conversational AI | 2 |
| Coding | Code generation | 5 |
| Search | Web retrieval | 3 |
| Docs | PDF/PPT/Image | 8-20 |

Here's a simple example in Python:

\`\`\`python
# Calling the ClusterAI API
import requests

response = requests.post('/api/v1/agents/chat/run', json={
    'message': 'Explain transformers',
    'conversationId': 'conv-123'
})
print(response.json()['content'])
\`\`\`

The system uses **LangChain** for orchestration and **LangGraph** for multi-step agent workflows. Redis handles session state and MongoDB stores conversation history.

Is there a specific part you'd like me to go deeper on?`,

  pricing: `Here's a **responsive pricing page** in HTML/CSS/JS:\n\nI'll generate the full code now — check the preview panel on the right! ✨`,

  search: `Based on my search across multiple sources, here's a synthesised answer with citations:

The latest developments in AI show significant progress across reasoning [1], multimodal capabilities [2], and safety research [3]. Major labs including OpenAI, Google DeepMind, and Anthropic are racing to develop more capable and aligned systems [4].

Key findings:
- **GPT-5** shows 40% improvement on reasoning benchmarks [1]
- **Gemini Ultra** leads on multimodal tasks [2]  
- Safety remains a primary concern as capabilities scale [3][4]`,
}

export const PRICING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ClusterAI Pricing</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #f8fafc; color: #1e293b; }
  header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4rem 2rem; text-align: center; }
  header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  header p  { font-size: 1.1rem; opacity: 0.9; }
  .plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 3rem auto; padding: 0 1.5rem; }
  .card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,.08); border: 2px solid transparent; transition: transform .2s, box-shadow .2s; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(99,102,241,.15); }
  .card.popular { border-color: #6366f1; position: relative; }
  .badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #6366f1; color: white; font-size: .75rem; font-weight: 700; padding: .25rem .75rem; border-radius: 999px; white-space: nowrap; }
  .plan-name { font-size: 1.1rem; font-weight: 700; color: #6366f1; margin-bottom: .5rem; }
  .plan-price { font-size: 2.5rem; font-weight: 800; margin: .5rem 0; }
  .plan-price span { font-size: 1rem; font-weight: 500; color: #64748b; }
  .plan-credits { color: #64748b; font-size: .9rem; margin-bottom: 1.5rem; }
  .features { list-style: none; margin-bottom: 2rem; }
  .features li { padding: .4rem 0; display: flex; align-items: center; gap: .5rem; font-size: .9rem; }
  .features li::before { content: "✓"; color: #22c55e; font-weight: 700; }
  .btn { width: 100%; padding: .85rem; border-radius: 10px; border: none; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background .2s; }
  .btn-primary { background: #6366f1; color: white; }
  .btn-primary:hover { background: #4f46e5; }
  .btn-outline { background: transparent; border: 2px solid #6366f1; color: #6366f1; }
  .btn-outline:hover { background: #eef2ff; }
  footer { text-align: center; padding: 2rem; color: #94a3b8; font-size: .875rem; }
</style>
</head>
<body>
<header>
  <h1>Simple, Transparent Pricing</h1>
  <p>Buy credits, use them on any agent — no subscriptions, no surprises.</p>
</header>
<main class="plans">
  <div class="card">
    <div class="plan-name">Starter</div>
    <div class="plan-price">₹99 <span>one-time</span></div>
    <div class="plan-credits">100 credits</div>
    <ul class="features">
      <li>50 Chat messages</li>
      <li>20 Code generations</li>
      <li>6 Web searches</li>
      <li>No expiry</li>
    </ul>
    <button class="btn btn-outline" onclick="alert('Buy Starter!')">Get Started</button>
  </div>
  <div class="card popular">
    <span class="badge">Most Popular</span>
    <div class="plan-name">Pro</div>
    <div class="plan-price">₹399 <span>one-time</span></div>
    <div class="plan-credits">500 credits</div>
    <ul class="features">
      <li>250 Chat messages</li>
      <li>100 Code generations</li>
      <li>33 PDF/PPT reports</li>
      <li>No expiry</li>
    </ul>
    <button class="btn btn-primary" onclick="alert('Buy Pro!')">Buy Pro</button>
  </div>
  <div class="card">
    <div class="plan-name">Max</div>
    <div class="plan-price">₹999 <span>one-time</span></div>
    <div class="plan-credits">1500 credits</div>
    <ul class="features">
      <li>750 Chat messages</li>
      <li>300 Code generations</li>
      <li>100 PDF/PPT reports</li>
      <li>Priority support</li>
    </ul>
    <button class="btn btn-outline" onclick="alert('Buy Max!')">Go Max</button>
  </div>
</main>
<footer>All prices in INR. Credits never expire. Admin-configured pricing.</footer>
</body>
</html>`
