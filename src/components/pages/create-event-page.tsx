"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { Icon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";
import { Card } from "@/components/ui/card";

export function CreateEventPage() {
  const router = useRouter();
  const { addEvent, notify } = useAppState();
  return (
    <div className="create-event-page">
      <div className="workspace-page-heading create-page-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Bring an idea to life</p><h1>Plan a <em>local event.</em></h1><p className="page-lead">Give neighbours the details they need to show up.</p></div><span className="create-heading-stamp"><Icon name="leaf" size={20} /> Grown nearby</span></div>
      <div className="create-event-layout">
        <Card className="event-form-card"><EventForm submitLabel="Publish event" onSave={async (draft) => { await addEvent(draft); notify("Your event has been published.", "success"); router.push("/upcoming-events"); }} /></Card>
        <aside className="create-event-aside">
          <div className="create-aside-art"><Image src="/images/community-planting.png" alt="A sapling being planted by hand" width={1600} height={900} sizes="(max-width: 1000px) 100vw, 30vw" /><span><Icon name="leaf" size={16} /> Start close to home.</span></div>
          <Card className="create-aside-card"><p className="workspace-overline">A good event needs</p><ul><li><span>01</span><p><strong>A clear invitation</strong><small>What’s happening and why it matters.</small></p></li><li><span>02</span><p><strong>A real meeting point</strong><small>Help neighbours know where to go.</small></p></li><li><span>03</span><p><strong>Room to take part</strong><small>Make joining feel simple and welcoming.</small></p></li></ul></Card>
          <p className="create-aside-note"><Icon name="calendar" size={15} /> Choose a future date so people have time to plan.</p>
        </aside>
      </div>
    </div>
  );
}
