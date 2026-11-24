import { useEffect, useState } from "react";
import { adminApi } from "../api/client";
import type { ContentBlock } from "@kelianc/shared";

export default function ContentTab({ notify }: { notify: (m: string) => void }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [enText, setEnText] = useState("");
  const [frText, setFrText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => adminApi.getContent().then((r) => setBlocks(r.blocks as ContentBlock[])).catch((e) => setError((e as Error).message));
  useEffect(() => { load(); }, []);

  const select = (b: ContentBlock) => {
    setSelected(b.key);
    setEnText(JSON.stringify(b.value.en, null, 2));
    setFrText(JSON.stringify(b.value.fr, null, 2));
    setError(null);
  };

  const save = async () => {
    if (!selected) return;
    try {
      const en = JSON.parse(enText);
      const fr = JSON.parse(frText);
      await adminApi.putContent(selected, en, fr);
      notify(`Saved ${selected}`);
      load();
    } catch (err) {
      setError(`Invalid JSON or server error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="tab-body">
      <div className="split">
        <ul className="key-list">
          {blocks.map((b) => (
            <li key={b.key}>
              <button className={selected === b.key ? "key active" : "key"} onClick={() => select(b)}>
                {b.key}
              </button>
            </li>
          ))}
        </ul>
        <div className="editor">
          {selected ? (
            <>
              <h2>{selected}</h2>
              <div className="two-col">
                <label>
                  English (JSON)
                  <textarea value={enText} onChange={(e) => setEnText(e.target.value)} rows={18} spellCheck={false} />
                </label>
                <label>
                  Français (JSON)
                  <textarea value={frText} onChange={(e) => setFrText(e.target.value)} rows={18} spellCheck={false} />
                </label>
              </div>
              <button onClick={save}>Save</button>
            </>
          ) : (
            <p>Select a content block on the left.</p>
          )}
          {error && <p className="error" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}
