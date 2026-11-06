---
title: "I Wrote About SEO, Then Audited My Own Site"
description: "An honest account of publishing an article about guarding fixes, then finding my own site had SEO bugs, no guard rails and a few months of quiet neglect."
seoDescription: An honest look at the SEO bugs I found on my own site after writing about web vitals, how I fixed them, and what is still not done.
published: 2026-11-06
draft: false
tags:
  - seo
  - web-vitals
  - testing
  - nuxt
  - ai
---

> **In short**
>
> - I published [an article about guarding a performance fix](/articles/subsetting-material-symbols-icon-font/) on a site with no guards of its own.
> - One idle question afterwards turned up three SEO bugs, and the checks I added found a fourth. All of them were mine, and one had been live for months.
> - They are fixed now, with checks so they stay fixed. Some things are still not done, and they are listed at the end.

My last article ended on a neat loop: identify the problem, understand it, fix it, prove the fix, then guard it so it stays fixed. It reads well. I had not been applying it to my own site.

This is what happened when I checked.

## I did not plan an audit

There was no plan here. The article went live, and a few minutes later I asked the AI assistant I had been writing with a lazy question: was SEO handled on that page?

I expected "yes". I had set the site up with a proper SEO module, and it generates titles, descriptions, social images, structured data and a sitemap without me thinking about it. That was the problem: I had stopped thinking about it.

The assistant fetched the live page and read its `<head>`. Most of it was fine. Three things were not:

1. **The title was too long.** With my name on the end it was 81 characters. Google shows about 60, so the end was cut off. I had spent a long time polishing that article and never looked at it the way a search result would show it.
2. **The description was out of date.** The article had changed shape during editing, from a how-to into a case study. The search snippet still described the how-to.
3. **Every canonical URL on the site pointed at a redirect.** The site is generated as static pages, which Netlify serves at `/path/` with a trailing slash. The canonical tags said `/path` without one, which Netlify redirects. So every page was telling search engines "the real page is somewhere else", and somewhere else bounced back.

None of these broke anything a visitor would see. That is exactly why they had survived.

## The fixes were the easy part

Each fix was small:

- **One setting** (`trailingSlash: true`) made canonicals, `og:url`, the sitemap and structured data use the URL Netlify actually serves, and one more made internal links match.
- **A shorter title:** "Material Symbols Was 97% Dead Weight". It is 52 characters with my name, keeps the search term, and is more accurate than the original.
- **A new description** that matched the article it had become.

If I had stopped there, I would have fixed today's bugs and left the conditions that produced them exactly as they were.

## Guarding it, starting low

The site had no tests and no CI. Netlify built whatever I pushed. So I added three checks that run on every pull request and every push.

### The link checker, made to mean it

The SEO module had been running a link checker on every build since I rebuilt the site in Nuxt. It printed a summary, and nothing acted on it. One setting (`failOnError: true`) means a broken internal link now fails the build instead of going live. It does not fetch external links, so someone else's outage cannot block my deploy.

### Tests on the built pages

The bugs only existed in the generated HTML, so the tests read the generated HTML. They check titles, descriptions, canonicals, the sitemap, drafts and 404s.

Eight older articles of mine have titles over 60 characters. The honest options were to shorten them all now or admit they exist, so they sit in an exceptions list. The test fails if anyone adds to that list, and also if one gets shortened but stays on it, so the list can only shrink. I have not shortened any of them yet.

I meant to use Vitest. Adding it made the package manager re-resolve every loosely pinned dependency, and one of them demanded a version that did not exist yet. The underlying issue is that my dependencies are pinned to `latest`, which is now on the list below. I used Node's built-in test runner instead, which needs no dependency at all.

### Lighthouse, with thresholds I can actually keep

Lighthouse scores four pages on mobile on every run. The scores are currently good, but I do not yet know how much they wobble between runs, and a check that fails at random gets switched off. So the thresholds started well below the scores and only go up.

They did not stay there long. Over the first five runs no score moved by more than 2 points, so the next day I raised them:

| | Starting threshold | Threshold now | Scores |
|---|---:|---:|---:|
| Performance | 80 | 90 | 94 to 98 |
| Accessibility | 90 | 90 | 92 to 95 |
| Best practices | 90 | 95 | 96 to 100 |
| SEO | 90 | 100 | 100 |

SEO at 100 is deliberate: on a site where I write about SEO, any failed SEO audit should stop a deploy. Accessibility stays at 90 because the homepage scores 92, which is not great. It is now visible on every run, which is the point, and the threshold goes up once it is fixed.

Each run keeps its reports for 90 days, and a log in the repository records every threshold change with a date, so the history lives with the code.

### Nothing skips the checks

Checks only help if they cannot be skipped, and I had pushed straight to `main` twice that day. A ruleset on the repository now requires every change to arrive as a pull request and pass the quality checks before it can merge, and nobody, including me, can push around it without switching it off first. This article went live through that same route.

## The guard found an older bug

Writing the 404 test turned up the most useful find of the day.

The site started as a single-page Vue app, and Netlify needed a catch-all rule to serve it: `/* /index.html 200`. When I rebuilt the site as static pages in July, that rule came along. So for about four months, every address that did not exist returned my homepage with a "200 OK". Search engines call that a soft 404, and it makes a site look as if it has endless duplicate pages.

Nobody told me, because nobody would. A personal site has no users filing bugs. The fix was deleting one line, after checking that every route from the old app still existed as a real page.

## Proving the checks work

A check I have never seen fail is a check I am trusting on faith. So I broke the built site on purpose: a canonical without the slash, an overlong title and the old catch-all rule. Each failed with a message naming the page and the problem. I also raised the Lighthouse threshold above the real score to make sure a failure actually fails the run.

## What the checks cannot see

Automated checks catch broken links and bad canonicals. They do not catch "amazinglky".

Reading the site the way a hiring manager would, rather than the way a build tool does, turned up four typos on my About page that had been there since 2023, and a job in my work history that appeared to start six months after it ended. None of it would ever fail a test. All of it was on the page people read to decide whether I am careful. The fixes took minutes; the lesson is that a site needs a reader as well as a test suite.

## The AI made mistakes too

Most of this was done in one long session with an AI coding assistant, and it was not flawless.

It was fast and it was thorough, but it also counted things wrong, made claims a little stronger than the evidence, and wrote a first title for this very article that was 66 characters long, breaking the 60-character rule it had just helped write. It caught that one itself, by measuring. It also told me a sentence on my About page was unfinished, when it had only read a truncated copy of the line; the sentence was fine, and it corrected itself once it read the whole file. Other mistakes I caught by reading carefully, and some I probably have not caught.

The useful part was never that the tools were right. It was that they answered quickly when asked, and I kept asking. Was SEO handled? Does the canonical match what is served? What happens at an address that does not exist? None of those questions came from the tools.

## What is still not done

- **Search Console is not set up.** I decided it is worth having, since it shows what Google actually indexed, and have not set it up yet.
- **The eight long titles are still long.**
- **The linter does not run.** `eslint` was never installed, which I found during this work and left for later.
- **Dependencies are still pinned to `latest`**, which is how the test framework broke.
- **Accessibility on the homepage is 92.** Finding out why is the next thing to investigate.

## What I would tell myself

- Check your own work the way you would check a colleague's. I published an article about guard rails on a site with none.
- Test what you ship, not just what you write. Every one of these bugs lived in the generated output.
- Start checks where you can keep them, then ratchet up. A strict check that gets disabled protects nothing.
- Personal projects rot quietly because nobody reports the bugs. That is a reason to automate the checks, not to skip them.
- AI tools make the work faster. Asking the right questions is still the job.
