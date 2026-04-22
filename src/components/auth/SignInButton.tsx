'use client'

import { SignInButton as ClerkSignInButton } from '@clerk/nextjs'

export function SignInButton() {
  return (
    <ClerkSignInButton>
      <button className="rounded-lg bg-[var(--color-vetu-gold)] px-5 py-2.5 text-sm font-medium text-[var(--color-vetu-ink)] transition-colors hover:bg-[var(--color-vetu-gold-light)]">
        Sign in to save your Vêtu profile
      </button>
    </ClerkSignInButton>
  )
}
