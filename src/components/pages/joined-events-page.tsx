"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { EventCard } from "@/components/event-card";
import { buttonClass } from "@/components/ui/button";

export function JoinedEventsPage() {
  const { user, joins, events } = useAppState();
  const joined = useMemo(() => {
    const records = joins.filter((record) => record.userEmail === user?.email);
    return records.map((record) => events.find((event) => event.id === record.eventId)).filter((event) => !!event).sort((a, b) => a.date.localeCompare(b.date));
  }, [joins, events, user]);

  return (
    <div className="joined-events-page">
      <div className="workspace-page-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Where you’re showing up</p><h1>Good to see <em>you there.</em></h1><p className="page-lead">Events you’ve joined, in date order.</p></div><Link className={buttonClass({ variant: "secondary" })} href="/upcoming-events">Find an event <Icon name="arrow" size={16} /></Link></div>
      {joined.length ? <div className="event-grid workspace-event-grid">{joined.map((event) => <EventCard key={event.id} event={event} />)}</div> : (
        <div className="empty-state"><span className="empty-state-icon"><Icon name="heart" size={24} /></span><p className="eyebrow">A place to begin</p><h2>You haven’t joined an event yet.</h2><p>Find an invitation that feels right and make room for a little good.</p><Link className={buttonClass()} href="/upcoming-events">Explore events <Icon name="arrow" size={17} /></Link></div>
      )}
    </div>
  );
}
