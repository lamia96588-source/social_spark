"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import { Icon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";
import { eventCategories } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filters = ["All events", ...eventCategories];

export function UpcomingEventsPage() {
  const { events, ready, today, dataError } = useAppState();
  const [activeFilter, setActiveFilter] = useState("All events");
  const [query, setQuery] = useState("");
  const upcoming = useMemo(() => {
    if (!today) return [];
    return events
      .filter((event) => event.date >= today)
      .filter((event) => activeFilter === "All events" || event.category === activeFilter)
      .filter((event) => `${event.title} ${event.location} ${event.description}`.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, activeFilter, query, today]);

  return (
    <div className="listing-page page-gutter">
      <div className="listing-page-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> Local invitations</p><h1>Find your <em>next good thing.</em></h1><p className="page-lead">Browse upcoming community events and choose a way to take part.</p></div>
        <div className="listing-location"><Icon name="mapPin" size={17} /><span><small>Community events in</small><strong>Dhaka, Bangladesh</strong></span><span className="scope-dot" /></div>
      </div>
      <div className="listing-toolbar">
        <label className="search-field">
          <Icon name="search" size={18} />
          <Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events or neighbourhoods" aria-label="Search events or neighbourhoods" />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><Icon name="x" size={16} /></button>}
        </label>
        <span className="listing-count">{ready ? `${upcoming.length} ${upcoming.length === 1 ? "event" : "events"}` : "Loading events"}</span>
      </div>
      <div className="filter-row" role="group" aria-label="Filter events by type">
        {filters.map((filter) => <Button key={filter} variant={activeFilter === filter ? "primary" : "outline"} size="sm" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</Button>)}
      </div>
      {!ready ? (
        <div className="event-grid listing-event-grid">{Array.from({ length: 6 }).map((_, index) => <div className="event-skeleton" key={index}><span /><i /><i /><i /></div>)}</div>
      ) : dataError ? (
        <div className="empty-state"><span className="empty-state-icon"><Icon name="leaf" size={25} /></span><h2>Events are unavailable</h2><p>{dataError}</p></div>
      ) : upcoming.length ? (
        <div className="event-grid listing-event-grid">{upcoming.map((event) => <EventCard event={event} key={event.id} />)}</div>
      ) : (
        <div className="empty-state"><span className="empty-state-icon"><Icon name="leaf" size={25} /></span><p className="eyebrow">No matching events</p><h2>Try a different starting point.</h2><p>Clear the search or choose another category to see more local invitations.</p><Button variant="secondary" onClick={() => { setQuery(""); setActiveFilter("All events"); }}>Show all events</Button></div>
      )}
      <div className="listing-end-note"><span className="listing-end-leaf"><Icon name="leaf" size={20} /></span><p>Have an idea for your neighbourhood?</p><a href="/create-event">Start a local event <Icon name="arrow" size={16} /></a></div>
    </div>
  );
}
