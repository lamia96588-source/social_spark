"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import type { DemoUser, JoinRecord, SocialEvent } from "@/lib/events";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };
type EventDraft = Omit<SocialEvent, "id" | "createdAt" | "createdBy" | "isSample">;
type AppState = {
  ready: boolean;
  today: string;
  tomorrow: string;
  user: DemoUser | null;
  theme: "light" | "dark";
  events: SocialEvent[];
  recentEvents: SocialEvent[];
  joins: JoinRecord[];
  dataError: string | null;
  githubEnabled: boolean;
  toasts: Toast[];
  notify: (message: string, kind?: ToastKind) => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<DemoUser>;
  register: (user: DemoUser & { password: string }) => Promise<DemoUser>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: DemoUser) => Promise<void>;
  addEvent: (event: EventDraft) => Promise<SocialEvent>;
  updateEvent: (id: string, patch: EventDraft) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  joinEvent: (eventId: string) => Promise<boolean>;
  hasJoined: (eventId: string) => boolean;
  dismissToast: (id: number) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const THEME_KEY = "socialspark.theme";

function dhakaDate(dayOffset = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function mapUser(value: { name: string; email: string; image?: string | null }): DemoUser {
  return { name: value.name, email: value.email, photo: value.image || "" };
}

async function api<T>(path: string, options: RequestInit = {}, protectedRoute = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (protectedRoute) {
    const result = await authClient.token();
    if (result.error || !result.data?.token) throw new Error("Please log in to continue.");
    headers.set("Authorization", `Bearer ${result.data.token}`);
  }
  const response = await fetch(`/api${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status}).`);
  return body as T;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  const [user, setUser] = useState<DemoUser | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [recentEvents, setRecentEvents] = useState<SocialEvent[]>([]);
  const [joins, setJoins] = useState<JoinRecord[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [githubEnabled, setGithubEnabled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshData = useCallback(async (currentUser: DemoUser | null) => {
    const [publicResult, recentResult, ownResult, joinResult] = await Promise.all([
      api<{ events: SocialEvent[] }>("/events"),
      api<{ events: SocialEvent[] }>("/events/recent"),
      currentUser ? api<{ events: SocialEvent[] }>("/me/events", {}, true) : Promise.resolve({ events: [] }),
      currentUser ? api<{ events: SocialEvent[]; joins: JoinRecord[] }>("/me/joins", {}, true) : Promise.resolve({ events: [], joins: [] }),
    ]);
    const merged = new Map<string, SocialEvent>();
    for (const event of [...publicResult.events, ...ownResult.events, ...joinResult.events]) merged.set(event.id, event);
    setEvents([...merged.values()]);
    setRecentEvents(recentResult.events);
    setJoins(joinResult.joins);
    setDataError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(async () => {
      if (cancelled) return;
      setTheme(window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");
      setToday(dhakaDate());
      setTomorrow(dhakaDate(1));
      try {
        const [session, config] = await Promise.all([
          authClient.getSession(),
          api<{ githubEnabled: boolean }>("/config"),
        ]);
        if (cancelled) return;
        const currentUser = session.data?.user ? mapUser(session.data.user) : null;
        setUser(currentUser);
        setGithubEnabled(config.githubEnabled);
        await refreshData(currentUser);
      } catch (error) {
        if (!cancelled) setDataError(error instanceof Error ? error.message : "Could not load events.");
      } finally {
        if (!cancelled) setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [refreshData]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (ready) window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, ready]);

  const dismissToast = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const notify = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => dismissToast(id), 3800);
  }, [dismissToast]);
  const toggleTheme = useCallback(() => setTheme((current) => current === "light" ? "dark" : "light"), []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) throw new Error(result.error.message || "Unable to sign in.");
    const session = await authClient.getSession();
    if (!session.data?.user) throw new Error("Unable to load your session.");
    const currentUser = mapUser(session.data.user);
    setUser(currentUser);
    await refreshData(currentUser);
    return currentUser;
  }, [refreshData]);

  const register = useCallback(async (newUser: DemoUser & { password: string }) => {
    const result = await authClient.signUp.email({
      name: newUser.name, email: newUser.email, password: newUser.password, image: newUser.photo,
    });
    if (result.error) throw new Error(result.error.message || "Unable to register.");
    const currentUser = mapUser(result.data.user);
    setUser(currentUser);
    await refreshData(currentUser);
    return currentUser;
  }, [refreshData]);

  const loginWithGithub = useCallback(async () => {
    const result = await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" });
    if (result.error) throw new Error(result.error.message || "GitHub sign in failed.");
  }, []);

  const logout = useCallback(async () => {
    const result = await authClient.signOut();
    if (result.error) throw new Error(result.error.message || "Unable to sign out.");
    setUser(null);
    await refreshData(null);
  }, [refreshData]);

  const updateProfile = useCallback(async (nextUser: DemoUser) => {
    const result = await authClient.updateUser({ name: nextUser.name, image: nextUser.photo });
    if (result.error) throw new Error(result.error.message || "Unable to update profile.");
    setUser(nextUser);
  }, []);

  const addEvent = useCallback(async (draft: EventDraft) => {
    const result = await api<{ event: SocialEvent }>("/events", { method: "POST", body: JSON.stringify(draft) }, true);
    await refreshData(user);
    return result.event;
  }, [refreshData, user]);

  const updateEvent = useCallback(async (id: string, patch: EventDraft) => {
    await api(`/events/${id}`, { method: "PATCH", body: JSON.stringify(patch) }, true);
    await refreshData(user);
    return true;
  }, [refreshData, user]);

  const deleteEvent = useCallback(async (id: string) => {
    await api(`/events/${id}`, { method: "DELETE" }, true);
    await refreshData(user);
    return true;
  }, [refreshData, user]);

  const joinEvent = useCallback(async (eventId: string) => {
    await api(`/events/${eventId}/join`, { method: "POST" }, true);
    await refreshData(user);
    return true;
  }, [refreshData, user]);

  const hasJoined = useCallback((eventId: string) => !!user && joins.some((record) => record.eventId === eventId && record.userEmail === user.email), [joins, user]);

  const value = useMemo(() => ({
    ready, today, tomorrow, user, theme, events, recentEvents, joins, dataError, githubEnabled, toasts,
    notify, toggleTheme, login, register, loginWithGithub, logout, updateProfile,
    addEvent, updateEvent, deleteEvent, joinEvent, hasJoined, dismissToast,
  }), [ready, today, tomorrow, user, theme, events, recentEvents, joins, dataError, githubEnabled, toasts,
    notify, toggleTheme, login, register, loginWithGithub, logout, updateProfile,
    addEvent, updateEvent, deleteEvent, joinEvent, hasJoined, dismissToast]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"}>
            <span className="toast-mark" aria-hidden="true">{toast.kind === "success" ? "✓" : toast.kind === "error" ? "!" : "i"}</span>
            <span>{toast.message}</span>
            <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
