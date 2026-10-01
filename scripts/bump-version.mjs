#!/usr/bin/env node
/**
 * Bump the public footer version stamp.
 * Version id stays the ISO week of the review. Next is the following calendar month
 * (`November 2026`), never "week of". Does not invent content changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "index.html");

function isoWeekParts(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return { year: date.getUTCFullYear(), week };
}

function formatReviewed(d = new Date()) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function nextMonthLabel(d = new Date()) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return `${months[next.getUTCMonth()]} ${next.getUTCFullYear()}`;
}

const { year, week } = isoWeekParts();
const stamp = `v${year}.${String(week).padStart(2, "0")} · Reviewed ${formatReviewed()} · Next: ${nextMonthLabel()}`;

let html = fs.readFileSync(htmlPath, "utf8");
const re = /(<div class="version" id="version-stamp">)([^<]+)(<\/div>)/;
if (!re.test(html)) {
  console.error("version-stamp element not found");
  process.exit(1);
}
html = html.replace(re, `$1${stamp}$3`);

const changedNote = process.env.CHANGED_NOTE;
if (changedNote) {
  html = html.replace(
    /(<p class="changed"><b>Changed<\/b> )([^<]+)(<\/p>)/,
    `$1${changedNote}$3`
  );
}

fs.writeFileSync(htmlPath, html);
console.log(`Updated version stamp → ${stamp}`);
