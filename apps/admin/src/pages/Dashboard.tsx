import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/client";
import ContentTab from "../components/ContentTab";
import ProjectsTab from "../components/ProjectsTab";
import TimelineTab from "../components/TimelineTab";
import MediaTab from "../components/MediaTab";
import SettingsTab from "../components/SettingsTab";

const TABS = ["Content", "Projects", "Timeline", "Media", "Settings"] as const;
type Tab = (typeof TABS)[number];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("Content");
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  }, []);

  useEffect(() => {
    document.title = "Admin — Kélian Chalier";
  }, []);

  return (
    <div className="dash">
      <header className="dash-header">
        <strong>Admin</strong>
        <nav aria-label="Admin sections">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? "tab active" : "tab"} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <button
          className="tab"
          onClick={async () => {
            await adminApi.logout().catch(() => {});
            onLogout();
          }}
        >
          Log out
        </button>
      </header>
      {message && <p className="toast" role="status">{message}</p>}
      <main>
        {tab === "Content" && <ContentTab notify={notify} />}
        {tab === "Projects" && <ProjectsTab notify={notify} />}
        {tab === "Timeline" && <TimelineTab notify={notify} />}
        {tab === "Media" && <MediaTab notify={notify} />}
        {tab === "Settings" && <SettingsTab notify={notify} />}
      </main>
    </div>
  );
}
