import type { Metadata } from "next";
import { AppStateProvider } from "@/components/app-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SocialSpark — Local action, shared together",
    template: "%s · SocialSpark",
  },
  description:
    "Find local community events in Dhaka, meet your neighbours, and turn small acts into shared progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
