export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(gbp: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(gbp)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}
