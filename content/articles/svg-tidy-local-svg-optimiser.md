---
title: "SVG Tidy: Clean and Optimise SVGs Locally"
description: Why I built SVG Tidy, a privacy-first browser tool for batch cleaning and optimising SVG files with conservative defaults and clear comparisons.
seoDescription: Introducing SVG Tidy, a browser-based tool for batch-cleaning and optimising SVG files locally without uploads, tracking, or lost viewBox data.
published: 2026-07-21
draft: false
tags:
  - svg
  - tools
  - web-development
  - privacy
---

SVGs are one of the best formats we have for icons, logos, and illustrations on the web. They are scalable, usually compact, and can be styled or animated with CSS and JavaScript. The files produced by design tools, however, do not always arrive ready for a codebase.

They can contain fixed dimensions, editor-specific data, inconsistent attribute ordering, unnecessary precision, and markup that is difficult to review. Cleaning one file is manageable. Cleaning a whole icon set is repetitive work that is easy to skip or perform inconsistently.

I built [SVG Tidy](https://svgtidy.shaungsimpson.com/) to make that job quick, predictable, and private.

## What SVG Tidy does

SVG Tidy is a browser-based batch normaliser. You can drop in a handful of SVG files or select an entire folder, and it will process the files locally in your browser. Folders are scanned recursively and non-SVG files are ignored.

The standard workflow applies a small set of useful transformations:

- strip `width` and `height` from the root element;
- preserve the `viewBox`, keeping the SVG responsive and scalable;
- sort attributes into a consistent order; and
- format the output as readable, neatly indented markup.

These are deliberately practical changes. The aim is not to chase the smallest possible byte count at any cost. It is to produce SVGs that are easier to use, review, and maintain.

## Your files stay on your machine

A tool like this should not require you to upload a folder of project assets to somebody else's server. SVG Tidy performs its work entirely in the browser: there are no file uploads and no tracking.

Local processing matters for more than privacy. It also makes the workflow feel immediate. You can drop in a folder, inspect the results, adjust the settings, and download the cleaned files without waiting for a round trip to a server.

## Conservative defaults, optional optimisation

SVG optimisation has trade-offs. A transformation that is safe for a static icon may break an SVG that depends on animation, scripts, external CSS, or meaningful metadata.

SVG Tidy therefore starts with conservative cleanup and makes more aggressive changes optional:

- **Conservative cleanup** removes editor data and redundant XML without changing the artwork.
- **Comments and metadata** can be removed for smaller files, with a clear warning that copyright or licence notes may also be removed.
- **Path optimisation** shortens commands and rounds coordinates using a configurable precision.
- **Artwork restructuring** can collapse groups and merge paths, but should be avoided for animated or scripted SVGs.
- **ID optimisation** shortens generated identifiers, but should be avoided when external CSS or scripts target those IDs.

The important part is that these choices are visible. Optimisation should be something a developer understands and opts into, not a mysterious black box.

## Review before downloading

After processing a batch, SVG Tidy shows the original and cleaned versions side by side. You can switch between the rendered artwork and the source, which makes it easier to check both visual fidelity and markup quality.

It also reports the before-and-after file sizes and breaks down what is consuming space, including path data, embedded images, metadata, and other markup. Embedded raster images are preserved because compressing them safely would require changing image quality.

Each result can be renamed and downloaded individually. For larger batches, SVG Tidy can create a ZIP while preserving the folder structure. That makes it useful for cleaning an existing asset directory without rebuilding its organisation afterward.

## Built for the work developers actually do

SVG Tidy is built with Vue, Vite, and SVGO. The technology is useful, but the workflow is the real point: batch input, sensible defaults, transparent options, before-and-after inspection, and local output.

I wanted a tool I could trust with a folder of assets and understand at a glance. Making it available publicly is my small way of giving something back to the developer community that has shared so many useful tools, packages, articles, and ideas with me over the years.

If SVG cleanup is part of your workflow, give [SVG Tidy](https://svgtidy.shaungsimpson.com/) a try. I hope it saves you some repetitive work and helps keep your SVG assets a little tidier.