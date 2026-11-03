import type { ReactNode } from "react";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="site-header" aria-hidden="true"><div className="site-header-inner"><span className="brand-wordmark">SocialSpark</span></div></div>}><Navbar /></Suspense>
      <main className="public-main">{children}</main>
      <Footer />
    </>
  );
}
