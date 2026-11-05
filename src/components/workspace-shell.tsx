"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAppState } from "@/components/app-provider";
import { BrandMark } from "@/components/brand";
import { Icon, type IconName } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { initials } from "@/lib/utils";

const groups: { label: string; items: { href: string; label: string; icon: IconName }[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: "compass" },
      { href: "/create-event", label: "Create an event", icon: "plus" },
      { href: "/manage-events", label: "Manage events", icon: "calendar" },
    ],
  },
  {
    label: "Your activity",
    items: [
      { href: "/joined-events", label: "Joined events", icon: "heart" },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/profile", label: "Profile settings", icon: "users" }],
  },
];

function WorkspaceAvatar({ name, photo }: { name: string; photo: string }) {
  return photo ? <Image className="avatar-image" src={photo} alt="" width={37} height={37} unoptimized /> : <span className="avatar-fallback" aria-hidden="true">{initials(name) || "S"}</span>;
}

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { ready, user, theme, toggleTheme, logout, notify } = useAppState();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, pathname, router]);

  if (!ready || !user) {
    return (
      <div className="workspace-loading" aria-label="Loading your workspace">
        <div className="loading-orbit"><span /></div>
        <p>{ready ? "Opening your workspace…" : "Getting your workspace ready…"}</p>
      </div>
    );
  }

  const nav = (
    <>
      <div className="workspace-brand"><BrandMark /></div>
      <div className="workspace-scope"><span className="scope-dot" /> Dhaka community <Icon name="chevronDown" size={15} /></div>
      <nav className="workspace-nav" aria-label="Workspace navigation">
        {groups.map((group) => (
          <div className="workspace-nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href === "/manage-events" && pathname.startsWith("/manage-events"));
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={active ? "workspace-nav-link workspace-nav-link-active" : "workspace-nav-link"} aria-current={active ? "page" : undefined}>
                  <Icon name={item.icon} size={18} /> <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="workspace-sidebar-bottom">
        <div className="sidebar-note"><span className="sidebar-note-mark"><Icon name="leaf" size={17} /></span><p><strong>Small steps count.</strong><span>Every local action makes room for the next.</span></p></div>
        <div className="sidebar-user">
          <WorkspaceAvatar name={user.name} photo={user.photo} />
          <span className="sidebar-user-copy"><strong>{user.name}</strong><span>Community member</span></span>
          <button type="button" aria-label="Log out" title="Log out" className="sidebar-logout" onClick={async () => { try { await logout(); notify("You’ve signed out.", "success"); router.push("/"); } catch (error) { notify(error instanceof Error ? error.message : "Could not sign out.", "error"); } }}><Icon name="logout" size={17} /></button>
        </div>
      </div>
    </>
  );

  return (
    <div className="workspace-frame">
      <aside className="workspace-sidebar">{nav}</aside>
      {mobileOpen && <button className="workspace-scrim" type="button" aria-label="Close workspace menu" onClick={() => setMobileOpen(false)} />}
      <aside className={mobileOpen ? "workspace-sidebar workspace-sidebar-mobile workspace-sidebar-mobile-open" : "workspace-sidebar workspace-sidebar-mobile"} aria-label="Workspace menu">
        <button className="workspace-mobile-close" type="button" aria-label="Close workspace menu" onClick={() => setMobileOpen(false)}><Icon name="x" /></button>
        {nav}
      </aside>
      <div className="workspace-main-column">
        <header className="workspace-topbar">
          <button className="workspace-mobile-trigger" type="button" aria-label="Open workspace menu" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
          <div className="workspace-breadcrumb"><span>SocialSpark</span><Icon name="chevronRight" size={15} /><strong>{groups.flatMap((group) => group.items).find((item) => item.href === pathname)?.label ?? "Workspace"}</strong></div>
          <div className="workspace-topbar-actions">
            <span className="demo-mode-tag"><span /> Your workspace</span>
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              <span className={theme === "light" ? "theme-option theme-option-active" : "theme-option"}><Icon name="sun" size={15} /></span>
              <span className={theme === "dark" ? "theme-option theme-option-active" : "theme-option"}><Icon name="moon" size={14} /></span>
            </button>
            <Link className={buttonClass({ variant: "secondary", size: "sm" })} href="/upcoming-events">Explore events <Icon name="arrowUpRight" size={15} /></Link>
          </div>
        </header>
        <main className="workspace-page">{children}</main>
        <footer className="workspace-footer"><span>SocialSpark community workspace</span><span>Small steps count.</span></footer>
      </div>
    </div>
  );
}
