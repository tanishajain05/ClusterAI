/** Format a number as INR currency */
export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

/** Format a date to readable string */
export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))

/** Short relative time (e.g. "2m ago") */
export const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/** Truncate string */
export const truncate = (s, n = 40) => (s.length > n ? s.slice(0, n) + '…' : s)

/** Generate a random ID */
export const uid = () => Math.random().toString(36).slice(2, 10)

/** Sleep helper */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Random int between min and max */
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
