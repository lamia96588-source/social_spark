"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EventForm } from "@/components/event-form";
import { Icon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";
import type { SocialEvent } from "@/lib/events";
import { Card } from "@/components/ui/card";
import { Button, buttonClass } from "@/components/ui/button";

export function ManageEventsPage() {
  const { user, events, updateEvent, deleteEvent, notify } = useAppState();
  const [editing, setEditing] = useState<SocialEvent | null>(null);
  const [deleting, setDeleting] = useState<SocialEvent | null>(null);
  const [working, setWorking] = useState(false);
  const ownEvents = events.filter((event) => event.createdBy === user?.email).sort((a, b) => a.date.localeCompare(b.date));

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEditing(null);
        setDeleting(null);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="manage-events-page">
      <div className="workspace-page-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your hosted events</p><h1>Keep good <em>in motion.</em></h1><p className="page-lead">Update or remove events you created.</p></div><Link className={buttonClass()} href="/create-event"><Icon name="plus" size={17} /> Create event</Link></div>
      {ownEvents.length ? (
        <div className="manage-event-list">{ownEvents.map((event) => <Card className="managed-event" key={event.id}><div className="managed-event-image"><Image src={event.thumbnail} alt="" fill sizes="112px" unoptimized /></div><div className="managed-event-copy"><span className="category-badge">{event.category}</span><h2>{event.title}</h2><p>{event.location} · {event.date}</p></div><div className="manage-event-actions"><Button variant="outline" size="icon" aria-label={`Edit ${event.title}`} onClick={() => setEditing(event)}><Icon name="edit" size={16} /></Button><Button variant="danger" size="icon" aria-label={`Delete ${event.title}`} onClick={() => setDeleting(event)}><Icon name="trash" size={16} /></Button></div></Card>)}</div>
      ) : (
        <div className="empty-state"><span className="empty-state-icon"><Icon name="calendar" size={24} /></span><p className="eyebrow">Your event list is clear</p><h2>Ready to start something?</h2><p>Once you create a local event, you can update or manage it here.</p><Link className={buttonClass({ size: "md" })} href="/create-event"><Icon name="plus" size={17} /> Create your first event</Link></div>
      )}
      {editing && (
        <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <section className="modal-panel modal-panel-wide" role="dialog" aria-modal="true" aria-labelledby="edit-event-title">
            <div className="modal-heading"><div><p className="workspace-overline">Update event</p><h2 id="edit-event-title">Edit the invitation.</h2></div><button type="button" className="modal-close" aria-label="Close edit event" onClick={() => setEditing(null)}><Icon name="x" /></button></div>
            <EventForm initial={editing} submitLabel="Save changes" onCancel={() => setEditing(null)} onSave={async (draft) => { await updateEvent(editing.id, draft); notify("Your event details have been updated.", "success"); setEditing(null); }} />
          </section>
        </div>
      )}
      {deleting && (
        <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}>
          <section className="modal-panel delete-confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="delete-event-title" aria-describedby="delete-event-description">
            <span className="delete-confirm-icon"><Icon name="trash" size={21} /></span><p className="workspace-overline">Remove event</p><h2 id="delete-event-title">Delete this event?</h2><p id="delete-event-description">“{deleting.title}” and its participant entries will be removed. This can’t be undone.</p>
            <div className="modal-actions"><Button variant="outline" onClick={() => setDeleting(null)} disabled={working}>Keep event</Button><Button variant="danger" disabled={working} onClick={async () => { setWorking(true); try { await deleteEvent(deleting.id); setDeleting(null); notify("The event was removed.", "success"); } catch (error) { notify(error instanceof Error ? error.message : "Could not delete the event.", "error"); } finally { setWorking(false); } }}>{working ? "Removing…" : "Delete event"}</Button></div>
          </section>
        </div>
      )}
    </div>
  );
}
