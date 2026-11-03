import type { ReactNode } from "react";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="workspace-loading"><div className="loading-orbit" /><p>Getting your workspace ready…</p></div>}><WorkspaceShell>{children}</WorkspaceShell></Suspense>;
}
