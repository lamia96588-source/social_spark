import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}`} href="/" aria-label="SocialSpark home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none">
          <path d="M21 35.5V17" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M21 20.5C9.8 20.5 6 14.4 6 7.5c9.1 0 15 3.9 15 13Z" fill="currentColor" />
          <path d="M21 15.6C21 7.6 26.7 4 36 4c0 8.1-4.3 13.1-15 13.1" fill="currentColor" />
          <path d="M21 28.4c-8.1 0-11.2 4-11.2 9.1 7.5 0 11.2-3 11.2-9.1Zm0-5.1c0-6.2 4.5-9.5 12.2-9.5 0 6.5-3.4 10.4-12.2 10.4" fill="currentColor" opacity=".72" />
        </svg>
      </span>
      <span className="brand-wordmark">Social<span>Spark</span></span>
    </Link>
  );
}
