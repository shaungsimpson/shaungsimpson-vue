# Quality checks

Every pull request and every push to `main` runs the Quality workflow (`.github/workflows/quality.yml`):

1. **Generate** the site. The link checker fails the build on a broken link.
2. **SEO tests** (`tests/site.test.ts`) check the generated pages: titles, descriptions, canonicals, the sitemap, drafts and 404s.
3. **Lighthouse** scores four pages on mobile, three runs each, against the thresholds in `lighthouserc.json`.

Run all three locally with `pnpm check`.

## Where to see results

- **Each run:** the workflow's summary page shows a table of median Lighthouse scores per page.
- **Full reports:** each run uploads a `reports-<commit>` artifact with the Lighthouse HTML reports and the link checker report, kept for 90 days.
- **Over time:** the log below. Add a row whenever a threshold changes.

## Raising the thresholds

Thresholds start low and go up as the site improves. To raise one:

1. Check the last few runs' summaries: the new threshold should pass with a few points to spare, since Lighthouse varies between runs.
2. Change it in `lighthouserc.json`.
3. Add a row to the log in the same pull request.

Never lower a threshold to make a failing change pass. Fix the change, or explain in the pull request why the score dropped.

## Threshold log

| Date | Performance | Accessibility | Best practices | SEO | Note |
|---|---:|---:|---:|---:|---|
| 2026-11-06 | 80 | 90 | 90 | 90 | Starting point. Baseline (mobile medians): performance 94 to 98, accessibility 92 to 95, best practices 96 to 100, SEO 100. |
| 2026-11-07 | 90 | 95 | 95 | 100 | Five CI runs moved by 2 points at most (performance 94 to 98, best practices 96 to 100, SEO 100). Fixing the work history `<dl>` raised the homepage's accessibility from 92 to 96, so every page is at 95 or above; accessibility scores did not vary between runs. |
