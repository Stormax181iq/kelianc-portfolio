import { useEffect, useState } from "react";
import { adminApi } from "../api/client";

interface MediaItem {
  id: number;
  filename: string;
  path: string;
  altEn: string;
  altFr: string;
  mime: string;
  size: number;
}

export default function MediaTab({ notify }: { notify: (m: string) => void }) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altFr, setAltFr] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => adminApi.getMedia().then((r) => setMedia(r.media as MediaItem[])).catch((e) => setError((e as Error).message));
  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file) return;
    setError(null);
    try {
      const res = await adminApi.uploadMedia(file, altEn, altFr);
      notify(`Uploaded ${res.path}`);
      setFile(null);
      setAltEn("");
      setAltFr("");
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="tab-body">
      <h2>Upload media</h2>
      <div className="editor">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="two-col">
          <label>Alt text (EN)<input value={altEn} onChange={(e) => setAltEn(e.target.value)} /></label>
          <label>Alt text (FR)<input value={altFr} onChange={(e) => setAltFr(e.target.value)} /></label>
        </div>
        <button onClick={upload} disabled={!file}>Upload</button>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
      <h2>Library</h2>
      <ul className="media-list">
        {media.map((m) => (
          <li key={m.id}>
            <code>{m.path}</code> — {m.filename} ({Math.round(m.size / 1024)} KB)
            <button
              className="danger"
              onClick={async () => {
                await adminApi.deleteMedia(m.id);
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
  );
}
