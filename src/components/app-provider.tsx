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
import {
  makeSampleEvents,
  type DemoUser,
  type JoinRecord,
  type SocialEvent,
} from "@/lib/events";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };
type AppState = {
  ready: boolean;
  today: string;
  tomorrow: string;
  user: DemoUser | null;
  theme: "light" | "dark";
  events: SocialEvent[];
  joins: JoinRecord[];
  toasts: Toast[];
  notify: (message: string, kind?: ToastKind) => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => DemoUser;
  register: (user: DemoUser) => DemoUser;
  logout: () => void;
  updateProfile: (user: DemoUser) => void;
  addEvent: (event: Omit<SocialEvent, "id" | "createdAt" | "createdBy">) => SocialEvent | null;
  updateEvent: (id: string, patch: Omit<SocialEvent, "id" | "createdAt" | "createdBy">) => boolean;
  deleteEvent: (id: string) => boolean;
  joinEvent: (eventId: string) => boolean;
  hasJoined: (eventId: string) => boolean;
  dismissToast: (id: number) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const USER_KEY = "socialspark.demo.user";
const EVENT_KEY = "socialspark.demo.events";
const JOIN_KEY = "socialspark.demo.joins";
const THEME_KEY = "socialspark.theme";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getDisplayName(email: string) {
  const local = email.split("@")[0] || "community member";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  const [user, setUser] = useState<DemoUser | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [joins, setJoins] = useState<JoinRecord[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const storedEvents = readJson<SocialEvent[] | null>(EVENT_KEY, null);
      const storedTheme = window.localStorage.getItem(THEME_KEY);
      setUser(readJson<DemoUser | null>(USER_KEY, null));
      setEvents(storedEvents?.length ? storedEvents : makeSampleEvents());
      setJoins(readJson<JoinRecord[]>(JOIN_KEY, []));
      setTheme(storedTheme === "dark" ? "dark" : "light");
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      setToday(now.toISOString().slice(0, 10));
      now.setDate(now.getDate() + 1);
      setTomorrow(now.toISOString().slice(0, 10));
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (ready) window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(EVENT_KEY, JSON.stringify(events));
    window.localStorage.setItem(JOIN_KEY, JSON.stringify(joins));
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  }, [events, joins, user, ready]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current, { id, message, kind }]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast],
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const login = useCallback((email: string, _password: string) => {
    void _password;
    const stored = readJson<DemoUser | null>(`socialspark.profile.${email}`, null);
    const nextUser =
      stored ?? {
        name: getDisplayName(email),
        email,
        photo: "",
      };
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback((newUser: DemoUser) => {
    window.localStorage.setItem(`socialspark.profile.${newUser.email}`, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const updateProfile = useCallback((nextUser: DemoUser) => {
    window.localStorage.setItem(`socialspark.profile.${nextUser.email}`, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const addEvent = useCallback(
    (draft: Omit<SocialEvent, "id" | "createdAt" | "createdBy">) => {
      if (!user) return null;
      const event: SocialEvent = {
        ...draft,
        id: `event-${crypto.randomUUID()}`,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      };
      setEvents((current) => [event, ...current]);
      return event;
    },
    [user],
  );

  const updateEvent = useCallback(
    (
      id: string,
      patch: Omit<SocialEvent, "id" | "createdAt" | "createdBy">,
    ) => {
      if (!user) return false;
      const owned = events.some((event) => event.id === id && event.createdBy === user.email);
      if (!owned) return false;
      setEvents((current) =>
        current.map((event) =>
          event.id === id && event.createdBy === user.email ? { ...event, ...patch } : event,
        ),
      );
      return true;
    },
    [events, user],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      if (!user) return false;
      const owned = events.some((event) => event.id === id && event.createdBy === user.email);
      if (!owned) return false;
      setEvents((current) => current.filter((event) => event.id !== id));
      setJoins((current) => current.filter((record) => record.eventId !== id));
      return true;
    },
    [events, user],
  );

  const hasJoined = useCallback(
    (eventId: string) => !!user && joins.some((record) => record.eventId === eventId && record.userEmail === user.email),
    [joins, user],
  );

  const joinEvent = useCallback(
    (eventId: string) => {
      if (!user || hasJoined(eventId)) return false;
      setJoins((current) => [
        ...current,
        { eventId, userEmail: user.email, userName: user.name, joinedAt: new Date().toISOString() },
      ]);
      return true;
    },
    [hasJoined, user],
  );

  const value = useMemo(
    () => ({
      ready,
      today,
      tomorrow,
      user,
      theme,
      events,
      joins,
      toasts,
      notify,
      toggleTheme,
      login,
      register,
      logout,
      updateProfile,
      addEvent,
      updateEvent,
      deleteEvent,
      joinEvent,
      hasJoined,
      dismissToast,
    }),
    [
      ready,
      today,
      tomorrow,
      user,
      theme,
      events,
      joins,
      toasts,
      notify,
      toggleTheme,
      login,
      register,
      logout,
      updateProfile,
      addEvent,
      updateEvent,
      deleteEvent,
      joinEvent,
      hasJoined,
      dismissToast,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"}>
            <span className="toast-mark" aria-hidden="true">
              {toast.kind === "success" ? "✓" : toast.kind === "error" ? "!" : "i"}
            </span>
            <span>{toast.message}</span>
            <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>
              ×
            </button>
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
