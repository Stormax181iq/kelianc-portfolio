import { useEffect, useState } from "react";
import { adminApi } from "../api/client";
import type { TimelineEvent, TimelineUpsert } from "@kelianc/shared";

const empty: TimelineUpsert = {
  kind: "education",
  startDate: "2026-09",
  endDate: null,
  title: { en: "", fr: "" },
  organization: { en: "", fr: "" },
  description: { en: "", fr: "" },
  order: 0,
};

export default function TimelineTab({ notify }: { notify: (m: string) => void }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [form, setForm] = useState<TimelineUpsert & { id?: number }>(empty);
  const [error, setError] = useState<string | null>(null);

  const load = () => adminApi.getTimeline().then((r) => setEvents(r.events as TimelineEvent[])).catch((e) => setError((e as Error).message));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setError(null);
    try {
      if (form.id) await adminApi.putTimeline(form.id, form);
      else await adminApi.postTimeline(form);
      notify("Saved timeline event");
      setForm(empty);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="tab-body split">
      <div>
        <h2>Events</h2>
        <button onClick={() => setForm(empty)}>+ New event</button>
        <ul className="key-list">
          {events.map((e) => (
            <li key={e.id}>
              <button className={form.id === e.id ? "key active" : "key"} onClick={() => setForm({ ...e })}>
                {e.startDate} — {e.title.en}
              </button>
              <button
                className="danger"
                onClick={async () => {
                  await adminApi.deleteTimeline(e.id);
                  notify("Deleted");
                  load();
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="editor">
        <h2>{form.id ? `Edit #${form.id}` : "New event"}</h2>
        <label>Kind
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as TimelineUpsert["kind"] })}>
            <option value="education">education</option>
            <option value="experience">experience</option>
            <option value="certification">certification</option>
          </select>
        </label>
        <label>Start (YYYY-MM)
          <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </label>
        <label>End (YYYY-MM, empty = present)
          <input value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value || null })} />
        </label>
        <label>Order
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </label>
        <div className="two-col">
          <label>Title (EN)<input value={form.title.en} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} /></label>
          <label>Title (FR)<input value={form.title.fr} onChange={(e) => setForm({ ...form, title: { ...form.title, fr: e.target.value } })} /></label>
        </div>
        <div className="two-col">
          <label>Organization (EN)<input value={form.organization.en} onChange={(e) => setForm({ ...form, organization: { ...form.organization, en: e.target.value } })} /></label>
          <label>Organization (FR)<input value={form.organization.fr} onChange={(e) => setForm({ ...form, organization: { ...form.organization, fr: e.target.value } })} /></label>
        </div>
        <div className="two-col">
          <label>Description (EN)<textarea rows={3} value={form.description.en} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} /></label>
          <label>Description (FR)<textarea rows={3} value={form.description.fr} onChange={(e) => setForm({ ...form, description: { ...form.description, fr: e.target.value } })} /></label>
        </div>
        <button onClick={save}>Save event</button>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
