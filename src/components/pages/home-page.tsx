"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { EventCard } from "@/components/event-card";
import { Icon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";
import { formatEventDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, buttonClass } from "@/components/ui/button";

const gallery = [
  { src: "/images/community-planting.png", alt: "Hands settling a new sapling into rich soil", title: "Planting for the next season" },
  { src: "/images/sure-we-can-earthday-clean-2021.jpg", alt: "Neighbours cleaning a shared city street", title: "Care for shared spaces" },
  { src: "/images/winter-clothes-sorting-reference.png", alt: "Folded warm clothes ready for a winter donation", title: "Make warmth go further" },
  { src: "/images/u-s-volunteers-join-okinawans-in-city.jpg", alt: "Volunteers working together in a community garden", title: "A little time, together" },
];

export function HomePage() {
  const { events, ready, user, today } = useAppState();
  const upcoming = useMemo(() => {
    if (!today) return [];
    return events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  }, [events, today]);
  const nextEvent = upcoming[0];
  const createHref = user ? "/create-event" : "/login?next=%2Fcreate-event";

  return (
    <>
      <section className="home-hero page-gutter">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Local people, growing good together</p>
          <h1>Good grows<br /><em>close to home.</em></h1>
          <p className="hero-lead">Find a local event, meet the people behind it, and help your neighbourhood flourish.</p>
          <div className="hero-actions">
            <Link className={buttonClass({ size: "lg" })} href="/upcoming-events">Explore events <Icon name="arrow" size={18} /></Link>
            <Link className={buttonClass({ variant: "secondary", size: "lg" })} href={createHref}>Start an initiative <Icon name="arrowUpRight" size={17} /></Link>
          </div>
          <div className="hero-proof-row">
            <div className="hero-avatar-stack" aria-hidden="true"><span>R</span><span>M</span><span>A</span></div>
            <p><strong>Made for neighbours.</strong><span>Small steps, shared locally.</span></p>
          </div>
        </div>
        <div className="hero-art-column">
          <div className="hero-island-stage" aria-label="Illustration of a thriving neighbourhood island">
            <span className="island-sunwash" />
            <span className="island-ring island-ring-one" />
            <span className="island-ring island-ring-two" />
            <Image className="hero-island-image" src="/images/hero-community-island.png" alt="A small green island where neighbours gather beneath a tree" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 54vw" />
            <span className="floating-leaf leaf-one" aria-hidden="true"><Icon name="leaf" size={19} /></span>
            <span className="floating-leaf leaf-two" aria-hidden="true"><Icon name="leaf" size={16} /></span>
            {nextEvent && (
              <Link href={`/events/${nextEvent.id}`} className="hero-next-event">
                <span className="next-event-icon"><Icon name="calendar" size={17} /></span>
                <span><small>Coming up near you</small><strong>{nextEvent.title}</strong><em>{formatEventDate(nextEvent.date, { weekday: undefined, year: undefined })} · {nextEvent.location.split(",")[0]}</em></span>
                <Icon name="arrowUpRight" size={17} />
              </Link>
            )}
            <span className="hero-art-caption">A neighbourhood is something we grow.</span>
          </div>
        </div>
        <div className="hero-baseline"><span>01 / LOCAL ACTION</span><span>Find your next good thing <Icon name="arrow" size={15} /></span></div>
      </section>

      <section className="home-intro-section page-gutter">
        <div className="section-intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> From noticing to doing</p>
          <h2>Good intentions<br /><em>need a place to land.</em></h2>
        </div>
        <div className="section-intro-text">
          <p>SocialSpark brings local projects into one shared space. Find a nearby cleanup, help sort warm clothes, or start the idea you have been carrying around.</p>
          <Link className="text-link" href="/upcoming-events">See what’s happening <Icon name="arrow" size={17} /></Link>
        </div>
      </section>

      <section className="feature-strip page-gutter" aria-label="How SocialSpark works">
        <Card className="feature-card">
          <span className="feature-number">01</span><span className="feature-mark feature-mark-leaf"><Icon name="leaf" size={22} /></span>
          <h3>Find your place</h3><p>Browse simple, local ways to lend a hand.</p>
          <Link href="/upcoming-events" aria-label="Find an event"><Icon name="arrowUpRight" size={18} /></Link>
        </Card>
        <Card className="feature-card feature-card-offset">
          <span className="feature-number">02</span><span className="feature-mark feature-mark-people"><Icon name="users" size={22} /></span>
          <h3>Show up together</h3><p>Meet neighbours who care about the same things.</p>
          <Link href="/upcoming-events" aria-label="Join neighbours at an event"><Icon name="arrowUpRight" size={18} /></Link>
        </Card>
        <Card className="feature-card">
          <span className="feature-number">03</span><span className="feature-mark feature-mark-calendar"><Icon name="calendar" size={22} /></span>
          <h3>Keep good moving</h3><p>Return to the work and help a small idea grow.</p>
          <Link href={createHref} aria-label="Start an event"><Icon name="arrowUpRight" size={18} /></Link>
        </Card>
      </section>

      <section className="greenway-band page-gutter">
        <div className="greenway-copy">
          <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-dot" /> Neighbourhood care looks like this</p>
          <h2>One street.<br /><em>Many small hands.</em></h2>
          <p>Every event begins with someone making space for someone else. Bring an idea, a little time, or simply a willingness to join in.</p>
          <Link className="greenway-link" href={createHref}>Create your first event <Icon name="arrow" size={17} /></Link>
        </div>
        <div className="greenway-photo-wrap">
          <Image src="/images/community-planting.png" alt="Hands placing a young plant into garden soil" width={1600} height={900} sizes="(max-width: 900px) 100vw, 45vw" />
          <span className="greenway-photo-caption"><Icon name="leaf" size={16} /> Care is something we practice.</span>
        </div>
        <span className="greenway-topography" aria-hidden="true" />
      </section>

      <section className="recent-section page-gutter" id="upcoming">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span className="eyebrow-dot" /> Open invitations</p><h2>Upcoming <em>near you</em></h2><p className="section-deck">A few good places to begin. All event details here are sample data for this frontend preview.</p></div>
          <Link className="text-link section-heading-link" href="/upcoming-events">All upcoming events <Icon name="arrow" size={17} /></Link>
        </div>
        {ready && upcoming.length > 0 ? (
          <div className="event-grid home-event-grid">{upcoming.map((event) => <EventCard event={event} key={event.id} />)}</div>
        ) : (
          <div className="event-grid home-event-grid" aria-label="Loading upcoming events">{Array.from({ length: 3 }).map((_, index) => <div className="event-skeleton" key={index}><span /><i /><i /><i /></div>)}</div>
        )}
      </section>

      <section className="gallery-section page-gutter">
        <div className="gallery-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Moments of care</p><h2>Good is <em>already growing.</em></h2><p>Small moments make a neighbourhood feel like it belongs to all of us.</p></div>
        <div className="community-gallery">
          {gallery.map((item, index) => (
            <figure className={`gallery-photo gallery-photo-${index + 1}`} key={item.src}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 75vw, 32vw" />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
          <div className="gallery-note"><span className="gallery-note-mark"><Icon name="leaf" size={23} /></span><p>Care takes root<br /><em>when we share it.</em></p><span>SocialSpark · Dhaka</span></div>
        </div>
      </section>

      <section className="newsletter-section page-gutter">
        <div className="newsletter-leaf" aria-hidden="true"><Icon name="leaf" size={32} /></div>
        <div><p className="eyebrow">A little good in your inbox</p><h2>Stay close to what’s growing.</h2><p>Newsletter sign-up is a visual preview for now. Updates will be available when the service is connected.</p></div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Your email address" disabled aria-describedby="newsletter-note" />
          <Button type="submit" disabled>Coming soon</Button>
          <span className="newsletter-note" id="newsletter-note">Newsletter is not active yet.</span>
        </form>
      </section>
    </>
  );
}
