# Agentic AI Field Card

Standalone one-pager: [`index.html`](./index.html). Don't start with an agent. Start with the job, then add a workflow, retrieval, or a loop only when the problem demands it.

**Live:** after Pages is enabled → `https://alextouvras.github.io/agentic-ai-field-card/`

The storytelling robot sits on this page the same way it does on [alextouvras.com/stories/ai-card](https://alextouvras.com/stories/ai-card): bottom-right chrome, a tap tucks it into the corner. The module in `index.html` (kept in step with `robot.js`) loads `robot.riv`, its view-model contract, and the Rive runtime from the current `main` commit of `AlexTouvras/storytelling`, so a new robot there shows up here without copying the file. The homepage card is [alextouvras.com/field-card](https://alextouvras.com/field-card/), which Orbit fills from `index.html` alone, so the module is inline rather than a second file. Inside the story iframe the script stays quiet, because that page already draws the robot. Print / PDF leaves it off.

Public artifact only. Editor / maintenance notes live **here** and under `docs/`, not on the card.

## Use across channels

| Channel | How |
|---|---|
| **Browser / site** | GitHub Pages URL, or host `index.html` anywhere static |
| **PDF** | Open → Print / PDF (landscape A4) |
| **LinkedIn** | Share the Pages URL; caption can reuse the H1 + lede |
| **Email / Slack** | Attach PDF or paste link |

## Automation (keeps the HTML honest)

| Piece | What it does |
|---|---|
| **Friday Cursor Automation (17:00 local)** | Discovers tools, edits the card when earned, leaves the PR open |
| **Friday review agent (18:00 local)** | The publish gate: publishes or keeps the previous card |
| **Slack #orbit** | Laconic FYI after review (Review / Considered / Changed / Online + Check card). Not the gate |
| **Mon watchdog** | If Friday review never applied, warn in #orbit to re-run the review agent |
| **Broken-link issue** | Opens a labeled issue when Use/framework URLs fail |

The Friday content agent runs `npm run discover`. `weekly-refresh.yml` is manual backup only (`workflow_dispatch`). The Friday 18:00 review agent is the publish gate (`Apply review`).

The public footer is a monthly review (`Next: October 2026` on the card), not a weekly stamp. A Friday with nothing new leaves Reviewed and Next where they are.

### Secrets (field-card repo)

Copy from Orbit / Vercel as needed:

| Secret | Purpose |
|---|---|
| `SLACK_ORBIT_WEBHOOK_URL` (or `SLACK_WEBHOOK_URL`) | Incoming webhook for #orbit |
| `WEEKLY_WRITE_SECRET` or `CRON_SECRET` or `FIELD_CARD_ACTION_SECRET` | HMAC for Apply review tokens (must match Orbit) |

### Secrets (Orbit / Vercel)

| Secret | Purpose |
|---|---|
| `GITHUB_TOKEN` or `FIELD_CARD_GITHUB_TOKEN` | Must be able to merge/close PRs on `AlexTouvras/agentic-ai-field-card` |
| Same signing secret as above | Verify Apply review tokens |

## What stays vs what churns

| Stable (edit rarely) | Churn zone (monthly OK) |
|---|---|
| Headline, the branch, and the loop with a human gate | A named-practice URL, when a better public source for the same move exists |
| A2A as a boundary, not a tile | Version stamp + Changed line |
| Prove it names bars and does not invent rates | — |

New protocols earn a **new station** only if they solve a new job (knowledge / control / tools / peers). A renamed framework does not go on the sheet. Rules and skills stay under judgement, not as extra stations.

## Doc links (named practices)

| Label | Destination |
|---|---|
| RAG | https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview |
| Workflow and agent | https://www.anthropic.com/engineering/building-effective-agents |
| MCP | https://modelcontextprotocol.io/ |
| A2A | https://a2a-protocol.org/ |
| Rules | https://cursor.com/docs/rules |
| Skills | https://cursor.com/docs/skills |
| Human gate | https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop |
| Evals | https://platform.openai.com/docs/guides/evals |

Direct tools, fine-tuning, and Bayesian optimisation stay off this sheet. A fixed path is a workflow. Changing facts stay in retrieval. A budget of expensive trials lives on the Bayesian optimisation card.

## Weekly refresh checklist (human)

1. If Friday review missed, re-run the 18:00 review agent or `Apply review` — do not Slack-Approve
2. Read the loop. Update only when a station teaches the wrong move, the stop is gone, or a named-practice URL is dead
3. Leave the picture alone on a no-change week. Do not put the job table or a framework picker back in front of it
