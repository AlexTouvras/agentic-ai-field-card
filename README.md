# Agentic AI Field Card

Standalone one-pager: [`index.html`](./index.html)

**Live:** after Pages is enabled → `https://alextouvras.github.io/agentic-ai-field-card/`

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
| **Monday GitHub Action** | Checks every doc link in `index.html`, bumps the footer version stamp, opens a **PR** with a human checklist |
| **Broken-link issue** | If any Use/framework URL fails, opens a labeled issue |
| **Content pass** | Use [`docs/weekly-refresh-prompt.md`](./docs/weekly-refresh-prompt.md) in Cursor (or any agent) to update frameworks/examples; open/update the PR |

Manual triggers: **Actions → Weekly field card refresh → Run workflow**.

Local:

```bash
npm run check:links
CHANGED_NOTE="Fixed MCP docs URL" npm run bump:version
```

## What stays vs what churns

| Stable (edit rarely) | Churn zone (weekly OK) |
|---|---|
| 4-layer stack | Framework picker rows |
| Problem → use logic | Concrete product names in examples |
| Rules vs skills | Version stamp + Changed line + doc URLs |
| Ladder, anti-patterns, kill switch | — |

New protocols earn a **new layer** only if they solve a new job (knowledge / control / tools / peers / behavior). A renamed framework is a picker-row swap, not a redesign.

## Framework picker guidance

| Constraint | Typical pick |
|---|---|
| Control / HITL / durable state | LangGraph |
| Speed to role-based demo | CrewAI |
| RAG / data-first | LlamaIndex |
| Azure / .NET | MS Agent Framework |
| Handoffs or Anthropic-native | OpenAI / Claude SDKs |
| Schema-first typed Python | Pydantic AI |

## Doc links (Use column + frameworks)

| Label | Destination |
|---|---|
| RAG | https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview |
| MCP | https://modelcontextprotocol.io/ |
| Direct tools | https://platform.openai.com/docs/guides/function-calling |
| Workflow / Agent | https://www.anthropic.com/engineering/building-effective-agents |
| Rules | https://cursor.com/docs/rules |
| Skill | https://cursor.com/docs/skills |
| Human gate | https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop |
| Fine-tune | https://platform.openai.com/docs/guides/fine-tuning |
| A2A | https://a2a-protocol.org/ |
| Evals | https://platform.openai.com/docs/guides/evals |
| LangGraph | https://langchain-ai.github.io/langgraph/ |
| CrewAI | https://docs.crewai.com/ |
| LlamaIndex | https://docs.llamaindex.ai/ |
| MS Agent Framework | https://learn.microsoft.com/en-us/agent-framework/overview/ |
| OpenAI Agents SDK | https://openai.github.io/openai-agents-python/ |
| Claude Agent SDK | https://code.claude.com/docs/en/agent-sdk/overview |
| Pydantic AI | https://ai.pydantic.dev/ |

## Weekly refresh checklist (human)

1. Merge or amend the Monday PR after the content pass
2. Swap framework rows if the field moved
3. Refresh example nouns if needed; keep the problem column intact
4. Leave ladder and anti-patterns alone unless the pattern itself changed
