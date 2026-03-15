import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useProjects, useTagColors, useAppSettings, useDocs, useTodos } from "./hooks";

// ─── Config ──────────────────────────────────────────────────────────────────

const LOGO_SRC = "data:image/png;base64,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";

const DARK_THEME = {
  bg: "#0A0A0A",
  surface: "#151515",
  surfaceHover: "#1C1C1C",
  surfaceActive: "#242424",
  border: "#2C2C2C",
  borderLight: "#3A3A3A",
  text: "#F0F0F0",
  textMuted: "#A0A0A0",
  textDim: "#707070",
  accent: "#7ACF85",
  accentDim: "#5BB866",
  accentGlow: "rgba(122,207,133,0.08)",
  danger: "#CF5C5C",
  success: "#7ACF85",
  blue: "#5B9BCF",
  purple: "#9B7ADB",
  orange: "#D98C4A",
};

const LIGHT_THEME = {
  bg: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceHover: "#FAFAFA",
  surfaceActive: "#F0F0F0",
  border: "#E0E0E0",
  borderLight: "#D0D0D0",
  text: "#1A1A1A",
  textMuted: "#666666",
  textDim: "#999999",
  accent: "#4EA65A",
  accentDim: "#3D8F48",
  accentGlow: "rgba(78,166,90,0.08)",
  danger: "#D44",
  success: "#4EA65A",
  blue: "#4080C0",
  purple: "#7B5ABB",
  orange: "#C07030",
};

let COLORS = DARK_THEME;

const STATUS_CONFIG = {
  backlog: { label: "Backlog", color: COLORS.textDim, dot: "#555" },
  planned: { label: "Planned", color: COLORS.blue, dot: COLORS.blue },
  active: { label: "Active", color: COLORS.accent, dot: COLORS.accent },
  review: { label: "Review", color: COLORS.purple, dot: COLORS.purple },
  done: { label: "Done", color: COLORS.success, dot: COLORS.success },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: COLORS.textMuted },
  medium: { label: "Medium", color: COLORS.orange },
  high: { label: "High", color: COLORS.danger },
  urgent: { label: "Urgent", color: "#FF4444" },
};

// ─── Utilities ───────────────────────────────────────────────────────────────
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDateFull = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toInputDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
};

const daysBetween = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};


// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
  const icons = {
    plus: (
      <path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    calendar: (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    timeline: (
      <>
        <path d="M4 6h16M4 12h10M4 18h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      </>
    ),
    x: (
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    chevronLeft: (
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    chevronRight: (
      <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    edit: (
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke={color} strokeWidth="1.5" fill="none" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    filter: (
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0, ...style }}
    >
      {icons[name]}
    </svg>
  );
};

// ─── Tag Color Palette ───────────────────────────────────────────────────────
const TAG_PALETTE = [
  { id: "green", color: "#7ACF85", label: "Green" },
  { id: "blue", color: "#5B9BCF", label: "Blue" },
  { id: "purple", color: "#9B7ADB", label: "Purple" },
  { id: "orange", color: "#D98C4A", label: "Orange" },
  { id: "red", color: "#CF5C5C", label: "Red" },
  { id: "yellow", color: "#CFBF4A", label: "Yellow" },
  { id: "pink", color: "#CF6B9B", label: "Pink" },
  { id: "teal", color: "#4ABFCF", label: "Teal" },
  { id: "gray", color: "#808080", label: "Gray" },
];

// ─── Tag Component ───────────────────────────────────────────────────────────
const Tag = ({ label, onRemove, color }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      background: color ? `${color}20` : COLORS.surfaceActive,
      border: color ? `1px solid ${color}40` : `1px solid transparent`,
      borderRadius: 4,
      fontSize: 11,
      color: color || COLORS.textMuted,
      fontWeight: color ? 500 : 400,
      letterSpacing: "0.02em",
    }}
  >
    {label}
    {onRemove && (
      <span
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        style={{ cursor: "pointer", opacity: 0.6, marginLeft: 2 }}
      >
        ×
      </span>
    )}
  </span>
);

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status, small }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: small ? "2px 6px" : "3px 10px",
        background: `${cfg.color}22`,
        borderRadius: 4,
        fontSize: small ? 10 : 11,
        color: cfg.color,
        fontWeight: 500,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: small ? 5 : 6,
          height: small ? 5 : 6,
          borderRadius: "50%",
          background: cfg.dot,
        }}
      />
      {cfg.label}
    </span>
  );
};

// ─── Priority Badge ──────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      style={{
        fontSize: 10,
        color: cfg.color,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {cfg.label}
    </span>
  );
};

// ─── Project Card ────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onClick, compact, visibleFields = {}, customFields = [], tagColors = {} }) => {
  const [hovered, setHovered] = useState(false);
  const vf = { ...DEFAULT_VISIBLE_FIELDS, ...visibleFields };
  const progress = project.endDate && project.dateMode !== "single"
    ? Math.min(100, Math.max(0, ((Date.now() - new Date(project.startDate)) / (new Date(project.endDate) - new Date(project.startDate))) * 100))
    : 0;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? COLORS.surfaceHover : COLORS.surface,
        border: `1px solid ${hovered ? COLORS.borderLight : COLORS.border}`,
        borderRadius: 8,
        padding: compact ? 14 : 18,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ fontSize: compact ? 14 : 15, fontWeight: 600, color: COLORS.text, margin: 0, lineHeight: 1.3, flex: 1 }}>
          {project.title}
        </h3>
        {vf.priority && <PriorityBadge priority={project.priority} />}
      </div>

      {vf.description && !compact && project.description && (
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {vf.status && <StatusBadge status={project.status} small />}
        {vf.dates && project.startDate && (
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>
            {project.dateMode === "single"
              ? formatDate(project.startDate)
              : `${formatDate(project.startDate)} → ${formatDate(project.endDate)}`}
          </span>
        )}
      </div>

      {vf.dates && project.endDate && project.dateMode !== "single" && project.status !== "done" && project.status !== "backlog" && (
        <div style={{ marginTop: 10, height: 3, background: COLORS.border, borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${STATUS_CONFIG[project.status].color}, ${STATUS_CONFIG[project.status].color}88)`,
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {vf.tags && project.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
          {project.tags.map((t) => (
            <Tag key={t} label={t} color={tagColors[t]} />
          ))}
        </div>
      )}

      {/* Assignee avatar */}
      {project.assignee && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: project.assignee === "ludvig" ? COLORS.accent : COLORS.purple,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: COLORS.bg, flexShrink: 0,
          }}>
            {project.assignee === "ludvig" ? "L" : "J"}
          </div>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>
            {project.assignee === "ludvig" ? "Ludvig" : "Johannes"}
          </span>
        </div>
      )}

      {vf.notes && project.notes && (
        <p style={{ fontSize: 11, color: COLORS.textDim, margin: "8px 0 0", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", fontStyle: "italic" }}>
          {project.notes}
        </p>
      )}

      {/* Custom fields */}
      {customFields.filter((f) => f.visible).map((f) => {
        const val = project.customFields?.[f.id];
        if (val === undefined || val === "" || val === null) return null;
        return (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>{f.name}:</span>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>
              {f.type === "checkbox" ? (val ? "Yes" : "No") : f.type === "url" ? <span style={{ color: COLORS.accent }}>{val}</span> : String(val)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Tag Dropdown Input ──────────────────────────────────────────────────────
const TagDropdownInput = ({ value, onChange, onAdd, allTags, currentTags, tagColors, onUpdateTagColor, onSelectTag, inputStyle }) => {
  const [open, setOpen] = useState(false);
  const [colorMenuTag, setColorMenuTag] = useState(null);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setColorMenuTag(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = allTags.filter(
    (t) => !currentTags.includes(t) && (!value || t.includes(value.toLowerCase()))
  );

  const handleSelect = (tag) => {
    onSelectTag(tag);
    onChange("");
    setOpen(false);
  };

  const handleCreate = () => {
    if (value.trim()) {
      onAdd();
      setOpen(false);
    }
  };

  const isNew = value.trim() && !allTags.includes(value.trim().toLowerCase());

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (isNew) handleCreate();
              else if (filtered.length === 1) handleSelect(filtered[0]);
            }
          }}
          placeholder="Search or create tag..."
          style={{ ...inputStyle, flex: 1 }}
        />
      </div>

      {/* Dropdown */}
      {open && (filtered.length > 0 || isNew) && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: COLORS.surface, border: `1px solid ${COLORS.borderLight}`, borderRadius: 8,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 50, maxHeight: 240, overflow: "auto",
        }}>
          {/* Create new */}
          {isNew && (
            <div
              onClick={handleCreate}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                cursor: "pointer", borderBottom: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Icon name="plus" size={14} color={COLORS.accent} />
              <span style={{ fontSize: 13, color: COLORS.accent, fontWeight: 500 }}>
                Create "{value.trim().toLowerCase()}"
              </span>
            </div>
          )}

          {/* Existing tags */}
          {filtered.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                cursor: "pointer", position: "relative",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div onClick={() => handleSelect(tag)} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                {tagColors[tag] && (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: tagColors[tag], flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 13, color: COLORS.text }}>{tag}</span>
              </div>

              {/* 3-dot menu */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setColorMenuTag(colorMenuTag === tag ? null : tag);
                }}
                style={{
                  cursor: "pointer", padding: "2px 4px", borderRadius: 4, fontSize: 16,
                  color: COLORS.textDim, lineHeight: 1, letterSpacing: 1,
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textDim}
              >
                ···
              </span>

              {/* Inline color picker popover */}
              {colorMenuTag === tag && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute", right: 8, top: "100%", zIndex: 60,
                    background: COLORS.surface, border: `1px solid ${COLORS.borderLight}`, borderRadius: 8,
                    padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    display: "flex", gap: 5, flexWrap: "wrap", width: 180,
                  }}
                >
                  {TAG_PALETTE.map((p) => (
                    <span
                      key={p.id}
                      onClick={() => {
                        onUpdateTagColor(tag, p.color);
                        setColorMenuTag(null);
                      }}
                      style={{
                        width: 24, height: 24, borderRadius: "50%", background: p.color, cursor: "pointer",
                        border: tagColors[tag] === p.color ? "2px solid #fff" : "2px solid transparent",
                        transition: "border 0.1s, transform 0.1s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      title={p.label}
                    />
                  ))}
                  {tagColors[tag] && (
                    <span
                      onClick={() => {
                        onUpdateTagColor(tag, null);
                        setColorMenuTag(null);
                      }}
                      style={{
                        width: 24, height: 24, borderRadius: "50%", cursor: "pointer",
                        border: `1px dashed ${COLORS.textDim}`, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 12, color: COLORS.textDim,
                      }}
                      title="Remove color"
                    >
                      ×
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Project Detail / Editor Modal ───────────────────────────────────────────
const ProjectModal = ({ project, onSave, onDelete, onClose, customFields = [], tagColors = {}, allTags = [], onUpdateTagColor }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(
    project || {
      id: uid(),
      title: "",
      description: "",
      status: "backlog",
      priority: "medium",
      dateMode: "range",
      startDate: addDays(new Date(), 0),
      endDate: addDays(new Date(), 14),
      tags: [],
      notes: "",
      customFields: {},
      created: new Date().toISOString().split("T")[0],
    }
  );
  const [tagInput, setTagInput] = useState("");
  const isNew = !project;

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const selectStyle = {
    background: COLORS.surfaceActive,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "8px 12px",
    color: COLORS.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    appearance: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    background: COLORS.surfaceActive,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "8px 12px",
    color: COLORS.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>
            {isNew ? "New Project" : "Edit Project"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.textMuted }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Project Name</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="What are you building?"
              style={{ ...inputStyle, fontSize: 16, fontWeight: 500, padding: "10px 12px" }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief overview..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Status & Priority & Assignee Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} style={selectStyle}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={(e) => update("priority", e.target.value)} style={selectStyle}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assignee</label>
              <select value={form.assignee || ""} onChange={(e) => update("assignee", e.target.value || null)} style={selectStyle}>
                <option value="">Unassigned</option>
                <option value="ludvig">Ludvig</option>
                <option value="johannes">Johannes</option>
              </select>
            </div>
          </div>

          {/* Date Mode Toggle + Dates */}
          <div>
            <label style={labelStyle}>Date Type</label>
            <div style={{ display: "flex", gap: 2, background: COLORS.surfaceActive, borderRadius: 6, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 12, width: "fit-content" }}>
              {[{ key: "single", label: "Single Date" }, { key: "range", label: "Date Range" }].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    update("dateMode", opt.key);
                    if (opt.key === "single") update("endDate", form.startDate);
                  }}
                  style={{
                    background: (form.dateMode || "range") === opt.key ? COLORS.bg : "transparent",
                    border: "none",
                    padding: "6px 14px",
                    cursor: "pointer",
                    color: (form.dateMode || "range") === opt.key ? COLORS.accent : COLORS.textDim,
                    fontSize: 12,
                    fontWeight: (form.dateMode || "range") === opt.key ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(form.dateMode || "range") === "single" ? (
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={toInputDate(form.startDate)}
                  onChange={(e) => { update("startDate", e.target.value); update("endDate", e.target.value); }}
                  style={inputStyle}
                />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input
                    type="date"
                    value={toInputDate(form.startDate)}
                    onChange={(e) => update("startDate", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input
                    type="date"
                    value={toInputDate(form.endDate)}
                    onChange={(e) => update("endDate", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: form.tags.length ? 8 : 0 }}>
              {form.tags.map((t) => (
                <Tag key={t} label={t} color={tagColors[t]} onRemove={() => update("tags", form.tags.filter((x) => x !== t))} />
              ))}
            </div>
            <TagDropdownInput
              value={tagInput}
              onChange={setTagInput}
              onAdd={addTag}
              allTags={allTags}
              currentTags={form.tags}
              tagColors={tagColors}
              onUpdateTagColor={onUpdateTagColor}
              onSelectTag={(tag) => {
                if (!form.tags.includes(tag)) update("tags", [...form.tags, tag]);
              }}
              inputStyle={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Internal notes, links, ideas..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Custom Fields</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {customFields.map((f) => {
                  const cfVals = form.customFields || {};
                  const val = cfVals[f.id] ?? (f.type === "checkbox" ? false : "");
                  const updateCF = (v) => update("customFields", { ...cfVals, [f.id]: v });

                  return (
                    <div key={f.id}>
                      <label style={{ ...labelStyle, fontSize: 10, marginBottom: 4 }}>{f.name}</label>
                      {f.type === "text" || f.type === "url" ? (
                        <input value={val} onChange={(e) => updateCF(e.target.value)} placeholder={f.type === "url" ? "https://..." : `Enter ${f.name.toLowerCase()}...`} style={inputStyle} />
                      ) : f.type === "number" ? (
                        <input type="number" value={val} onChange={(e) => updateCF(e.target.value)} style={inputStyle} />
                      ) : f.type === "date" ? (
                        <input type="date" value={val} onChange={(e) => updateCF(e.target.value)} style={inputStyle} />
                      ) : f.type === "select" ? (
                        <select value={val} onChange={(e) => updateCF(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                          <option value="">Select...</option>
                          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : f.type === "checkbox" ? (
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <input type="checkbox" checked={!!val} onChange={(e) => updateCF(e.target.checked)} style={{ accentColor: COLORS.accent, width: 16, height: 16 }} />
                          <span style={{ fontSize: 13, color: COLORS.text }}>{val ? "Yes" : "No"}</span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div>
            {!isNew && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  background: "none",
                  border: `1px solid ${COLORS.danger}33`,
                  borderRadius: 6,
                  padding: "8px 14px",
                  color: COLORS.danger,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="trash" size={14} color={COLORS.danger} />
                Delete
              </button>
            )}
            {confirmDelete && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.danger }}>Delete this project?</span>
                <button
                  onClick={() => { onDelete(form.id); onClose(); }}
                  style={{
                    background: COLORS.danger, border: "none", borderRadius: 6,
                    padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6,
                    padding: "8px 14px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                padding: "8px 18px",
                color: COLORS.textMuted,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                background: COLORS.accent,
                border: "none",
                borderRadius: 6,
                padding: "8px 22px",
                color: COLORS.bg,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isNew ? "Create Project" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Project Detail View ────────────────────────────────────────────────────
const ProjectDetailView = ({ project, onSave, onDelete, onClose, customFields = [], tagColors = {}, allTags = [], onUpdateTagColor, currentUserId }) => {
  const { todos, loading: todosLoading, addTodo, updateTodo, deleteTodo, addManyTodos } = useTodos(project?.id);
  const [form, setForm] = useState(project);
  const [tagInput, setTagInput] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoAssignee, setNewTodoAssignee] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const saveTimerRef = useRef(null);

  // Update form when project changes (realtime)
  useEffect(() => {
    if (project) setForm(project);
  }, [project]);

  const update = (key, val) => {
    const updated = { ...form, [key]: val };
    setForm(updated);
    // Debounced auto-save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      onSave(updated);
    }, 800);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    addTodo(newTodoText.trim(), newTodoAssignee || null);
    setNewTodoText("");
    setNewTodoAssignee("");
  };

  const handleExtractFromTranscript = () => {
    if (!transcriptText.trim()) return;
    setAiLoading(true);
    fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `You are a task extraction assistant. Analyze this meeting transcript and extract all action items, to-dos, and tasks mentioned. For each task, try to identify who it's assigned to (look for names like Ludvig or Johannes).

Return ONLY a valid JSON array with objects like: [{"text": "task description", "assignee": "ludvig" or "johannes" or null}]

Do not include any other text, markdown, or explanation. Just the JSON array.

Meeting transcript:
${transcriptText}`
        }],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const text = data.content?.map((c) => c.text || "").join("") || "[]";
        try {
          // Strip markdown code fences if present
          const clean = text.replace(/```json\s*|```/g, "").trim();
          const tasks = JSON.parse(clean);
          if (Array.isArray(tasks) && tasks.length > 0) {
            addManyTodos(tasks);
            setTranscriptText("");
            setShowTranscript(false);
          }
        } catch (e) {
          console.error("Failed to parse AI response:", e, text);
        }
        setAiLoading(false);
      })
      .catch((err) => {
        console.error("AI extraction failed:", err);
        setAiLoading(false);
      });
  };

  const selectStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6,
    padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%",
    appearance: "none", cursor: "pointer",
  };

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6,
    padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  const doneCount = todos.filter(t => t.done).length;
  const todoCount = todos.length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0" }}>
      {/* Back button */}
      <button
        onClick={() => { if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); onSave(form); } onClose(); }}
        style={{
          background: "none", border: "none", color: COLORS.accent, fontSize: 13, cursor: "pointer",
          padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6,
        }}
      >
        ← Back to board
      </button>

      <div className="creatly-detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* ─── LEFT: Project Info ─── */}
        <div>
          {/* Title */}
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            style={{
              ...inputStyle, fontSize: 22, fontWeight: 700, padding: "12px 0", background: "transparent",
              border: "none", borderBottom: `1px solid ${COLORS.border}`, borderRadius: 0, marginBottom: 20, width: "100%",
            }}
          />

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief overview..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Status, Priority, Assignee */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} style={selectStyle}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={(e) => update("priority", e.target.value)} style={selectStyle}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assignee</label>
              <select value={form.assignee || ""} onChange={(e) => update("assignee", e.target.value || null)} style={selectStyle}>
                <option value="">Unassigned</option>
                <option value="ludvig">Ludvig</option>
                <option value="johannes">Johannes</option>
              </select>
            </div>
          </div>

          {/* Date Mode + Dates */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Date Type</label>
            <div style={{ display: "flex", gap: 2, background: COLORS.surfaceActive, borderRadius: 6, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 12, width: "fit-content" }}>
              {[{ key: "single", label: "Single" }, { key: "range", label: "Range" }].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { update("dateMode", opt.key); if (opt.key === "single") update("endDate", form.startDate); }}
                  style={{
                    background: (form.dateMode || "range") === opt.key ? COLORS.bg : "transparent",
                    border: "none", padding: "5px 12px", cursor: "pointer",
                    color: (form.dateMode || "range") === opt.key ? COLORS.accent : COLORS.textDim,
                    fontSize: 12, fontWeight: (form.dateMode || "range") === opt.key ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(form.dateMode || "range") === "single" ? (
              <input type="date" value={toInputDate(form.startDate)} onChange={(e) => { update("startDate", e.target.value); update("endDate", e.target.value); }} style={inputStyle} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Start</label>
                  <input type="date" value={toInputDate(form.startDate)} onChange={(e) => update("startDate", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End</label>
                  <input type="date" value={toInputDate(form.endDate)} onChange={(e) => update("endDate", e.target.value)} style={inputStyle} />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: form.tags?.length ? 8 : 0 }}>
              {form.tags?.map((t) => (
                <Tag key={t} label={t} color={tagColors[t]} onRemove={() => update("tags", form.tags.filter((x) => x !== t))} />
              ))}
            </div>
            <TagDropdownInput
              value={tagInput} onChange={setTagInput} onAdd={addTag}
              allTags={allTags} currentTags={form.tags || []} tagColors={tagColors}
              onUpdateTagColor={onUpdateTagColor}
              onSelectTag={(tag) => { if (!form.tags?.includes(tag)) update("tags", [...(form.tags || []), tag]); }}
              inputStyle={inputStyle}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Internal notes, links, ideas..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {/* Delete */}
          <div style={{ paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} style={{ background: "none", border: `1px solid ${COLORS.danger}33`, borderRadius: 6, padding: "8px 14px", color: COLORS.danger, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="trash" size={14} color={COLORS.danger} /> Delete Project
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.danger }}>Delete this project?</span>
                <button onClick={() => { onDelete(form.id); onClose(); }} style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 14px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: To-Do List ─── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>To-Do</h3>
              {todoCount > 0 && (
                <span style={{ fontSize: 12, color: COLORS.textDim }}>
                  {doneCount}/{todoCount} done
                </span>
              )}
            </div>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              style={{
                background: showTranscript ? `${COLORS.accent}15` : "transparent",
                border: `1px solid ${showTranscript ? COLORS.accent + "44" : COLORS.border}`,
                borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                color: showTranscript ? COLORS.accent : COLORS.textMuted, fontSize: 12, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              ✨ Extract from transcript
            </button>
          </div>

          {/* Progress bar */}
          {todoCount > 0 && (
            <div style={{ height: 4, background: COLORS.border, borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
              <div style={{
                height: "100%", width: `${(doneCount / todoCount) * 100}%`,
                background: COLORS.accent, borderRadius: 2, transition: "width 0.3s ease",
              }} />
            </div>
          )}

          {/* AI Transcript Input */}
          {showTranscript && (
            <div style={{
              background: `${COLORS.accent}08`, border: `1px solid ${COLORS.accent}22`, borderRadius: 8,
              padding: 14, marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, marginBottom: 8 }}>
                ✨ Paste meeting transcript
              </div>
              <textarea
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste your meeting transcript here... AI will extract action items and create to-dos automatically."
                rows={6}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, marginBottom: 8 }}
                disabled={aiLoading}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setShowTranscript(false); setTranscriptText(""); }}
                  style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 14px", color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtractFromTranscript}
                  disabled={aiLoading || !transcriptText.trim()}
                  style={{
                    background: aiLoading ? COLORS.surfaceActive : COLORS.accent,
                    border: "none", borderRadius: 6, padding: "6px 18px",
                    color: aiLoading ? COLORS.textDim : COLORS.bg, fontSize: 12, fontWeight: 600,
                    cursor: aiLoading ? "wait" : "pointer",
                  }}
                >
                  {aiLoading ? "Extracting..." : "Extract Tasks"}
                </button>
              </div>
            </div>
          )}

          {/* Add new todo */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              placeholder="Add a to-do..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <select
              value={newTodoAssignee}
              onChange={(e) => setNewTodoAssignee(e.target.value)}
              style={{ ...selectStyle, width: 110 }}
            >
              <option value="">Anyone</option>
              <option value="ludvig">Ludvig</option>
              <option value="johannes">Johannes</option>
            </select>
            <button
              onClick={handleAddTodo}
              disabled={!newTodoText.trim()}
              style={{
                background: COLORS.accent, border: "none", borderRadius: 6, padding: "0 14px",
                color: COLORS.bg, fontSize: 20, fontWeight: 600, cursor: "pointer", lineHeight: 1,
              }}
            >
              +
            </button>
          </div>

          {/* Todo list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {todosLoading && <div style={{ padding: 20, textAlign: "center", color: COLORS.textDim, fontSize: 13 }}>Loading...</div>}
            {!todosLoading && todos.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: COLORS.textDim, fontSize: 13, border: `1px dashed ${COLORS.border}`, borderRadius: 8 }}>
                No to-dos yet. Add one above or extract from a meeting transcript.
              </div>
            )}
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: todo.done ? "transparent" : COLORS.surface,
                  border: `1px solid ${todo.done ? "transparent" : COLORS.border}`,
                  borderRadius: 6, transition: "all 0.15s",
                  opacity: todo.done ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={(e) => updateTodo(todo.id, { done: e.target.checked })}
                  style={{ accentColor: COLORS.accent, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{
                  flex: 1, fontSize: 13, color: COLORS.text,
                  textDecoration: todo.done ? "line-through" : "none",
                }}>
                  {todo.text}
                </span>
                {/* Assignee badge */}
                {todo.assignee && (
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: todo.assignee === "ludvig" ? COLORS.accent : COLORS.purple,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: COLORS.bg, flexShrink: 0,
                  }} title={todo.assignee === "ludvig" ? "Ludvig" : "Johannes"}>
                    {todo.assignee === "ludvig" ? "L" : "J"}
                  </div>
                )}
                {/* Assignee dropdown */}
                <select
                  value={todo.assignee || ""}
                  onChange={(e) => updateTodo(todo.id, { assignee: e.target.value || null })}
                  style={{
                    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 4,
                    padding: "2px 4px", color: COLORS.textMuted, fontSize: 10, outline: "none",
                    appearance: "none", cursor: "pointer", width: 70,
                  }}
                >
                  <option value="">—</option>
                  <option value="ludvig">Ludvig</option>
                  <option value="johannes">Johannes</option>
                </select>
                {/* Delete */}
                <span
                  onClick={() => deleteTodo(todo.id)}
                  style={{ cursor: "pointer", color: COLORS.textDim, fontSize: 14, padding: "0 2px", lineHeight: 1 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.danger}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textDim}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Board View ──────────────────────────────────────────────────────────────
const BoardView = ({ projects, onSelect, visibleFields, customFields, tagColors }) => {
  const columns = Object.keys(STATUS_CONFIG);

  return (
    <div
      className="creatly-board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, minmax(200px, 1fr))`,
        gap: 12,
        overflowX: "auto",
        padding: "0 0 20px",
        minHeight: 400,
      }}
    >
      {columns.map((status) => {
        const items = projects.filter((p) => p.status === status);
        return (
          <div key={status}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "0 4px" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: STATUS_CONFIG[status].dot,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {STATUS_CONFIG[status].label}
              </span>
              <span style={{ fontSize: 11, color: COLORS.textDim, marginLeft: "auto" }}>{items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((p) => (
                <ProjectCard key={p.id} project={p} onClick={() => onSelect(p)} compact visibleFields={visibleFields} customFields={customFields} tagColors={tagColors} />
              ))}
              {items.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: COLORS.textDim, fontSize: 12, border: `1px dashed ${COLORS.border}`, borderRadius: 8 }}>
                  No projects
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Timeline View ───────────────────────────────────────────────────────────
const TimelineView = ({ projects, onSelect }) => {
  const [offset, setOffset] = useState(0);
  const daysToShow = 42;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 7 + offset);

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const sorted = [...projects]
    .filter((p) => p.startDate && p.endDate)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const dayWidth = 32;
  const rowHeight = 40;
  const headerHeight = 50;

  const getPosition = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diffDays = (d - startDate) / (1000 * 60 * 60 * 24);
    return diffDays * dayWidth;
  };

  const todayX = getPosition(today.toISOString());

  return (
    <div>
      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setOffset((o) => o - 14)}
          style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: COLORS.textMuted }}
        >
          <Icon name="chevronLeft" size={14} />
        </button>
        <button
          onClick={() => setOffset(0)}
          style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", color: COLORS.textMuted, fontSize: 12 }}
        >
          Today
        </button>
        <button
          onClick={() => setOffset((o) => o + 14)}
          style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: COLORS.textMuted }}
        >
          <Icon name="chevronRight" size={14} />
        </button>
        <span style={{ fontSize: 12, color: COLORS.textDim }}>
          {formatDateFull(days[0])} — {formatDateFull(days[days.length - 1])}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ overflowX: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 8, background: COLORS.surface }}>
        <div style={{ position: "relative", minWidth: daysToShow * dayWidth, height: headerHeight + sorted.length * rowHeight + 20 }}>
          {/* Day headers */}
          <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}`, height: headerHeight }}>
            {days.map((d, i) => {
              const isToday = d.toDateString() === today.toDateString();
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const isFirstOfMonth = d.getDate() === 1;
              return (
                <div
                  key={i}
                  style={{
                    width: dayWidth,
                    minWidth: dayWidth,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    borderRight: isFirstOfMonth ? `1px solid ${COLORS.borderLight}` : "none",
                    background: isToday ? COLORS.accentGlow : isWeekend ? "rgba(255,255,255,0.015)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>
                    {d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? COLORS.accent : COLORS.textMuted,
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: isToday ? `${COLORS.accent}22` : "transparent",
                    }}
                  >
                    {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Today line */}
          {todayX >= 0 && todayX <= daysToShow * dayWidth && (
            <div
              style={{
                position: "absolute",
                left: todayX + dayWidth / 2,
                top: headerHeight,
                bottom: 0,
                width: 1,
                background: COLORS.accent,
                opacity: 0.4,
                zIndex: 5,
              }}
            />
          )}

          {/* Project bars / markers */}
          {sorted.map((project, i) => {
            const left = getPosition(project.startDate);
            const cfg = STATUS_CONFIG[project.status];
            const isSingle = project.dateMode === "single";

            if (isSingle) {
              const markerSize = 20;
              return (
                <div
                  key={project.id}
                  onClick={() => onSelect(project)}
                  style={{
                    position: "absolute",
                    top: headerHeight + i * rowHeight + 6,
                    left: Math.max(left + dayWidth / 2 - markerSize / 2, 0),
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    zIndex: 10,
                    height: rowHeight - 12,
                  }}
                >
                  <div style={{
                    width: markerSize,
                    height: markerSize,
                    background: cfg.color,
                    borderRadius: 4,
                    transform: "rotate(45deg)",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.text, whiteSpace: "nowrap" }}>
                    {project.title}
                  </span>
                </div>
              );
            }

            const right = getPosition(project.endDate);
            const width = Math.max(right - left, dayWidth);

            return (
              <div
                key={project.id}
                onClick={() => onSelect(project)}
                style={{
                  position: "absolute",
                  top: headerHeight + i * rowHeight + 6,
                  left: Math.max(left, 0),
                  width: width,
                  height: rowHeight - 12,
                  background: `${cfg.color}18`,
                  border: `1px solid ${cfg.color}44`,
                  borderRadius: 5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                  overflow: "hidden",
                  transition: "all 0.15s ease",
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${cfg.color}28`;
                  e.currentTarget.style.transform = "scaleY(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${cfg.color}18`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {project.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Calendar View ───────────────────────────────────────────────────────────
const CalendarView = ({ projects, onSelect }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(i);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getProjectsForDay = (day) => {
    if (!day) return [];
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return projects.filter((p) => {
      if (!p.startDate) return false;
      const s = new Date(p.startDate);
      s.setHours(0, 0, 0, 0);
      const e = p.endDate ? new Date(p.endDate) : s;
      e.setHours(0, 0, 0, 0);
      return date >= s && date <= e;
    });
  };

  const navMonth = (dir) => {
    setViewDate(new Date(year, month + dir, 1));
  };

  return (
    <div>
      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => navMonth(-1)} style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: COLORS.textMuted }}>
          <Icon name="chevronLeft" size={14} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, minWidth: 160, textAlign: "center" }}>
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button onClick={() => navMonth(1)} style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: COLORS.textMuted }}>
          <Icon name="chevronRight" size={14} />
        </button>
      </div>

      {/* Grid */}
      <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", background: COLORS.surface }}>
        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${COLORS.border}` }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontSize: 11, fontWeight: 600, color: COLORS.textDim, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => {
            const isToday = day && new Date(year, month, day).toDateString() === today.toDateString();
            const dayProjects = getProjectsForDay(day);

            return (
              <div
                key={i}
                style={{
                  minHeight: 90,
                  padding: 6,
                  borderRight: (i + 1) % 7 !== 0 ? `1px solid ${COLORS.border}` : "none",
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: isToday ? COLORS.accentGlow : day ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                {day && (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? COLORS.accent : COLORS.textMuted,
                        background: isToday ? `${COLORS.accent}22` : "transparent",
                        marginBottom: 4,
                      }}
                    >
                      {day}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {dayProjects.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelect(p)}
                          style={{
                            padding: "2px 5px",
                            background: `${STATUS_CONFIG[p.status].color}20`,
                            borderLeft: `2px solid ${STATUS_CONFIG[p.status].color}`,
                            borderRadius: 2,
                            fontSize: 10,
                            color: COLORS.text,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.title}
                        </div>
                      ))}
                      {dayProjects.length > 3 && (
                        <span style={{ fontSize: 9, color: COLORS.textDim, paddingLeft: 5 }}>
                          +{dayProjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── List View ───────────────────────────────────────────────────────────────
const ListView = ({ projects, onSelect }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {/* Header */}
    <div className="creatly-list-header" style={{ display: "grid", gridTemplateColumns: "2fr 100px 80px 140px 1fr", gap: 12, padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
      {["Project", "Status", "Priority", "Date", "Tags"].map((h) => (
        <span key={h} style={{ fontSize: 10, fontWeight: 600, color: COLORS.textDim, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {h}
        </span>
      ))}
    </div>

    {projects.map((p) => (
      <div
        key={p.id}
        className="creatly-list-row"
        onClick={() => onSelect(p)}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 100px 80px 140px 1fr",
          gap: 12,
          padding: "10px 14px",
          cursor: "pointer",
          borderRadius: 6,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.surfaceHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.title}
        </span>
        <StatusBadge status={p.status} small />
        <PriorityBadge priority={p.priority} />
        <span className="creatly-list-date" style={{ fontSize: 12, color: COLORS.textDim }}>
          {p.startDate
            ? p.dateMode === "single"
              ? formatDate(p.startDate)
              : `${formatDate(p.startDate)} → ${formatDate(p.endDate)}`
            : "—"}
        </span>
        <div className="creatly-list-tags" style={{ display: "flex", gap: 4, overflow: "hidden" }}>
          {p.tags.slice(0, 3).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── Docs / Knowledge Base View ─────────────────────────────────────────────
const FOLDER_PRESETS = ["General", "Brand Guidelines", "SOPs", "Meeting Notes", "Templates", "Strategy"];

const DocsView = ({ docs, onSave, onDelete, theme }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFolder, setEditFolder] = useState("General");
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Get all unique folders
  const allFolders = useMemo(() => {
    const set = new Set(FOLDER_PRESETS);
    docs.forEach((d) => d.folder && set.add(d.folder));
    return [...set].sort();
  }, [docs]);

  // Filter docs
  const filtered = useMemo(() => {
    let result = docs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.title.toLowerCase().includes(q) || d.content?.toLowerCase().includes(q));
    }
    if (folderFilter !== "all") {
      result = result.filter((d) => d.folder === folderFilter);
    }
    return result;
  }, [docs, search, folderFilter]);

  const selectDoc = (doc) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content || "");
    setEditFolder(doc.folder || "General");
    setConfirmDelete(false);
  };

  const createNew = () => {
    const doc = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      title: "Untitled Document",
      content: "",
      folder: folderFilter !== "all" ? folderFilter : "General",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(doc);
    selectDoc(doc);
  };

  const handleSave = () => {
    if (!selectedDoc) return;
    onSave({ ...selectedDoc, title: editTitle, content: editContent, folder: editFolder });
  };

  const handleAiWrite = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: `You are a professional business writer for a Swedish e-commerce headwear brand called Hatstore/Creatly. Write the following document in a clear, professional tone. Use markdown formatting with headers, bullet points, and sections where appropriate.\n\nDocument request: ${aiPrompt}\n\n${editContent ? `Existing content to build on:\n${editContent}` : ""}` }],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const text = data.content?.map((c) => c.text || "").join("\n") || "Error generating content.";
        setEditContent((prev) => (prev ? prev + "\n\n" + text : text));
        setAiLoading(false);
        setAiPrompt("");
      })
      .catch(() => {
        setAiLoading(false);
        setEditContent((prev) => prev + "\n\n[AI generation failed — check console for errors]");
      });
  };

  const addCustomFolder = () => {
    if (newFolderName.trim()) {
      setEditFolder(newFolderName.trim());
      setShowNewFolder(false);
      setNewFolderName("");
    }
  };

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6,
    padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
  };

  // ─── Doc Editor View ───
  if (selectedDoc) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={() => { handleSave(); setSelectedDoc(null); }}
          style={{
            background: "none", border: "none", color: COLORS.accent, fontSize: 13, cursor: "pointer",
            padding: "0 0 16px", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back to docs
        </button>

        {/* Title */}
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          style={{
            ...inputStyle, fontSize: 22, fontWeight: 700, padding: "12px 0", marginBottom: 8,
            background: "transparent", border: "none", borderBottom: `1px solid ${COLORS.border}`,
            borderRadius: 0, width: "100%",
          }}
        />

        {/* Folder selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>Folder:</span>
          {!showNewFolder ? (
            <>
              <select
                value={editFolder}
                onChange={(e) => { setEditFolder(e.target.value); }}
                onBlur={handleSave}
                style={{ ...inputStyle, width: "auto", appearance: "none", cursor: "pointer", padding: "4px 12px" }}
              >
                {allFolders.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <button onClick={() => setShowNewFolder(true)} style={{ background: "none", border: `1px dashed ${COLORS.border}`, borderRadius: 4, padding: "4px 8px", color: COLORS.textDim, fontSize: 11, cursor: "pointer" }}>
                + New folder
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomFolder()} placeholder="Folder name..." style={{ ...inputStyle, width: 160, padding: "4px 8px" }} autoFocus />
              <button onClick={addCustomFolder} style={{ background: COLORS.accent, border: "none", borderRadius: 4, padding: "4px 10px", color: COLORS.bg, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
              <button onClick={() => setShowNewFolder(false)} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", fontSize: 12 }}>Cancel</button>
            </div>
          )}
        </div>

        {/* AI Writer */}
        <div style={{
          background: `${COLORS.accent}08`, border: `1px solid ${COLORS.accent}22`, borderRadius: 8,
          padding: 14, marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            ✨ AI Writer
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleAiWrite()}
              placeholder="Describe what to write... e.g. 'Brand voice guidelines for social media'"
              style={{ ...inputStyle, flex: 1 }}
              disabled={aiLoading}
            />
            <button
              onClick={handleAiWrite}
              disabled={aiLoading || !aiPrompt.trim()}
              style={{
                background: aiLoading ? COLORS.surfaceActive : COLORS.accent,
                border: "none", borderRadius: 6, padding: "0 18px",
                color: aiLoading ? COLORS.textDim : COLORS.bg, fontSize: 13, fontWeight: 600, cursor: aiLoading ? "wait" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {aiLoading ? "Writing..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Content editor */}
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          placeholder="Start writing or use the AI writer above..."
          style={{
            ...inputStyle, minHeight: 400, resize: "vertical", fontFamily: "'DM Sans', monospace",
            lineHeight: 1.7, fontSize: 14, padding: 16, borderRadius: 8,
          }}
        />

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
          <div>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} style={{ background: "none", border: `1px solid ${COLORS.danger}33`, borderRadius: 6, padding: "8px 14px", color: COLORS.danger, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="trash" size={14} color={COLORS.danger} /> Delete
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.danger }}>Delete this doc?</span>
                <button onClick={() => { onDelete(selectedDoc.id); setSelectedDoc(null); }} style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 14px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, color: COLORS.textDim }}>
            {editContent.length} characters · Last saved {selectedDoc.updated_at ? new Date(selectedDoc.updated_at).toLocaleString() : "never"}
          </span>
        </div>
      </div>
    );
  }

  // ─── Doc List View ───
  return (
    <div>
      {/* Header bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Icon name="search" size={14} color={COLORS.textDim} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search docs..."
            style={{ ...inputStyle, paddingLeft: 32 }}
          />
        </div>
        <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)} style={{ ...inputStyle, width: "auto", appearance: "none", cursor: "pointer" }}>
          <option value="all">All Folders</option>
          {allFolders.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <button onClick={createNew} style={{ background: COLORS.accent, border: "none", borderRadius: 6, padding: "8px 16px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
          <Icon name="plus" size={14} color={COLORS.bg} /> New Doc
        </button>
      </div>

      {/* Docs grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: COLORS.textDim }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>{docs.length === 0 ? "No documents yet" : "No matching documents"}</p>
          <button onClick={createNew} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
            Create your first document
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => selectDoc(doc)}
              style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8,
                padding: 16, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceHover; e.currentTarget.style.borderColor = COLORS.borderLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.borderColor = COLORS.border; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0, lineHeight: 1.3, flex: 1 }}>
                  {doc.title}
                </h3>
                <span style={{ fontSize: 10, color: COLORS.textDim, background: COLORS.surfaceActive, padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 8 }}>
                  {doc.folder}
                </span>
              </div>
              <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {doc.content?.slice(0, 200) || "Empty document"}
              </p>
              <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textDim }}>
                {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Default field types ─────────────────────────────────────────────────────
const FIELD_TYPES = {
  text: { label: "Text", icon: "edit" },
  number: { label: "Number", icon: "edit" },
  date: { label: "Date", icon: "calendar" },
  select: { label: "Select", icon: "filter" },
  checkbox: { label: "Checkbox", icon: "grid" },
  url: { label: "URL", icon: "edit" },
};

const DEFAULT_VISIBLE_FIELDS = {
  description: true,
  status: true,
  priority: true,
  dates: true,
  tags: true,
  notes: false,
};

// ─── Field Visibility Settings Modal ─────────────────────────────────────────
const FieldSettingsModal = ({ visibleFields, customFields, onUpdateVisible, onAddField, onRemoveField, onClose }) => {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldOptions, setNewFieldOptions] = useState("");

  const handleAdd = () => {
    if (!newFieldName.trim()) return;
    const id = newFieldName.trim().toLowerCase().replace(/\s+/g, "_");
    if (customFields.find((f) => f.id === id)) return;
    onAddField({
      id,
      name: newFieldName.trim(),
      type: newFieldType,
      options: newFieldType === "select" ? newFieldOptions.split(",").map((s) => s.trim()).filter(Boolean) : [],
      visible: true,
    });
    setNewFieldName("");
    setNewFieldOptions("");
  };

  const inputStyle = {
    background: COLORS.surfaceActive,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "8px 12px",
    color: COLORS.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
          width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>Field Settings</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.textMuted }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Card visibility toggles */}
          <label style={labelStyle}>Show on Cards</label>
          <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 12px" }}>Choose which fields appear on project cards in the main view.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
            {Object.entries(DEFAULT_VISIBLE_FIELDS).map(([key]) => (
              <label
                key={key}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: COLORS.surfaceActive, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${visibleFields[key] ? COLORS.accent + "44" : COLORS.border}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleFields[key] ?? DEFAULT_VISIBLE_FIELDS[key]}
                  onChange={(e) => onUpdateVisible(key, e.target.checked)}
                  style={{ accentColor: COLORS.accent, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: COLORS.text, textTransform: "capitalize" }}>{key}</span>
              </label>
            ))}
            {customFields.map((f) => (
              <label
                key={f.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: COLORS.surfaceActive, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${f.visible ? COLORS.accent + "44" : COLORS.border}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={f.visible}
                  onChange={(e) => onUpdateVisible(`custom_${f.id}`, e.target.checked)}
                  style={{ accentColor: COLORS.accent, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{f.name}</span>
                <span style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase" }}>{f.type}</span>
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveField(f.id); }}
                  style={{ color: COLORS.danger, cursor: "pointer", fontSize: 12, padding: "2px 4px" }}
                >
                  <Icon name="trash" size={13} color={COLORS.danger} />
                </span>
              </label>
            ))}
          </div>

          {/* Add custom field */}
          <label style={labelStyle}>Add Custom Field</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}>
              <input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name..."
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
              >
                {Object.entries(FIELD_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            {newFieldType === "select" && (
              <input
                value={newFieldOptions}
                onChange={(e) => setNewFieldOptions(e.target.value)}
                placeholder="Options (comma separated)..."
                style={inputStyle}
              />
            )}
            <button
              onClick={handleAdd}
              style={{
                background: COLORS.accent, border: "none", borderRadius: 6, padding: "8px 18px",
                color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start",
              }}
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tag Manager Modal ───────────────────────────────────────────────────────
const TagManagerModal = ({ tagColors, allTags, onUpdate, onClose }) => {
  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState(TAG_PALETTE[0].color);

  const handleAdd = () => {
    const tag = newTag.trim().toLowerCase();
    if (!tag) return;
    onUpdate({ ...tagColors, [tag]: newColor });
    setNewTag("");
  };

  const handleColorChange = (tag, color) => {
    onUpdate({ ...tagColors, [tag]: color });
  };

  const handleRemoveColor = (tag) => {
    const next = { ...tagColors };
    delete next[tag];
    onUpdate(next);
  };

  // Merge: all tags from projects + any saved color tags
  const allKnown = [...new Set([...allTags, ...Object.keys(tagColors)])].sort();

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6,
    padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
          width: "100%", maxWidth: 440, maxHeight: "90vh", overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>Tag Colors</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.textMuted }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Existing tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {allKnown.map((tag) => {
              const currentColor = tagColors[tag];
              return (
                <div key={tag} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: COLORS.surfaceActive, borderRadius: 6,
                  border: `1px solid ${currentColor ? currentColor + "44" : COLORS.border}`,
                }}>
                  <Tag label={tag} color={currentColor} />
                  <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
                    {TAG_PALETTE.map((p) => (
                      <span
                        key={p.id}
                        onClick={() => handleColorChange(tag, p.color)}
                        style={{
                          width: 18, height: 18, borderRadius: "50%", background: p.color, cursor: "pointer",
                          border: currentColor === p.color ? "2px solid #fff" : "2px solid transparent",
                          transition: "border 0.15s",
                          flexShrink: 0,
                        }}
                        title={p.label}
                      />
                    ))}
                    {currentColor && (
                      <span
                        onClick={() => handleRemoveColor(tag)}
                        style={{ cursor: "pointer", color: COLORS.textDim, fontSize: 14, marginLeft: 4, padding: "0 2px" }}
                        title="Remove color"
                      >
                        ×
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {allKnown.length === 0 && (
              <p style={{ fontSize: 13, color: COLORS.textDim, textAlign: "center", padding: 12 }}>No tags yet. Add tags to projects first, or create one below.</p>
            )}
          </div>

          {/* Add new tag with color */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {TAG_PALETTE.slice(0, 5).map((p) => (
                <span
                  key={p.id}
                  onClick={() => setNewColor(p.color)}
                  style={{
                    width: 20, height: 20, borderRadius: "50%", background: p.color, cursor: "pointer",
                    border: newColor === p.color ? "2px solid #fff" : "2px solid transparent",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleAdd}
              style={{
                background: COLORS.accent, border: "none", borderRadius: 6, padding: "0 14px",
                color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AI Chat Assistant ──────────────────────────────────────────────────────
const AiChatAssistant = ({ projects, saveProject, deleteProject, currentUserId, onOpenProject, showToast }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm your Creatly assistant. I can create projects, add to-dos, update statuses, or summarize what's on your plate. What do you need?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildSystemPrompt = () => {
    const projectSummary = projects.map(p =>
      `- "${p.title}" (id:${p.id}, status:${p.status}, priority:${p.priority}, assignee:${p.assignee || "unassigned"}, tags:[${p.tags?.join(",")}])`
    ).join("\n");

    return `You are Creatly Assistant, an AI helper inside a project planner app for Hatstore (Swedish e-commerce headwear brand). Users are Ludvig and Johannes.

CURRENT PROJECTS:
${projectSummary || "(no projects yet)"}

You can perform actions by including a JSON block in your response wrapped in <actions> tags. Available actions:

1. Create a project:
<actions>[{"action":"create_project","title":"...","description":"...","status":"backlog","priority":"medium","assignee":"ludvig"|"johannes"|null,"tags":["tag1"],"dateMode":"range","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD"}]</actions>

2. Update a project:
<actions>[{"action":"update_project","id":"project-uuid","updates":{"status":"active","priority":"high","assignee":"ludvig"}}]</actions>

3. Delete a project:
<actions>[{"action":"delete_project","id":"project-uuid"}]</actions>

4. Add to-dos to a project (requires project id):
<actions>[{"action":"add_todos","project_id":"project-uuid","todos":[{"text":"task text","assignee":"ludvig"|"johannes"|null}]}]</actions>

RULES:
- Always respond conversationally AND include actions when the user wants something done.
- For new projects, use sensible defaults: status=backlog, priority=medium, dateMode=range, startDate=today, endDate=2 weeks from now.
- Today's date is ${new Date().toISOString().split("T")[0]}.
- When a user pastes a meeting transcript, create a project AND extract to-dos from it.
- When asked about what's going on, summarize projects grouped by status.
- Keep responses short and punchy. No fluff.
- If you need to reference a project, use its title — the user doesn't know UUIDs.
- You can include multiple actions in one response.`;
  };

  const executeActions = async (actionsText) => {
    try {
      const actions = JSON.parse(actionsText);
      for (const action of actions) {
        if (action.action === "create_project") {
          const project = {
            id: uid(),
            title: action.title || "Untitled",
            description: action.description || "",
            status: action.status || "backlog",
            priority: action.priority || "medium",
            assignee: action.assignee || null,
            dateMode: action.dateMode || "range",
            startDate: action.startDate || new Date().toISOString().split("T")[0],
            endDate: action.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
            tags: action.tags || [],
            notes: action.notes || "",
            customFields: {},
            created: new Date().toISOString(),
          };
          await saveProject(project, currentUserId);
          showToast(`Created project "${project.title}"`);

          // If there are todos bundled with project creation
          if (action.todos && action.todos.length > 0) {
            const { supabase } = await import("./supabase");
            const startOrder = 0;
            const rows = action.todos.map((item, i) => ({
              id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
              project_id: project.id,
              text: item.text,
              assignee: item.assignee || null,
              done: false,
              sort_order: startOrder + i,
              created_at: new Date().toISOString(),
            }));
            await supabase.from("todos").upsert(rows);
          }
        } else if (action.action === "update_project") {
          const existing = projects.find(p => p.id === action.id);
          if (existing) {
            const updated = { ...existing, ...action.updates };
            await saveProject(updated, currentUserId);
            showToast(`Updated "${existing.title}"`);
          }
        } else if (action.action === "delete_project") {
          const existing = projects.find(p => p.id === action.id);
          if (existing) {
            await deleteProject(action.id);
            showToast(`Deleted "${existing.title}"`);
          }
        } else if (action.action === "add_todos") {
          const { supabase } = await import("./supabase");
          const { data: existingTodos } = await supabase
            .from("todos")
            .select("sort_order")
            .eq("project_id", action.project_id)
            .order("sort_order", { ascending: false })
            .limit(1);
          const startOrder = (existingTodos?.[0]?.sort_order ?? -1) + 1;
          const rows = action.todos.map((item, i) => ({
            id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
            project_id: action.project_id,
            text: item.text,
            assignee: item.assignee || null,
            done: false,
            sort_order: startOrder + i,
            created_at: new Date().toISOString(),
          }));
          await supabase.from("todos").upsert(rows);
          showToast(`Added ${rows.length} to-do(s)`);
        }
      }
    } catch (e) {
      console.error("Failed to execute actions:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build conversation for API (skip first assistant greeting)
      const apiMessages = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "Sorry, something went wrong.";

      // Extract and execute actions
      const actionsMatch = text.match(/<actions>([\s\S]*?)<\/actions>/);
      if (actionsMatch) {
        await executeActions(actionsMatch[1]);
      }

      // Clean the display text (remove action tags)
      const displayText = text.replace(/<actions>[\s\S]*?<\/actions>/g, "").trim();
      setMessages(prev => [...prev, { role: "assistant", content: displayText }]);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: "Oops, couldn't reach the AI. Try again." }]);
    }
    setLoading(false);
  };

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 8,
    padding: "10px 14px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%",
    boxSizing: "border-box", fontFamily: "inherit",
  };

  // Floating button
  if (!open) {
    return (
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          width: 52, height: 52, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(122,207,133,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(122,207,133,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(122,207,133,0.4)"; }}
        title="Creatly Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5-1.34C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill={COLORS.bg} stroke={COLORS.bg} strokeWidth="0.5"/>
          <circle cx="8" cy="12" r="1.5" fill={COLORS.accent}/>
          <circle cx="12" cy="12" r="1.5" fill={COLORS.accent}/>
          <circle cx="16" cy="12" r="1.5" fill={COLORS.accent}/>
        </svg>
      </div>
    );
  }

  // Chat window
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9998,
      width: 400, maxWidth: "calc(100vw - 48px)", height: 520, maxHeight: "calc(100vh - 100px)",
      background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
      boxShadow: "0 16px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Creatly Assistant</div>
            <div style={{ fontSize: 10, color: COLORS.textDim }}>AI-powered project helper</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}
        >
          <Icon name="x" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
              background: msg.role === "user" ? COLORS.accent : COLORS.surfaceActive,
              color: msg.role === "user" ? COLORS.bg : COLORS.text,
              fontSize: 13, lineHeight: 1.5,
              borderBottomRightRadius: msg.role === "user" ? 4 : 12,
              borderBottomLeftRadius: msg.role === "assistant" ? 4 : 12,
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "10px 14px", borderRadius: 12, borderBottomLeftRadius: 4,
              background: COLORS.surfaceActive, color: COLORS.textDim, fontSize: 13,
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Ask me anything... create projects, add tasks, get summaries"
            rows={2}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.4 }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: loading ? COLORS.surfaceActive : COLORS.accent,
              border: "none", borderRadius: 8, padding: "0 14px",
              color: loading ? COLORS.textDim : COLORS.bg,
              fontSize: 16, cursor: loading ? "wait" : "pointer",
              alignSelf: "flex-end", height: 38, flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
function ProjectPlanner({ currentUser, currentUserId, onLogout }) {
  const { projects, loading, saveProject, deleteProject } = useProjects();
  const { tagColors, updateTagColor: handleUpdateTagColor } = useTagColors();
  const { visibleFields, setVisibleFields, customFieldDefs: customFields, setCustomFieldDefs: setCustomFields } = useAppSettings();
  const { docs, loading: docsLoading, saveDoc, deleteDoc } = useDocs();
  const [module, setModule] = useState("planner");
  const [view, setView] = useState("board");
  const [modal, setModal] = useState(null);
  const [detailProject, setDetailProject] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("creatly_theme") || "dark"; } catch(e) { return "dark"; }
  });

  // Apply theme
  COLORS = theme === "dark" ? DARK_THEME : LIGHT_THEME;
  useEffect(() => {
    try { localStorage.setItem("creatly_theme", theme); } catch(e) {}
  }, [theme]);

  // Toast notification for other user's changes
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Watch for realtime changes from the other user
  const prevProjectsRef = useRef(projects);
  useEffect(() => {
    const prev = prevProjectsRef.current;
    if (prev.length > 0 && projects.length > 0) {
      for (const p of projects) {
        const old = prev.find(o => o.id === p.id);
        if (p.updatedBy && p.updatedBy !== currentUserId) {
          if (!old) {
            showToast(`${p.updatedBy === "ludvig" ? "Ludvig" : "Johannes"} created "${p.title}"`);
            break;
          } else if (old.status !== p.status || old.title !== p.title) {
            showToast(`${p.updatedBy === "ludvig" ? "Ludvig" : "Johannes"} updated "${p.title}"`);
            break;
          }
        }
      }
    }
    prevProjectsRef.current = projects;
  }, [projects, currentUserId, showToast]);

  const filtered = useMemo(() => {
    let result = projects;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }
    return result;
  }, [projects, search, filterStatus]);

  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [projects]);

  const handleSave = (project) => {
    saveProject(project, currentUserId);
    setModal(null);
  };

  const handleDetailSave = (project) => {
    saveProject(project, currentUserId);
    // Update the detailProject reference so the view stays in sync
    setDetailProject(project);
  };

  const handleDelete = (id) => {
    deleteProject(id);
    setModal(null);
    setDetailProject(null);
  };

  const handleCardClick = (project) => {
    setDetailProject(project);
  };

  const handleUpdateVisible = (key, value) => {
    if (key.startsWith("custom_")) {
      const fieldId = key.replace("custom_", "");
      const updated = customFields.map((f) => f.id === fieldId ? { ...f, visible: value } : f);
      setCustomFields(updated);
    } else {
      setVisibleFields({ ...visibleFields, [key]: value });
    }
  };

  const handleAddField = (field) => {
    setCustomFields([...customFields, field]);
  };

  const handleRemoveField = (fieldId) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId));
  };

  const viewButtons = [
    { key: "board", icon: "grid", label: "Board" },
    { key: "timeline", icon: "timeline", label: "Timeline" },
    { key: "calendar", icon: "calendar", label: "Calendar" },
    { key: "list", icon: "timeline", label: "List" },
  ];

  if (loading || docsLoading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.accent, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        html, body, #root { background: ${COLORS.bg} !important; min-height: 100vh; margin: 0; padding: 0; color: ${COLORS.text}; }
        *, *::before, *::after { box-sizing: border-box; }
        select option { background: ${COLORS.surface}; color: ${COLORS.text}; }
        input::placeholder, textarea::placeholder { color: ${COLORS.textDim}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        @media (max-width: 768px) {
          .creatly-header { flex-direction: column !important; gap: 10px !important; padding: 10px 14px !important; }
          .creatly-header-search { max-width: 100% !important; }
          .creatly-header-actions { width: 100%; justify-content: space-between !important; flex-wrap: wrap; }
          .creatly-board { grid-template-columns: 1fr !important; }
          .creatly-list-row { grid-template-columns: 1fr auto !important; }
          .creatly-list-header { display: none !important; }
          .creatly-list-tags, .creatly-list-date { display: none !important; }
          .creatly-detail-layout { grid-template-columns: 1fr !important; }
          main { padding: 12px !important; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <header
        className="creatly-header"
        style={{
          padding: "14px 24px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          background: COLORS.surface,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={LOGO_SRC} alt="creatly" style={{ height: 26, objectFit: "contain" }} />
          {/* Module tabs */}
          <div style={{ display: "flex", background: COLORS.surfaceActive, borderRadius: 6, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            {[{ key: "planner", label: "Planner" }, { key: "docs", label: "Docs" }].map((m) => (
              <button
                key={m.key}
                onClick={() => setModule(m.key)}
                style={{
                  background: module === m.key ? COLORS.bg : "transparent",
                  border: "none", padding: "6px 14px", cursor: "pointer",
                  color: module === m.key ? COLORS.accent : COLORS.textDim,
                  fontSize: 12, fontWeight: module === m.key ? 600 : 400, transition: "all 0.15s",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {module === "planner" && <div className="creatly-header-search" style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 500 }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1 }}>
            <Icon name="search" size={14} color={COLORS.textDim} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              style={{
                width: "100%",
                background: COLORS.surfaceActive,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                padding: "7px 10px 7px 32px",
                color: COLORS.text,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: COLORS.surfaceActive,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              padding: "7px 10px",
              color: COLORS.textMuted,
              fontSize: 12,
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>}

        <div className="creatly-header-actions" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* User indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: COLORS.surfaceActive, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
            <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{currentUser.name}</span>
            <button
              onClick={onLogout}
              style={{ background: "none", border: "none", color: COLORS.textDim, fontSize: 11, cursor: "pointer", padding: "0 0 0 4px" }}
              title="Sign out"
            >
              ✕
            </button>
          </div>

          {/* Theme Toggle - always visible */}
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{
              background: COLORS.surfaceActive,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              padding: "7px 10px",
              cursor: "pointer",
              color: COLORS.textMuted,
              fontSize: 14,
              lineHeight: 1,
            }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Planner-only buttons */}
          {module === "planner" && (
            <>
              {/* View toggles */}
              <div style={{ display: "flex", background: COLORS.surfaceActive, borderRadius: 6, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                {viewButtons.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setView(v.key)}
                    style={{
                      background: view === v.key ? COLORS.bg : "transparent",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                      color: view === v.key ? COLORS.accent : COLORS.textDim,
                      fontSize: 11,
                      fontWeight: view === v.key ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon name={v.icon} size={13} color={view === v.key ? COLORS.accent : COLORS.textDim} />
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Tag Colors */}
              <button
                onClick={() => setShowTagManager(true)}
                style={{
                  background: COLORS.surfaceActive,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: "7px 10px",
                  cursor: "pointer",
                  color: COLORS.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                }}
              >
                Tags
              </button>

              {/* Field Settings */}
              <button
                onClick={() => setShowFieldSettings(true)}
                style={{
                  background: COLORS.surfaceActive,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: "7px 10px",
                  cursor: "pointer",
                  color: COLORS.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                }}
              >
                <Icon name="filter" size={13} color={COLORS.textMuted} />
                Fields
              </button>

              {/* New Project */}
              <button
                onClick={() => setModal("new")}
                style={{
                  background: COLORS.accent,
                  border: "none",
                  borderRadius: 6,
                  padding: "7px 14px",
                  color: COLORS.bg,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Icon name="plus" size={14} color={COLORS.bg} />
                New
              </button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: 24, maxWidth: module === "planner" && view === "timeline" && !detailProject ? "none" : 1400, margin: "0 auto" }}>
        {/* Project Detail View */}
        {module === "planner" && detailProject && (
          <ProjectDetailView
            project={projects.find(p => p.id === detailProject.id) || detailProject}
            onSave={handleDetailSave}
            onDelete={handleDelete}
            onClose={() => setDetailProject(null)}
            customFields={customFields}
            tagColors={tagColors}
            allTags={allTags}
            onUpdateTagColor={handleUpdateTagColor}
            currentUserId={currentUserId}
          />
        )}

        {/* Planner views */}
        {module === "planner" && !detailProject && (
          <>
            {view === "board" && <BoardView projects={filtered} onSelect={handleCardClick} visibleFields={visibleFields} customFields={customFields} tagColors={tagColors} />}
            {view === "timeline" && <TimelineView projects={filtered} onSelect={handleCardClick} />}
            {view === "calendar" && <CalendarView projects={filtered} onSelect={handleCardClick} />}
            {view === "list" && <ListView projects={filtered} onSelect={handleCardClick} />}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: COLORS.textDim }}>
                <p style={{ fontSize: 14, marginBottom: 8 }}>No projects found</p>
                <button
                  onClick={() => setModal("new")}
                  style={{
                    background: "none",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: "8px 18px",
                    color: COLORS.textMuted,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Create your first project
                </button>
              </div>
            )}
          </>
        )}

        {/* Docs view */}
        {module === "docs" && (
          <DocsView docs={docs} onSave={(doc) => saveDoc(doc, currentUserId)} onDelete={deleteDoc} theme={theme} />
        )}
      </main>

      {/* Project Modal (new projects only) */}
      {modal === "new" && (
        <ProjectModal
          project={null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
          customFields={customFields}
          tagColors={tagColors}
          allTags={allTags}
          onUpdateTagColor={handleUpdateTagColor}
        />
      )}

      {/* Field Settings Modal */}
      {showFieldSettings && (
        <FieldSettingsModal
          visibleFields={visibleFields}
          customFields={customFields}
          onUpdateVisible={handleUpdateVisible}
          onAddField={handleAddField}
          onRemoveField={handleRemoveField}
          onClose={() => setShowFieldSettings(false)}
        />
      )}

      {/* Tag Manager Modal */}
      {showTagManager && (
        <TagManagerModal
          tagColors={tagColors}
          allTags={allTags}
          onUpdate={setTagColors}
          onClose={() => setShowTagManager(false)}
        />
      )}

      {/* AI Chat Assistant */}
      <AiChatAssistant
        projects={projects}
        saveProject={saveProject}
        deleteProject={deleteProject}
        currentUserId={currentUserId}
        onOpenProject={(p) => setDetailProject(p)}
        showToast={showToast}
      />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 9999,
          background: COLORS.surface, border: `1px solid ${COLORS.accent}44`,
          borderRadius: 8, padding: "12px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
          <span style={{ fontSize: 13, color: COLORS.text }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

// ─── User Login Gate ─────────────────────────────────────────────────────────
const USERS = {
  ludvig: { name: "Ludvig", password: "ludvig" },
  johannes: { name: "Johannes", password: "johannes" },
};
const USER_KEY = "creatly_user";

function UserGate({ children }) {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(USER_KEY);
      if (stored && USERS[stored]) setUser(stored);
    } catch (e) {}
    setChecking(false);
  }, []);

  const handleSubmit = () => {
    const entry = Object.entries(USERS).find(([, u]) => u.password === input);
    if (entry) {
      const [key] = entry;
      try { window.sessionStorage.setItem(USER_KEY, key); } catch (e) {}
      setUser(key);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  const handleLogout = () => {
    try { window.sessionStorage.removeItem(USER_KEY); } catch (e) {}
    setUser(null);
    setInput("");
  };

  if (checking) return null;
  if (user) return children({ user: USERS[user], userId: user, onLogout: handleLogout });

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 360, padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src={LOGO_SRC} alt="creatly" style={{ height: 36, objectFit: "contain", marginBottom: 16 }} />
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Sign in to continue</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your password"
            autoFocus
            style={{
              background: COLORS.surfaceActive, border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
              borderRadius: 8, padding: "12px 16px", color: COLORS.text, fontSize: 15, outline: "none",
              width: "100%", boxSizing: "border-box", textAlign: "center", letterSpacing: "0.1em",
            }}
          />
          {error && <p style={{ color: COLORS.danger, fontSize: 13, textAlign: "center", margin: 0 }}>Wrong password</p>}
          <button
            onClick={handleSubmit}
            style={{
              background: COLORS.accent, border: "none", borderRadius: 8, padding: "12px 24px",
              color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%",
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserGate>
      {({ user, userId, onLogout }) => <ProjectPlanner currentUser={user} currentUserId={userId} onLogout={onLogout} />}
    </UserGate>
  );
}
