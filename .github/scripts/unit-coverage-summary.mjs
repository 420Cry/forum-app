#!/usr/bin/env node
import fs from 'node:fs'

const summaryPath = 'coverage/coverage-summary.json'
if (!fs.existsSync(summaryPath)) {
  console.log('## Unit test coverage\n\n_No coverage report found._')
  process.exit(0)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const total = summary.total
const pct = entry => entry?.pct ?? 0

console.log('## Unit test coverage (forum-app / Vitest)')
console.log()
console.log(
  `| Metric | Coverage |
| --- | ---: |
| Lines | ${pct(total.lines)}% |
| Statements | ${pct(total.statements)}% |
| Functions | ${pct(total.functions)}% |
| Branches | ${pct(total.branches)}% |`,
)
