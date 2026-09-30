#!/usr/bin/env node
/**
 * Proves the field card can still read the storytelling robot at main.
 * Exits 0 when that commit's contract, host behavior, runtime version, and
 * .riv are all readable. Does not vendor the file.
 */
import fs from "node:fs";
import {
  FALLBACK_ROBOT,
  canvasRuntimeVersion,
  currentStorySha,
  parseCardHost,
  parseRobotContract,
  storyFileUrl,
} from "../robot.js";

const FILES = {
  pkg: "package.json",
  robot: "src/illustrations/robot.ts",
  host: "src/components/director/AiFieldCard.tsx",
  riv: "src/illustrations/robot.riv",
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

const sampleRobot = `
export const ROBOT = {
  name: "Widget",
  stateMachine: "WidgetMachine",
  width: 320,
  height: 480,
  props: {
    line: "speech",
    presence: "where",
    poke: "tap",
    settle: "rest",
  },
} as const;
`;

const sampleHost = `
const CARD_LINE = "Hello from the card.";
const SETTLE_MS = 900;
function place() {
  const padTop = 40;
  const padRight = 8;
  const padBottom = 12;
  const cx = parked ? 0.9 : 0.4;
  const cy = parked ? 0.7 : 0.5;
  const bw = parked ? 0.25 : 0.3;
  const bh = parked ? 0.2 : 0.45;
}
`;

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const inline = html.match(/<script type="module">\n([\s\S]*?)\n  <\/script>\n<\/body>/);
if (!inline) fail("index.html is missing the inlined robot module");
const robotJs = fs.readFileSync(new URL("../robot.js", import.meta.url), "utf8").trim();
if (inline[1].trim() !== robotJs) {
  fail("index.html robot module is out of date with robot.js — Orbit only publishes index.html");
}

const sample = parseRobotContract(sampleRobot);
if (!sample || sample.name !== "Widget" || sample.props.poke !== "tap" || sample.height !== 480) {
  fail("robot contract parser missed a sample export");
}
const sampleCard = parseCardHost(sampleHost);
if (!sampleCard || sampleCard.line !== "Hello from the card." || sampleCard.hit.parked.cx !== 0.9 || sampleCard.padBottom !== 12) {
  fail("card host parser missed a sample AiFieldCard");
}
if (canvasRuntimeVersion({ dependencies: { "@rive-app/canvas": "^2.43.1" } }) !== "2.43.1") {
  fail("runtime version parser missed the canvas package");
}

const sha = await currentStorySha();
if (!sha) fail("could not resolve AlexTouvras/storytelling main");

async function text(file) {
  const res = await fetch(storyFileUrl(sha, file), { headers: { "User-Agent": "agentic-ai-field-card" } });
  if (!res.ok) fail(`${res.status} ${file}`);
  return res.text();
}

const [pkgText, robotText, hostText, rivRes] = await Promise.all([
  text(FILES.pkg),
  text(FILES.robot),
  text(FILES.host),
  fetch(storyFileUrl(sha, FILES.riv), { headers: { "User-Agent": "agentic-ai-field-card" } }),
]);

if (!rivRes.ok) fail(`${rivRes.status} ${FILES.riv}`);
const riv = await rivRes.arrayBuffer();
if (riv.byteLength < 1000) fail(`robot.riv is unexpectedly small (${riv.byteLength} bytes)`);

const pkg = JSON.parse(pkgText);
const runtime = canvasRuntimeVersion(pkg);
if (!runtime) fail("storytelling package.json has no @rive-app/canvas version");

const robot = parseRobotContract(robotText);
if (!robot) {
  fail("could not read export const ROBOT from storytelling — the field card would fall back to a stale contract");
}
const host = parseCardHost(hostText);
if (!host) {
  fail("could not read AiFieldCard host behavior — the field card would fall back to a stale tuck/line");
}

const same =
  robot.name === FALLBACK_ROBOT.name &&
  robot.stateMachine === FALLBACK_ROBOT.stateMachine &&
  robot.props.line === FALLBACK_ROBOT.props.line &&
  robot.props.presence === FALLBACK_ROBOT.props.presence;

console.log(
  JSON.stringify(
    {
      sha,
      runtime,
      bytes: riv.byteLength,
      robot,
      host,
      fallbackMatchesContract: same,
    },
    null,
    2,
  ),
);
