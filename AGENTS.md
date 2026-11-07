# Working on shaungsimpson.com

Standards for anyone changing this site, people and coding agents alike. The site is a Nuxt static site (`pnpm generate` into `dist/`) deployed on Netlify, with articles in `content/articles/`.

## Definition of done

A change is ready when:

1. **`pnpm check` passes.** It generates the site (the link checker fails on broken links), runs the SEO tests and runs Lighthouse. CI runs the same steps on every pull request; see [docs/quality.md](docs/quality.md).
2. **New rules come with a test.** If you fix an SEO or content problem that could come back, add a check to `tests/site.test.ts` so it cannot.
3. **Thresholds only go up.** Never lower a threshold in `lighthouserc.json` or add to an exception list in a test to make a change pass. Raising a threshold gets a row in the log in `docs/quality.md`.

## SEO rules

The tests enforce these; keep them true.

- **URLs end in a slash.** Netlify serves prerendered pages at `/path/`, so canonicals, `og:url`, the sitemap and internal links use that form (`site.trailingSlash` and `nuxtLink.trailingSlash` in `nuxt.config.ts`).
- **Every page has a `<title>` and a meta description.**
- **Titles fit in a search result:** 60 characters including " | Shaun Simpson". Older articles listed in `LONG_TITLES` are exceptions; shorten one and remove it, never add one.
- **Missing pages return a real 404.** No catch-all `200` rewrite in `public/_redirects`.
- **Drafts stay unpublished.** `draft: true` and future-dated articles are left out of the content collection (`content.config.ts`), so they are never generated, listed in the sitemap or shipped in `sql_dump.txt`.

## Articles

- Frontmatter follows `content.config.ts`. Use `seoDescription` (160 characters or fewer) when the search snippet should differ from `description`.
- Set `draft: true` until the article is ready. The repository is public, so a pushed draft can still be read on GitHub.
- To schedule an article, merge it with a future `published` date. The Scheduled publish workflow rebuilds the site just after midnight in Sydney on that date.
- Write in Australian English (colour, behaviour, centre). UI text is in sentence case.
- Align Markdown tables in the source, in articles and docs alike: pad every cell so the pipes line up and the table reads as a table without rendering. Right-align number columns (`---:`) and pad them to match.
- Keep work articles generic: no employer, client or colleague names, ticket numbers, internal URLs or private code copied verbatim.

## Git

- Work on a branch; conventional commit titles (`feat:`, `fix:`, `docs:`, `chore:`), no emojis.
