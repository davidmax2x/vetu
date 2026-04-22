// Re-export Clerk auth utilities for internal consistency
export { auth, currentUser } from '@clerk/nextjs/server'
export { useUser, useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
