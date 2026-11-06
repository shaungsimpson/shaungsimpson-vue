---
title: "Material Symbols Was 97% Dead Weight"
description: "A case study in fixing a real performance problem in an existing codebase: cutting an icon font by 97%, the compromises involved, and whether an icon font is still the right choice."
seoDescription: How I cut an icon font by 97% in a live codebase, the compromises involved, and when SVG icons are the better choice.
published: 2026-11-06
draft: false
tags:
  - performance
  - fonts
  - web-vitals
  - css
  - nuxt
---

> **In short**
>
> - **Problem:** one icon font was 83% of all font bytes on our public marketing pages, slowing them during a wider SEO and web vitals audit.
> - **Decision:** mitigate now by subsetting the font to the icons actually used, rather than rewrite every icon as SVG.
> - **Outcome:** a 97% smaller font (625 KB to 15 KB), no sideways layout shift while it loads, and tests that keep it that way, delivered in a day.
> - **Trade-off:** it is still an icon font. For a new project I would start with SVG icons.

Material Symbols is a convenient way to put icons in an app. You install one package, import one stylesheet, and write `check_circle` wherever you want a tick. That convenience has a cost that is easy to miss: the font holds every icon in the set, about 4,300 of them, and you download all of them to draw the hundred or so you use.

This is the story of finding that cost in a production Nuxt app, and of fixing it inside the constraints of a working codebase: what I tried, what broke, the compromise I chose and why, and whether it is the right long-term answer.

The work ran in five steps: identify, understand, fix, prove, guard.

## The problem

This was one task in a wider SEO and web vitals audit of our public marketing pages, carried out over a few days. Alongside it ran a batch of other fixes: subsetting the brand text fonts, sitemap and crawl corrections, meta descriptions, heading levels and image sizing. Each was small; together they targeted the scores that decide how those pages rank and how fast they feel.

A web vitals scan of those pages showed one file making up 83% of all font bytes: the Material Symbols font, at about 625 KB. We use it across the site for most of our non-bespoke icons, so it loads everywhere, but the cost hurt most on the marketing pages, where load speed feeds directly into search rankings, bounce rates and conversions.

The size alone was bad. The way it loaded made it worse:

- **It was blocking.** The stylesheet used `font-display: block`, so every icon on the page stayed blank until the whole 625 KB had arrived.
- **It was discovered late.** The browser only learns about a font after it has downloaded and parsed the CSS that references it, so the biggest font on the page started downloading last.
- **It shifted layout.** Before the font loads, a ligature icon is just its name in invisible text. `lock_outline` is 12 characters wide, about 140 pixels, so rows of icons jumped sideways when the 1em glyphs replaced them.
- **It competed with the page's main content.** Largest Contentful Paint (LCP) measures how long the biggest element on screen, usually a hero image or heading, takes to appear. An icon is rarely that element, but 625 KB of font downloading at the same time takes bandwidth from the files that are, which matters most on slower mobile connections.

The app rendered 102 different icons. Roughly 97% of the download was never used.

## Why it happens: ligature fonts

Material Symbols is a ligature font. You do not reference an icon by a code point; you write its name as text, and the font has a ligature rule that turns the 12 characters of `check_circle` into a single icon glyph.

That design is why icon fonts are pleasant to use, and it is also why they fail in two quiet ways:

1. **The whole set ships by default.** The font cannot know which names your app will type, so it contains all of them.
2. **A missing icon fails silently, as text.** If a name is not in the font, or is spelt wrong, the browser simply draws the letters. Ligatures are case-sensitive, so `Asterisk` renders the word "Asterisk" rather than the icon. Nothing errors; it just looks broken.

Keep that second point in mind, because shrinking the font makes it much easier to hit.

## The constraints

This was not a greenfield choice. The app was live, most icons rendered through one shared component, and other people were shipping changes to the same code every day. Whatever I did had to fix the size problem without rewriting how icons are used, and without leaving a process only I understood.

## Options considered

### Switch to SVG icons

An SVG icon system (such as `@nuxt/icon`) only ships what you use, and is the right choice for a new project. Here it would have meant touching about 220 call sites in the same change. Subsetting the font kept the existing `<AppIcon>` component, and almost every caller, as they were. I come back to that trade-off at the end.

### Subset locally with fonttools

The usual way to subset a font is `pyftsubset` with a list of characters. For a ligature font that barely helps. Every icon name is made of `a`–`z` and `_`, so keeping those characters keeps nearly every ligature, and the file hardly shrinks. Pruning ligatures properly means working at the glyph ID level with custom tooling.

### Let Google subset it

Google Fonts already solves this. The CSS API accepts an `icon_names` parameter and returns a font holding only those icons, with the variable axes you ask for. It prunes ligatures correctly, keeps the `FILL` axis for filled variants, and needs no Python. This is what I used.

The network is only needed when someone adds or removes an icon. The font is committed to the repository, so builds stay offline and deterministic.

## The mitigation

### 1. A manifest of icon names

One file lists every icon the app may use:

```ts
// icons/manifest.ts
export const ICON_NAMES = [
  'add',
  'check_circle',
  'expand_more',
  // ...
] as const

export type IconName = (typeof ICON_NAMES)[number]
```

The icon component's `icon` prop is typed `IconName`, with no `| string` escape hatch. Before the subset, `| string` let new icons in without friction. After it, `| string` would let you choose icons the font does not contain. Now the editor autocompletes names and flags any that are missing.

Because the list is committed, every icon change appears as a one-line diff in review.

### 2. A script to regenerate the font

A small script, run as `pnpm icons:build`, does four things:

1. reads the manifest;
2. checks every name against Google's official codepoints list;
3. downloads the subset font from Google Fonts;
4. writes a JSON file with the names baked into the font and the font's sha256.

```ts
const CODEPOINTS_URL =
  'https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/' +
  'MaterialSymbolsRounded%5BFILL,GRAD,opsz,wght%5D.codepoints'

// icon_names must be sorted, or Google rejects the request.
const names = [...ICON_NAMES].sort()

const codepoints = await (await fetchOk(CODEPOINTS_URL)).text()
const known = new Set(codepoints.split('\n').map((line) => line.split(' ')[0]))
const unknown = names.filter((name) => !known.has(name))
if (unknown.length) {
  throw new Error(`Not Material Symbols icons (names are lowercase): ${unknown.join(', ')}`)
}

const cssUrl =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,700,0..1,0' +
  `&icon_names=${names.join(',')}&display=block`

const css = await (await fetchOk(cssUrl)).text()
const fontUrl = css.match(/src:\s*url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1]
if (!fontUrl) throw new Error(`No woff2 url in Google Fonts response:\n${css}`)

const font = Buffer.from(await (await fetchOk(fontUrl)).arrayBuffer())
writeFileSync(FONT_PATH, font)
const sha256 = createHash('sha256').update(font).digest('hex')
writeFileSync(NAMES_PATH, `${JSON.stringify({ names, sha256 }, null, 2)}\n`)
```

Two details here were learnt the hard way:

- **Google's subset API quietly accepts names that are not icons.** A made-up name still returns a perfectly good font, and the icon then renders as text. The codepoints check catches typos and capitalised names before the download.
- **The npm package's name list is not complete.** It leaves out aliases such as `expand_more` and `auto_awesome`. Validating against it dropped eight icons the app really used. The codepoints file in Google's repository includes aliases.

Google picks the font format from the user agent, so the script sends a current Chrome user agent to get woff2.

### 3. Load it early, and keep `font-display: block`

The package's stylesheet was replaced with a local `@font-face`:

```css
@font-face {
  font-family: 'Material Symbols Rounded';
  font-style: normal;
  font-weight: 700;
  font-display: block;
  src: url('./fonts/icons.woff2') format('woff2');
}
```

It is tempting to switch to `font-display: swap`, but for an icon font that flashes `keyboard_arrow_down` as text before each icon appears, which is worse than a brief blank. The problem was never `block`; it was size and timing. The subset fixes the size, and a preload fixes the timing:

```ts
import iconFont from '~/fonts/icons.woff2?url'

useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: iconFont, crossorigin: '' },
  ],
})
```

Preloading is not always right for fonts. Preload a font a page might not use and you waste bandwidth on it. Here every page draws icons and the file is 15 KB, so fetching it immediately is the right trade. Importing it with `?url` means the preload and the CSS point at the same hashed file after the build.

### 4. Stop the sideways shift

Before the font arrives, the invisible ligature name is many ems wide. The first attempt, `width: 1em`, fixed the shift and broke something else: icons centred by stretching to their parent with `text-align: center` moved to the left.

Size containment gives the icon a *natural* width of 1em while `width` stays `auto`, so stretched icons still stretch:

```css
@supports (contain-intrinsic-inline-size: 1em) {
  .icon {
    contain: inline-size;
    contain-intrinsic-inline-size: 1em;
  }
}
```

The `@supports` wrapper matters: in older Safari (before 17), `contain: inline-size` without the intrinsic size collapses icons to zero width, so those browsers keep the old behaviour instead.

One more trap: do not add `overflow: hidden` to hide the overflowing name. On an inline-block it moves the baseline, so inline icons sit lower than the text beside them.

## Keeping it current

A subset font is only fast while the manifest matches the code. People will forget, and so will AI coding agents, so the rules live in the codebase rather than in anyone's memory.

### An architecture test

A test in the normal unit suite scans the source for icon names and fails when:

| Check | Catches |
|---|---|
| Every icon used is in the manifest | A new icon added without regenerating, which would render as text |
| Every manifest icon is still used | Dead icons bloating the font |
| Manifest names match the font JSON | The list edited but the script not run |
| The font's sha256 matches the JSON | A merge that kept the other branch's binary font while the text files merged |
| No raw icon font class in templates | Icons that bypass the component and the scan |
| The scanner finds known samples | A regex change that quietly stops finding names |

Each failure message names the exact fix, such as "add `x` to manifest.ts and run `pnpm icons:build`".

The sha256 check deserves a mention. Git merges text files line by line but takes one side of a binary file whole, so two branches that each add an icon can merge into a manifest with both names and a font with only one. The hash catches it.

### Scan only where icons can appear

The first version of the scan matched every quoted string in the codebase and found about 35 false positives: `'radio'`, `'label'`, `'pending'` and so on are all valid icon names. An allow-list would have created blind spots, since a later `icon="label"` would be ignored too.

Instead the scan only looks where an icon name can be:

- `icon="…"` and other attributes ending in `icon`;
- the values of bound `:icon="…"` expressions;
- `icon:` keys in objects;
- return values of functions typed `IconName`.

The few literals in those positions that are not Material icons are listed per file, so each exception covers one name in one place.

### Guidance where people and agents look

The project's agent instructions file has one line on rendering icons through the component and running the script. A short doc explains how ligature icons fail, how to add and remove them, where the scan looks and why the CSS is the way it is. The manifest's header comment repeats the three steps at the point people edit.

Adding an icon is now: add the name, run `pnpm icons:build`, commit the manifest, font and JSON.

## Proving it worked

Before calling it done, I checked each claim rather than trusting the numbers:

- **The build:** one 15.7 KB icon font in the output, with the preload and the CSS pointing at the same hashed file.
- **Layout:** measured in Chromium and WebKit, and checked by hand in Firefox. Once loaded, every layout matched the old one; before load, the sideways shift was gone.
- **The guard:** I broke it on purpose. An unlisted icon, a stale manifest and a swapped font file each made the test fail with the right message.

None of that replaced looking. With AI tools writing more of the code and more of the tests, it is easy to see a green suite and move on. I still loaded the pages on a throttled connection and checked the centred and filled icons by eye, because layout problems like the off-centre icons `width: 1em` caused are exactly what a test suite misses unless someone already knows to look for them.
## The results

| | Before | After |
|---|---|---|
| Icon font | ~625 KB, ~4,300 icons | 15 KB, 102 icons, with the `FILL` axis |
| Discovery | after the CSS is parsed | preloaded with the document |
| Layout before load | box as wide as the hidden name, row shifts on load | 1em natural width, no sideways shift |
| Missing or misspelt icon | renders as text, found by eye | fails a test or the type check |

The work also caught a real bug: an `icon="Asterisk"` that had been rendering the word "Asterisk" beside a required field, because ligatures are case-sensitive. It now draws an asterisk.

## Is an icon font still the right choice?

Honestly, it depends where you are starting from.

Icon fonts earned their place. One package gives a team a large, consistent icon set, everyone can use it straight away, and adding an icon is as easy as typing its name. For a team moving quickly, that is a reasonable trade, and it is why so many projects still use them.

If I were starting a project today, though, I would be cautious about reaching for one. Most of this article exists because the icons were a font: the blocking load, the hidden text taking up space, the preload, the containment CSS, and icons that fail silently as words. SVG icons avoid all of that by design. They are drawn inline, there is nothing to wait for, a missing icon never turns into a stray word, and they are easier to make accessible, since an SVG can carry its own title and label.

The tooling has also caught up. In Nuxt, [`@nuxt/icon`](https://nuxt.com/modules/icon/bundles) can scan your source and bundle only the icons you use, which is much the same safety net this article builds by hand. Material Symbols is available as an SVG set through Iconify, so you do not even have to change the look.

But a working app is not a new project. Moving this one to SVG would have meant changing around 220 call sites to go from 15 KB to slightly less, and the subset got almost all of the benefit in one pull request with only a handful of small caller changes.

Time mattered too. The subset delivered results within a day. The proper fix would have meant re-auditing every call site, likely taking a week, and any icon rendered somewhere the audit missed, such as a name built at runtime or passed through data, could have reached production broken. The subset's scan and tests surfaced those hidden uses as part of the work, rather than leaving them to be found by users.

That made subsetting the right first step for a codebase that already depends on a font: fix the real problem now, decide the bigger change separately.

There is a twist here. Almost all of the upkeep this process needs, keeping the manifest current, running the script and acting on test failures, is the kind of work AI coding agents now do reliably, especially when every failure message names its own fix. That makes the mitigation cheap to live with. But the same is true of the migration: changing every call site to an SVG component is exactly the repetitive, test-checked change agents handle well. AI-assisted development lowers the cost of maintaining a compromise and the cost of leaving it, so the question becomes less "can we afford to migrate?" and more "is this still worth its upkeep?"

So my advice is:

- **Starting fresh:** prefer SVG icons, bundled at build time.
- **Already using an icon font:** subset it now. It is the biggest win for the least change, and it mitigates most of the problems above.
- **Either way:** hide decorative icons from screen readers (`aria-hidden="true"`) and give meaningful ones a label. A ligature icon that is not hidden can be read aloud by its name.

Subsetting is excellent mitigation. It is not a cure, and it is not always the best starting point.

## Takeaways

- Identify, understand, fix, prove, guard. A fix you have not proven is a guess, and one you have not guarded will drift.
- Ligature fonts cannot be subset by characters. Subset by icon name, and let Google do it if you can.
- Validate names yourself. Both the subset API and the browser fail silently.
- Put the rules in a test, not a wiki page. A subset that drifts quietly turns icons back into words.
- In an existing codebase, fix the real problem within its constraints first, and make the bigger change a separate decision.
