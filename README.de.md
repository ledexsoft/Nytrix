<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Nytrix logo">
    </picture>
  </a>
</p>
<p align="center">Der Open-Source KI-Coding-Agent.</p>
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

# Paketmanager
npm i -g @nytrix/cli@latest      # oder bun/pnpm/yarn
nix run github:ledexsoft/Nytrix  # Nix
```

> [!TIP]
> Entferne Versionen älter als 0.1.x vor der Installation.

### Desktop-App (BETA)

Nytrix ist auch als Desktop-Anwendung verfügbar. Lade sie von [GitHub Releases](https://github.com/ledexsoft/Nytrix/releases) herunter.


#### Installationsverzeichnis

Das Installationsskript installiert Nytrix in `$HOME/.nytrix/bin`.

### Agents

Nytrix enthält zwei eingebaute Agents, zwischen denen du mit der `Tab`-Taste wechseln kannst.

- **build** - Standard-Agent mit vollem Zugriff für Entwicklungsarbeit
- **plan** - Nur-Lese-Agent für Analyse und Code-Exploration
  - Verweigert Datei-Edits standardmäßig
  - Fragt vor dem Ausführen von bash-Befehlen nach
  - Ideal zum Erkunden unbekannter Codebases oder zum Planen von Änderungen

Außerdem ist ein **general**-Subagent für komplexe Suchen und mehrstufige Aufgaben enthalten.
Dieser wird intern genutzt und kann in Nachrichten mit `@general` aufgerufen werden.

Mehr dazu unter [Agents](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content/agents.mdx).

### Dokumentation

Mehr Infos zur Konfiguration von Nytrix findest du in unseren [**Docs**](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content).

### Beitragen

Wenn du zu Nytrix beitragen möchtest, lies bitte unsere [Contributing Docs](./CONTRIBUTING.md), bevor du einen Pull Request einreichst.

### About Nytrix

Nytrix is an independent fork of OpenCode. See LICENSE for source attribution.

---

**Tritt unserer Community bei** [GitHub Discussions](https://github.com/ledexsoft/Nytrix/discussions)
