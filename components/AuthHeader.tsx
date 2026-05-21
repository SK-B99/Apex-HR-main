// components/AuthHeader.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

type HeaderVariant = "login" | "signup" | "become-tenant" | "light";

interface AuthHeaderProps {
  variant?: HeaderVariant;
}

export function AuthHeader({ variant = "login" }: AuthHeaderProps) {
  const isLight = variant === "light";

  return (
    <header
      className={`absolute top-0 right-0 left-0 z-20 flex items-center justify-between border-b px-7 py-5 ${
        isLight
          ? "border-black/5 bg-white/95 backdrop-blur-sm"
          : "border-black/10 bg-white/95 shadow-sm backdrop-blur-md"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <span
          className="text-[18px] font-extrabold tracking-tight text-emerald-950"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Apex<span className="text-emerald-500">HR</span>
        </span>
      </Link>

      {/* Center nav — only on become-tenant */}
      {variant === "become-tenant" && (
        <nav className="flex items-center gap-6">
          {["Register Company", "Pricing", "Features"].map((item, i) => (
            <Link
              key={item}
              href="#"
              className={`text-[13.5px] font-medium transition-colors ${
                i === 0
                  ? "text-emerald-700"
                  : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
      )}

      {/* Right-side CTAs */}
      <div className="flex items-center gap-2">
        {variant === "login" && (
          <>
            <PrimaryButton href="/register-tenant">
              Register Companny
            </PrimaryButton>
          </>
        )}

        {variant === "signup" && (
          <>
            <PrimaryButton href="/register-tenant">
              Register Company
            </PrimaryButton>
          </>
        )}

        {variant === "become-tenant" && (
          <>
            <GhostButton href="/login">Log in</GhostButton>
          </>
        )}

        {variant === "light" && (
          <>
            <OutlineButton href="/login">Log in</OutlineButton>
            <SolidButton href="/register-tenant">Register Company</SolidButton>
          </>
        )}
      </div>
    </header>
  );
}

// Sub-components
function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button
        size="sm"
        className="border border-gray-300 bg-transparent font-semibold text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
      >
        {children}
      </Button>
    </Link>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button
        size="sm"
        className="border-none bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
      >
        {children}
      </Button>
    </Link>
  );
}

function OutlineButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button
        size="sm"
        variant="outline"
        className="border-emerald-600 font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        {children}
      </Button>
    </Link>
  );
}

function SolidButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button
        size="sm"
        className="border-none bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
      >
        {children}
      </Button>
    </Link>
  );
}
