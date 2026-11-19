/**
 * adminService — mirrors:
 *   GET  /admin/metrics
 *   GET  /admin/users
 *   PATCH /admin/users/:uid
 *   GET  /admin/audit-log
 */
import { sleep, uid } from '@utils/format'
import { MOCK_ADMIN_USERS, MOCK_METRICS } from './mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockUsers = [...MOCK_ADMIN_USERS]

export const adminService = {
  async getMetrics() {
    if (USE_MOCK) { await sleep(600); return MOCK_METRICS }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/admin/metrics')
    return data
  },

  async getUsers() {
    if (USE_MOCK) { await sleep(500); return mockUsers }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/admin/users')
    return data
  },

  async updateUser(userUid, updates) {
    if (USE_MOCK) {
      await sleep(400)
      const idx = mockUsers.findIndex((u) => u.uid === userUid)
      if (idx !== -1) Object.assign(mockUsers[idx], updates)
      return mockUsers[idx]
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.patch(`/admin/users/${userUid}`, updates)
    return data
  },

  async getAuditLog() {
    if (USE_MOCK) {
      await sleep(400)
      return Array.from({ length: 12 }, (_, i) => ({
        id: uid(),
        action: ['USER_LOGIN', 'CREDITS_PURCHASE', 'AGENT_RUN', 'ADMIN_BLOCK_USER', 'CREDITS_REFUND'][i % 5],
        actor: MOCK_ADMIN_USERS[i % 4].email,
        target: MOCK_ADMIN_USERS[(i + 1) % 4].email,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        meta: { ip: `192.168.1.${i + 10}` },
      }))
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/admin/audit-log')
    return data
  },
}
