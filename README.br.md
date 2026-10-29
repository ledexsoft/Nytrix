<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo do Nytrix">
    </picture>
  </a>
</p>
<p align="center">O agente de programação com IA de código aberto.</p>
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

### Instalação

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/ledexsoft/Nytrix/dev/install | bash

# Gerenciadores de pacotes
npm i -g @nytrix/cli@latest      # ou bun/pnpm/yarn
nix run github:ledexsoft/Nytrix  # Nix
```

> [!TIP]
> Remova versões anteriores a 0.1.x antes de instalar.

### App desktop (BETA)

O Nytrix também está disponível como aplicativo desktop. Baixe em [GitHub Releases](https://github.com/ledexsoft/Nytrix/releases).


#### Diretório de instalação

O script de instalação instala o Nytrix em `$HOME/.nytrix/bin`.

### Agents

O Nytrix inclui dois agents integrados, que você pode alternar com a tecla `Tab`.

- **build** - Padrão, agent com acesso total para trabalho de desenvolvimento
- **plan** - Agent somente leitura para análise e exploração de código
  - Nega edições de arquivos por padrão
  - Pede permissão antes de executar comandos bash
  - Ideal para explorar codebases desconhecidas ou planejar mudanças

Também há um subagent **general** para buscas complexas e tarefas em várias etapas.
Ele é usado internamente e pode ser invocado com `@general` nas mensagens.

Saiba mais sobre [agents](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content/agents.mdx).

### Documentação

Para mais informações sobre como configurar o Nytrix, [**veja nossa documentação**](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content).

### Contribuir

Se você tem interesse em contribuir com o Nytrix, leia os [contributing docs](./CONTRIBUTING.md) antes de enviar um pull request.

### About Nytrix

Nytrix is an independent fork of OpenCode. See LICENSE for source attribution.

---

**Junte-se à nossa comunidade** [GitHub Discussions](https://github.com/ledexsoft/Nytrix/discussions)
