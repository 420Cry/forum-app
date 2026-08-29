#!/usr/bin/env node
/**
 * Print a GitHub Actions job summary from Playwright results.json.
 * Usage: node .github/scripts/report-e2e-summary.mjs [path/to/results.json] [--collapse]
 *
 * `--collapse` folds the full table behind a <details> and lists failures up
 * front — used for the PR comment, where the flat table is too noisy.
 * Set E2E_RUN_URL to append a link back to the workflow run.
 *
 * Lives in forum-app so the e2e CI job does not depend on
 * forum-test-automation@main shipping this script.
 */
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const collapse = args.includes('--collapse')
const runUrl = process.env.E2E_RUN_URL

const resultsPath = args.find(a => !a.startsWith('--'))
  ?? path.join(process.cwd(), 'forum-test-automation', 'playwright-report', 'results.json')

if (!fs.existsSync(resultsPath)) {
  console.log('## E2E coverage\n\n_No Playwright results file found._')
  process.exit(0)
}

const report = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
const stats = report.stats ?? {}
const suites = report.suites ?? []

/** @type {{ id: string, title: string, ok: boolean }[]} */
const cases = []

function walkSuite(suite, prefix = '') {
  const title = prefix ? `${prefix} › ${suite.title}` : suite.title
  for (const spec of suite.specs ?? []) {
    const id = spec.title.match(/^[A-Z]+\d+/)?.[0] ?? spec.title
    const ok = (spec.tests ?? []).every(
      t => (t.results ?? []).every(r => r.status === 'passed' || r.status === 'skipped'),
    )
    cases.push({ id, title: `${title} › ${spec.title}`, ok })
  }
  for (const child of suite.suites ?? []) {
    walkSuite(child, title)
  }
}

for (const suite of suites) walkSuite(suite)

const passed = cases.filter(c => c.ok).length
const total = cases.length
const pct = total ? Math.round((passed / total) * 100) : 0

const failures = cases.filter(c => !c.ok)

console.log('## E2E test coverage (forum-test-automation)')
console.log()
console.log(
  `**${passed}/${total}** scenarios passed (**${pct}%**) `
  + `— duration ${Math.round((stats.duration ?? 0) / 1000)}s`,
)
console.log()

if (collapse && failures.length) {
  console.log(`### Failed (${failures.length})`)
  console.log()
  for (const c of failures) console.log(`- ${c.title}`)
  console.log()
}

if (collapse) console.log(`<details><summary>All ${total} scenarios</summary>\n`)

console.log('| ID / scenario | Status |')
console.log('| --- | --- |')
for (const c of cases) {
  const escapedTitle = c.title
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
  console.log(`| ${escapedTitle} | ${c.ok ? 'pass' : 'fail'} |`)
}

if (collapse) console.log('\n</details>')

if (runUrl) {
  console.log()
  console.log(`[Full run and artifacts](${runUrl})`)
}
