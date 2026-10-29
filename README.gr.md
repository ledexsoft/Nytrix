<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Nytrix logo">
    </picture>
  </a>
</p>
<p align="center">Ο πράκτορας τεχνητής νοημοσύνης ανοικτού κώδικα για προγραμματισμό.</p>
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

### Εγκατάσταση

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/ledexsoft/Nytrix/dev/install | bash

# Διαχειριστές πακέτων
npm i -g @nytrix/cli@latest      # ή bun/pnpm/yarn
nix run github:ledexsoft/Nytrix  # Nix
```

> [!TIP]
> Αφαίρεσε παλαιότερες εκδόσεις από τη 0.1.x πριν από την εγκατάσταση.

### Εφαρμογή Desktop (BETA)

Το Nytrix είναι επίσης διαθέσιμο ως εφαρμογή. Κατέβασε το από το [GitHub Releases](https://github.com/ledexsoft/Nytrix/releases).


#### Κατάλογος Εγκατάστασης

Το script εγκατάστασης εγκαθιστά το Nytrix στο `$HOME/.nytrix/bin`.

### Πράκτορες

Το Nytrix περιλαμβάνει δύο ενσωματωμένους πράκτορες μεταξύ των οποίων μπορείτε να εναλλάσσεστε με το πλήκτρο `Tab`.

- **build** - Προεπιλεγμένος πράκτορας με πλήρη πρόσβαση για εργασία πάνω σε κώδικα
- **plan** - Πράκτορας μόνο ανάγνωσης για ανάλυση και εξερεύνηση κώδικα
  - Αρνείται την επεξεργασία αρχείων από προεπιλογή
  - Ζητά άδεια πριν εκτελέσει εντολές bash
  - Ιδανικός για εξερεύνηση άγνωστων αρχείων πηγαίου κώδικα ή σχεδιασμό αλλαγών

Περιλαμβάνεται επίσης ένας **general** υποπράκτορας για σύνθετες αναζητήσεις και πολυβηματικές διεργασίες.
Χρησιμοποιείται εσωτερικά και μπορεί να κληθεί χρησιμοποιώντας `@general` στα μηνύματα.

Μάθετε περισσότερα για τους [πράκτορες](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content/agents.mdx).

### Οδηγός Χρήσης

Για περισσότερες πληροφορίες σχετικά με τη ρύθμιση του Nytrix, [**πλοηγήσου στον οδηγό χρήσης μας**](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content).

### Συνεισφορά

Εάν ενδιαφέρεσαι να συνεισφέρεις στο Nytrix, διαβάστε τα [οδηγό χρήσης συνεισφοράς](./CONTRIBUTING.md) πριν υποβάλεις ένα pull request.

### About Nytrix

Nytrix is an independent fork of OpenCode. See LICENSE for source attribution.

---

**Γίνε μέλος της κοινότητάς μας** [GitHub Discussions](https://github.com/ledexsoft/Nytrix/discussions)
