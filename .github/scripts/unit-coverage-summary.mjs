#!/usr/bin/env node
/**
 * Print a coverage report from Vitest's json-summary reporter.
 * Usage: node .github/scripts/unit-coverage-summary.mjs [path/to/coverage-summary.json] [--collapse]
 *
 * `--collapse` folds the per-directory breakdown behind a <details> — used for
 * the PR comment. Set UNIT_RUN_URL to append a link back to the workflow run.
 */
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const collapse = args.includes('--collapse')
const runUrl = process.env.UNIT_RUN_URL

const summaryPath = args.find(a => !a.startsWith('--')) ?? 'coverage/coverage-summary.json'

if (!fs.existsSync(summaryPath)) {
  console.log('## Unit test coverage\n\n_No coverage report found._')
  process.exit(0)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const { total, ...files } = summary

const METRICS = ['lines', 'statements', 'functions', 'branches']
const pct = entry => (entry?.pct ?? 0).toFixed(1)
const cell = entry => (entry?.total ? `${pct(entry)}%` : '—')

/** Group per-file entries by their directory, relative to the repo root. */
const byDir = new Map()
for (const [file, data] of Object.entries(files)) {
  const rel = path.relative(process.cwd(), file)
  const dir = path.dirname(rel.startsWith('..') ? file : rel)
  if (!byDir.has(dir)) {
    byDir.set(dir, { files: 0, ...Object.fromEntries(METRICS.map(m => [m, { total: 0, covered: 0 }])) })
  }
  const agg = byDir.get(dir)
  agg.files += 1
  for (const m of METRICS) {
    agg[m].total += data[m]?.total ?? 0
    agg[m].covered += data[m]?.covered ?? 0
  }
}

for (const agg of byDir.values()) {
  for (const m of METRICS) {
    agg[m].pct = agg[m].total ? (agg[m].covered / agg[m].total) * 100 : 0
  }
}

// Worst gaps first: a 0%-covered one-liner matters less than a half-covered module.
const dirs = [...byDir.entries()].sort(
  (a, b) => (b[1].lines.total - b[1].lines.covered) - (a[1].lines.total - a[1].lines.covered),
)

console.log('## Unit test coverage (forum-app / Vitest)')
console.log()
console.log(
  `**${pct(total.lines)}%** of lines covered `
  + `(${total.lines.covered}/${total.lines.total}) across ${Object.keys(files).length} files`,
)
console.log()
console.log('| Metric | Covered | Total | Coverage |')
console.log('| --- | ---: | ---: | ---: |')
for (const m of METRICS) {
  const label = m[0].toUpperCase() + m.slice(1)
  console.log(`| ${label} | ${total[m].covered} | ${total[m].total} | ${pct(total[m])}% |`)
}
console.log()

if (collapse) console.log(`<details><summary>Breakdown by directory (${dirs.length})</summary>\n`)

console.log('| Directory | Files | Lines | Statements | Functions | Branches | Uncovered lines |')
console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: |')
for (const [dir, agg] of dirs) {
  console.log(
    `| \`${dir}\` | ${agg.files} | ${cell(agg.lines)} | ${cell(agg.statements)} `
    + `| ${cell(agg.functions)} | ${cell(agg.branches)} | ${agg.lines.total - agg.lines.covered} |`,
  )
}

if (collapse) console.log('\n</details>')

if (runUrl) {
  console.log()
  console.log(`[Full coverage report](${runUrl})`)
}
