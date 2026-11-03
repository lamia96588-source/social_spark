"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initials, safePhotoUrl } from "@/lib/utils";

export function ProfilePage() {
  const { user, updateProfile, notify, events, joins } = useAppState();
  const [name, setName] = useState(user?.name ?? "");
  const [photo, setPhoto] = useState(user?.photo ?? "");
  const [error, setError] = useState("");
  const ownCount = events.filter((event) => event.createdBy === user?.email).length;
  const joinedCount = joins.filter((record) => record.userEmail === user?.email).length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Your display name needs at least 2 characters.");
    if (photo && !safePhotoUrl(photo)) return setError("Use a profile image URL that starts with https://.");
    if (!user) return;
    updateProfile({ ...user, name: name.trim(), photo: safePhotoUrl(photo) });
    notify("Your profile details were updated in this browser.", "success");
  }

  return (
    <div className="profile-page">
      <div className="workspace-page-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your community profile</p><h1>A face to <em>your good work.</em></h1><p className="page-lead">Keep the details neighbours see up to date.</p></div></div>
      <div className="profile-layout">
        <Card className="profile-summary-card"><div className="profile-avatar-large">{user?.photo ? <Image src={user.photo} alt="" width={90} height={90} unoptimized /> : <span>{initials(user?.name ?? "S")}</span>}</div><p className="workspace-overline">Community member</p><h2>{user?.name}</h2><p className="profile-summary-email">{user?.email}</p><div className="profile-summary-divider" /><div className="profile-summary-counts"><div><strong>{ownCount}</strong><span>events hosted</span></div><div><strong>{joinedCount}</strong><span>events joined</span></div></div><p className="profile-preview-note"><Icon name="leaf" size={15} /> Preview profile · saved on this device</p></Card>
        <Card className="profile-form-card"><div className="profile-form-heading"><p className="workspace-overline">Profile details</p><h2>Make it yours.</h2><p>Update your name and profile picture.</p></div><form className="profile-form" onSubmit={submit} noValidate><label className="form-field"><span>Display name</span><Input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label><label className="form-field"><span>Profile photo URL</span><span className="field-with-icon"><Icon name="camera" size={17} /><Input type="url" value={photo} onChange={(event) => setPhoto(event.target.value)} placeholder="https://example.com/your-photo.jpg" /></span><small className="field-help">Use a secure https:// image URL, or leave it blank for initials.</small></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="profile-form-actions"><Button type="submit" size="lg">Save profile <Icon name="check" size={17} /></Button></div><p className="event-form-demo-note"><Icon name="leaf" size={15} /> Profile changes are stored in this browser only.</p></form></Card>
      </div>
    </div>
  );
}
