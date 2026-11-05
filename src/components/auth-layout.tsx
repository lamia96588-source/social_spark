"use client";

import Image from "next/image";
import { BrandMark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useAppState();
  return (
    <div className="auth-layout">
      <div className="auth-form-column">
        <div className="auth-topbar"><BrandMark /><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span className={theme === "light" ? "theme-option theme-option-active" : "theme-option"}><Icon name="sun" size={15} /></span><span className={theme === "dark" ? "theme-option theme-option-active" : "theme-option"}><Icon name="moon" size={14} /></span></button></div>
        <div className="auth-form-content">{children}</div>
        <p className="auth-copyright">© 2026 SocialSpark</p>
      </div>
      <aside className="auth-visual-panel">
        <Image src="/images/community-planting.png" alt="Hands gently planting a young sapling" fill priority sizes="(max-width: 860px) 100vw, 48vw" />
        <span className="auth-visual-scrim" />
        <div className="auth-art-caption"><span><Icon name="leaf" size={18} /></span><div><p>Care, close to home.</p><strong>When we show up for one another, our city grows kinder.</strong></div></div>
        <div className="auth-visual-footer"><span>SocialSpark · Dhaka</span><span>Small acts, shared together.</span></div>
      </aside>
    </div>
  );
}
