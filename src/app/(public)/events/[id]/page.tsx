import type { Metadata } from "next";
import { Suspense } from "react";
import { EventDetailsPage } from "@/components/pages/event-details-page";

export const metadata: Metadata = { title: "Event details" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className="details-loading page-gutter"><div className="event-skeleton"><span /><i /><i /><i /></div></div>}><EventDetailsRoute params={params} /></Suspense>;
}

async function EventDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventDetailsPage eventId={id} />;
}
