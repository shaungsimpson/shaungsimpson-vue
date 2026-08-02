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

- WSL2: if you are developing on Windows and not using WSL2, you are missing out. It is a game changer for Windows. It helps you run a full Linux kernel on your Windows machine. You can seamlessly work in a Linux environment, incorporate Docker containers, and run Linux commands. It is a must have for any developer working on Windows.
- Windows Terminal: This is a great terminal that allows you to have multiple tabs and multiple panes in each tab. It is useful for managing multiple terminal windows.
- Herd: Herd makes local PHP and Laravel development much easier on both Windows and Mac. It keeps projects quick to set up, makes it simple to switch PHP versions, and lets me focus on the application rather than maintaining local runtime installations. The free version is useful on its own, while the paid version adds further convenience if it suits your workflow.
- Figma Desktop: Figma Desktop is useful when I am working through interface ideas, reviewing designs, or inspecting the details needed to turn a design into a working interface. Having it as a desktop app keeps that work close to the rest of my development tools.

## Mac Tools

- Ghostty: Ghostty is now my terminal of choice on Mac. It is fast, lightweight, and feels right at home in a keyboard-focused development workflow. I like that it stays out of the way while still being pleasant to use all day.
- Figma Desktop: I use Figma Desktop on Mac for the same design and review work. It is a handy place to explore a flow, inspect a component, and keep design conversations practical while building a feature.
- Rectangle: Rectangle is a window manager for Mac that allows you to easily move and resize windows. Coming from Windows I found the window management in Mac somewhat lacking, although this is likely due to my unfamiliarity with it. Rectangle has made it much easier to manage windows on my Mac, especially with multiple monitors.
- Alfred: Alfred is Mac's Spotlight search on steroids. It is a great tool that allows you to quickly search for files, applications, and even run scripts. It has a lot of functionality that can be added through plugins.
- Herd: I use Herd on Mac for the same reason I use it on Windows: it removes a lot of the friction from getting a Laravel project running locally. It is a much nicer starting point than manually assembling every part of a local PHP environment.
- DBngin: DBngin is an all in one database management tool. It allows you to easily manage your databases and switch between different versions of MySQL, Postgres, and Redis. If you do not want to set up and organise Docker containers, this will allow you to handle the databases you need for your projects.

## Universal Tools

- JetBrains Suite: I use the JetBrains suite of IDEs for my development. I use PHPStorm for PHP development and WebStorm for JavaScript development. They are a feature-heavy group of specialised IDEs that have a lot of utility out of the box.
  - PHPStorm: PHPStorm is a great IDE for PHP development. It has a lot of features that make developing in PHP a breeze. It has great support for Laravel and Symfony. It is a paid IDE, but it is worth the money if you are doing a lot of PHP development. If you are developing in Laravel, I also strongly recommend the Laravel Idea plugin.
  - WebStorm: WebStorm is for JavaScript developers what PHPStorm is for PHP developers. It is a paid IDE, but it is worth the money if you are doing a lot of JavaScript development.
  - Writerside: Writerside is a handy markdown editor that I use for writing markdown files. I use this mainly to define functional requirements, flesh out specs, and write documentation. I also use it for personal notes on systems and processes that I work with.
- VS Code: VS Code is great if you cannot justify the licensing for the JetBrains IDEs. I used this extensively until I was fortunate enough to work for a company that pays for the JetBrains Suite. There are huge amounts of plugins available so you can customise your editor to your workflow.
- Codex and ChatGPT: I use ChatGPT and Codex as collaborative tools for exploring ideas, reviewing approaches, working through unfamiliar code, and speeding up the repetitive parts of development. They are most useful when I stay responsible for the decisions and use them to improve the feedback loop.
- Claude CLI: Claude CLI is another useful option for working with an AI assistant directly from the terminal. Being able to bring an assistant into the same place I already run commands, inspect projects, and work through changes makes it practical for day to day development.
- Docker: Docker is pretty much a standard in the industry. Even if you are not in a DevOps role, you should definitely learn the basics.
- Postman: Postman is a great tool for testing APIs. It allows you to easily test your API and see the responses in a nice format.
- Git: Git is a must have for any developer. It is a version control system that allows you to track changes in your codebase. Some of us remember the bad old days before good version control. I would strongly recommend any developer learn the more advanced functionality Git can provide. It is absolutely necessary in any team based development.
- zsh: zsh is my shell of choice and the obligatory inclusion of oh-my-zsh. It is a great shell that has a lot of functionality out of the box. I have customised my zsh shell to include a lot of plugins that help me with my day to day tasks. Frequent complex tasks can be built into shell functions and called from the command line. For example, I have a shell function that allows me to select a running Docker container, back up the database, and save it to a file before manipulating the database while working on a feature. I have a companion command that restores the database from that file. This is a huge time saver for me.