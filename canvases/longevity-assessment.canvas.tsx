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
          Re-evaluation after durability hardening (commit 8fd706c) — 2026-08-03
        </Text>
      </Stack>

      <Callout tone="success" title="Updated verdict">
        Operationally durable for product and link churn over the next 1–3 years,
        if Friday Automation and Slack Approve keep running. Conceptually durable
        only if the quarterly ontology pass in docs/durability.md actually
        happens. Still not an unattended multi-year field oracle.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="1–3 yr" label="Framework / URL churn" tone="success" />
        <Stat value="Process" label="Concept layers" tone="warning" />
        <Stat value="Visible" label="Silent-fail risk" tone="success" />
        <Stat value="Moderate" label="Search noise now" tone="warning" />
      </Grid>

      <H2>What changed since the first pass</H2>
      <Table
        headers={["Gap (before)", "Fix landed", "Effect on longevity"]}
        rows={[
          [
            "Star-noise drowned candidates",
            "Score + noise filters, ignoreRepos, noisePatterns",
            "Judgment spends time on real swaps; less Approve fatigue",
          ],
          [
            "Automation could die silently",
            "Saturday check + Decision: contract",
            "Missed weeks become GitHub issues, not quiet drift",
          ],
          [
            "No long-horizon process",
            "docs/durability.md quarterly ontology",
            "Layers/constraints get a scheduled human redesign slot",
          ],
          [
            "Search queries too broad",
            "Language-scoped + higher star floors",
            "Fewer irrelevant novel hits entering the funnel",
          ],
        ]}
        rowTone={["success", "success", "success", "success"]}
      />

      <Callout tone="info" title="Evidence from smoke discovery">
        After filters: 14 candidates (was 19), 13 rejected as noise, MetaGPT /
        chatbot junk gone. Remaining novel hits skew toward protocol SDKs and
        real orchestration libs — still need judgment deferrals, but signal is
        cleaner.
      </Callout>

      <Divider />

      <H2>Loop health (current design)</H2>
      <Grid columns={4} gap={12}>
        <Card>
          <CardHeader>Fri CI</CardHeader>
          <CardBody>
            <Text size="small">
              Discover + links + discovery PR. No vendor LLM.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Fri Automation</CardHeader>
          <CardBody>
            <Text size="small">
              Decision: update|no-change, optional HTML edit, Slack notify.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Sat SLA</CardHeader>
          <CardBody>
            <Text size="small">
              field-card-judgment issue if Decision: missing after ~20h.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Human gate</CardHeader>
          <CardBody>
            <Text size="small">
              #orbit preview → Approve/Skip. Still required for merge.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <H2>Horizon scorecard (revised)</H2>
      <Table
        headers={["Horizon", "Before", "Now", "Still needs"]}
        rows={[
          [
            "12–24 months",
            "Likely OK if loop active",
            "Strong — noise down, missed judgment visible",
            "Automation path bound to new repo folder",
          ],
          [
            "Years 2–3",
            "Watchlist/search drift risk",
            "Plausible with quarterly ontology",
            "Actually run the quarterly checklist",
          ],
          [
            "Year 4+",
            "Ontology likely stale",
            "Same ceiling — process helps, does not invent new jobs",
            "Willing redesign when layers stop matching the field",
          ],
        ]}
        rowTone={["success", "warning", "danger"]}
      />

      <H2>Remaining risks (unchanged or only partly fixed)</H2>
      <Stack gap={12}>
        <Card>
          <CardHeader
            trailing={<Pill tone="warning" size="small">Open</Pill>}
          >
            Triple dependency: Actions + Cursor Automation + Approve
          </CardHeader>
          <CardBody>
            <Text>
              SLA detects a missing Decision; it does not replace Automation or
              force Slack Approves. A skipped Approve week still leaves Pages on
              the last merged card.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            trailing={<Pill tone="warning" size="small">Open</Pill>}
          >
            Discovery is still GitHub-centric
          </CardHeader>
          <CardBody>
            <Text>
              Standards bodies, vendor blogs, and closed ecosystems can move the
              field without starring a repo. Quarterly review is the backstop;
              non-GitHub signals are still Later in the backlog.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            trailing={<Pill tone="neutral" size="small">Process</Pill>}
          >
            Quarterly ontology is documented, not enforced
          </CardHeader>
          <CardBody>
            <Text>
              Unlike Saturday CI, nothing opens an issue if you skip a quarter.
              Longevity past ~3 years tracks whether you treat durability.md as
              real work.
            </Text>
          </CardBody>
        </Card>
      </Stack>

      <H2>Score delta</H2>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>First evaluation</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>Churn: 1–2 years if loop alive</Text>
              <Text>Noise: high</Text>
              <Text>Silent Automation failure: yes</Text>
              <Text>Ontology process: none</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>After 8fd706c</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text style={{ color: theme.accent.primary }}>
                Churn: 1–3 years with cleaner signal
              </Text>
              <Text style={{ color: theme.accent.primary }}>
                Noise: moderate
              </Text>
              <Text style={{ color: theme.accent.primary }}>
                Silent Automation failure: detected
              </Text>
              <Text style={{ color: theme.accent.primary }}>
                Ontology process: documented quarterly
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Divider />

      <H3>Bottom line</H3>
      <Text>
        The project is now a{" "}
        <span style={{ color: theme.accent.primary, fontWeight: 600 }}>
          maintained instrument with failure detection
        </span>
        , not just a hopeful weekly script. That is a real longevity upgrade for
        tools and links. Multi-year conceptual currency still rides on human
        quarterly judgment — by design — and that is the right tradeoff for a
        one-pager.
      </Text>

      <Row gap={8} wrap>
        <Pill tone="info" size="small">
          Next: re-bind Friday Automation to new path
        </Pill>
        <Pill tone="neutral" size="small">
          Next: schedule first quarterly ontology
        </Pill>
      </Row>
    </Stack>
  );
}
