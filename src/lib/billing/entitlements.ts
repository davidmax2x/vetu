// Stub — will be fully implemented by BILLING_AGENT
export async function checkEntitlement(userId: string | null, feature: string) {
  return { allowed: true, tier: 'free', reason: undefined as string | undefined, upgradeUrl: undefined as string | undefined }
}

export async function incrementUsage(userId: string, feature: string) {
  // No-op stub
}
