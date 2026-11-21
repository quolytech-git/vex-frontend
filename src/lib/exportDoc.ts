"use client";

/* Real client-side export for CVs and letters.
   - Word: an HTML document saved as .doc (opens in Word, Pages, Google Docs).
   - PDF: opens a clean print window; the browser's "Save as PDF" makes the file.
   Both are one column with plain headings, so applicant systems can read them. */

export interface ExportSection {
  heading: string;
  lines: string[];
  bullets?: boolean;
}

export interface ExportDoc {
  fileName: string; // without extension
  title: string; // name at the top
  subtitle?: string;
  sections: ExportSection[];
  accent?: string;
  headingStyle?: "serif" | "sans" | "caps";
  center?: boolean;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildHtml(d: ExportDoc) {
  const accent = d.accent || "#212d3d";
  const headFont =
    d.headingStyle === "sans"
      ? "font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 12pt;"
      : d.headingStyle === "caps"
      ? "font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase;"
      : "font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 14pt;";
  const body = d.sections
    .filter((s) => s.lines.some((l) => l.trim()))
    .map((s) => {
      const content = s.bullets
        ? `<ul>${s.lines.filter((l) => l.trim()).map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`
        : s.lines.filter((l) => l.trim()).map((l) => `<p>${esc(l).replace(/\n/g, "<br/>")}</p>`).join("");
      return `<h2>${esc(s.heading)}</h2>${content}`;
    })
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(d.fileName)}</title>
<style>
  @page { size: A4; margin: 18mm 18mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1a1a1a; max-width: 720px; margin: 24px auto; }
  h1 { margin: 0; color: ${accent}; ${d.headingStyle === "serif" || !d.headingStyle ? "font-family: Georgia, serif; font-weight: 400; font-size: 24pt;" : "font-size: 20pt;"} ${d.center ? "text-align:center;" : ""} }
  .sub { margin: 4px 0 10px; color: #555; font-size: 9.5pt; ${d.center ? "text-align:center;" : ""} }
  hr { border: 0; border-top: 2px solid ${accent}; margin: 0 0 12px; }
  h2 { ${headFont} color: ${accent}; margin: 14px 0 4px; }
  p { margin: 0 0 6px; }
  ul { margin: 0 0 6px 18px; padding: 0; }
  li { margin: 0 0 3px; }
</style></head><body>
<h1>${esc(d.title)}</h1>${d.subtitle ? `<p class="sub">${esc(d.subtitle)}</p>` : ""}<hr/>${body}
</body></html>`;
}

export function downloadWord(d: ExportDoc) {
  const blob = new Blob(["﻿", buildHtml(d)], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${d.fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Returns false if the browser blocked the print window. */
export function printPdf(d: ExportDoc): boolean {
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) return false;
  w.document.open();
  w.document.write(buildHtml(d));
  w.document.close();
  w.focus();
  window.setTimeout(() => w.print(), 350);
  return true;
}

export function safeFileName(...parts: string[]) {
  return parts
    .filter(Boolean)
    .join("_")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80) || "Vex_CV";
}
