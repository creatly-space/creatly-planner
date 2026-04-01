#!/usr/bin/env python3
"""v17 patch: injects Ideas module into App.jsx"""
import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

errors = []

# 1. Add useIdeas to import
OLD_IMPORT = 'import { useProjects, useTagColors, useAppSettings, useDocs, useTodos, useClients, useNotifications, useServices } from "./hooks";'
NEW_IMPORT = 'import { useProjects, useTagColors, useAppSettings, useDocs, useTodos, useClients, useNotifications, useServices, useIdeas } from "./hooks";'
if OLD_IMPORT in src:
    src = src.replace(OLD_IMPORT, NEW_IMPORT, 1)
    print("OK 1: import updated")
else:
    errors.append("ERR 1: import line not found")

# 2. Hook call + state vars in ProjectPlanner
OLD_HOOK = '  const { services, saveService, deleteService } = useServices();'
NEW_HOOK = ('  const { services, saveService, deleteService } = useServices();\n'
            '  const { ideas, saveIdea, deleteIdea } = useIdeas();\n'
            '  const [showNewIdea, setShowNewIdea] = useState(false);\n'
            '  const [editingIdea, setEditingIdea] = useState(null);\n'
            '  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("all");')
if OLD_HOOK in src:
    src = src.replace(OLD_HOOK, NEW_HOOK, 1)
    print("OK 2: hook + state added")
else:
    errors.append("ERR 2: services hook not found")

# 3. Ideas tab in nav
OLD_NAV = '{ key: "services", label: "Services" }].map'
NEW_NAV  = '{ key: "services", label: "Services" }, { key: "ideas", label: "Ideas" }].map'
if OLD_NAV in src:
    src = src.replace(OLD_NAV, NEW_NAV, 1)
    print("OK 3: nav tab added")
else:
    errors.append("ERR 3: nav array not found")

# 4. IdeasModule render — insert before </main>
OLD_MAIN = '      </main>\n\n      {/* Project Modal (new projects only) */}'
NEW_MAIN = (
    '\n        {/* Ideas view */}\n'
    '        {module === "ideas" && (\n'
    '          <IdeasModule\n'
    '            ideas={ideas}\n'
    '            clients={clients}\n'
    '            categoryFilter={ideaCategoryFilter}\n'
    '            onCategoryFilter={setIdeaCategoryFilter}\n'
    '            onNew={() => setShowNewIdea(true)}\n'
    '            onEdit={(idea) => setEditingIdea(idea)}\n'
    '            onSave={saveIdea}\n'
    '            onDelete={deleteIdea}\n'
    '            currentUserId={currentUserId}\n'
    '            currentUser={currentUser}\n'
    '            showToast={showToast}\n'
    '            theme={theme}\n'
    '          />\n'
    '        )}\n'
    '      </main>\n\n'
    '      {/* Project Modal (new projects only) */'
)
if OLD_MAIN in src:
    src = src.replace(OLD_MAIN, NEW_MAIN, 1)
    print("OK 4: IdeasModule render added")
else:
    errors.append("ERR 4: </main> anchor not found")

# 5. IdeaModal renders — insert before Kit comment
OLD_KIT = '      {/* Kit */}'
NEW_KIT = (
    '      {/* Idea Modals */}\n'
    '      {showNewIdea && (\n'
    '        <IdeaModal\n'
    '          idea={null}\n'
    '          clients={clients}\n'
    '          onSave={saveIdea}\n'
    '          onClose={() => setShowNewIdea(false)}\n'
    '          currentUserId={currentUserId}\n'
    '        />\n'
    '      )}\n'
    '      {editingIdea && (\n'
    '        <IdeaModal\n'
    '          idea={editingIdea}\n'
    '          clients={clients}\n'
    '          onSave={saveIdea}\n'
    '          onDelete={deleteIdea}\n'
    '          onClose={() => setEditingIdea(null)}\n'
    '          currentUserId={currentUserId}\n'
    '        />\n'
    '      )}\n\n'
    '      {/* Kit */}'
)
if OLD_KIT in src:
    src = src.replace(OLD_KIT, NEW_KIT, 1)
    print("OK 5: IdeaModal renders added")
else:
    errors.append("ERR 5: Kit anchor not found")

# 6. Inject component code before Main App
IDEAS_CODE = r'''
// ─── Ideas Module ─────────────────────────────────────────────────────────────
const IDEA_CATEGORIES = ["Campaign", "Content", "Product", "Other"];
const IDEA_STATUS_CONFIG = {
  raw:      { label: "Raw",      color: "#A0A0A0", bg: "rgba(160,160,160,0.12)" },
  refined:  { label: "Refined",  color: "#5B9BCF", bg: "rgba(91,155,207,0.12)"  },
  approved: { label: "Approved", color: "#7ACF85", bg: "rgba(122,207,133,0.12)" },
};

const IdeasModule = ({ ideas, clients, categoryFilter, onCategoryFilter, onNew, onEdit, onSave, onDelete, currentUserId, currentUser, showToast, theme }) => {
  const filtered = categoryFilter === "all" ? ideas : ideas.filter(i => i.category === categoryFilter);
  const clientMap = {};
  clients.forEach(c => { clientMap[c.id] = c; });

  const cycleStatus = async (idea, e) => {
    e.stopPropagation();
    const order = ["raw", "refined", "approved"];
    const next = order[(order.indexOf(idea.status || "raw") + 1) % order.length];
    await onSave({ ...idea, status: next, updated_at: new Date().toISOString() }, currentUserId);
  };

  const handleKitExpand = (idea, e) => {
    e.stopPropagation();
    const prompt = "Expand this idea into a concrete creative brief:\n\nTitle: " + idea.title + "\n\nDescription: " + (idea.description || "(no description yet)") + "\n\nCategory: " + (idea.category || "General") + "\n\nGive me: 1) A sharpened concept, 2) Key angles/hooks, 3) Suggested formats/channels, 4) One concrete next step.";
    window.dispatchEvent(new CustomEvent("kit-prompt", { detail: { prompt } }));
    showToast && showToast("Sent to Kit \u2736");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Ideas</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textMuted }}>{ideas.length} idea{ideas.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onNew} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 18px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + New Idea
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["all", ...IDEA_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => onCategoryFilter(cat)}
            style={{ background: categoryFilter === cat ? COLORS.accent : COLORS.surfaceActive, border: "1px solid " + (categoryFilter === cat ? COLORS.accent : COLORS.border), borderRadius: 20, padding: "5px 14px", color: categoryFilter === cat ? COLORS.bg : COLORS.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
            {cat === "all" ? "All" : cat}
            {cat !== "all" && <span style={{ marginLeft: 5, opacity: 0.6 }}>{ideas.filter(i => i.category === cat).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: COLORS.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>{ideas.length === 0 ? "No ideas yet" : "No ideas in this category"}</div>
          {ideas.length === 0 && <button onClick={onNew} style={{ marginTop: 8, background: COLORS.accent, border: "none", borderRadius: 8, padding: "10px 24px", color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add your first idea</button>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map(idea => {
          const statusCfg = IDEA_STATUS_CONFIG[idea.status || "raw"];
          const client = idea.client_id ? clientMap[idea.client_id] : null;
          return (
            <div key={idea.id} onClick={() => onEdit(idea)}
              style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 18, cursor: "pointer", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: COLORS.textDim }}>{idea.category || "Other"}</span>
                <button onClick={(e) => cycleStatus(idea, e)} title="Click to advance status"
                  style={{ background: statusCfg.bg, border: "1px solid " + statusCfg.color + "40", borderRadius: 20, padding: "3px 10px", color: statusCfg.color, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {statusCfg.label}
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6, lineHeight: 1.3 }}>{idea.title}</div>
              {idea.description && (
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {idea.description}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid " + COLORS.border }}>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>
                  {client ? <span style={{ color: COLORS.blue }}>{client.name}</span> : <span>No client</span>}
                </div>
                <button onClick={(e) => handleKitExpand(idea, e)} title="Expand with Kit AI"
                  style={{ background: COLORS.accent + "20", border: "1px solid " + COLORS.accent + "40", borderRadius: 6, padding: "4px 10px", color: COLORS.accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.accent + "35"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = COLORS.accent + "20"; }}>
                  \u2736 Kit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Idea Modal ───────────────────────────────────────────────────────────────
const IdeaModal = ({ idea, clients, onSave, onDelete, onClose, currentUserId }) => {
  const isNew = !idea;
  const [form, setForm] = useState({
    id: idea?.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
    title: idea?.title || "",
    description: idea?.description || "",
    category: idea?.category || "Campaign",
    status: idea?.status || "raw",
    client_id: idea?.client_id || null,
    created_by: idea?.created_by || currentUserId || null,
    created_at: idea?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    await onSave({ ...form, updated_at: new Date().toISOString() }, currentUserId);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(form.id);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 12, width: "100%", maxWidth: 520, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.text }}>{isNew ? "New Idea" : "Edit Idea"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textDim, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>&times;</button>
        </div>

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Title *</label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What's the idea?" autoFocus
          style={{ width: "100%", background: COLORS.surfaceActive, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ width: "100%", background: COLORS.surfaceActive, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
              {IDEA_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              style={{ width: "100%", background: COLORS.surfaceActive, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
              {Object.entries(IDEA_STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Client (optional)</label>
        <select value={form.client_id || ""} onChange={e => setForm(f => ({ ...f, client_id: e.target.value || null }))}
          style={{ width: "100%", background: COLORS.surfaceActive, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", cursor: "pointer", boxSizing: "border-box", marginBottom: 16 }}>
          <option value="">No client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe the idea, context, inspiration..." rows={5}
          style={{ width: "100%", background: COLORS.surfaceActive, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box", marginBottom: 22 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {!isNew && !showDelete && (
              <button onClick={() => setShowDelete(true)} style={{ background: "none", border: "1px solid " + COLORS.danger + "40", borderRadius: 6, padding: "7px 14px", color: COLORS.danger, fontSize: 13, cursor: "pointer" }}>Delete</button>
            )}
            {!isNew && showDelete && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Sure?</span>
                <button onClick={handleDelete} style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "7px 14px", color: "#fff", fontSize: 13, cursor: "pointer" }}>Yes, delete</button>
                <button onClick={() => setShowDelete(false)} style={{ background: "none", border: "1px solid " + COLORS.border, borderRadius: 6, padding: "7px 14px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ background: "none", border: "1px solid " + COLORS.border, borderRadius: 7, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim()}
              style={{ background: form.title.trim() ? COLORS.accent : COLORS.surfaceActive, border: "none", borderRadius: 7, padding: "8px 22px", color: form.title.trim() ? COLORS.bg : COLORS.textDim, fontSize: 13, fontWeight: 600, cursor: form.title.trim() ? "pointer" : "default" }}>
              {isNew ? "Create Idea" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'''

OLD_MAIN_APP = '// ─── Main App ────────────────────────────────────────────────────────────────\nfunction ProjectPlanner'
if OLD_MAIN_APP in src:
    src = src.replace(OLD_MAIN_APP, IDEAS_CODE + OLD_MAIN_APP, 1)
    print("OK 6: IdeasModule + IdeaModal components injected")
else:
    errors.append("ERR 6: Main App anchor not found")

if errors:
    print("\nERRORS:")
    for e in errors:
        print(e)
    sys.exit(1)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(src)

print("\nAll 6 patches applied. App.jsx saved.")
