"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppState } from "@/components/app-provider";
import { BrandMark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { initials } from "@/lib/utils";

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create-event", label: "Create event" },
  { href: "/manage-events", label: "Manage events" },
  { href: "/joined-events", label: "Joined events" },
  { href: "/profile", label: "Your profile" },
];

function Avatar({ name, photo }: { name: string; photo: string }) {
  if (photo) return <Image className="avatar-image" src={photo} alt="" width={37} height={37} unoptimized />;
  return <span className="avatar-fallback" aria-hidden="true">{initials(name) || "S"}</span>;
}

export function Navbar() {
  const { user, theme, toggleTheme, logout, notify } = useAppState();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      setProfileOpen(false);
      setMenuOpen(false);
      notify("You’ve signed out.", "success");
      router.push("/");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not sign out.", "error");
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={pathname === "/" ? "nav-link nav-link-active" : "nav-link"} href="/">Home</Link>
          <Link className={pathname.startsWith("/upcoming-events") || pathname.startsWith("/events/") ? "nav-link nav-link-active" : "nav-link"} href="/upcoming-events">Upcoming events</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
            <span className={theme === "light" ? "theme-option theme-option-active" : "theme-option"}><Icon name="sun" size={16} /></span>
            <span className={theme === "dark" ? "theme-option theme-option-active" : "theme-option"}><Icon name="moon" size={15} /></span>
          </button>
          {user ? (
            <div className="profile-menu-wrap">
              <button className="profile-trigger" type="button" aria-label={`Open ${user.name} profile menu`} aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
                <Avatar name={user.name} photo={user.photo} />
                <span className="profile-trigger-name">{user.name}</span>
                <Icon name="chevronDown" size={15} />
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-head"><strong>{user.name}</strong><span>{user.email}</span></div>
              {workspaceLinks.slice(1).map((item) => <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}>{item.label}</Link>)}
                  <button type="button" className="dropdown-logout" onClick={handleLogout}><Icon name="logout" size={16} /> Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link className={buttonClass({ size: "sm" })} href="/login">Login</Link>
          )}
          <button className="mobile-menu-trigger" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <Icon name={menuOpen ? "x" : "menu"} size={21} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-nav-panel">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home <Icon name="arrowUpRight" size={16} /></Link>
          <Link href="/upcoming-events" onClick={() => setMenuOpen(false)}>Upcoming events <Icon name="arrowUpRight" size={16} /></Link>
          {user ? (
            <>
              <div className="mobile-nav-divider" />
              {workspaceLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
              <button type="button" className="mobile-nav-logout" onClick={handleLogout}>Log out <Icon name="logout" size={16} /></button>
            </>
          ) : <Link className="mobile-login-link" href="/login">Login to your account <Icon name="arrow" size={16} /></Link>}
          <button type="button" className="mobile-theme-link" onClick={toggleTheme}><Icon name={theme === "light" ? "moon" : "sun"} size={16} /> Switch to {theme === "light" ? "dark" : "light"} mode</button>
        </div>
      )}
    </header>
  );
}
