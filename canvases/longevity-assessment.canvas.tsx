import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

export default function LongevityAssessment() {
  const theme = useHostTheme();

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 960 }}>
      <Stack gap={8}>
        <H1>Field card longevity</H1>
        <Text tone="secondary">
          Will the weekly loop keep the card current as agentic AI evolves over
          the next several years?
        </Text>
      </Stack>

      <Callout tone="warning" title="Verdict">
        Strong for 1–2 years of framework and link churn if the Friday loop and
        Slack Approve stay active. Not sufficient alone for multi-year paradigm
        shifts — discovery finds products; it does not redesign the card’s job
        model.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="1–2 yr" label="Framework / URL churn" tone="success" />
        <Stat value="Mixed" label="Concept layers" tone="warning" />
        <Stat value="Human" label="Gate dependency" tone="warning" />
        <Stat value="High" label="Search noise today" tone="danger" />
      </Grid>

      <Divider />

      <H2>What the system actually does</H2>
      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>CI (Friday 12:00 UTC)</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>Link check → issues on breakage</Text>
              <Text>GitHub search + watchlist discovery</Text>
              <Text>Version stamp + discovery PR</Text>
              <Text tone="secondary" size="small">
                No LLM. Cheap and durable.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Cursor Automation (17:00)</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>Judge update vs no-change</Text>
              <Text>Edit picker / URLs when earned</Text>
              <Text>Write PR Summary + Slack notify</Text>
              <Text tone="secondary" size="small">
                Quality gate — also a single point of failure.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Human (#orbit)</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>Preview proposed HTML</Text>
              <Text>Approve or Skip</Text>
              <Text>Squash-merge only via Approve</Text>
              <Text tone="secondary" size="small">
                Protects the one-pager; also caps unattended freshness.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <H2>Design strengths for longevity</H2>
      <Table
        headers={["Choice", "Why it ages well"]}
        rows={[
          [
            "Stable vs churn split",
            "4-layer stack, problem→use, ladder, anti-patterns stay; picker + product nouns churn",
          ],
          [
            "Picker ≤ 7, swap by constraint",
            "Forces replacement over accumulation — card cannot become a directory",
          ],
          [
            "New layer only for new job",
            "Renames and hype do not rewrite the ontology",
          ],
          [
            "CI without vendor LLM",
            "Discovery keeps running even if model APIs / pricing shift",
          ],
          [
            "Human Approve before merge",
            "Prevents silent degradation from noisy GitHub-star candidates",
          ],
        ]}
      />

      <H2>Where it will struggle over years</H2>
      <Stack gap={12}>
        <Card>
          <CardHeader
            trailing={<Pill tone="danger" size="small">Structural</Pill>}
          >
            Discovery is GitHub-star biased
          </CardHeader>
          <CardBody>
            <Text>
              Latest run: 19 candidates, many novel hits are chatbots, demo
              frameworks, skill dumps, or star-farm noise (MetaGPT, nanobot,
              hyperframes, cyber-skills packs). Heuristics
              (agent|orchestr|mcp|…) will miss paradigm shifts that use
              different vocabulary, and will keep surfacing popular irrelevancies.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            trailing={<Pill tone="warning" size="small">Process</Pill>}
          >
            Freshness depends on three living systems
          </CardHeader>
          <CardBody>
            <Text>
              GitHub Actions, Cursor Cloud Automation, and Orbit Slack Approve
              must all keep working. If Automation stops, CI still opens
              discovery PRs — but the card HTML stops evolving. If Approves
              stop, PRs pile up and Pages drifts.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            trailing={<Pill tone="warning" size="small">Ontology</Pill>}
          >
            Watchlist + layers are hand-curated
          </CardHeader>
          <CardBody>
            <Text>
              New constraint niches (e.g. durable workflows, browser agents,
              local runtime) require someone to add watchlist entries and
              possibly invent a new picker constraint or layer. Automation can
              swap rows; it cannot invent a better map of the field by itself.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            trailing={<Pill tone="neutral" size="small">Evidence</Pill>}
          >
            Loop already works once — under judgment
          </CardHeader>
          <CardBody>
            <Text>
              W31: discovery flagged Google ADK as a high-priority gap;
              judgment added it and deferred Semantic Kernel / Haystack /
              Mastra / novel noise. That is the intended behavior — product
              freshness with conceptual restraint — not autonomous year-scale
              authorship.
            </Text>
          </CardBody>
        </Card>
      </Stack>

      <H2>Horizon scorecard</H2>
      <Table
        headers={["Horizon", "Likely outcome", "Condition"]}
        rows={[
          [
            "Next 12–24 months",
            "Picker, docs URLs, and examples stay credible",
            "Friday Automation + weekly Approve continue",
          ],
          [
            "Years 2–4",
            "Core layers may still hold; search queries & watchlist need redesign",
            "Quarterly human ontology pass",
          ],
          [
            "Year 5+",
            "Card may describe yesterday’s map unless redesigned",
            "New jobs (beyond RAG/agent/tools/peers/behavior) force a rewrite",
          ],
        ]}
        rowTone={["success", "warning", "danger"]}
      />

      <H2>What would make “years to come” realistic</H2>
      <Stack gap={8}>
        <Row gap={8} align="center">
          <Pill tone="info" size="small">1</Pill>
          <Text>
            Quarterly ontology review: are the layers and constraints still the
            right jobs?
          </Text>
        </Row>
        <Row gap={8} align="center">
          <Pill tone="info" size="small">2</Pill>
          <Text>
            Harden discovery: tighter relevance filters, demote star-only
            novelty, track sources beyond GitHub (papers, vendor blogs,
            standards bodies).
          </Text>
        </Row>
        <Row gap={8} align="center">
          <Pill tone="info" size="small">3</Pill>
          <Text>
            Health check for the Automation itself (alert if no judgment Summary
            lands within N days of the Friday discovery PR).
          </Text>
        </Row>
        <Row gap={8} align="center">
          <Pill tone="info" size="small">4</Pill>
          <Text>
            Keep the human gate, but treat skipped weeks as a freshness SLA
            breach — not silent success.
          </Text>
        </Row>
      </Stack>

      <Divider />

      <H3>Bottom line</H3>
      <Text>
        This is a well-designed{" "}
        <span style={{ color: theme.accent.primary, fontWeight: 600 }}>
          maintenance system for a curated one-pager
        </span>
        , not an autonomous encyclopedia of the field. It will keep the card
        honest on tools and links for the near future. It will not, by itself,
        guarantee conceptual currency for “years to come” without periodic
        human redesign of what the card is allowed to say.
      </Text>
    </Stack>
  );
}
