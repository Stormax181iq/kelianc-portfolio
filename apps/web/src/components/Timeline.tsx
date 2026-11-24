import { useEffect, useState } from "react";
import { useContent } from "../i18n/ContentContext";
import { api, type TimelineEventDto } from "../api/client";

const KINDS = ["education", "experience", "certification"] as const;

export default function Timeline() {
  const { locale, t } = useContent();
  const labels = t<Record<string, string>>("timeline.labels");
  const [events, setEvents] = useState<TimelineEventDto[]>([]);

  useEffect(() => {
    api.timeline(locale).then((r) => setEvents(r.events)).catch(() => {});
  }, [locale]);

  const formatDate = (d: string | null) => (d ? d : labels.present ?? "Present");

  return (
    <div className="timeline-groups">
      {KINDS.map((kind) => {
        const items = events.filter((e) => e.kind === kind);
        if (items.length === 0) return null;
        return (
          <section key={kind} className="timeline-group">
            <h3>{labels[kind] ?? kind}</h3>
            <ol className="timeline">
              {items.map((e) => (
                <li key={e.id} className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-card">
                    <span className="timeline-date">
                      {formatDate(e.startDate)} — {formatDate(e.endDate)}
                    </span>
                    <h4>{e.title}</h4>
                    <p className="timeline-org">{e.organization}</p>
                    <p>{e.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
