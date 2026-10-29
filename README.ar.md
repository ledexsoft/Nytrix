<p align="center">
  <a href="https://github.com/ledexsoft/Nytrix">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="شعار Nytrix">
    </picture>
  </a>
</p>
<p align="center">وكيل برمجة بالذكاء الاصطناعي مفتوح المصدر.</p>
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

### التثبيت

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/ledexsoft/Nytrix/dev/install | bash

# مديري الحزم
npm i -g @nytrix/cli@latest      # او bun/pnpm/yarn
nix run github:ledexsoft/Nytrix  # Nix
```

> [!TIP]
> احذف الاصدارات الاقدم من 0.1.x قبل التثبيت.

### تطبيق سطح المكتب (BETA)

يتوفر Nytrix ايضا كتطبيق سطح مكتب. قم بالتنزيل من [GitHub Releases](https://github.com/ledexsoft/Nytrix/releases).


#### مجلد التثبيت

يثبت سكربت التثبيت Nytrix في `$HOME/.nytrix/bin`.

### Agents

يتضمن Nytrix وكيليْن (Agents) مدمجين يمكنك التبديل بينهما باستخدام زر `Tab`.

- **build** - الافتراضي، وكيل بصلاحيات كاملة لاعمال التطوير
- **plan** - وكيل للقراءة فقط للتحليل واستكشاف الكود
  - يرفض تعديل الملفات افتراضيا
  - يطلب الاذن قبل تشغيل اوامر bash
  - مثالي لاستكشاف قواعد كود غير مألوفة او لتخطيط التغييرات

بالاضافة الى ذلك يوجد وكيل فرعي **general** للبحث المعقد والمهام متعددة الخطوات.
يستخدم داخليا ويمكن استدعاؤه بكتابة `@general` في الرسائل.

تعرف على المزيد حول [agents](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content/agents.mdx).

### التوثيق

لمزيد من المعلومات حول كيفية ضبط Nytrix، [**راجع التوثيق**](https://github.com/ledexsoft/Nytrix/tree/dev/services/www/src/docs/content).

### المساهمة

اذا كنت مهتما بالمساهمة في Nytrix، يرجى قراءة [contributing docs](./CONTRIBUTING.md) قبل ارسال pull request.

### About Nytrix

Nytrix is an independent fork of OpenCode. See LICENSE for source attribution.

---

**انضم الى مجتمعنا** [GitHub Discussions](https://github.com/ledexsoft/Nytrix/discussions)
