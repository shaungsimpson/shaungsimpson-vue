// Prints the median Lighthouse score per page and category as a markdown table,
// and appends it to the GitHub job summary when run in Actions.
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('reports/lighthouse/manifest.json', 'utf8'))
const categories = ['performance', 'accessibility', 'best-practices', 'seo']

const runsByPage = Map.groupBy(manifest, (run) => new URL(run.url).pathname)
const median = (values) => values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)]

const rows = [...runsByPage].map(([page, runs]) =>
  `| ${page} | ${categories.map((c) => Math.round(median(runs.map((r) => r.summary[c])) * 100)).join(' | ')} |`,
)
const table = [
  `| Page | ${categories.join(' | ')} |`,
  `|---|${categories.map(() => '---:').join('|')}|`,
  ...rows,
].join('\n')
const summary = `### Lighthouse (mobile, median of ${manifest.length / runsByPage.size} runs)\n\n${table}\n`

console.log(summary)
writeFileSync('reports/lighthouse/summary.md', summary)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
