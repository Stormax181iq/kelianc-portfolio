import { useEffect, useState } from "react";
import { adminApi } from "../api/client";
import type { ProjectDetail, ProjectUpsert } from "@kelianc/shared";

const empty: ProjectUpsert = {
  slug: "",
  category: "academic",
  title: { en: "", fr: "" },
  summary: { en: "", fr: "" },
  tech: [],
  image: null,
  repoUrl: "",
  demoUrl: "",
  featured: false,
  order: 0,
  context: { en: "", fr: "" },
  methods: { en: "", fr: "" },
  results: { en: "", fr: "" },
  skills: [],
  contribution: null,
  traceMediaPath: null,
  traceCaption: null,
};

export default function ProjectsTab({ notify }: { notify: (m: string) => void }) {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [form, setForm] = useState<ProjectUpsert>(empty);
  const [techText, setTechText] = useState("");
  const [skillsEn, setSkillsEn] = useState("");
  const [skillsFr, setSkillsFr] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => adminApi.getProjects().then((r) => setProjects(r.projects as ProjectDetail[])).catch((e) => setError((e as Error).message));
  useEffect(() => { load(); }, []);

  const edit = (p: ProjectDetail) => {
    setForm({
      slug: p.slug,
      category: p.category,
      title: p.title,
      summary: p.summary,
      tech: p.tech,
      image: p.image,
      repoUrl: p.repoUrl ?? "",
      demoUrl: p.demoUrl ?? "",
      featured: p.featured,
      order: p.order,
      context: p.context,
      methods: p.methods,
      results: p.results,
      skills: p.skills,
      contribution: p.contribution,
      traceMediaPath: p.trace?.mediaPath ?? null,
      traceCaption: p.trace?.caption ?? null,
    });
    setTechText(p.tech.join(", "));
    setSkillsEn(p.skills.map((s) => s.en).join("\n"));
    setSkillsFr(p.skills.map((s) => s.fr).join("\n"));
    setError(null);
  };

  const setPair = (field: "title" | "summary" | "context" | "methods" | "results" | "contribution" | "traceCaption", locale: "en" | "fr", value: string) => {
    setForm((f) => {
      const cur = (f[field] ?? { en: "", fr: "" }) as { en: string; fr: string };
      return { ...f, [field]: { ...cur, [locale]: value } };
    });
  };

  const save = async () => {
    setError(null);
    const skills = skillsEn.split("\n").map((s) => s.trim()).filter(Boolean).map((en, i) => ({
      en,
      fr: skillsFr.split("\n").map((s) => s.trim()).filter(Boolean)[i] ?? en,
    }));
    const body: ProjectUpsert = {
      ...form,
      tech: techText.split(",").map((s) => s.trim()).filter(Boolean),
      skills,
    };
    try {
      await adminApi.putProject(form.slug, body);
      notify(`Saved ${form.slug}`);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="tab-body split">
      <div>
        <h2>Projects</h2>
        <button onClick={() => { setForm(empty); setTechText(""); setSkillsEn(""); setSkillsFr(""); }}>+ New project</button>
        <ul className="key-list">
          {projects.map((p) => (
            <li key={p.slug}>
              <button className={form.slug === p.slug ? "key active" : "key"} onClick={() => edit(p)}>
                {p.slug}
              </button>
              <button
                className="danger"
                onClick={async () => {
                  if (confirm(`Delete ${p.slug}?`)) {
                    await adminApi.deleteProject(p.slug);
                    notify(`Deleted ${p.slug}`);
                    load();
                  }
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="editor">
        <h2>{form.slug || "New project"}</h2>
        <label>Slug (lowercase, dashes)
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-project" />
        </label>
        <label>Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectUpsert["category"] })}>
            <option value="academic">academic</option>
            <option value="personal">personal</option>
            <option value="professional">professional</option>
          </select>
        </label>
        <label>Featured
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
        </label>
        <label>Order
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </label>
        {(["title", "summary", "context", "methods", "results"] as const).map((field) => (
          <div className="two-col" key={field}>
            <label>{field} (EN)
              <textarea rows={3} value={(form[field] as { en: string }).en} onChange={(e) => setPair(field, "en", e.target.value)} />
            </label>
            <label>{field} (FR)
              <textarea rows={3} value={(form[field] as { fr: string }).fr} onChange={(e) => setPair(field, "fr", e.target.value)} />
            </label>
          </div>
        ))}
        <label>Tech (comma-separated)
          <input value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="TypeScript, React" />
        </label>
        <label>Image path (e.g. /uploads/xxx.png)
          <input value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value || null })} />
        </label>
        <label>Repo URL
          <input value={form.repoUrl ?? ""} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} />
        </label>
        <label>Demo URL
          <input value={form.demoUrl ?? ""} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
        </label>
        <div className="two-col">
          <label>Skills (EN, one per line)
            <textarea rows={5} value={skillsEn} onChange={(e) => setSkillsEn(e.target.value)} />
          </label>
          <label>Skills (FR, one per line)
            <textarea rows={5} value={skillsFr} onChange={(e) => setSkillsFr(e.target.value)} />
          </label>
        </div>
        <div className="two-col">
          <label>Contribution (EN)
            <textarea rows={3} value={form.contribution?.en ?? ""} onChange={(e) => setPair("contribution", "en", e.target.value)} />
          </label>
          <label>Contribution (FR)
            <textarea rows={3} value={form.contribution?.fr ?? ""} onChange={(e) => setPair("contribution", "fr", e.target.value)} />
          </label>
        </div>
        <label>Trace media path
          <input value={form.traceMediaPath ?? ""} onChange={(e) => setForm({ ...form, traceMediaPath: e.target.value || null })} />
        </label>
        <div className="two-col">
          <label>Trace caption (EN)
            <textarea rows={2} value={form.traceCaption?.en ?? ""} onChange={(e) => setPair("traceCaption", "en", e.target.value)} />
          </label>
          <label>Trace caption (FR)
            <textarea rows={2} value={form.traceCaption?.fr ?? ""} onChange={(e) => setPair("traceCaption", "fr", e.target.value)} />
          </label>
        </div>
        <button onClick={save}>Save project</button>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
