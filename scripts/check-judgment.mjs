#!/usr/bin/env node
/**
 * Durability health check: Friday discovery PRs must receive Cursor judgment.
 * Looks for open chore/weekly-refresh-* PRs older than the grace window without
 * a machine-readable Decision line in ## Summary.
 *
 * Exit 0 = healthy (or nothing to check). Exit 1 = missed judgment (issue opened).
 *
 * Auth: GH_TOKEN / GITHUB_TOKEN. Repo: GITHUB_REPOSITORY or --repo owner/name.
 */
import { execFileSync } from "node:child_process";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const repo =
  process.argv.find((a) => a.startsWith("--repo="))?.slice("--repo=".length) ||
  process.env.GITHUB_REPOSITORY ||
  "AlexTouvras/agentic-ai-field-card";

/** Hours after PR open before we treat missing judgment as a breach. */
const GRACE_HOURS = Number(process.env.JUDGMENT_GRACE_HOURS || 20);
const LABEL = "field-card-judgment";

function ghJson(args) {
  const env = { ...process.env, GH_TOKEN: token || process.env.GH_TOKEN };
  const out = execFileSync("gh", args, { encoding: "utf8", env });
  return JSON.parse(out || "null");
}

function gh(args) {
  const env = { ...process.env, GH_TOKEN: token || process.env.GH_TOKEN };
  return execFileSync("gh", args, { encoding: "utf8", env }).trim();
}

function hasDecision(body) {
  if (!body) return false;
  // Preferred machine line from docs/weekly-refresh-prompt.md
  if (/^Decision:\s*(update|no-change)\b/im.test(body)) return true;
  // Fallback: explicit Summary that states the binary choice
  if (/##\s*Summary[\s\S]{0,1200}?\b(no HTML change|no-change|updated? (the )?card|picker swap)\b/i.test(body)) {
    return true;
  }
  return false;
}

const prs = ghJson([
  "pr",
  "list",
  "--repo",
  repo,
  "--state",
  "open",
  "--json",
  "number,title,headRefName,createdAt,body,url",
  "--limit",
  "20",
]);

const weekly = (prs || []).filter((p) => /^chore\/weekly-refresh-/i.test(p.headRefName || ""));
if (!weekly.length) {
  console.log("Judgment check: no open weekly-refresh PR — OK");
  process.exit(0);
}

const now = Date.now();
const breaches = [];
for (const pr of weekly) {
  const ageH = (now - new Date(pr.createdAt).getTime()) / 3600000;
  const judged = hasDecision(pr.body || "");
  console.log(
    `PR #${pr.number} ${pr.headRefName}: age=${ageH.toFixed(1)}h judged=${judged}`
  );
  if (!judged && ageH >= GRACE_HOURS) {
    breaches.push({ ...pr, ageH });
  }
}

if (!breaches.length) {
  console.log("Judgment check: all weekly PRs within grace or already judged — OK");
  process.exit(0);
}

for (const pr of breaches) {
  const title = `Missed weekly judgment on PR #${pr.number}`;
  const open = ghJson([
    "issue",
    "list",
    "--repo",
    repo,
    "--label",
    LABEL,
    "--state",
    "open",
    "--json",
    "number,title",
  ]);
  const existing = (open || []).find((i) => String(i.title).includes(`#${pr.number}`));
  if (existing) {
    console.log(`Issue already open: #${existing.number}`);
    continue;
  }

  const body = [
    `Weekly discovery PR has no Cursor **Decision** after ${GRACE_HOURS}h.`,
    "",
    `- PR: ${pr.url}`,
    `- Branch: \`${pr.headRefName}\``,
    `- Age: ${pr.ageH.toFixed(1)} hours`,
    "",
    "### Fix",
    "1. Run Cursor Automation (or manual pass) per `docs/weekly-refresh-prompt.md`",
    "2. Ensure PR body includes `Decision: update` or `Decision: no-change` under `## Summary`",
    "3. Run **Notify Slack approve** when ready",
    "",
    "This is a durability SLA breach — discovery without judgment leaves the public card stale.",
  ].join("\n");

  try {
    const url = gh([
      "issue",
      "create",
      "--repo",
      repo,
      "--title",
      title,
      "--label",
      LABEL,
      "--body",
      body,
    ]);
    console.log(`Opened issue: ${url}`);
  } catch (err) {
    // Label may not exist yet
    const url = gh([
      "issue",
      "create",
      "--repo",
      repo,
      "--title",
      title,
      "--body",
      body,
    ]);
    console.log(`Opened issue (no label): ${url}`);
    console.warn(String(err.message || err));
  }
}

process.exit(1);
