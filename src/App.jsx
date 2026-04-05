import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useProjects, useTagColors, useAppSettings, useDocs, useTodos, useClients, useNotifications, useServices, useIdeas } from "./hooks";

// ─── Config ──────────────────────────────────────────────────────────────────

const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAA+CAYAAABuk1SaAAAWV0lEQVR42u2debRfVXXHP/s3vExkIIGEAAXMQhAUwamCCKLLolYsihS7ChVroQ7YWhasqgUtFNSlFWICtFBLabUocxlcWFlY7XJAmRQqopbKoAQCgQwvycvL+/1+u3/c78k7ud7p93vvQULuWeuu95J3h3322fPeZx+jHvWY4uHuDTPrufuBwNXAGGCp27rAfODzZnapuzfNrPt8w96ql68eBYRtQKPsNjPrvVBxUDNIPXKHmbkk+w47agapR6bmMDN3992A9+UwSQ+YATxoZteHZ2oGqccOoTwABxYCpwGbc3yGecAtwPXRMzWD1GOHGR3g2QIG6QDDtYlVjx1ZkzR1WQ79NF7ICGjUNFCPetQMUo961AxSj3pscz6IkknjRusLMNS3Lc1xR8D3dssgqcyqm1kva4HcvRE5db1+FzFNBJneY/Z3LceZpJ9sbxX4o3tcuPApYoYtczKzbsG8t1qXCeLZinCZB2fR+yZDGFShgcmms1YfBBOIrJv6WxuYRRLyGzWzsfQCuXuzn4UbgKEayWPWZcBYfCAyEWEa/hYwXfjaUDDH3mQwSgxLej7C95CuDUAnvS6BYMvwXQBrV+/pVAG3QsZ9kGy8T7V2rPL+VgXC20LY7r4QOAQ4ObAvSSJpBrATSQHaJncfBp4EHgJ+DNxnZsOp93nJd2dJInqONOqY2Uh4ZwTfNGBXYE7Kz9pgZg8XfC8UxnVFXC8DXg0cCOwBzNU828B6dx8BngB+AdwF3Gtmo6l3DcocMSxDwMHAq4D9gN01t2m61gOj7v4s8Ahwv2B5NHmVWxEhuPt0zckzfNMeMLsMXKDt7jtFz+T5uuv7REVb8/cCrbTJzMYmgOuZJCHsXHq0CguFux8BHAccCuyil3Z0BekR1HxDjNcU0zwO/BdwlZk9lCbqWOqpvKEFfAXYCxhNwdiTtrrHzE4LMLr7wcAfi3kXSNqH+2eKSd+dp2L13dnAHwLvAF6s53qaY1e/u+YVz3Ez8DBwK/A1M1tVRphFZoqqXncG3gMcC+wjZsiDJeQqgrBbA9wDfMXMvpuF7whv5wBvB9bqHenRLGES0/w3VBDEJwinN2esa9Ay84ELzOwSd38LcH4ObF1gZ+DTZnbDIEJJwvrLwBJgJCNg5UCrVUA0XXc/BDhdjNEANgrgGEGW8WKP/r4r8H7geHe/DlhmZsMlk5ovRsxikJ2AeVr0rrt/QDC2gE0ios3R/a0sFZ/SPMcDHxYxboqurDl2Mua4l2B4j7tfbGZXxUxfhTl0n7v7CSTlHb+jhdsYEWAeLEQ/W8BRwFHufruI6PEcfM/R+rRzGKTMdHKZejMqMEizT/N3WgFsgZlmMLGxs+isGoPEC+ruHwE+JAAN9UAjB5FFWmkMeEZI+jPg9e5+ppn9tIBJxqIrzSBjwe529+OAs4BVQlozRUSZjma0P2E28GngGBHiM5EWbPYxx1E9Pwf4rLsfCpxtZuuztGWO5pwBnCsttl6wNCkPxWcJqHX6/WjgYHf/SzO7JwOWToTn3oAOtuv5snv69Se8ALZuCcxVRzz/LAbxRlpzuPs0d18KnKmFXxcRzCDRCIvU/ypgb+Ar7v5GaYBmzjN5lwMzpN0+Ivhc37AK0jowx0KZcseIGDczeOlEmGNHczwWuNzd5+pbVhL9aQEXyexapQVrDYjvYBo1gdUkBYVfcveXCZZGRTxbH9+frPf0+94J++llVyMjnHih/I2nIvu2jNN7kV3sJap2g35e5O6vFJNUJcqGTJ/9gK/K59hclagjITAbuEzO+KoSYgzz66bs/yJGeVpO/sVyNPNCoEGinw28GVhZQphFZoqqXncG3gMcC+wjZsiDJeQqgrBbA9wDfMXMvpuF7whv5wBvB9bqHenRLGES0/w3VBDEJwinN2esa9Ay84ELzOwSd38LcH4ObF1gZ+DTZnbDIEJJwvrLwBJgJCNg5UCrVUA0XXc/BDhdjNEANgrgGEGW8WKP/r4r8H7geHe/DlhmZsMlk5ovRsxikJ2AeVr0rrt/QDC2gE0ios3R/a0sFZ/SPMcDHxYxboqurDl2Mua4l2B4j7tfbGZXxUxfhTl0n7v7CSTlHb+jhdsYEWAeLEQ/W8BRwFHufruI6PEcfM/R+rRzGKTMdHKZejMqMEizT/N3WgFsgZlmMLGxs+isGoPEC+ruHwE+JAAN9UAjB5FFWmkMeEZI+jPg9e5+ppn9tIBJxqIrzSBjwe529+OAs4BVQlozRUSZjma0P2E28GngGBHiM5EWbPYxx1E9Pwf4rLsfCpxtZuuztGWO5pwBnCsttl6wNCkPxWcJqHX6/WjgYHf/SzO7JwOWToTn3oAOtuv5snv69Se8ALZuCcxVRzz/LAbxRlpzuPs0d18KnKmFXxcRzCDRCIvU/ypgb+Ar7v5GaYBmzjN5lwMzpN0+Ivhc37AK0jowx0KZcseIGDczeOlEmGNHczwWuNzd5+pbVhL9aQEXyexapQVrDYjvYBo1gdUkBYVfcveXCZZGRTxbH9+frPf0+94J++llVyMjnHih/I2nIvu2jNN7kV3sJap2g35e5O6vFJNUJcqGTJ/9gK/K59hclagjITAbuEzO+KoSYgzz66bs/yJGeVpO/sVyNPNCoEGinw28GVhZQphFZoqqXncG3gMcC+wjZsiDJeQqgrBbA9wDfMXMvpuF7whv5wBvB9bqHenRLGES0/w3VBDEJwinN2esa9Ay84ELzOwSd38LcH4ObF1gZ+DTZnbDIEJJwvrLwBJgJCNg5UCrVUA0XXc/BDhdjNEANgrgGEGW8WKP/r4r8H7geHe/DlhmZsMlk5ovRsxikJ2AeVr0rrt/QDC2gE0ios3R/a0sFZ/SPMcDHxYxboqurDl2Mua4l2B4j7tfbGZXxUxfhTl0n7v7CSTlHb+jhdsYEWAeLEQ/W8BRwFHufruI6PEcfM/R+rRzGKTMdHKZejMqMEizT/N3WgFsgZlmMLGxs+isGoPEC+ruHwE+JAAN9UAjB5FFWmkMeEZI+jPg9e5+ppn9tIBJxqIrzSBjwe529+OAs4BVQlozRUSZjma0P2E28GngGBHiM5EWbPYxx1E9Pwf4rLsfCpxtZuuztGWO5pwBnCsttl6wNCkPxWcJqHX6/WjgYHf/SzO7JwOWToTn3oAOtuv5snv69Se8ALZuCcxVRzz/LAbxRlpzuPs0d18KnKmFXxcRzCDRCIvU/ypgb+Ar7v5GaYBmzjN5lwMzpN0+Ivhc37AK0jowx0KZcseIGDczeOlEmGNHczwWuNzd5+pbVhL9aQEXyexapQVrDYjvYBo1gdUkBYVfcveXCZZGRTxbH9+frPf0+94J++llVyMjnHih/I2nIvu2jNN7kV3sJap2g35e5O6vFJNUJcqGTJ/9gK/K59hclagjITAbuEzO+KoSYwzx66TsvyJGeVpO/cVyNPNCr0mSoZ0NvB1YXUKaRWaKql53Bt4DHAPsJWbIgyXkKoKwWwPcA3zFzP4rC98RXs8B3gGs1fvTU1nCJKb5b6ggiEkQTm/OWNegZeYDF5jZJe7+FuD8HNi6wM7Ap83shkGEkoT1l4ElwEhGwMqBVquA6Lrufghwuhijoe8QwDGCLOPFHv19V+D9wPHufh2wzMyGSyY1X4yYxSA7AfO06F13/4BgbAGbRESbo/tbWSo+pXmOBz4sYtwUXVlz7GTMcS/B8B53v9jMroqZvgpz6D539xNIyjt+Rwu3MSLAPFCI/m8BRwFHufvtIqLHc/A9R+vTzmGQMtPJZerNqMAg/Wd3v88RJNUATVIB8PVHLwA9aGYXSJMuMrPV7v4y4G8E2BZ0/Y1+3wh8z92PlVkwI6pU7UTIfE3S/fNm9h/u/gHgi5J84cjTVoKrnQ+zyOzzHzCze4oKJYTfVWZ2nzTHn0fnY00U4vMA12bPNLNHK1q44z1NZDX1YCHGtV4Y/8HMHnL39yk5tqvMB3efT8YpW+7+SZJk3oYKjNT0DM8jY32Mu68xs/XhJk3Y3V9G0nkxr+D3IQl8n0Jxf8sknx2fBSHs7u77F0ikGe7+YvnBf2hmT5O0YQ0y8h8yaJB2Hj2mmtljJHu83mdm33L3j5EUkQ3LPGK8f1Td+j2C0FJ5qZg0SQx8ATjdzFb2YBpj644GFl5o1oHqDY48vNHdV0jl7kzSFzwk8v4FuAK42Mz+VmF3j+mJPCiabr4apCUT8JvufraZXVDGIGWSPeRkr0wf2tOYxCD3SPKcK3uqiCAWAL+SWXlmlCDeqMgOkfYB/Bk5uqjXYjnpVe5+nxJE9Jh1VknUO9z98pDnqrKBi/RN7wrPd2v63Mx+4e5LNK87Sbq+N6rZFKRbR/P2rGYCJJIXS4InfBmSDSqb5J8WA46g+X8CON/MvqMIzcdJ2l0VbUa0liTjtYqkZ5rn4O0i4/8rFNUKZv2hBfDl7VYNKJinbr6cIf1fKf9lKckBnCMVJ3QaMstCqUNqjVUDoIQLcByxIwT6Y5WCjkQ/FDPcrHPlCWGBcQJIYLZ3kfgvkT+1r7T5b4P+p6uY+wQK3w+J85xkRhH8R+TUdxrv2cT0L2B2VPuhd7r7B4BflFO+FLhcjBLXUXQyhNSj0t7dPdeJUVVIQaxR+y9OSH8nWOkqe7TGo/J7l+qfT+x3Hy5mwnkQlV2tOgQcRZlBnKIz5X2UMQ+bhZ+X0JhRi7AJAIr8pbf5XbECCqRW8l3QhVzMVEPIYXfPaWKHjX1P2O0dz+YpAF1lSKNdfr/WMnOPO2Y1xCvC1uPZdBfqJfjz/p5PqEY+K78m2N58A2pHLmLyuwCfYJpvCu+3/P+vRYZ5B87v5ORV6ezYKl0CDnM16lHSK+u0mhTd35h8TBrYcwjKgX4dqDPsaF6XmW7JuZCqbGzAn/0OYk8g0a7r6BHlLFWkv0PcNh3vUeLNqYrSO8ItKwEvPMvxWJ/Gu0dLk2PBkJDIffaAfJkV5yj8zp/SrZHQ8wk3V1HkHGi1Y8nuzN2APxqXj/H3p0j4D/2PD7k/T5E0dzzVFIvhP5SfLcThZ8Eqf1OAP4D+IFCO1YBrvDNktwPARcCPzKzR8JZG1OpWQYp8XiepC1EWMfRygWIa7Jy2RP0DH+q6M3yvniV2Uqvuvu7IhOjk8PoC4EvVdAeTfkDNwN3irEfr5gQ+9DdD9ai/UT4viYHl6cC/6Mk4tIcwt5EVh7kYsGWx+ij0fctI2moUQWf+6QLllTbZNWFpjZgZpcofLoP8Mmq+auDtcBj2h4c/n8G4fRP/f8Hyu6qIf57oZPOmFgd4z1F8ZaS7KAYLiqhyWh+sMrMbgcec/fPlxVo1gxSj3pMJIPUox49qCe7v0RRoPisTHd/qZm1awapxw7BIGFX35GSSu75kRBqkRyitAlYZWbPUDNIPXYYBokOVG8AN5pZM/q9CSwzs+vkV9QMUo8dZYSm0U8DX0y1wgqdCu8JDV5qBqnH9qRJ2rlmVsAg+0VarUE9/V2PemwPKkRRLYuScXeV3B6c3RG59z0UgfKJZJApIQTf6oSY5d+R7NoLEd2qMNqr5Fk3BrieZ+d+6LVjE0lFyyKCmyjYd0ePa/k2f1Iyv0f07oEUyjP5LlWG5hFP4/p4dFSh3RJVATrSpLyh2gd9oveLyWpTi++uFYR7Jh0JmMypz0JCJeR1MkFBq4/NbOfVCHqhGdwi8TjW6LnO2UE2CtIymCqWJypqQ5oo4B54m5gw98L3AvzxGAeS9lTT5CUuX1qhQmSnDiCIzW1FUdOMp6XAqSaPHG0KnEtV+tZXkxN190Xey/u1G8CJ3/6S+Wy8YONZEG8Z9e5c5+UkZ5WjPO9x9Zy3I5mgB7gLOMLO7+zj0s9S+5AkkCYH1VpyR9kXQ22U2XLXZGY+KfnRFnJH2jEK9a4GvZzBIMHWPJskW31X27jXAr0uSg+1kG+5TCjhVPWnzZJJTttZE4euJ8Eaap9j2W0R2uYzw2UwCfiAT9N8b0f5eV2L3iPYqV1Y4txfB0FDYO1HCJKzpbOBsdz+UpDnAJpmZ/wMJ9U8hNnEW5QAAAABJRU5ErkJggg==";

const DARK_THEME = {
  bg: "#111318",
  surface: "#161920",
  surfaceHover: "#1a1d24",
  surfaceActive: "#1e2230",
  border: "#1e2028",
  borderLight: "#252830",
  text: "#eef0f5",
  textMuted: "#9099b0",
  textDim: "#4a5270",
  accent: "#7ACF85",
  accentDim: "#5BB866",
  accentGlow: "rgba(122,207,133,0.08)",
  danger: "#e05a5a",
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
const ProjectCard = ({ project, onClick, compact, visibleFields = {}, customFields = [], tagColors = {}, clientMap = {} }) => {
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

      {/* Client badge */}
      {project.clientId && clientMap[project.clientId] && (
        <div style={{ marginTop: 8 }}>
          <span style={{
            fontSize: 10, color: COLORS.blue, background: `${COLORS.blue}15`,
            padding: "2px 8px", borderRadius: 4, border: `1px solid ${COLORS.blue}30`,
            fontWeight: 500, letterSpacing: "0.03em",
          }}>
            {clientMap[project.clientId].name}
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
const ProjectModal = ({ project, onSave, onDelete, onClose, customFields = [], tagColors = {}, allTags = [], onUpdateTagColor, clients = [] }) => {
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
      clientId: null,
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

          {/* Client / Brand */}
          {clients.length > 0 && (
            <div>
              <label style={labelStyle}>Client / Brand</label>
              <select value={form.clientId || ""} onChange={(e) => update("clientId", e.target.value || null)} style={selectStyle}>
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

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
const ProjectDetailView = ({ project, onSave, onDelete, onClose, customFields = [], tagColors = {}, allTags = [], onUpdateTagColor, currentUserId, clients = [] }) => {
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

          {/* Client / Brand */}
          {clients.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Client / Brand</label>
              <select value={form.clientId || ""} onChange={(e) => update("clientId", e.target.value || null)} style={selectStyle}>
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

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

// ─── Dashboard View ──────────────────────────────────────────────────────────
const DashboardView = ({ projects, currentUserId, onSelectProject }) => {
  const [allTodos, setAllTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(true);

  // Fetch all todos for current user across all projects
  useEffect(() => {
    const fetchAllTodos = async () => {
      const { supabase } = await import("./supabase");
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setAllTodos(data);
      setTodosLoading(false);
    };
    fetchAllTodos();
  }, [projects]); // refetch when projects change

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // My tasks (assigned to current user, not done)
  const myTodos = allTodos.filter(t => !t.done && t.assignee === currentUserId);
  const myDoneTodos = allTodos.filter(t => t.done && t.assignee === currentUserId);

  // Group projects by status
  const activeProjects = projects.filter(p => p.status === "active");
  const reviewProjects = projects.filter(p => p.status === "review");
  const plannedProjects = projects.filter(p => p.status === "planned");
  const backlogProjects = projects.filter(p => p.status === "backlog");
  const doneProjects = projects.filter(p => p.status === "done");

  // Overdue projects
  const overdueProjects = projects.filter(p =>
    p.endDate && p.status !== "done" && new Date(p.endDate) < now
  );

  // Recently updated (last 7 days, by other user)
  const recentlyUpdated = projects
    .filter(p => p.updatedBy && p.updatedBy !== currentUserId)
    .slice(0, 5);

  // Get project title from todo
  const getProjectTitle = (projectId) => {
    const p = projects.find(pr => pr.id === projectId);
    return p ? p.title : "Unknown project";
  };

  const getProject = (projectId) => projects.find(pr => pr.id === projectId);

  const cardStyle = {
    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
    padding: 20, overflow: "hidden",
  };

  const headerStyle = {
    fontSize: 13, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.04em",
    textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
  };

  const userName = currentUserId === "ludvig" ? "Ludvig" : "Johannes";

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: "0 0 6px" }}>
          Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}, {userName}
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textDim, margin: 0 }}>
          {activeProjects.length} active project{activeProjects.length !== 1 ? "s" : ""} · {myTodos.length} task{myTodos.length !== 1 ? "s" : ""} assigned to you
          {overdueProjects.length > 0 && <span style={{ color: COLORS.danger }}> · {overdueProjects.length} overdue</span>}
        </p>
      </div>

      {/* Stats Row */}
      <div className="creatly-dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Backlog", count: backlogProjects.length, color: COLORS.textDim },
          { label: "Planned", count: plannedProjects.length, color: COLORS.blue },
          { label: "Active", count: activeProjects.length, color: COLORS.accent },
          { label: "Review", count: reviewProjects.length, color: COLORS.purple },
          { label: "Done", count: doneProjects.length, color: COLORS.success },
        ].map(s => (
          <div key={s.label} style={{
            ...cardStyle, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="creatly-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* My Tasks */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
            My Tasks ({myTodos.length})
          </div>
          {todosLoading ? (
            <div style={{ color: COLORS.textDim, fontSize: 13, padding: 12 }}>Loading...</div>
          ) : myTodos.length === 0 ? (
            <div style={{ color: COLORS.textDim, fontSize: 13, padding: 12, textAlign: "center" }}>
              No tasks assigned to you right now
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflow: "auto" }}>
              {myTodos.slice(0, 15).map(todo => {
                const proj = getProject(todo.project_id);
                return (
                  <div
                    key={todo.id}
                    onClick={() => proj && onSelectProject(proj)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                      borderRadius: 6, cursor: "pointer", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: proj ? STATUS_CONFIG[proj.status]?.color || COLORS.textDim : COLORS.textDim,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {todo.text}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.textDim }}>{getProjectTitle(todo.project_id)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {myTodos.length > 15 && (
            <div style={{ fontSize: 11, color: COLORS.textDim, textAlign: "center", padding: "8px 0 0" }}>
              +{myTodos.length - 15} more tasks
            </div>
          )}
        </div>

        {/* Active & Review Projects */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
            Needs Attention ({activeProjects.length + reviewProjects.length})
          </div>
          {[...overdueProjects, ...reviewProjects, ...activeProjects.filter(p => !overdueProjects.includes(p))].length === 0 ? (
            <div style={{ color: COLORS.textDim, fontSize: 13, padding: 12, textAlign: "center" }}>
              No active projects right now
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflow: "auto" }}>
              {[...overdueProjects, ...reviewProjects, ...activeProjects.filter(p => !overdueProjects.includes(p))].slice(0, 10).map(p => {
                const isOverdue = overdueProjects.includes(p);
                const todoCount = allTodos.filter(t => t.project_id === p.id).length;
                const doneCount = allTodos.filter(t => t.project_id === p.id && t.done).length;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      background: isOverdue ? `${COLORS.danger}10` : COLORS.surfaceActive,
                      border: `1px solid ${isOverdue ? COLORS.danger + "33" : "transparent"}`,
                      borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = isOverdue ? `${COLORS.danger}10` : COLORS.surfaceActive}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.title}
                        </span>
                        {isOverdue && <span style={{ fontSize: 10, color: COLORS.danger, fontWeight: 600 }}>OVERDUE</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <StatusBadge status={p.status} small />
                        {p.assignee && (
                          <div style={{
                            width: 18, height: 18, borderRadius: "50%", fontSize: 9, fontWeight: 700,
                            background: p.assignee === "ludvig" ? COLORS.accent : COLORS.purple,
                            color: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {p.assignee === "ludvig" ? "L" : "J"}
                          </div>
                        )}
                        {todoCount > 0 && (
                          <span style={{ fontSize: 11, color: COLORS.textDim }}>{doneCount}/{todoCount} tasks</span>
                        )}
                        {p.endDate && (
                          <span style={{ fontSize: 11, color: isOverdue ? COLORS.danger : COLORS.textDim, marginLeft: "auto" }}>
                            Due {formatDate(p.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.blue }} />
            Recent Activity
          </div>
          {projects.slice(0, 8).map(p => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
                borderRadius: 6, cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: STATUS_CONFIG[p.status]?.color || COLORS.textDim,
              }} />
              <span style={{ fontSize: 13, color: COLORS.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.title}
              </span>
              <StatusBadge status={p.status} small />
              {p.updatedBy && (
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", fontSize: 9, fontWeight: 700,
                  background: p.updatedBy === "ludvig" ? COLORS.accent : COLORS.purple,
                  color: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {p.updatedBy === "ludvig" ? "L" : "J"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* My Completed Tasks */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.success }} />
            Completed ({myDoneTodos.length})
          </div>
          {myDoneTodos.length === 0 ? (
            <div style={{ color: COLORS.textDim, fontSize: 13, padding: 12, textAlign: "center" }}>
              No completed tasks yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflow: "auto" }}>
              {myDoneTodos.slice(0, 10).map(todo => (
                <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px" }}>
                  <span style={{ color: COLORS.accent, fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 13, color: COLORS.textDim, textDecoration: "line-through", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {todo.text}
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.textDim }}>{getProjectTitle(todo.project_id)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Board View ──────────────────────────────────────────────────────────────
const BoardView = ({ projects, onSelect, visibleFields, customFields, tagColors, clientMap = {} }) => {
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
const AiChatAssistant = ({ projects, docs, saveDoc, clients = [], clientMap = {}, services = [], saveProject, deleteProject, currentUserId, onOpenProject, showToast, pendingMessage, onPendingMessageConsumed }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm Kit, your Creatly assistant. I can create projects, add to-dos, write emails & copy based on your brand docs, or just chat. Try talking to me — hit the mic button!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const pendingVoiceSend = useRef(false);
  const sendMessageRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle messages pushed from outside (e.g. Kit button on idea cards)
  useEffect(() => {
    if (!pendingMessage) return;
    setOpen(true);
    setInput(pendingMessage);
    if (onPendingMessageConsumed) onPendingMessageConsumed();
    // Small delay to let open state settle, then auto-send
    setTimeout(() => {
      if (sendMessageRef.current) sendMessageRef.current(pendingMessage);
    }, 120);
  }, [pendingMessage]);

  // Speech-to-text
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    // Stop Kit from talking when user starts speaking
    window.speechSynthesis?.cancel();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported in this browser."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      setInput(transcript);
      if (e.results[0].isFinal) {
        setListening(false);
        pendingVoiceSend.current = true;
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // Text-to-speech
  const speak = (text) => {
    if (!voiceEnabled) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    // Try to find a good English voice
    const voices = synth.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
    // Auto-listen after Kit finishes speaking
    utterance.onend = () => {
      setTimeout(() => {
        if (voiceEnabled && !loading) toggleListening();
      }, 500);
    };
    synth.speak(utterance);
  };

  const buildSystemPrompt = () => {
    const projectSummary = projects.map(p => {
      const clientName = p.clientId && clientMap[p.clientId] ? ` client:${clientMap[p.clientId].name}` : "";
      return `- "${p.title}" (id:${p.id}, status:${p.status}, priority:${p.priority}, assignee:${p.assignee || "unassigned"}${clientName}, tags:[${p.tags?.join(",")}])`;
    }).join("\n");

    // Build client brand context
    const clientContext = clients.length > 0 ? clients.map(c => {
      const bc = c.brand_context || {};
      const parts = [];
      if (bc.tone_of_voice) parts.push(`Tone: ${bc.tone_of_voice}`);
      if (bc.guidelines) parts.push(`Guidelines: ${bc.guidelines}`);
      if (bc.preferences) parts.push(`Preferences: ${bc.preferences}`);
      if (bc.learnings) parts.push(`Learnings: ${bc.learnings}`);
      return `CLIENT: ${c.name}${c.industry ? ` (${c.industry})` : ""}\n${parts.join("\n") || "(no brand context yet)"}`;
    }).join("\n\n") : "";

    // Build knowledge base from docs — prioritize Brand Guidelines, Templates, SOPs
    const priorityFolders = ["Brand Guidelines", "Templates", "SOPs", "Strategy"];
    const sortedDocs = [...(docs || [])].sort((a, b) => {
      const aP = priorityFolders.indexOf(a.folder);
      const bP = priorityFolders.indexOf(b.folder);
      return (aP === -1 ? 99 : aP) - (bP === -1 ? 99 : bP);
    });
    const docsContext = sortedDocs
      .filter(d => d.content && d.content.trim())
      .slice(0, 10)
      .map(d => `[${d.folder || "General"}] ${d.title} (id:${d.id}):\n${d.content.slice(0, 1500)}`)
      .join("\n\n---\n\n");

    // Build services/rate card context
    const servicesContext = services.length > 0 ? services.map(s =>
      `- ${s.name} (${s.category}): ${s.price_sek.toLocaleString("sv-SE")} SEK, ~${s.estimated_days} day${s.estimated_days !== 1 ? "s" : ""}${s.description ? ` — ${s.description}` : ""}`
    ).join("\n") : "";

        return `You are Kit, the AI assistant inside Creatly — a creative bureau that focuses only on AI. You help the team (Ludvig and Johannes) manage projects, write content, and get things done. You're sharp, helpful, and a bit playful.

You have access to web search. Use it proactively when you need current information — competitor research, market context, brand analysis, pricing, recent news, etc. Don't ask permission to search, just do it.

COMPETITIVE BRIEF: When a user asks you to research a competitor or gives you a URL/brand name to analyze, use web search to gather real data and output a structured brief in this format:

---
**COMPETITIVE BRIEF: [Brand Name]**

**Overview** — What they do, positioning, target audience

**Creative & Content** — Ad style, content formats, tone, visual identity

**Channels** — Where they're active (Meta, TikTok, email, SEO, etc.)

**Strengths** — What they do well

**Weaknesses / Gaps** — Where they're weak or missing

**Opportunities for [our client / Creatly]** — Specific angles we can exploit

**Key Takeaways** — 3–5 bullets for immediate action
---

Always ground the brief in real findings from your search. Be specific — mention actual campaigns, taglines, or tactics if you find them.

CURRENT PROJECTS:
${projectSummary || "(no projects yet)"}

${servicesContext ? `CREATLY SERVICES & RATE CARD (use this when generating creative briefs or discussing pricing):\n${servicesContext}\n\n` : ""}${clientContext ? `CLIENT BRAND CONTEXT (use this when creating content for or about these clients — apply their tone, guidelines, and preferences):
${clientContext}

` : ""}KNOWLEDGE BASE (from Creatly Docs — use this for brand context, tone, templates, and best practices when creating content):
${docsContext || "(no docs yet — ask the user to add brand guidelines, templates, and SOPs to Creatly Docs)"}

You can perform actions by including a JSON block in your response wrapped in <actions> tags. Available actions:

1. Create a project:
<actions>[{"action":"create_project","title":"...","description":"...","status":"backlog","priority":"medium","assignee":"ludvig"|"johannes"|null,"tags":["tag1"],"dateMode":"range","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","todos":[{"text":"task","assignee":"ludvig"|null}]}]</actions>

2. Update a project:
<actions>[{"action":"update_project","id":"project-uuid","updates":{"status":"active","priority":"high","assignee":"ludvig"}}]</actions>

3. Delete a project:
<actions>[{"action":"delete_project","id":"project-uuid"}]</actions>

4. Add to-dos to a project (requires project id):
<actions>[{"action":"add_todos","project_id":"project-uuid","todos":[{"text":"task text","assignee":"ludvig"|"johannes"|null}]}]</actions>

5. Plan a full project from a goal (AI Project Planner — use this when the user gives you a goal, client, and/or deadline and asks you to plan it out):
<actions>[{"action":"plan_projects","projects":[{"title":"...","description":"...","status":"backlog","priority":"high","assignee":"ludvig"|"johannes"|null,"clientId":null,"tags":["tag1"],"dateMode":"range","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","todos":[{"text":"task","assignee":"ludvig"|"johannes"|null}]}]}]</actions>

6. Create a new doc in the Creatly Docs knowledge base:
<actions>[{"action":"create_doc","title":"...","content":"full markdown content here","folder":"General|Brand Guidelines|SOPs|Meeting Notes|Templates|Strategy"}]</actions>

7. Update an existing doc (use the doc id from the knowledge base context):
<actions>[{"action":"update_doc","id":"doc-uuid","title":"...","content":"updated full markdown content"}]</actions>

RULES:
- Always respond conversationally AND include actions when the user wants something done.
- For new projects, use sensible defaults: status=backlog, priority=medium, dateMode=range, startDate=today, endDate=2 weeks from now.
- Today's date is ${new Date().toISOString().split("T")[0]}.
- When a user pastes a meeting transcript, create a project AND extract to-dos from it.
- When asked to write content for a specific client, ALWAYS apply their brand context (tone, guidelines, preferences). If they have no brand context yet, remind the user to fill it in on the Clients page.
- When asked to write content (emails, copy, briefs, etc.), check both Client Brand Context AND Knowledge Base for tone, guidelines, and templates.
- When creating projects that involve content deliverables, put the actual written content in the project description AND break down execution steps as to-dos.
- When asked about what's going on, summarize projects grouped by status.
- Keep responses short and punchy. No fluff.
- If you need to reference a project, use its title — the user doesn't know UUIDs.
- You can include multiple actions in one response.
- For plan_projects: break the goal into logical sub-projects (e.g. Strategy, Content Production, Distribution), assign realistic dates spread across the timeline, and populate each with specific actionable to-dos with assignees. Think like a project manager.
- For create_doc / update_doc: write proper markdown — use headers, bullets, sections. Pick the most relevant folder. When asked to "save this to Docs" or "create a doc about X", use these actions. For update_doc, rewrite the full content.
- You can see existing doc IDs in the knowledge base context above — use them for update_doc.`;
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
        } else if (action.action === "plan_projects") {
          const { supabase } = await import("./supabase");
          const projectList = action.projects || [];
          for (const p of projectList) {
            const project = {
              id: uid(),
              title: p.title || "Untitled",
              description: p.description || "",
              status: p.status || "backlog",
              priority: p.priority || "medium",
              assignee: p.assignee || null,
              clientId: p.clientId || null,
              dateMode: p.dateMode || "range",
              startDate: p.startDate || new Date().toISOString().split("T")[0],
              endDate: p.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
              tags: p.tags || [],
              notes: p.notes || "",
              customFields: {},
              created: new Date().toISOString(),
            };
            await saveProject(project, currentUserId);
            if (p.todos && p.todos.length > 0) {
              const todoRows = p.todos.map((item, i) => ({
                id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
                project_id: project.id,
                text: item.text,
                assignee: item.assignee || null,
                done: false,
                sort_order: i,
                created_at: new Date().toISOString(),
              }));
              await supabase.from("todos").upsert(todoRows);
            }
          }
          showToast(`Created ${projectList.length} project${projectList.length !== 1 ? "s" : ""} 🎯`);
        } else if (action.action === "create_doc") {
          const newDoc = {
            id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
            title: action.title || "Untitled",
            content: action.content || "",
            folder: action.folder || "General",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await saveDoc(newDoc, currentUserId);
          showToast(`Doc created: "${newDoc.title}" 📝`);
        } else if (action.action === "update_doc") {
          const existing = docs.find(d => d.id === action.id);
          if (existing) {
            const updated = {
              ...existing,
              title: action.title || existing.title,
              content: action.content || existing.content,
              updated_at: new Date().toISOString(),
            };
            await saveDoc(updated, currentUserId);
            showToast(`Doc updated: "${updated.title}" 📝`);
          }
        }
      }
    } catch (e) {
      console.error("Failed to execute actions:", e);
    }
  };

  const handleSend = async (overrideText) => {
    const textToSend = typeof overrideText === "string" ? overrideText : input.trim();
    if (!textToSend || loading) return;
    const userMsg = { role: "user", content: textToSend };
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
          max_tokens: 4000,
          system: buildSystemPrompt(),
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const text = data.content?.filter(c => c.type === "text").map(c => c.text || "").join("") || "Sorry, something went wrong.";

      // Extract and execute actions
      const actionsMatch = text.match(/<actions>([\s\S]*?)<\/actions>/);
      if (actionsMatch) {
        await executeActions(actionsMatch[1]);
      }

      // Clean the display text (remove action tags)
      const displayText = text.replace(/<actions>[\s\S]*?<\/actions>/g, "").trim();
      setMessages(prev => [...prev, { role: "assistant", content: displayText }]);
      speak(displayText);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: "Oops, couldn't reach the AI. Try again." }]);
    }
    setLoading(false);
  };

  // Register send function on ref so pendingMessage effect can call it
  sendMessageRef.current = handleSend;

  // Auto-send after voice input finishes
  useEffect(() => {
    if (pendingVoiceSend.current && input.trim() && !listening && !loading) {
      pendingVoiceSend.current = false;
      const timer = setTimeout(() => handleSend(), 300);
      return () => clearTimeout(timer);
    }
  });

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
        title="Kit"
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
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Kit</div>
            <div style={{ fontSize: 10, color: COLORS.textDim }}>Creatly AI assistant</div>
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
        {/* Voice toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 6 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, color: COLORS.textDim }}>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              style={{ accentColor: COLORS.accent, width: 12, height: 12 }}
            />
            Conversation mode
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Mic button */}
          <button
            onClick={toggleListening}
            style={{
              background: listening ? COLORS.danger : COLORS.surfaceActive,
              border: `1px solid ${listening ? COLORS.danger : COLORS.border}`,
              borderRadius: 8, padding: "0 12px", cursor: "pointer",
              color: listening ? "#fff" : COLORS.textMuted,
              fontSize: 18, alignSelf: "flex-end", height: 38, flexShrink: 0,
              transition: "all 0.2s",
              animation: listening ? "pulse 1.5s infinite" : "none",
            }}
            title={listening ? "Stop listening" : "Talk to Kit"}
          >
            🎙
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder={listening ? "Listening..." : "Talk to Kit or type here..."}
            rows={2}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.4, borderColor: listening ? COLORS.accent : COLORS.border }}
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

// ─── Retro Modal ─────────────────────────────────────────────────────────────
const RetroModal = ({ project, clients = [], onSave, onClose }) => {
  const [worked, setWorked] = useState("");
  const [didnt, setDidnt] = useState("");
  const [loading, setLoading] = useState(false);

  const client = clients.find(c => c.id === project.clientId);

  const handleSubmit = async () => {
    if (!worked.trim() && !didnt.trim()) { onClose(); return; }
    setLoading(true);

    try {
      // Ask Claude to summarize the retro into a concise learning
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `Summarize this project retro into 2-3 punchy bullet points as a "Kit Learning" — things to remember for future projects. Be specific and actionable. No fluff.

Project: ${project.title}
Client: ${client?.name || "internal"}

What worked:
${worked || "(nothing noted)"}

What didn't / what to do differently:
${didnt || "(nothing noted)"}

Return only the bullet points, starting each with •`
          }]
        }),
      });
      const data = await res.json();
      const summary = data.content?.filter(c => c.type === "text").map(c => c.text).join("") || "";

      const timestamp = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      const retroEntry = `\n\n[Retro – ${project.title} – ${timestamp}]\n${summary}`;

      if (client) {
        // Append to client Kit Learnings
        const existing = client.brand_context?.learnings || "";
        onSave({ clientId: client.id, learnings: existing + retroEntry });
      } else {
        // Append to project notes
        onSave({ projectId: project.id, notes: (project.notes || "") + retroEntry });
      }
    } catch (e) {
      console.error("Retro save error:", e);
    }
    setLoading(false);
    onClose();
  };

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`,
    borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 13,
    outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical",
    fontFamily: "inherit", lineHeight: 1.6,
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, width: "100%", maxWidth: 520, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Project Complete 🎉</div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.text }}>{project.title}</h2>
          {client && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Client: {client.name}</div>}
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
            Quick retro — Kit will turn this into a learning and save it{client ? ` to ${client.name}'s profile` : " to the project"}.
          </p>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>✅ What worked?</label>
            <textarea value={worked} onChange={e => setWorked(e.target.value)} rows={3} placeholder="What went well, what you'd repeat, what the client loved..." style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>⚡ What to do differently?</label>
            <textarea value={didnt} onChange={e => setDidnt(e.target.value)} rows={3} placeholder="What didn't work, what you'd change, lessons learned..." style={inputStyle} />
          </div>
        </div>

        <div style={{ padding: "14px 24px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
            Skip
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 22px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Retro →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Service Modal ────────────────────────────────────────────────────────────
const ServiceModal = ({ service, onSave, onDelete, onClose }) => {
  const isNew = !service;
  const [form, setForm] = useState(service || {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    name: "", category: "Creative", description: "", price_sek: 0, estimated_days: 1, sort_order: 0, active: true,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { if (!form.name.trim()) return; onSave(form); onClose(); };
  const CATEGORIES = ["Creative", "Strategy", "Tech", "Distribution", "Consulting"];
  const inputStyle = { background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, width: "100%", maxWidth: 520, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>{isNew ? "New Service" : "Edit Service"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 18 }}>×</button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={labelStyle}>Service Name *</label><input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Meta Ad Set (3 creatives)" style={{ ...inputStyle, fontSize: 15, fontWeight: 500 }} autoFocus /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Sort Order</label><input type="number" value={form.sort_order} onChange={e => update("sort_order", parseInt(e.target.value) || 0)} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description || ""} onChange={e => update("description", e.target.value)} placeholder="What's included..." rows={2} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Price (SEK)</label><input type="number" value={form.price_sek} onChange={e => update("price_sek", parseInt(e.target.value) || 0)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Estimated Days</label><input type="number" value={form.estimated_days} onChange={e => update("estimated_days", parseInt(e.target.value) || 1)} style={inputStyle} /></div>
          </div>
        </div>
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {!isNew && !confirmDelete && <button onClick={() => setConfirmDelete(true)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 13, cursor: "pointer", padding: 0 }}>Delete service</button>}
            {confirmDelete && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>Sure?</span>
              <button onClick={() => { onDelete(form.id); onClose(); }} style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px", color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} style={{ background: COLORS.accent, border: "none", borderRadius: 6, padding: "8px 22px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{isNew ? "Add Service" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Creative Brief Modal ─────────────────────────────────────────────────────
const CreativeBriefModal = ({ clients, services, currentUserId, saveDoc, showToast, onClose }) => {
  const [step, setStep] = useState(1); // 1=setup, 2=generating, 3=preview
  const [clientId, setClientId] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [projectGoal, setProjectGoal] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);

  const client = clients.find(c => c.id === clientId);
  const pickedServices = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = pickedServices.reduce((sum, s) => sum + s.price_sek, 0);
  const totalDays = pickedServices.length > 0 ? Math.max(...pickedServices.map(s => s.estimated_days)) + Math.floor(pickedServices.reduce((sum, s) => sum + s.estimated_days, 0) / 3) : 0;
  const endDate = startDate ? new Date(new Date(startDate).getTime() + totalDays * 86400000).toISOString().split("T")[0] : "";

  const CATEGORIES = [...new Set(services.map(s => s.category))];

  const toggleService = (id) => setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const formatSEK = (n) => n.toLocaleString("sv-SE") + " SEK";

  const generateBrief = async () => {
    setLoading(true);
    setStep(2);
    try {
      const bc = client?.brand_context || {};
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: `Write a professional creative brief for a client. Use markdown formatting.

CLIENT: ${client?.name || "TBD"}${client?.industry ? ` (${client.industry})` : ""}
GOAL: ${projectGoal}
TONE OF VOICE: ${bc.tone_of_voice || "not specified"}
BRAND GUIDELINES: ${bc.guidelines || "not specified"}
TARGET AUDIENCE: ${bc.preferences || "not specified"}
ADDITIONAL NOTES: ${notes || "none"}

DELIVERABLES & PRICING:
${pickedServices.map(s => `- ${s.name}: ${formatSEK(s.price_sek)} (est. ${s.estimated_days} days)\n  ${s.description || ""}`).join("\n")}

TOTAL INVESTMENT: ${formatSEK(totalPrice)}
TIMELINE: ${startDate} → ${endDate} (${totalDays} working days)

Write a compelling creative brief with these sections:
# Creative Brief — ${client?.name || "Client"}: [short campaign/project title]

## Overview
[2-3 sentences on what this project is and why it matters]

## Objective
[Clear, measurable goal]

## Target Audience
[Who we're reaching and what matters to them]

## Deliverables
[List each deliverable with a one-line description]

## Creative Direction
[Tone, style, key messages — grounded in the brand context]

## Timeline
[Key milestones from ${startDate} to ${endDate}]

## Investment
[Clean pricing table with total]

## Next Steps
[What happens after signing off]

Keep it sharp, professional, and client-ready. No fluff.`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(c => c.type === "text").map(c => c.text).join("") || "";
      setBrief(text);
      setStep(3);
    } catch (e) {
      console.error("Brief gen error:", e);
      showToast("Failed to generate brief");
      setStep(1);
    }
    setLoading(false);
  };

  const saveToDocs = async () => {
    const title = `Creative Brief — ${client?.name || "Client"} — ${new Date().toLocaleDateString("sv-SE")}`;
    await saveDoc({
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      title,
      content: brief,
      folder: "Templates",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, currentUserId);
    showToast(`Brief saved to Docs 📄`);
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(brief);
    showToast("Brief copied to clipboard");
  };

  const inputStyle = { background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, width: "100%", maxWidth: step === 3 ? 760 : 620, maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {step === 1 ? "Step 1 of 2 — Configure" : step === 2 ? "Generating..." : "Step 2 of 2 — Review & Save"}
            </div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.text }}>Creative Brief Generator</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 20 }}>×</button>
        </div>

        {/* Step 1 — Configure */}
        {step === 1 && (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, overflow: "auto" }}>
            {/* Client + Goal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  <option value="">No client / Internal</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Project Goal *</label>
              <textarea value={projectGoal} onChange={e => setProjectGoal(e.target.value)} placeholder="What are we trying to achieve? e.g. Launch a Meta ads campaign to drive sign-ups for our new AI product..." rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} autoFocus />
            </div>

            {/* Services */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 12 }}>Deliverables</label>
              {CATEGORIES.map(cat => (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{cat}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {services.filter(s => s.category === cat).map(s => {
                      const picked = selectedServices.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                            border: `1px solid ${picked ? COLORS.accent : COLORS.border}`,
                            background: picked ? `${COLORS.accent}10` : COLORS.surfaceActive,
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${picked ? COLORS.accent : COLORS.borderLight}`, background: picked ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                              {picked && <span style={{ color: COLORS.bg, fontSize: 10, fontWeight: 700 }}>✓</span>}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{s.name}</div>
                              {s.description && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{s.description}</div>}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: picked ? COLORS.accent : COLORS.textMuted }}>{s.price_sek.toLocaleString("sv-SE")} SEK</div>
                            <div style={{ fontSize: 11, color: COLORS.textDim }}>{s.estimated_days}d</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Additional Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything else Kit should know for this brief..." rows={2} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
            </div>
          </div>
        )}

        {/* Step 2 — Generating */}
        {step === 2 && (
          <div style={{ padding: 60, textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✍️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>Kit is writing your brief...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Applying brand context and structuring deliverables</div>
          </div>
        )}

        {/* Step 3 — Preview */}
        {step === 3 && (
          <div style={{ padding: 24, overflow: "auto", flex: 1 }}>
            <pre style={{ margin: 0, fontFamily: "inherit", fontSize: 13, color: COLORS.text, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{brief}</pre>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          {/* Pricing summary */}
          {step !== 2 && selectedServices.length > 0 && (
            <div style={{ fontSize: 13 }}>
              <span style={{ color: COLORS.textMuted }}>{pickedServices.length} service{pickedServices.length !== 1 ? "s" : ""} · </span>
              <span style={{ fontWeight: 700, color: COLORS.accent }}>{formatSEK(totalPrice)}</span>
              {totalDays > 0 && <span style={{ color: COLORS.textDim }}> · ~{totalDays} days</span>}
            </div>
          )}
          {step !== 2 && selectedServices.length === 0 && <div />}
          {step === 2 && <div />}

          <div style={{ display: "flex", gap: 8 }}>
            {step === 1 && (
              <>
                <button onClick={onClose} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button
                  onClick={generateBrief}
                  disabled={!projectGoal.trim() || selectedServices.length === 0}
                  style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 22px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: (!projectGoal.trim() || selectedServices.length === 0) ? "not-allowed" : "pointer", opacity: (!projectGoal.trim() || selectedServices.length === 0) ? 0.5 : 1 }}
                >
                  Generate Brief →
                </button>
              </>
            )}
            {step === 3 && (
              <>
                <button onClick={() => setStep(1)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>← Edit</button>
                <button onClick={copyToClipboard} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Copy</button>
                <button onClick={saveToDocs} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 22px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save to Docs →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Services View ────────────────────────────────────────────────────────────
const ServicesView = ({ services, clients, onEdit, onNew, onSave, onDelete, currentUserId, saveDoc, showToast }) => {
  const [showBrief, setShowBrief] = useState(false);
  const CATEGORIES = [...new Set(services.map(s => s.category))];
  const totalRevenue = services.reduce((sum, s) => sum + s.price_sek, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Services & Pricing</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textMuted }}>{services.length} services · avg {services.length > 0 ? Math.round(totalRevenue / services.length).toLocaleString("sv-SE") : 0} SEK</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowBrief(true)} style={{ background: "none", border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: "8px 16px", color: COLORS.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            ✨ Generate Brief
          </button>
          <button onClick={onNew} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 18px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Add Service
          </button>
        </div>
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.filter(s => s.category === cat).map(s => (
              <div
                key={s.id}
                onClick={() => onEdit(s)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "none"; }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 3 }}>{s.name}</div>
                  {s.description && <div style={{ fontSize: 12, color: COLORS.textMuted }}>{s.description}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{s.price_sek.toLocaleString("sv-SE")} <span style={{ fontSize: 12, color: COLORS.textMuted }}>SEK</span></div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>~{s.estimated_days} day{s.estimated_days !== 1 ? "s" : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: COLORS.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💼</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>No services yet</div>
          <button onClick={onNew} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "10px 24px", color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>Add your first service</button>
        </div>
      )}

      {showBrief && (
        <CreativeBriefModal
          clients={clients}
          services={services}
          currentUserId={currentUserId}
          saveDoc={saveDoc}
          showToast={showToast}
          onClose={() => setShowBrief(false)}
        />
      )}
    </div>
  );
};


// ─── Client Profile Modal ────────────────────────────────────────────────────
const ClientProfileModal = ({ client, onSave, onDelete, onClose }) => {
  const isNew = !client;
  const [form, setForm] = useState(client || {
    id: uid(), name: "", contact_name: "", contact_email: "", industry: "",
    brand_context: { tone_of_voice: "", guidelines: "", preferences: "", learnings: "" },
    notes: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const updateBrand = (key, val) => setForm(p => ({ ...p, brand_context: { ...p.brand_context, [key]: val } }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, created_at: form.created_at || new Date().toISOString() });
    onClose();
  };

  const inputStyle = { background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, width: "100%", maxWidth: 620, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>{isNew ? "New Client" : "Edit Client"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 18 }}>×</button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Basic info */}
          <div>
            <label style={labelStyle}>Client / Brand Name *</label>
            <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Hatstore, Nike..." style={{ ...inputStyle, fontSize: 15, fontWeight: 500 }} autoFocus />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Contact Name</label>
              <input value={form.contact_name} onChange={e => update("contact_name", e.target.value)} placeholder="John Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input value={form.contact_email} onChange={e => update("contact_email", e.target.value)} placeholder="john@brand.com" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Industry</label>
            <input value={form.industry} onChange={e => update("industry", e.target.value)} placeholder="e-commerce, SaaS, fashion..." style={inputStyle} />
          </div>

          {/* Brand Context */}
          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Brand Context for AI</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Tone of Voice</label>
                <textarea value={form.brand_context?.tone_of_voice || ""} onChange={e => updateBrand("tone_of_voice", e.target.value)} placeholder="How should this brand communicate? e.g. Bold, playful, direct. Avoid corporate jargon..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={labelStyle}>Brand Guidelines</label>
                <textarea value={form.brand_context?.guidelines || ""} onChange={e => updateBrand("guidelines", e.target.value)} placeholder="Key brand rules, visual identity notes, messaging pillars..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={labelStyle}>Content Preferences</label>
                <textarea value={form.brand_context?.preferences || ""} onChange={e => updateBrand("preferences", e.target.value)} placeholder="Preferred content formats, platforms, audience info, what works well..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={labelStyle}>Kit Learnings</label>
                <textarea value={form.brand_context?.learnings || ""} onChange={e => updateBrand("learnings", e.target.value)} placeholder="Insights Kit should always remember for this client — what's worked, what hasn't, specific quirks, lessons from past projects..." rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Internal Notes</label>
            <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Any other internal notes..." rows={2} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {!isNew && !confirmDelete && (
              <button onClick={() => setConfirmDelete(true)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 13, cursor: "pointer", padding: 0 }}>
                Delete client
              </button>
            )}
            {confirmDelete && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Sure?</span>
                <button onClick={() => { onDelete(form.id); onClose(); }} style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}>Delete</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px", color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} style={{ background: COLORS.accent, border: "none", borderRadius: 6, padding: "8px 22px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {isNew ? "Create Client" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Clients View ─────────────────────────────────────────────────────────────
const ClientsView = ({ clients, projects, onEdit, onSave, onDelete, onNew }) => {
  const projectCountByClient = useMemo(() => {
    const counts = {};
    projects.forEach(p => { if (p.clientId) counts[p.clientId] = (counts[p.clientId] || 0) + 1; });
    return counts;
  }, [projects]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Clients</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textMuted }}>{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              const url = `${window.location.origin}/intake.html`;
              navigator.clipboard.writeText(url).then(() => alert("Intake link copied to clipboard!"));
            }}
            style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 14px", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            🔗 Share Intake Form
          </button>
          <button
            onClick={onNew}
            style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 18px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            + New Client
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: COLORS.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>No clients yet</div>
          <div style={{ fontSize: 13, marginBottom: 24 }}>Add clients to link projects and inject brand context into Kit.</div>
          <button onClick={onNew} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "10px 24px", color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Add your first client
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {clients.map(client => {
            const projectCount = projectCountByClient[client.id] || 0;
            const hasContext = client.brand_context && Object.values(client.brand_context).some(v => v?.trim());
            return (
              <div
                key={client.id}
                onClick={() => onEdit(client)}
                style={{
                  background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10,
                  padding: 20, cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>{client.name}</div>
                    {client.industry && <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{client.industry}</div>}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${COLORS.blue}20`, border: `1px solid ${COLORS.blue}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {client.contact_name && (
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
                    {client.contact_name}{client.contact_email && ` · ${client.contact_email}`}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                    {projectCount} project{projectCount !== 1 ? "s" : ""}
                  </span>
                  {hasContext && (
                    <span style={{ fontSize: 10, color: COLORS.accent, background: `${COLORS.accent}15`, padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>
                      AI context ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Ideas Module ─────────────────────────────────────────────────────────────

const IDEA_CATEGORIES = ["Campaign", "Content", "Product", "Other"];
const IDEA_STATUSES = [
  { key: "raw", label: "Raw", color: "#808080" },
  { key: "refined", label: "Refined", color: "#5B9BCF" },
  { key: "approved", label: "Approved", color: "#7ACF85" },
];

const IdeaStatusPill = ({ status, onClick }) => {
  const cfg = IDEA_STATUSES.find(s => s.key === status) || IDEA_STATUSES[0];
  return (
    <span
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 10px",
        background: `${cfg.color}22`,
        border: `1px solid ${cfg.color}44`,
        borderRadius: 20,
        fontSize: 10, color: cfg.color, fontWeight: 600,
        letterSpacing: "0.04em", textTransform: "uppercase",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s",
        userSelect: "none",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const IdeaModal = ({ idea, clients, onSave, onDelete, onClose, currentUserId }) => {
  const isNew = !idea;
  const [form, setForm] = useState(idea || {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    title: "",
    description: "",
    category: "Campaign",
    status: "raw",
    client_id: null,
    created_by: currentUserId,
    created_at: new Date().toISOString(),
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  const inputStyle = {
    background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`,
    borderRadius: 6, padding: "8px 12px", color: COLORS.text,
    fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block",
  };
  const selectStyle = {
    ...inputStyle, appearance: "none", cursor: "pointer",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.text }}>
            {isNew ? "New Idea" : "Edit Idea"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.textMuted }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={form.title}
              onChange={e => update("title", e.target.value)}
              placeholder="What's the idea?"
              autoFocus
              style={{ ...inputStyle, fontSize: 15, fontWeight: 500, padding: "10px 12px" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description || ""}
              onChange={e => update("description", e.target.value)}
              placeholder="Details, context, inspiration..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category || "Campaign"} onChange={e => update("category", e.target.value)} style={selectStyle}>
                {IDEA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status || "raw"} onChange={e => update("status", e.target.value)} style={selectStyle}>
                {IDEA_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {clients.length > 0 && (
            <div>
              <label style={labelStyle}>Client / Brand</label>
              <select value={form.client_id || ""} onChange={e => update("client_id", e.target.value || null)} style={selectStyle}>
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 4 }}>
            {!isNew && (
              <div>
                {confirmDelete ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => { onDelete(form.id); onClose(); }}
                      style={{ background: COLORS.danger, border: "none", borderRadius: 6, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 14px", color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 14px", color: COLORS.danger, fontSize: 12, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
            {isNew && <div />}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={{ background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ background: COLORS.accent, border: "none", borderRadius: 6, padding: "8px 18px", color: COLORS.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {isNew ? "Save Idea" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IdeaCard = ({ idea, clients, onEdit, onStatusCycle, onKitClick }) => {
  const [hovered, setHovered] = useState(false);
  const client = clients.find(c => c.id === idea.client_id);

  const cycleStatus = () => {
    const idx = IDEA_STATUSES.findIndex(s => s.key === idea.status);
    const next = IDEA_STATUSES[(idx + 1) % IDEA_STATUSES.length];
    onStatusCycle(idea.id, next.key);
  };

  const catColor = {
    Campaign: COLORS.orange, Content: COLORS.purple,
    Product: COLORS.blue, Other: COLORS.textDim,
  }[idea.category] || COLORS.textDim;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? COLORS.surfaceHover : COLORS.surface,
        border: `1px solid ${hovered ? COLORS.borderLight : COLORS.border}`,
        borderRadius: 10, padding: 16, cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.25)" : "none",
        display: "flex", flexDirection: "column", gap: 10,
      }}
      onClick={() => onEdit(idea)}
    >
      {/* Top row: category + kit button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
          textTransform: "uppercase", color: catColor,
          background: `${catColor}18`, padding: "2px 8px", borderRadius: 4,
        }}>
          {idea.category}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onKitClick(idea); }}
          title="Ask Kit about this idea"
          style={{
            background: hovered ? `${COLORS.accent}18` : "transparent",
            border: `1px solid ${hovered ? COLORS.accent + "44" : "transparent"}`,
            borderRadius: 6, padding: "3px 8px", cursor: "pointer",
            color: COLORS.accent, fontSize: 11, fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          ✦ Kit
        </button>
      </div>

      {/* Title */}
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.text, lineHeight: 1.35 }}>
        {idea.title}
      </h3>

      {/* Description */}
      {idea.description && (
        <p style={{
          margin: 0, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {idea.description}
        </p>
      )}

      {/* Footer: client badge + status pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        {client ? (
          <span style={{
            fontSize: 10, color: COLORS.blue, background: `${COLORS.blue}15`,
            padding: "2px 7px", borderRadius: 4, border: `1px solid ${COLORS.blue}30`,
            fontWeight: 500,
          }}>
            {client.name}
          </span>
        ) : <span />}
        <IdeaStatusPill status={idea.status} onClick={cycleStatus} />
      </div>
    </div>
  );
};

const IdeasModule = ({ ideas, clients, saveIdea, deleteIdea, currentUserId, onKitMessage }) => {
  const [editingIdea, setEditingIdea] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = ideas.filter(idea => {
    if (catFilter !== "all" && idea.category !== catFilter) return false;
    if (statusFilter !== "all" && idea.status !== statusFilter) return false;
    return true;
  });

  const handleStatusCycle = async (id, newStatus) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    await saveIdea({ ...idea, status: newStatus }, currentUserId);
  };

  const handleKitClick = (idea) => {
    const client = clients.find(c => c.id === idea.client_id);
    const msg = `I want to develop this idea further: "${idea.title}"${idea.description ? ` — ${idea.description}` : ""}${client ? ` (for ${client.name})` : ""}. Help me refine it and suggest next steps.`;
    if (onKitMessage) onKitMessage(msg);
  };

  const btnStyle = (active) => ({
    background: active ? COLORS.surfaceActive : "transparent",
    border: `1px solid ${active ? COLORS.borderLight : "transparent"}`,
    borderRadius: 6, padding: "5px 12px", cursor: "pointer",
    color: active ? COLORS.text : COLORS.textMuted,
    fontSize: 12, fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Ideas</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textMuted }}>
            {ideas.length} idea{ideas.length !== 1 ? "s" : ""} · {filtered.length} shown
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          style={{
            background: COLORS.accent, border: "none", borderRadius: 7,
            padding: "8px 16px", color: COLORS.bg, fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <Icon name="plus" size={14} color={COLORS.bg} />
          New Idea
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Category filters */}
        <div style={{ display: "flex", gap: 3, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: 3 }}>
          <button style={btnStyle(catFilter === "all")} onClick={() => setCatFilter("all")}>All</button>
          {IDEA_CATEGORIES.map(c => (
            <button key={c} style={btnStyle(catFilter === c)} onClick={() => setCatFilter(c)}>{c}</button>
          ))}
        </div>

        <div style={{ width: 1, background: COLORS.border, margin: "0 4px" }} />

        {/* Status filters */}
        <div style={{ display: "flex", gap: 3, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: 3 }}>
          <button style={btnStyle(statusFilter === "all")} onClick={() => setStatusFilter("all")}>All Status</button>
          {IDEA_STATUSES.map(s => (
            <button key={s.key} style={btnStyle(statusFilter === s.key)} onClick={() => setStatusFilter(s.key)}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>{ideas.length === 0 ? "No ideas yet" : "No ideas match your filters"}</p>
          {ideas.length === 0 && (
            <button
              onClick={() => setShowNew(true)}
              style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 18px", color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}
            >
              Capture your first idea
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
        }}>
          {filtered.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              clients={clients}
              onEdit={setEditingIdea}
              onStatusCycle={handleStatusCycle}
              onKitClick={handleKitClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showNew && (
        <IdeaModal
          idea={null}
          clients={clients}
          onSave={(idea) => saveIdea(idea, currentUserId)}
          onDelete={deleteIdea}
          onClose={() => setShowNew(false)}
          currentUserId={currentUserId}
        />
      )}
      {editingIdea && (
        <IdeaModal
          idea={editingIdea}
          clients={clients}
          onSave={(idea) => saveIdea(idea, currentUserId)}
          onDelete={deleteIdea}
          onClose={() => setEditingIdea(null)}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
function ProjectPlanner({ currentUser, currentUserId, onLogout }) {
  const { projects, loading, saveProject, deleteProject } = useProjects();
  const { tagColors, updateTagColor: handleUpdateTagColor } = useTagColors();
  const { visibleFields, setVisibleFields, customFieldDefs: customFields, setCustomFieldDefs: setCustomFields } = useAppSettings();
  const { docs, loading: docsLoading, saveDoc, deleteDoc } = useDocs();
  const { clients, saveClient, deleteClient } = useClients();
  const { services, saveService, deleteService } = useServices();
  const { ideas, saveIdea, deleteIdea } = useIdeas();
  const [kitPendingMessage, setKitPendingMessage] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showNewService, setShowNewService] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications(currentUserId);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e) => {
      if (!e.target.closest("[data-notif-panel]")) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);
  const [module, setModule] = useState("home");
  const [view, setView] = useState("board");
  const [modal, setModal] = useState(null);
  const [detailProject, setDetailProject] = useState(null);
  const [retroProject, setRetroProject] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("creatly_theme") || "dark"; } catch(e) { return "dark"; }
  });

  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);

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
    // Trigger retro modal when project is marked Done for the first time
    const prev = projects.find(p => p.id === project.id);
    if (project.status === "done" && prev && prev.status !== "done") {
      setRetroProject(project);
    }
    saveProject(project, currentUserId);
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
        <div style={{ color: COLORS.accent, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh", marginLeft: 68,
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 768px) {
          .creatly-header { flex-direction: column !important; gap: 10px !important; padding: 10px 14px !important; }
          .creatly-header-search { max-width: 100% !important; }
          .creatly-header-actions { width: 100%; justify-content: space-between !important; flex-wrap: wrap; }
          .creatly-board { grid-template-columns: 1fr !important; }
          .creatly-list-row { grid-template-columns: 1fr auto !important; }
          .creatly-list-header { display: none !important; }
          .creatly-list-tags, .creatly-list-date { display: none !important; }
          .creatly-detail-layout { grid-template-columns: 1fr !important; }
          .creatly-dashboard-grid { grid-template-columns: 1fr !important; }
          .creatly-dashboard-stats { grid-template-columns: repeat(3, 1fr) !important; }
          main { padding: 12px !important; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
        {/* Sidebar nav */}
        <div style={{
          width: 68, flexShrink: 0, background: COLORS.surface,
          borderRight: `0.5px solid ${COLORS.border}`,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "20px 0", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
        }}>
          <div style={{ width: 38, height: 38, background: COLORS.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="2" fill="#0a2e0f"/>
              <rect x="9" y="1" width="6" height="6" rx="2" fill="#0a2e0f"/>
              <rect x="1" y="9" width="6" height="6" rx="2" fill="#0a2e0f"/>
              <rect x="9" y="9" width="6" height="6" rx="2" fill="#0a2e0f" opacity="0.4"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, width: "100%", padding: "0 10px" }}>
            {[
              { key: "home", label: "Home", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor"/><rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor"/><rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor"/><rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.4"/></svg> },
              { key: "planner", label: "Planner", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="2" rx="1" fill="currentColor"/><rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor"/><rect x="2" y="13" width="10" height="2" rx="1" fill="currentColor"/></svg> },
              { key: "docs", label: "Docs", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h14v10H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { key: "clients", label: "Clients", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17c0-3.866 3.134-6 7-6s7 2.134 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { key: "services", label: "Services", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { key: "ideas", label: "Ideas", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8 7.5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
            ].map((m) => (
              <button key={m.key} onClick={() => setModule(m.key)} title={m.label} style={{ width: "100%", aspectRatio: "1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", background: module === m.key ? "rgba(122,207,133,0.15)" : "transparent", color: module === m.key ? COLORS.accent : COLORS.textDim, transition: "all 0.15s" }}>
                {m.icon}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 10px 0", borderTop: `0.5px solid ${COLORS.border}`, width: "100%" }}>
            <button onClick={() => setKitOpen(v => !v)} style={{ width: 38, height: 38, background: COLORS.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v8H2zM6 14h4" stroke="#0a2e0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <div onClick={onLogout} style={{ width: 38, height: 38, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#0a2e0f", cursor: "pointer" }}>
              {currentUser === "ludvig" ? "L" : "J"}
            </div>
          </div>
        </div>

      {/* Content */}
      <main style={{ marginLeft: 68, padding: 24, maxWidth: module === "planner" && view === "timeline" && !detailProject ? "none" : 1400, margin: "0 auto" }}>
        {/* Dashboard */}
        {module === "home" && (
          <DashboardView
            projects={projects}
            currentUserId={currentUserId}
            onSelectProject={(p) => { setModule("planner"); setDetailProject(p); }}
          />
        )}

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
            clients={clients}
          />
        )}

        {/* Planner views */}
        {module === "planner" && !detailProject && (
          <>
            {view === "board" && <BoardView projects={filtered} onSelect={handleCardClick} visibleFields={visibleFields} customFields={customFields} tagColors={tagColors} clientMap={clientMap} />}
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

        {/* Clients view */}
        {module === "clients" && (
          <ClientsView
            clients={clients}
            projects={projects}
            onEdit={(client) => setEditingClient(client)}
            onSave={saveClient}
            onDelete={deleteClient}
            onNew={() => setShowNewClient(true)}
          />
        )}

        {module === "services" && (
          <ServicesView
            services={services}
            clients={clients}
            onEdit={(s) => setEditingService(s)}
            onNew={() => setShowNewService(true)}
            onSave={saveService}
            onDelete={deleteService}
            currentUserId={currentUserId}
            saveDoc={saveDoc}
            showToast={showToast}
          />
        )}

        {module === "ideas" && (
          <IdeasModule
            ideas={ideas}
            clients={clients}
            saveIdea={saveIdea}
            deleteIdea={deleteIdea}
            currentUserId={currentUserId}
            onKitMessage={(msg) => setKitPendingMessage(msg)}
          />
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
          clients={clients}
        />
      )}

      {/* Client Profile Modal — edit existing */}
      {editingClient && (
        <ClientProfileModal
          client={editingClient}
          onSave={saveClient}
          onDelete={deleteClient}
          onClose={() => setEditingClient(null)}
        />
      )}

      {/* Client Profile Modal — new */}
      {showNewClient && (
        <ClientProfileModal
          client={null}
          onSave={saveClient}
          onDelete={deleteClient}
          onClose={() => setShowNewClient(false)}
        />
      )}

      {/* Service Modals */}
      {editingService && (
        <ServiceModal
          service={editingService}
          onSave={saveService}
          onDelete={deleteService}
          onClose={() => setEditingService(null)}
        />
      )}
      {showNewService && (
        <ServiceModal
          service={null}
          onSave={saveService}
          onDelete={deleteService}
          onClose={() => setShowNewService(false)}
        />
      )}

      {/* Retro Modal */}
      {retroProject && (
        <RetroModal
          project={retroProject}
          clients={clients}
          onSave={async ({ clientId, learnings, projectId, notes }) => {
            if (clientId) {
              const client = clients.find(c => c.id === clientId);
              if (client) {
                await saveClient({ ...client, brand_context: { ...client.brand_context, learnings } });
                showToast("Retro saved to " + client.name + "'s Kit Learnings 🧠");
              }
            } else if (projectId) {
              const proj = projects.find(p => p.id === projectId);
              if (proj) {
                await saveProject({ ...proj, notes }, currentUserId);
                showToast("Retro saved to project notes 🧠");
              }
            }
          }}
          onClose={() => setRetroProject(null)}
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
        docs={docs}
        clients={clients}
        clientMap={clientMap}
        saveProject={saveProject}
        saveDoc={saveDoc}
        services={services}
        deleteProject={deleteProject}
        currentUserId={currentUserId}
        onOpenProject={(p) => setDetailProject(p)}
        showToast={showToast}
        pendingMessage={kitPendingMessage}
        onPendingMessageConsumed={() => setKitPendingMessage(null)}
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
      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
