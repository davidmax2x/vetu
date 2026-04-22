'use client'

import { UserButton } from '@clerk/nextjs'

export function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonPopoverCard: 'bg-[#3A3D47] border border-[#E0DBD2]/20',
          userButtonPopoverActionButton: 'text-[#F7F4EF] hover:bg-[#0A0A0B]',
          userButtonPopoverFooter: 'hidden',
        }
      }}
    />
  )
}
