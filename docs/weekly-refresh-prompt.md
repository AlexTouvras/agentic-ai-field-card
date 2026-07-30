# Weekly content refresh

Discovery of new frameworks/tools is **automated** by `npm run discover` in the Monday GitHub Action.
This prompt is for reviewing the PR and handling judgment calls the scripts defer.

## Already done by CI

1. Link check → `data/link-report.json`
2. Landscape discovery → `data/discovery-report.md`
3. Picker proposal → `data/proposed-updates.json` (HTML may already be patched if an API key secret is configured)
4. Version stamp bump + PR opened

## Your job on the PR

1. Read **Identified candidates** in the PR body.
2. Accept, edit, or revert any auto picker changes.
3. For net-new confirmed tools, add them to `data/watchlist.json` with `onCard: true|false`.
4. Only add a **stack layer** if a new *job* appeared (not a new brand for an old job).
5. Keep **Use** as short linked labels; nuance stays in **Example**.
6. Do not put editor notes on the public HTML.
