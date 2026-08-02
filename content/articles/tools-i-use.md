---
title: Tools I Use
description: A quick overview of tools I use to enhance my productivity
seoDescription: A practical overview of the Windows, macOS, development, database, and productivity tools Shaun Simpson uses in his daily workflow.
published: '2024-05-26'
updated: '2026-08-02'
draft: false
tags:
  - tools
  - productivity
---

In my career I have found that a massive help to enhancing productivity is finding good tools that help alleviate the complexity of building products and features. In that regard I would like to share some of the tools that I use both personally and professionally.

At home I use a Windows machine and at work I use a Macbook Pro M2. Regardless of the OS, there are tools that can help ease the burden of a developer's day to day tasks. Here are some of the tools that I use.

## Windows Tools

- [WSL2](https://learn.microsoft.com/windows/wsl/): WSL2 lets Windows run a real Linux environment alongside Windows applications. This means I can use the same command-line tools, package managers, and Docker workflows commonly used on servers, while still using my normal Windows desktop. For web development, it makes Windows feel much closer to a Linux development machine.
- [Windows Terminal](https://learn.microsoft.com/windows/terminal/): Windows Terminal is the application I use to open command-line sessions on Windows. It supports multiple tabs, split panes, and profiles for PowerShell, WSL, and other shells, so I can keep a local server, a test runner, and a Git session open without juggling several windows.

## Mac Tools

- [Ghostty](https://ghostty.org/): Ghostty is my terminal of choice on Mac. A terminal is where I run commands to start applications, inspect logs, use Git, and work with developer tools. Ghostty is quick, lightweight, and comfortable to use all day without adding much friction to that workflow.
- [Rectangle](https://rectangleapp.com/): Rectangle is a macOS window manager. It adds keyboard shortcuts for placing windows side by side, filling a screen, or moving them between displays. Coming from Windows, where snapping windows is built in, it makes working with an editor, browser, and terminal on one or more monitors much easier.
- [Alfred](https://www.alfredapp.com/): Alfred is an enhanced application launcher and search tool for macOS. At its simplest it helps me open apps and find files quickly; with workflows, it can also run scripts and automate repeated actions. It is a useful way to keep small everyday tasks close to the keyboard.
- [DBngin](https://dbngin.com/): DBngin manages local database services such as MySQL, PostgreSQL, and Redis on macOS. Instead of manually installing, starting, and switching database versions, I can create the service a project needs and run it locally. It is a straightforward alternative when Docker would be more setup than the job requires.

## Universal Tools

- [Herd](https://herd.laravel.com/): Herd makes local PHP and Laravel development much easier on both Windows and Mac. It provides the local web server and PHP versions a Laravel project needs, so getting a project running is mostly about opening it rather than assembling a local runtime from separate pieces. The free version is useful on its own, while the paid version adds further convenience if it suits your workflow.
- [Figma Desktop](https://www.figma.com/downloads/): Figma is a collaborative design tool. I use the desktop app to explore interface ideas, review a design, inspect dimensions and colours, and turn a component into a working interface. Keeping it installed alongside my development tools makes design conversations much more practical.
- [JetBrains Suite](https://www.jetbrains.com/): JetBrains makes specialised code editors, known as IDEs, that understand the languages and frameworks they target. Their tools provide navigation, refactoring, debugging, testing, and code analysis out of the box. I mainly use PHPStorm for backend work and WebStorm for frontend work.
  - [PHPStorm](https://www.jetbrains.com/phpstorm/): PHPStorm is an IDE for PHP. It understands a codebase rather than treating files as plain text, which makes it easier to safely rename code, trace where something is used, run tests, and diagnose problems. Its Laravel support is particularly helpful, and I also recommend the [Laravel Idea](https://laravel-idea.com/) plugin for Laravel-specific shortcuts and insight.
  - [WebStorm](https://www.jetbrains.com/webstorm/): WebStorm is JetBrains' IDE for JavaScript and TypeScript. It gives the same kind of project-wide navigation, refactoring, debugging, and test support for frontend applications that PHPStorm provides for PHP.
  - [Writerside](https://www.jetbrains.com/writerside/): Writerside is a documentation tool that works well with Markdown. I use it when writing functional requirements, fleshing out specifications, documenting systems, and keeping personal notes that benefit from more structure than a plain text file.
- [VS Code](https://code.visualstudio.com/): Visual Studio Code is a free, extensible code editor. It is a strong choice if a full JetBrains licence is not practical, because extensions can add language support, formatters, debugging tools, and integrations to suit a particular workflow.
- [Codex](https://openai.com/codex/) and [ChatGPT](https://chatgpt.com/): I use ChatGPT and Codex as collaborative tools for exploring ideas, reviewing approaches, working through unfamiliar code, and speeding up repetitive tasks. They are most valuable when I remain responsible for the decisions and use them to improve the feedback loop, rather than treating their output as an answer that needs no review.
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/overview): Claude Code is an AI assistant that works from the terminal, where I already run project commands and inspect changes. This makes it convenient for talking through an unfamiliar codebase, investigating an issue, or making a focused change without leaving the development workflow.
- [Docker](https://www.docker.com/): Docker packages an application and its dependencies into containers: isolated, repeatable environments that run the same way across computers. It is useful for services such as databases, queues, and local copies of production-like infrastructure, and it is worth learning the basics even outside a DevOps role.
- [Postman](https://www.postman.com/): Postman is an API client. It lets me send requests to an application's API, provide headers or authentication, and inspect the response without needing to build a user interface first. It is especially useful while developing or debugging integrations.
- [Git](https://git-scm.com/): Git is a version-control system. It records changes to a codebase over time, lets developers work safely on separate branches, and makes it possible to review, merge, or restore work when collaborating in a team. It is essential knowledge for day-to-day software development.
- [zsh](https://zsh.sourceforge.io/) and [oh-my-zsh](https://ohmyz.sh/): zsh is the command shell I use, which is the program that interprets commands in a terminal. oh-my-zsh adds themes, helpful defaults, and a large plugin ecosystem. I have also added shell functions for recurring tasks, such as choosing a running Docker container, backing up its database before a change, and restoring that backup afterwards. Those small automations save a surprising amount of time.