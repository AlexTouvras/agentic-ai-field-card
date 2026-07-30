#!/usr/bin/env node
/**
 * Post #orbit Slack Approve/Skip for the weekly field-card PR (Orbit-style).
 *
 * Env:
 *   SLACK_ORBIT_WEBHOOK_URL or SLACK_WEBHOOK_URL
 *   WEEKLY_WRITE_SECRET or CRON_SECRET or FIELD_CARD_ACTION_SECRET (HMAC, must match Orbit)
 *   SITE_URL (default https://alextouvras.com)
 *   PR_NUMBER (required)
 *   PR_URL (optional)
 *   GH_TOKEN / GITHUB_TOKEN (optional; used to resolve PR url/title)
 */
import { createHmac } from "node:crypto";

const repo = process.env.FIELD_CARD_REPO || "AlexTouvras/agentic-ai-field-card";
const site = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://alextouvras.com").replace(
  /\/$/,
  ""
);
const webhook =
  process.env.SLACK_ORBIT_WEBHOOK_URL?.trim() || process.env.SLACK_WEBHOOK_URL?.trim();
const secret =
  process.env.FIELD_CARD_ACTION_SECRET?.trim() ||
  process.env.WEEKLY_WRITE_SECRET?.trim() ||
  process.env.CRON_SECRET?.trim();

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signToken(prNumber, action, ttlSeconds = 7 * 24 * 60 * 60) {
  if (!secret) throw new Error("Missing FIELD_CARD_ACTION_SECRET / WEEKLY_WRITE_SECRET / CRON_SECRET");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = b64url(
    JSON.stringify({
      kind: "field-card",
      repo,
      pr: Number(prNumber),
      action,
      exp,
    })
  );
  const sig = createHmac("sha256", secret).update(payload).digest();
  return `${payload}.${b64url(sig)}`;
}

function actionUrl(prNumber, action) {
  const token = signToken(prNumber, action);
  return `${site}/api/field-card/action?token=${encodeURIComponent(token)}`;
}

async function resolvePr(prNumber) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      title: `Field card weekly refresh (#${prNumber})`,
      url: process.env.PR_URL || `https://github.com/${repo}/pull/${prNumber}`,
      body: "",
    };
  }
  const res = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "agentic-ai-field-card-notify",
    },
  });
  if (!res.ok) throw new Error(`GitHub PR fetch failed: ${res.status}`);
  const data = await res.json();
  return { title: data.title, url: data.html_url, body: data.body || "" };
}

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
  console.error("PR_NUMBER is required");
  process.exit(1);
}
if (!webhook) {
  console.error("SLACK_ORBIT_WEBHOOK_URL or SLACK_WEBHOOK_URL is required");
  process.exit(1);
}

const pr = await resolvePr(prNumber);
const approve = actionUrl(prNumber, "approve");
const skip = actionUrl(prNumber, "skip");
const live = "https://alextouvras.github.io/agentic-ai-field-card/";
const reportHint = pr.body.includes("discovery-report")
  ? "Discovery report is on the PR branch (`data/discovery-report.md`)."
  : "Review the PR diff before approving.";

const text = `Field card ready for Approve: ${pr.title}`;
const blocks = [
  {
    type: "header",
    text: { type: "plain_text", text: "Orbit — field card weekly refresh", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${pr.title}*\n${reportHint}\n\n*<${pr.url}|Open pull request>*  ·  *<${live}|Live Pages card>*`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${approve}|Approve & merge>*  ·  *<${skip}|Skip (close PR)>*`,
    },
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "Approve opens a confirm page first (Slack link unfurls will not merge). Same gate pattern as weekly Writes.",
      },
    ],
  },
];

const res = await fetch(webhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text, blocks }),
});

if (!res.ok) {
  console.error(`Slack webhook failed (${res.status}):`, await res.text());
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, pr: Number(prNumber), channel: "#orbit" }));
