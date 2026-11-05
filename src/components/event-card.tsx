import Image from "next/image";
import Link from "next/link";
import type { SocialEvent } from "@/lib/events";
import { formatEventDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";

export function EventCard({ event, compact = false }: { event: SocialEvent; compact?: boolean }) {
  return (
    <article className={compact ? "event-card event-card-compact" : "event-card"}>
      <Link href={`/events/${event.id}`} className="event-card-image-link" aria-label={`View ${event.title}`}>
        <div className="event-card-image">
          <Image src={event.thumbnail} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized />
          <CategoryBadge category={event.category} />
          {event.isSample && <span className="sample-image-mark">Sample</span>}
        </div>
      </Link>
      <div className="event-card-content">
        <div className="event-card-date"><Icon name="calendar" size={15} /> <time dateTime={event.date}>{formatEventDate(event.date)}</time></div>
        <h3><Link href={`/events/${event.id}`}>{event.title}</Link></h3>
        <p className="event-card-location"><Icon name="mapPin" size={15} /> {event.location}</p>
        {!compact && <p className="event-card-description">{event.description}</p>}
        <div className="event-card-bottom">
          <span className="event-card-demo">Community event</span>
          <Link className="event-card-action" href={`/events/${event.id}`} aria-label={`View event: ${event.title}`}>View event <Icon name="arrow" size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
