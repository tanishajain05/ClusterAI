/**
 * agentService — mirrors:
 *   POST /agents/:type/run   (returns stream)
 *   GET  /conversations
 *   GET  /assets
 *   POST /assets/:id/delete
 *   POST /agents/docmedia/job   (background job)
 *   GET  /agents/docmedia/job/:id
 */
import { sleep, uid, randInt } from '@utils/format'
import { streamResponse, streamProgress, CHAT_RESPONSES, PRICING_PAGE_HTML } from './mock/mockStream'
import { MOCK_CONVERSATIONS, MOCK_ASSETS, SEARCH_CITATIONS, AGENT_PRICES } from './mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockAssets = [...MOCK_ASSETS]
const mockConvs  = [...MOCK_CONVERSATIONS]

export const agentService = {
  /** Stream a chat/coding/search reply — yields tokens */
  async *runAgentStream(type, payload) {
    if (!USE_MOCK) {
      // TODO: replace with real SSE / fetch stream from /api/v1/agents/:type/run
      throw new Error('Real backend not connected')
    }
    await sleep(randInt(300, 700))

    let responseText = ''
    if (type === 'chat') {
      responseText = CHAT_RESPONSES.default
    } else if (type === 'coding') {
      const prompt = (payload.prompt || '').toLowerCase()
      if (prompt.includes('pricing') || prompt.includes('dark')) {
        responseText = CHAT_RESPONSES.pricing
        yield { type: 'token', value: responseText }
        yield { type: 'code', language: 'html', content: PRICING_PAGE_HTML }
        return
      }
      responseText = `Here's the generated code. Check the preview panel!\n\n\`\`\`html\n<!-- Generated output -->\n<div>Generated!</div>\n\`\`\``
    } else if (type === 'search') {
      responseText = CHAT_RESPONSES.search
      yield { type: 'pipeline', step: 'Rewriting query...' };   await sleep(500)
      yield { type: 'pipeline', step: 'Searching the web...' }; await sleep(700)
      yield { type: 'pipeline', step: 'Reading pages...' };     await sleep(600)
      yield { type: 'pipeline', step: 'Writing answer...' };    await sleep(400)
    }

    for await (const token of streamResponse(responseText)) {
      yield { type: 'token', value: token }
    }

    if (type === 'search') {
      yield { type: 'citations', citations: SEARCH_CITATIONS }
    }

    yield { type: 'done', creditsUsed: AGENT_PRICES[type]?.credits || 2 }
  },

  /** POST /agents/docmedia/job — start background job */
  async startDocJob(jobType, payload) {
    if (USE_MOCK) {
      await sleep(400)
      return { jobId: `job_${uid()}`, status: 'pending', jobType, payload }
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/agents/docmedia/job', { jobType, ...payload })
    return data
  },

  /** Async generator that simulates background job progress */
  async *pollJobProgress(jobType) {
    const steps = jobType === 'pdf' || jobType === 'ppt'
      ? ['Understanding brief', 'Generating outline', 'Retrieving sources', 'Drafting content', 'Reviewing draft', 'Rendering file', 'Storing asset']
      : ['Processing prompt', 'Generating image', 'Safety check', 'Storing asset']
    for await (const update of streamProgress(steps)) {
      yield update
    }
  },

  /** GET /conversations */
  async getConversations() {
    if (USE_MOCK) { await sleep(400); return mockConvs }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/conversations')
    return data
  },

  /** GET /assets */
  async getAssets() {
    if (USE_MOCK) { await sleep(500); return mockAssets }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/assets')
    return data
  },

  /** DELETE /assets/:id */
  async deleteAsset(id) {
    if (USE_MOCK) { await sleep(300); return { success: true } }
    const { default: api } = await import('/utils/axios')
    await api.delete(`/assets/${id}`)
    return { success: true }
  },

  /** Intent router: returns a suggested agent type for a given prompt */
  async suggestAgent(prompt) {
    if (USE_MOCK) {
      await sleep(200)
      const p = prompt.toLowerCase()
      if (p.includes('code') || p.includes('build') || p.includes('debug')) return 'coding'
      if (p.includes('search') || p.includes('news') || p.includes('latest')) return 'search'
      if (p.includes('pdf') || p.includes('report') || p.includes('image')) return 'docmedia'
      return null  // no suggestion
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/agents/intent', { prompt })
    return data.suggestedAgent
  },
}
