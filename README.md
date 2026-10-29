<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Nytrix logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix/discussions">GitHub Discussions</a>
  <a href="https://www.npmjs.com/package/@nytrix/cli"><img alt="npm" src="https://img.shields.io/npm/v/@nytrix/cli?style=flat-square" /></a>
  <a href="https://github.com/ledexsoft/Nytrix/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/ledexsoft/Nytrix/release.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![Nytrix Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://github.com/ledexsoft/Nytrix)

---

### Installation

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/ledexsoft/Nytrix/dev/install | bash

# Package managers
npm i -g @nytrix/cli@latest      # or bun/pnpm/yarn
nix run github:ledexsoft/Nytrix  # Nix
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

Nytrix is also available as a desktop application. Download it from [GitHub Releases](https://github.com/ledexsoft/Nytrix/releases).


#### Installation Directory

The install script installs Nytrix to `$HOME/.nytrix/bin`.

### Agents

Nytrix includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content/agents.mdx).

### Documentation

For more info on how to configure Nytrix, [**head over to our docs**](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content).

### Contributing

If you're interested in contributing to Nytrix, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### About Nytrix

Nytrix is an independent fork of OpenCode. See LICENSE for source attribution.

---

**Join our community** [GitHub Discussions](https://github.com/ledexsoft/Nytrix/discussions)
