import { useEffect, useState } from "react";
import { adminApi } from "../api/client";

export default function SettingsTab({ notify }: { notify: (m: string) => void }) {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSettings().then((r) => setSettings(r.settings)).catch((e) => setError((e as Error).message));
  }, []);

  const save = async () => {
    setError(null);
    try {
      await adminApi.putSettings({
        learningPortfolioPublished: Boolean(settings.learningPortfolioPublished),
        cvEn: (settings.cvEn as string) || null,
        cvFr: (settings.cvFr as string) || null,
      });
      notify("Settings saved");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="tab-body editor">
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={Boolean(settings.learningPortfolioPublished)}
          onChange={(e) => setSettings({ ...settings, learningPortfolioPublished: e.target.checked })}
        />{" "}
        Publish the Semester 4 learning portfolio page content
      </label>
      <label>CV path (EN) — e.g. /files/cv-en.pdf
        <input value={(settings.cvEn as string) ?? ""} onChange={(e) => setSettings({ ...settings, cvEn: e.target.value })} />
      </label>
      <label>CV path (FR) — e.g. /files/cv-fr.pdf
        <input value={(settings.cvFr as string) ?? ""} onChange={(e) => setSettings({ ...settings, cvFr: e.target.value })} />
      </label>
      <button onClick={save}>Save settings</button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
