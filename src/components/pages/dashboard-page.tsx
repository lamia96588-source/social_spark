"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { EventCard } from "@/components/event-card";
import { Card } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";
import { formatEventDate } from "@/lib/utils";

export function DashboardPage() {
  const { user, events, joins, today } = useAppState();
  const ownEvents = useMemo(() => events.filter((event) => event.createdBy === user?.email).sort((a, b) => a.date.localeCompare(b.date)), [events, user]);
  const joinedIds = useMemo(() => joins.filter((record) => record.userEmail === user?.email).map((record) => record.eventId), [joins, user]);
  const joinedEvents = useMemo(() => events.filter((event) => joinedIds.includes(event.id) && today && event.date >= today).sort((a, b) => a.date.localeCompare(b.date)), [events, joinedIds, today]);
  const nextEvent = joinedEvents[0];
  const recentEvents = ownEvents.slice(0, 3);

  return (
    <div className="dashboard-page">
      <div className="workspace-page-heading dashboard-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> Your local workspace</p><h1>Good morning, <em>{user?.name.split(" ")[0]}.</em></h1><p className="page-lead">Here’s what’s moving in your corner of the community.</p></div>
        <Link className={buttonClass({ size: "md" })} href="/create-event"><Icon name="plus" size={17} /> Create an event</Link>
      </div>
      <div className="demo-banner"><span><Icon name="leaf" size={17} /></span><p><strong>Preview mode</strong><span>These events and activity are saved only on this device. No server is connected yet.</span></p><Link href="/upcoming-events">Browse events <Icon name="arrow" size={15} /></Link></div>
      <div className="dashboard-stats" aria-label="Your activity at a glance">
        <Card className="dashboard-stat"><span>Events you created</span><strong>{ownEvents.length}</strong><small>Your local initiatives</small><span className="stat-line stat-line-forest" /></Card>
        <Card className="dashboard-stat"><span>Events you joined</span><strong>{joinedIds.length}</strong><small>From this browser</small><span className="stat-line stat-line-leaf" /></Card>
        <Card className="dashboard-stat"><span>Upcoming for you</span><strong>{joinedEvents.length}</strong><small>Future events you joined</small><span className="stat-line stat-line-olive" /></Card>
      </div>
      <div className="dashboard-main-grid">
        <section className="dashboard-primary-column">
          <div className="workspace-section-heading"><div><p className="workspace-overline">The next step</p><h2>Your upcoming event</h2></div><Link href="/joined-events" className="subtle-link">View joined events <Icon name="arrow" size={15} /></Link></div>
          {nextEvent ? <EventCard event={nextEvent} compact /> : (
            <Card className="dashboard-next-empty"><span className="next-empty-icon"><Icon name="calendar" size={24} /></span><div><h3>Nothing on your calendar yet.</h3><p>Join a local event and it’ll be waiting here when you come back.</p><Link href="/upcoming-events" className="text-link">Find an event <Icon name="arrow" size={16} /></Link></div></Card>
          )}
          <div className="workspace-section-heading dashboard-created-heading"><div><p className="workspace-overline">Your work</p><h2>Events you’re hosting</h2></div><Link href="/manage-events" className="subtle-link">Manage all <Icon name="arrow" size={15} /></Link></div>
          {recentEvents.length ? <div className="event-grid dashboard-own-grid">{recentEvents.map((event) => <EventCard event={event} compact key={event.id} />)}</div> : (
            <Card className="dashboard-own-empty"><p>Your first hosted event will show up here.</p><Link href="/create-event">Plan a local initiative <Icon name="arrow" size={16} /></Link></Card>
          )}
        </section>
        <aside className="dashboard-rail">
          <Card className="quick-actions-card"><p className="workspace-overline">Make it happen</p><h2>Small step, right now.</h2><p>Start with something close to home.</p><Link href="/create-event" className="quick-action-link"><span><Icon name="plus" size={17} /></span><div><strong>Create an event</strong><small>Bring an idea to your neighbours</small></div><Icon name="arrowUpRight" size={16} /></Link><Link href="/upcoming-events" className="quick-action-link"><span><Icon name="search" size={17} /></span><div><strong>Find something to join</strong><small>Explore what’s coming up</small></div><Icon name="arrowUpRight" size={16} /></Link></Card>
          <Card className="dashboard-note-card"><span className="dashboard-note-mark"><Icon name="leaf" size={20} /></span><p className="workspace-overline">A note for today</p><blockquote>“A small act, done together, can change how a place feels.”</blockquote><span className="dashboard-note-source">The SocialSpark idea</span></Card>
          <div className="dashboard-activity"><div className="workspace-section-heading"><div><p className="workspace-overline">Recent activity</p><h2>Your latest steps</h2></div></div>
            {joins.filter((record) => record.userEmail === user?.email).length ? (
              <ul>{joins.filter((record) => record.userEmail === user?.email).slice(-3).reverse().map((record) => <li key={`${record.eventId}-${record.joinedAt}`}><span className="activity-mark"><Icon name="heart" size={15} /></span><p><strong>You joined an event</strong><span>{formatEventDate(record.joinedAt.slice(0, 10))}</span></p></li>)}</ul>
            ) : <p className="activity-empty">When you join an event, your steps will appear here.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
