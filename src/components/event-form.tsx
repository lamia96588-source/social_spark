"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { EventCategory, SocialEvent } from "@/lib/events";
import { eventCategories } from "@/lib/events";
import { safePhotoUrl } from "@/lib/utils";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

export type EventDraft = Omit<SocialEvent, "id" | "createdAt" | "createdBy">;

type EventFormProps = {
  initial?: SocialEvent;
  onSave: (event: EventDraft) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function EventForm({ initial, onSave, onCancel, submitLabel }: EventFormProps) {
  const { tomorrow } = useAppState();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<EventCategory>(initial?.category ?? "Community");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (title.trim().length < 5) return setError("Give your event a clear title with at least 5 characters.");
    if (description.trim().length < 20) return setError("Add a little more detail so people know what to expect (20 characters minimum).");
    if (!eventCategories.includes(category)) return setError("Choose an event type.");
    if (!safePhotoUrl(thumbnail)) return setError("Add a thumbnail URL that starts with https://.");
    if (location.trim().length < 3) return setError("Add a neighbourhood or meeting location.");
    if (!date || (tomorrow && date < tomorrow)) return setError("Choose a date in the future. Today and earlier dates are not available.");
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      thumbnail: safePhotoUrl(thumbnail),
      location: location.trim(),
      date,
      isSample: false,
    });
  }

  return (
    <form className="event-form" onSubmit={submit} noValidate>
      <div className="event-form-grid">
        <label className="form-field form-field-wide"><span>Event title <i>Required</i></span><Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={90} placeholder="e.g. Saturday street cleanup" required /></label>
        <label className="form-field form-field-wide"><span>What will happen? <i>Required</i></span><Textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={5} placeholder="Share the purpose, what volunteers will do, and anything they should bring." required /><small className="field-help">{description.length}/1000 characters</small></label>
        <label className="form-field"><span>Event type <i>Required</i></span><Select value={category} onChange={(event) => setCategory(event.target.value as EventCategory)} required>{eventCategories.map((item) => <option value={item} key={item}>{item}</option>)}</Select></label>
        <label className="form-field"><span>Neighbourhood or meeting point <i>Required</i></span><span className="field-with-icon"><Icon name="mapPin" size={16} /><Input value={location} onChange={(event) => setLocation(event.target.value)} maxLength={120} placeholder="e.g. Dhanmondi Lake, Dhaka" required /></span></label>
        <label className="form-field"><span>Event date <i>Required</i></span><Input type="date" value={date} min={tomorrow || undefined} onChange={(event) => setDate(event.target.value)} required /><small className="field-help">Choose a future date. Past dates and today are unavailable.</small></label>
        <label className="form-field"><span>Thumbnail image URL <i>Required</i></span><Input type="url" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} placeholder="https://example.com/community-event.jpg" required /></label>
      </div>
      {thumbnail && safePhotoUrl(thumbnail) && (
        <div className="event-form-preview"><div className="event-form-preview-image"><Image src={thumbnail} alt="Preview of the event thumbnail" fill sizes="240px" unoptimized /></div><p><strong>Thumbnail preview</strong><span>This image appears on event cards.</span></p></div>
      )}
      {error && <p className="form-error" role="alert"><Icon name="leaf" size={16} /> {error}</p>}
      <div className="event-form-actions">{onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}<Button type="submit" size="lg">{submitLabel ?? (initial ? "Save changes" : "Publish event")} <Icon name="arrow" size={17} /></Button></div>
      <p className="event-form-demo-note"><Icon name="leaf" size={15} /> Demo mode: events are saved in this browser and are not published to a server.</p>
    </form>
  );
}
