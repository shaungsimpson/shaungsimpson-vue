/**
 * Checks the generated site in dist/ against the SEO rules in AGENTS.md.
 * Run `pnpm generate` first; `pnpm check` does both.
 */
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { test } from 'node:test'

const SITE = 'https://shaungsimpson.com'
const DIST = 'dist'
const MAX_TITLE = 60

// Titles over MAX_TITLE that predate the rule. Shorten one, then remove it here; never add to it.
const LONG_TITLES = new Set([
  '/articles/embrace-the-framework-custom-collections-for-subscriptions/',
  '/articles/embrace-the-framework-customer-eligibility-with-custom-collections/',
  '/articles/embrace-the-framework-operational-reports-with-collections/',
  '/articles/embrace-the-framework-order-fulfilment-with-collections/',
  '/articles/embrace-the-framework-order-processing-pipeline-that-can-grow/',
  '/articles/embrace-the-framework-order-processing-with-pipelines/',
  '/articles/embrace-the-framework-supplier-imports-with-collections-and-pipelines/',
  '/articles/embrace-the-framework-why-working-with-laravel-beats-working-around-it/',
])

assert.ok(existsSync(DIST), 'dist/ is missing: run `pnpm generate` first')

const pageFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name.startsWith('_') ? [] : pageFiles(path)
    return entry.name === 'index.html' ? [path] : []
  })

const pages = pageFiles(DIST).map((file) => {
  const html = readFileSync(file, 'utf8')
  const pick = (re: RegExp) => html.match(re)?.[1]
  return {
    path: `/${relative(DIST, file).replace(/index\.html$/, '')}`,
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/),
    ogUrl: pick(/<meta property="og:url" content="([^"]*)"/),
  }
})

const sitemap = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])

test('every page has a title and a meta description', () => {
  for (const page of pages) {
    assert.ok(page.title, `${page.path}: no <title>`)
    assert.ok(page.description, `${page.path}: no meta description`)
  }
})

test('every canonical is the page itself, at the trailing-slash URL Netlify serves', () => {
  for (const page of pages) {
    assert.equal(page.canonical, `${SITE}${page.path}`, `${page.path}: canonical points elsewhere or at a redirect`)
    assert.equal(page.ogUrl, page.canonical, `${page.path}: og:url differs from the canonical`)
  }
})

test(`titles fit in a search result (${MAX_TITLE} characters)`, () => {
  for (const page of pages) {
    if (LONG_TITLES.has(page.path)) continue
    assert.ok(page.title!.length <= MAX_TITLE, `${page.path}: title is ${page.title!.length} characters; shorten it`)
  }
})

test('the long title exceptions only shrink', () => {
  assert.ok(LONG_TITLES.size <= 8, 'LONG_TITLES has grown; shorten the new title instead of adding an exception')
})

test('every grandfathered long title is still long', () => {
  for (const path of LONG_TITLES) {
    const page = pages.find((p) => p.path === path)
    assert.ok(page && page.title!.length > MAX_TITLE, `${path}: no longer needs an exception; remove it from LONG_TITLES`)
  }
})

test('the sitemap lists only pages that exist, at their canonical URLs', () => {
  const canonicals = new Set(pages.map((p) => p.canonical))
  for (const loc of sitemap) assert.ok(canonicals.has(loc), `sitemap lists ${loc}, which is not a page's canonical`)
})

test('draft articles are not published', () => {
  const drafts = readdirSync('content/articles')
    .filter((file) => /^draft:\s*true$/m.test(readFileSync(join('content/articles', file), 'utf8')))
    .map((file) => `/articles/${file.replace(/\.md$/, '')}/`)
  for (const path of drafts) {
    assert.ok(!pages.some((p) => p.path === path), `${path} is a draft but was generated`)
    assert.ok(!sitemap.includes(`${SITE}${path}`), `${path} is a draft but is in the sitemap`)
  }
})

test('unknown URLs get a real 404, not the homepage', () => {
  assert.ok(existsSync(join(DIST, '404.html')), 'dist/404.html is missing')
  const redirects = join(DIST, '_redirects')
  if (existsSync(redirects)) {
    assert.doesNotMatch(readFileSync(redirects, 'utf8'), /^\/\*\s+\S+\s+200/m, 'a catch-all 200 rewrite turns every 404 into a soft 404')
  }
})
