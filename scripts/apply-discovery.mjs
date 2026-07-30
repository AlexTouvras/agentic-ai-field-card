#!/usr/bin/env node
/**
 * Turn discovery-report.json into concrete picker proposals.
 * If ANTHROPIC_API_KEY or OPENAI_API_KEY is set, asks the model to choose
 * keep/add/replace rows (max 7 on the card). Otherwise uses heuristics.
 * Optionally patches index.html when APPLY_TO_HTML=1.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = JSON.parse(fs.readFileSync(path.join(root, "data", "discovery-report.json"), "utf8"));
const htmlPath = path.join(root, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

function currentPicker() {
  const block = html.match(/<div class="picker">([\s\S]*?)<\/div>\s*<\/section>/);
  if (!block) return [];
  const rows = [];
  const re = /<div class="pick"><strong>([\s\S]*?)<\/strong><span>([\s\S]*?)<\/span><\/div>/g;
  let m;
  while ((m = re.exec(block[1]))) {
    const strong = m[1];
    const blurb = m[2].trim();
    const links = [...strong.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)].map((x) => ({
      href: x[1],
      label: x[2].trim(),
    }));
    const label = links.length
      ? links.map((l) => l.label).join(" / ") + (strong.includes("SDKs") ? " SDKs" : "")
      : strong.replace(/<[^>]+>/g, "").trim();
    rows.push({ label: label.trim(), blurb, links });
  }
  return rows;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPicker(rows) {
  const parts = rows.map((row) => {
    let strong;
    if (row.links?.length === 2 && /sdk/i.test(row.label)) {
      strong = `<a href="${row.links[0].href}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.links[0].label)}</a> / <a href="${row.links[1].href}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.links[1].label)}</a> SDKs`;
    } else if (row.links?.length >= 1) {
      strong = `<a href="${row.links[0].href}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.links[0].label || row.label)}</a>`;
    } else {
      strong = escapeHtml(row.label);
    }
    return `          <div class="pick"><strong>${strong}</strong><span>${escapeHtml(row.blurb)}</span></div>`;
  });
  return `        <div class="picker">\n${parts.join("\n")}\n        </div>`;
}

const current = currentPicker();
const highCandidates = (report.candidates || []).filter((c) => c.priority === "high" || c.priority === "medium");

async function proposeWithAnthropic(apiKey) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You maintain a one-page Agentic AI field card. The Framework picker must stay ≤7 rows.
Current picker JSON:
${JSON.stringify(current, null, 2)}

Discovery candidates (new or not-on-card):
${JSON.stringify(highCandidates, null, 2)}

Fresh releases:
${JSON.stringify(report.freshReleases || [], null, 2)}

Rules:
- Prefer constraint coverage: control/HITL, speed prototype, RAG/data, enterprise/.NET, handoffs/Anthropic, typed Python — not hype.
- Do NOT invent docs URLs; only use docs/repos from the candidate list or current picker.
- Adding a framework means it earned a slot; you may drop the weakest current row if full.
- Protocols (MCP/A2A) are NOT picker rows.
- Return ONLY JSON: {"rows":[{"label":"","blurb":"","links":[{"href":"","label":""}]}],"changelog":["..."],"deferred":[{"name":"","why":""}]}`,
      },
    ],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = data.content?.map((c) => c.text || "").join("") || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in model response");
  return JSON.parse(jsonMatch[0]);
}

async function proposeWithOpenAI(apiKey) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You maintain a ≤7-row agent framework picker. Return JSON with rows, changelog, deferred. Never invent documentation URLs.",
        },
        {
          role: "user",
          content: JSON.stringify({ current, candidates: highCandidates, freshReleases: report.freshReleases }),
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

function proposeHeuristic() {
  const rows = current.map((r) => ({
    label: r.label,
    blurb: r.blurb,
    links: r.links,
  }));
  const changelog = [];
  const deferred = [];

  for (const c of highCandidates) {
    const already = rows.some((r) => r.label.toLowerCase().includes(c.name.toLowerCase().slice(0, 8)));
    if (already) continue;
    const docs = c.docs?.[0];
    if (!docs || !/^https?:\/\//.test(docs)) {
      deferred.push({ name: c.name, why: "No docs URL to link from the card" });
      continue;
    }
    if (c.priority !== "high") {
      deferred.push({ name: c.name, why: `Priority ${c.priority} — left for human review` });
      continue;
    }
    if (rows.length >= 7) {
      deferred.push({ name: c.name, why: "Picker full (7); review for replace" });
      continue;
    }
    rows.push({
      label: c.name,
      blurb: (c.constraint ? `${c.constraint} path` : "See discovery report") + " — auto-suggested",
      links: [{ href: docs, label: c.name }],
    });
    changelog.push(`Added candidate ${c.name} from discovery (${c.kind})`);
  }

  if (!changelog.length) {
    changelog.push("No automatic picker edits — see deferred candidates");
  }
  return { rows, changelog, deferred: deferred.concat(
    highCandidates
      .filter((c) => !changelog.some((x) => x.includes(c.name)))
      .slice(0, 8)
      .map((c) => ({ name: c.name, why: c.reason || c.kind }))
  ) };
}

let proposal;
let mode = "heuristic";
try {
  if (process.env.ANTHROPIC_API_KEY) {
    proposal = await proposeWithAnthropic(process.env.ANTHROPIC_API_KEY);
    mode = "anthropic";
  } else if (process.env.OPENAI_API_KEY) {
    proposal = await proposeWithOpenAI(process.env.OPENAI_API_KEY);
    mode = "openai";
  } else {
    proposal = proposeHeuristic();
  }
} catch (err) {
  console.error("Model propose failed, falling back to heuristic:", err.message);
  proposal = proposeHeuristic();
  mode = "heuristic-fallback";
}

proposal.mode = mode;
proposal.generatedAt = new Date().toISOString();
proposal.candidateCount = report.summary?.candidateCount ?? 0;

fs.writeFileSync(
  path.join(root, "data", "proposed-updates.json"),
  JSON.stringify(proposal, null, 2) + "\n"
);

const apply =
  process.env.APPLY_TO_HTML === "1" ||
  process.env.APPLY_TO_HTML === "true" ||
  !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
const hasRowChanges =
  Array.isArray(proposal.rows) &&
  proposal.changelog?.some((c) => /add|replace|drop|remov|updat/i.test(c));

if (apply && hasRowChanges && proposal.rows.length) {
  const next = renderPicker(proposal.rows.slice(0, 7));
  const replaced = html.replace(/<div class="picker">[\s\S]*?<\/div>(\s*<\/section>)/, `${next}$1`);
  if (replaced === html) {
    console.error("Failed to locate picker block for patch");
  } else {
    html = replaced;
    const note = proposal.changelog.slice(0, 3).join(" · ");
    html = html.replace(
      /(<p class="changed"><b>Changed<\/b> )([^<]+)(<\/p>)/,
      `$1${note}$3`
    );
    fs.writeFileSync(htmlPath, html);
    console.log("Patched index.html framework picker");
  }
} else {
  console.log(
    apply
      ? "APPLY_TO_HTML set but no row changelog — left HTML picker unchanged"
      : "Wrote proposals only (set APPLY_TO_HTML=1 to patch the card)"
  );
}

console.log(`Propose mode=${mode}; changelog=${(proposal.changelog || []).join(" | ")}`);
