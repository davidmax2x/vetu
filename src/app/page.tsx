import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E0DBD2]/10">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl text-[#C9A84C]">
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-[#F7F4EF] mb-4">
          Dressed with intention.
        </h1>
        <p className="text-lg md:text-xl text-[#7A7D88] max-w-lg mb-8">
          Discover your colour season. Get outfit recommendations. Try on looks virtually.
        </p>
        <div className="flex gap-4">
          <Link
            href="/analyse"
            className="rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
          >
            Analyse your colours
          </Link>
          {!userId && <SignInButton />}
        </div>
      </main>
    </div>
  );
}
