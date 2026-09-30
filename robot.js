/**
 * Storytelling robot on the field card.
 *
 * The character lives in AlexTouvras/storytelling. This page does not vendor
 * robot.riv. On each visit it resolves main, then loads that commit's file,
 * the ROBOT contract (artboard, size, view-model names), the host behavior
 * from AiFieldCard (bubble line, tuck hit box, reduced-motion settle), and
 * the @rive-app/canvas version that commit was built with.
 *
 * https://alextouvras.com/stories/ai-card already draws this robot over an
 * iframe of the card. When this page is that iframe, it stays out of the way.
 */

export const STORY_REPO = "AlexTouvras/storytelling";

const FILES = {
  pkg: "package.json",
  robot: "src/illustrations/robot.ts",
  host: "src/components/director/AiFieldCard.tsx",
  riv: "src/illustrations/robot.riv",
};

/** Used only when a file from that commit cannot be read. */
export const FALLBACK_RUNTIME = "2.43.1";

export const FALLBACK_ROBOT = {
  name: "Robot",
  stateMachine: "Robot",
  width: 400,
  height: 400,
  props: {
    line: "line",
    presence: "presence",
    poke: "poke",
    settle: "settle",
  },
};

export const FALLBACK_HOST = {
  line: "This card is which layer to use, and which to leave out.",
  settleMs: 1400,
  padTop: 80,
  padRight: 16,
  padBottom: 16,
  hit: {
    parked: { cx: 0.88, cy: 0.76, bw: 0.2, bh: 0.24 },
    present: { cx: 0.5, cy: 0.55, bw: 0.38, bh: 0.46 },
  },
};

export function storyFileUrl(ref, filePath) {
  return `https://raw.githubusercontent.com/${STORY_REPO}/${ref}/${filePath}`;
}

export function canvasRuntimeVersion(pkg) {
  const raw = pkg?.dependencies?.["@rive-app/canvas"];
  if (typeof raw !== "string") return null;
  const match = raw.match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function sliceObject(source, start) {
  let i = start;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  if (source[i] !== "{") return null;
  let depth = 0;
  let quote = null;
  for (let j = i; j < source.length; j += 1) {
    const c = source[j];
    if (quote) {
      if (c === "\\") {
        j += 1;
        continue;
      }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(i, j + 1);
    }
  }
  return null;
}

function pickString(source, key) {
  const match = source.match(new RegExp("(?:^|[\\s,{])" + key + "\\s*:\\s*\"([^\"\\\\]*)\""));
  return match ? match[1] : null;
}

function pickNumber(source, key) {
  const match = source.match(new RegExp("(?:^|[\\s,{])" + key + "\\s*:\\s*(\\d+(?:\\.\\d+)?)"));
  return match ? Number(match[1]) : null;
}

function stripBlockComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Artboard name, state machine, size, and view-model keys from `export const ROBOT`. */
export function parseRobotContract(source) {
  if (typeof source !== "string") return null;
  source = stripBlockComments(source);
  const at = source.search(/export const ROBOT\s*=/);
  if (at < 0) return null;
  const eq = source.indexOf("=", at);
  if (eq < 0) return null;
  const body = sliceObject(source, eq + 1);
  if (!body) return null;
  const propsAt = body.indexOf("props:");
  const props = propsAt < 0 ? null : sliceObject(body, propsAt + "props:".length);
  if (!props) return null;
  const contract = {
    name: pickString(body, "name"),
    stateMachine: pickString(body, "stateMachine"),
    width: pickNumber(body, "width"),
    height: pickNumber(body, "height"),
    props: {
      line: pickString(props, "line"),
      presence: pickString(props, "presence"),
      poke: pickString(props, "poke"),
      settle: pickString(props, "settle"),
    },
  };
  if (!contract.name || !contract.stateMachine) return null;
  if (!contract.width || !contract.height) return null;
  if (!contract.props.line || !contract.props.presence || !contract.props.poke || !contract.props.settle) {
    return null;
  }
  return contract;
}

/** Bubble line, settle time, and tuck hit box from AiFieldCard. */
export function parseCardHost(source) {
  if (typeof source !== "string") return null;
  const line = source.match(/const CARD_LINE = "([^"\\]*)"/);
  const settleMs = source.match(/const SETTLE_MS = (\d+)/);
  const padTop = source.match(/const padTop = (\d+)/);
  const padRight = source.match(/const padRight = (\d+)/);
  const padBottom = source.match(/const padBottom = (\d+)/);
  const cx = source.match(/const cx = parked \? ([\d.]+) : ([\d.]+)/);
  const cy = source.match(/const cy = parked \? ([\d.]+) : ([\d.]+)/);
  const bw = source.match(/const bw = parked \? ([\d.]+) : ([\d.]+)/);
  const bh = source.match(/const bh = parked \? ([\d.]+) : ([\d.]+)/);
  if (!line || !settleMs || !padTop || !padRight || !padBottom || !cx || !cy || !bw || !bh) return null;
  const host = {
    line: line[1],
    settleMs: Number(settleMs[1]),
    padTop: Number(padTop[1]),
    padRight: Number(padRight[1]),
    padBottom: Number(padBottom[1]),
    hit: {
      parked: { cx: Number(cx[1]), cy: Number(cy[1]), bw: Number(bw[1]), bh: Number(bh[1]) },
      present: { cx: Number(cx[2]), cy: Number(cy[2]), bw: Number(bw[2]), bh: Number(bh[2]) },
    },
  };
  if (!host.line || host.settleMs < 1) return null;
  return host;
}

export async function currentStorySha() {
  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (typeof window === "undefined") headers["User-Agent"] = "agentic-ai-field-card";
    const res = await fetch(`https://api.github.com/repos/${STORY_REPO}/commits/main`, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.sha === "string" && data.sha ? data.sha : null;
  } catch {
    return null;
  }
}

function framed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function safeVm(instance) {
  try {
    return instance?.viewModelInstance ?? null;
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.arrayBuffer();
}

function loadRuntime(version) {
  const base = `https://cdn.jsdelivr.net/npm/@rive-app/canvas@${version}`;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${base}/rive.js`;
    script.async = true;
    script.onload = () => {
      const api = window.rive;
      if (!api?.Rive || !api.RuntimeLoader) {
        reject(new Error("Rive runtime did not load"));
        return;
      }
      api.RuntimeLoader.setWasmUrl(`${base}/rive.wasm`);
      resolve(api);
    };
    script.onerror = () => reject(new Error(`Rive runtime ${version} failed to load`));
    document.head.appendChild(script);
  });
}

function mountChrome(host) {
  const style = document.createElement("style");
  style.textContent = `
    .field-robot {
      pointer-events: none;
      position: fixed;
      z-index: 20;
      left: 0;
    }
    .field-robot canvas {
      width: 100%;
      height: 100%;
      display: block;
      vertical-align: top;
    }
    .field-robot-hit {
      position: fixed;
      z-index: 21;
      cursor: pointer;
      border: 0;
      background: transparent;
      padding: 0;
      color: transparent;
    }
    .field-robot-hit:focus-visible {
      outline: 2px solid #245a7a;
      outline-offset: 2px;
    }
    .field-robot-presence {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    @media print {
      .field-robot, .field-robot-hit, .field-robot-presence { display: none !important; }
    }
  `;
  const layer = document.createElement("div");
  layer.className = "field-robot";
  layer.id = "field-robot";
  layer.dataset.testid = "rive-robot";
  layer.style.top = `${host.padTop}px`;
  layer.style.right = `${host.padRight}px`;
  layer.style.bottom = `${host.padBottom}px`;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  layer.appendChild(canvas);

  const hit = document.createElement("button");
  hit.type = "button";
  hit.className = "field-robot-hit";
  hit.id = "field-robot-hit";
  hit.dataset.testid = "robot-hit";
  hit.hidden = true;
  hit.setAttribute("aria-label", "Tuck the robot into the corner");

  const presence = document.createElement("p");
  presence.className = "field-robot-presence";
  presence.id = "field-robot-presence";
  presence.dataset.testid = "robot-presence";
  presence.textContent = "—";

  document.head.appendChild(style);
  document.body.append(layer, hit, presence);
  return { layer, canvas, hit, presence };
}

function placeHit(hit, host, robot, where) {
  const boxW = window.innerWidth - host.padRight;
  const boxH = window.innerHeight - host.padTop - host.padBottom;
  const scale = Math.min(boxW / robot.width, boxH / robot.height);
  const w = robot.width * scale;
  const h = robot.height * scale;
  const x = window.innerWidth - host.padRight - w;
  const y = window.innerHeight - host.padBottom - h;
  const box = where === "parked" ? host.hit.parked : host.hit.present;
  hit.style.left = `${x + (box.cx - box.bw / 2) * w}px`;
  hit.style.top = `${y + (box.cy - box.bh / 2) * h}px`;
  hit.style.width = `${box.bw * w}px`;
  hit.style.height = `${box.bh * h}px`;
}

async function mount() {
  const sha = (await currentStorySha()) || "main";
  const ref = sha;
  const [pkgText, robotText, hostText, riv] = await Promise.all([
    fetchText(storyFileUrl(ref, FILES.pkg)).catch(() => null),
    fetchText(storyFileUrl(ref, FILES.robot)).catch(() => null),
    fetchText(storyFileUrl(ref, FILES.host)).catch(() => null),
    fetchBuffer(storyFileUrl(ref, FILES.riv)),
  ]);

  let runtime = FALLBACK_RUNTIME;
  if (pkgText) {
    try {
      runtime = canvasRuntimeVersion(JSON.parse(pkgText)) || FALLBACK_RUNTIME;
    } catch {
      runtime = FALLBACK_RUNTIME;
    }
  }
  const robot = (robotText && parseRobotContract(robotText)) || FALLBACK_ROBOT;
  const host = (hostText && parseCardHost(hostText)) || FALLBACK_HOST;

  let api;
  try {
    api = await loadRuntime(runtime);
  } catch (err) {
    if (runtime === FALLBACK_RUNTIME) throw err;
    api = await loadRuntime(FALLBACK_RUNTIME);
  }

  const { layer, canvas, hit, presence } = mountChrome(host);
  layer.dataset.storySha = sha;

  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const ratio = () => Math.min(window.devicePixelRatio || 1, 2);
  let instance = null;
  let settleTimer = null;

  const resize = () => instance?.resizeDrawingSurfaceToCanvas(ratio());
  const observer = new ResizeObserver(() => resize());
  observer.observe(layer);

  const settle = () => {
    if (!instance || !reducedMotion()) return;
    instance.play();
    if (settleTimer !== null) window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => instance?.pause(), host.settleMs);
  };

  const readPresence = () => {
    const value = safeVm(instance)?.enum(robot.props.presence)?.value;
    return value ? String(value) : "";
  };

  const sync = () => {
    const where = readPresence();
    presence.textContent = where || "—";
    placeHit(hit, host, robot, where);
    hit.hidden = false;
    hit.setAttribute("aria-label", where === "parked" ? "Bring the robot back" : "Tuck the robot into the corner");
  };

  hit.addEventListener("click", () => {
    const trigger = safeVm(instance)?.trigger(robot.props.poke);
    if (!trigger) return;
    trigger.trigger();
    instance?.play();
    if (reducedMotion()) settle();
  });

  instance = new api.Rive({
    canvas,
    buffer: riv,
    artboard: robot.name,
    stateMachine: robot.stateMachine,
    autoplay: true,
    autoBind: true,
    layout: new api.Layout({
      fit: api.Fit.Contain,
      alignment: api.Alignment.BottomRight,
    }),
    onLoad: () => {
      resize();
      const vm = safeVm(instance);
      const line = vm?.string(robot.props.line);
      if (line) line.value = host.line;
      if (!reducedMotion()) instance.play();
      else {
        vm?.trigger(robot.props.settle)?.trigger();
        settle();
      }
      sync();
      window.setInterval(sync, 200);
      window.addEventListener("resize", sync);
    },
    onLoadError: () => {
      layer.remove();
      hit.remove();
      presence.remove();
      console.warn("Field-card robot failed to load.");
    },
  });
}

if (typeof document !== "undefined" && !framed()) {
  mount().catch((err) => {
    console.warn("Field-card robot unavailable.", err);
    document.getElementById("field-robot")?.remove();
    document.getElementById("field-robot-hit")?.remove();
    document.getElementById("field-robot-presence")?.remove();
  });
}
