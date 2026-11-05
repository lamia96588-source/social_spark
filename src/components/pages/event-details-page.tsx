"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { CategoryBadge } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { formatEventDate } from "@/lib/utils";

export function EventDetailsPage({ eventId }: { eventId: string }) {
  const { ready, user, events, hasJoined, joinEvent, notify, today, dataError } = useAppState();
  const router = useRouter();
  const event = events.find((item) => item.id === eventId);
  const joined = hasJoined(eventId);

  async function handleJoin() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }
    if (joined) return;
    try {
      await joinEvent(eventId);
      notify("You’re on the event list. See you there!", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not join this event.", "error");
    }
  }

  if (!ready) return <div className="details-loading page-gutter"><div className="event-skeleton"><span /><i /><i /><i /></div></div>;
  if (!event) {
    return <div className="empty-state event-not-found page-gutter"><span className="empty-state-icon"><Icon name="leaf" size={25} /></span><p className="eyebrow">{dataError ? "Events unavailable" : "Event not found"}</p><h1>{dataError ? "Could not load this invitation." : "This invitation has moved on."}</h1><p>{dataError || "It may have been removed. Browse the upcoming list to find another one."}</p><Link className={buttonClass({ variant: "secondary" })} href="/upcoming-events">Browse upcoming events <Icon name="arrow" size={16} /></Link></div>;
  }

  return (
    <div className="event-detail-page page-gutter">
      <Link className="back-link" href="/upcoming-events"><Icon name="arrow" size={16} /> All upcoming events</Link>
      <div className="event-detail-layout">
        <article className="event-detail-main">
          <div className="event-detail-image">
            <Image src={event.thumbnail} alt="" fill priority sizes="(max-width: 900px) 100vw, 65vw" unoptimized />
            <CategoryBadge category={event.category} />
            {event.isSample && <span className="sample-image-mark">Sample image</span>}
          </div>
          <div className="event-detail-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Neighbours make it happen</p>
            <h1>{event.title}</h1>
            <div className="detail-meta-row"><span><Icon name="calendar" size={17} /> {formatEventDate(event.date)}</span><span><Icon name="mapPin" size={17} /> {event.location}</span></div>
            <div className="detail-copy-rule" />
            <h2>About this event</h2>
            <p className="event-description">{event.description}</p>
          </div>
        </article>
        <aside className="event-detail-aside">
          <Card className="event-join-card">
            <p className="eyebrow">A little time goes a long way</p>
            <h2>Come be part of it.</h2>
            <p>Join this local effort and make a plan to show up.</p>
            <div className="event-place-card"><span><Icon name="calendar" size={17} /></span><p><small>When</small><strong>{formatEventDate(event.date)}</strong></p></div>
            <div className="event-place-card"><span><Icon name="mapPin" size={17} /></span><p><small>Where</small><strong>{event.location}</strong></p></div>
            <Button className="join-event-button" size="lg" onClick={handleJoin} disabled={joined}>{joined ? <><Icon name="check" size={18} /> You’re on the list</> : <>Join this event <Icon name="arrow" size={18} /></>}</Button>
            <p className="join-footnote">{user ? "Your place is saved to your account." : "You’ll be asked to log in before joining."}</p>
          </Card>
          <div className="detail-host-note"><span className="detail-host-icon"><Icon name="leaf" size={19} /></span><p><strong>Local by design</strong><span>Created by {event.isSample ? "the SocialSpark demo team" : event.createdBy}</span></p></div>
        </aside>
      </div>
      <section className="related-events"><div className="related-heading"><div><p className="eyebrow">Keep the momentum</p><h2>More ways to <em>take part.</em></h2></div><Link className="text-link" href="/upcoming-events">Explore all <Icon name="arrow" size={16} /></Link></div>
        <div className="event-grid related-grid">{events.filter((item) => item.id !== event.id && today && item.date >= today).slice(0, 3).map((item) => <EventCard key={item.id} event={item} compact />)}</div>
      </section>
    </div>
  );
}
