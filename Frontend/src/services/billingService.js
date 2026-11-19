/**
 * billingService — mirrors:
 *   GET  /wallet
 *   POST /billing/orders
 *   POST /billing/verify
 *   GET  /billing/transactions
 *   POST /credits/deduct
 *   POST /credits/add
 */
import { sleep, uid } from '@utils/format'
import { MOCK_TRANSACTIONS, CREDIT_PACKS, AGENT_PRICES } from './mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// In-memory wallet for mock (starts at 85 credits after welcome bonus used)
let mockBalance = 85
let mockUsed = 15
const mockTxns = [...MOCK_TRANSACTIONS]

export const billingService = {
  async getWallet() {
    if (USE_MOCK) { await sleep(400); return { balance: mockBalance, usedThisPeriod: mockUsed } }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/wallet')
    return data
  },

  async getTransactions() {
    if (USE_MOCK) { await sleep(500); return [...mockTxns] }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/billing/transactions')
    return data
  },

  async deductCredits({ amount, reason, agentType }) {
    if (USE_MOCK) {
      await sleep(200)
      mockBalance = Math.max(0, mockBalance - amount)
      mockUsed += amount
      const txn = { id: uid(), type: 'usage', amount: -amount, balanceAfter: mockBalance, reference: `AGT-${agentType?.toUpperCase()}-${uid()}`, note: reason, createdAt: new Date().toISOString() }
      mockTxns.unshift(txn)
      return { balance: mockBalance, usedThisPeriod: mockUsed, transaction: txn }
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/credits/deduct', { amount, reason, agentType })
    return data
  },

  async addCredits({ amount, reason }) {
    if (USE_MOCK) {
      await sleep(200)
      mockBalance += amount
      const txn = { id: uid(), type: 'purchase', amount, balanceAfter: mockBalance, reference: `RZP-${uid()}`, note: reason, createdAt: new Date().toISOString() }
      mockTxns.unshift(txn)
      return { balance: mockBalance, transaction: txn }
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/credits/add', { amount, reason })
    return data
  },

  async createOrder(packId) {
    if (USE_MOCK) {
      await sleep(600)
      const pack = CREDIT_PACKS.find((p) => p.id === packId)
      return { orderId: `order_mock_${uid()}`, packId, pack, amount: pack.priceINR * 100, currency: 'INR' }
    }
    // TODO: replace with real Razorpay Checkout.js order creation
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/billing/orders', { packId })
    return data
  },

  async verifyPayment({ orderId, paymentId, signature, packId }) {
    if (USE_MOCK) {
      await sleep(800)
      const pack = CREDIT_PACKS.find((p) => p.id === packId)
      mockBalance += pack.credits
      const txn = { id: uid(), type: 'purchase', amount: pack.credits, balanceAfter: mockBalance, reference: paymentId || `RZP-${uid()}`, note: `${pack.name} pack purchase`, createdAt: new Date().toISOString() }
      mockTxns.unshift(txn)
      return { success: true, balance: mockBalance, transaction: txn }
    }
    // TODO: verify Razorpay signature on backend
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/billing/verify', { orderId, paymentId, signature })
    return data
  },

  getCreditPacks() { return CREDIT_PACKS },
  getAgentPrices() { return AGENT_PRICES },
}
