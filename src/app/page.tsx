import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { StepFlow } from "@/components/StepFlow";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-gold)]">
          Vêtu
        </Link>
        <nav className="flex items-center gap-4">
          {userId ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
        </nav>
      </header>

      <main className="flex-1">
        <StepFlow />
      </main>

      <footer className="border-t border-[var(--color-border)] px-6 py-4 text-center text-xs text-[var(--color-muted)]">
        <p>Vêtu — Dressed with intention.</p>
      </footer>
    </div>
  );
}
