import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "arrowUpRight"
  | "calendar"
  | "camera"
  | "check"
  | "chevronDown"
  | "chevronRight"
  | "compass"
  | "clock"
  | "edit"
  | "heart"
  | "leaf"
  | "lock"
  | "logout"
  | "mail"
  | "mapPin"
  | "menu"
  | "moon"
  | "plus"
  | "search"
  | "sun"
  | "trash"
  | "users"
  | "x"
  | "xBrand";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M4.5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M7 7h10v10" />,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" /></>,
  camera: <><path d="M4 7.5h3l1.5-2h7l1.5 2h3v12H4z" /><circle cx="12" cy="13.5" r="3.25" /></>,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.8 8.2-2.6 5-5 2.6 2.6-5 5-2.6Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  edit: <><path d="m14 5 5 5M4 20l4.2-.8L19 8.4 15.6 5 4.8 15.8 4 20Z" /></>,
  heart: <path d="M20.8 8.9c0 5.2-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.9A4.5 4.5 0 0 1 12 7.1a4.5 4.5 0 0 1 8.8 1.8Z" />,
  leaf: <><path d="M20.5 3.5c-8.4.1-14.2 2.3-15.8 7.2-1.1 3.4 1.2 6.7 4.8 6.7 5.3 0 9.7-5.8 11-13.9Z" /><path d="M4 21c2.9-5.7 6.7-8.4 12.6-11.6" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  logout: <><path d="M10 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H10" /><path d="M14 8l4 4-4 4m4-4H9" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  mapPin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.25" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M20.5 14.2A8.7 8.7 0 0 1 9.8 3.5 8.8 8.8 0 1 0 20.5 14.2Z" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" /></>,
  users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V20" /><circle cx="10" cy="7.5" r="3.5" /><path d="M17 11a3.5 3.5 0 0 0 0-7m3 16v-1.5a4 4 0 0 0-3-3.9" /></>,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  xBrand: <path fill="currentColor" stroke="none" d="M18.9 2.25h3.68l-8.04 9.19L24 21.75h-7.4l-5.8-7.58-6.62 7.58H.5l8.6-9.83L0 2.25h7.6l5.23 6.92 6.07-6.92ZM17.6 19.5h2.04L6.5 4.4H4.31z" />,
};

export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
