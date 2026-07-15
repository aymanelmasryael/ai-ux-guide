# AEL Academy — AI & UX Knowledge Base (Scaffold)

![AEL Academy — AI & UX Knowledge Base](assets/og-image.png)

**Version:** 0.1.0 — Pre-release

An interactive, zero-dependency Q&A browser for AI-assisted UX design and software engineering topics. Built with vanilla HTML, CSS, and JavaScript.

---

## Overview

This project is a static single-page application that renders 2,001 Q&A cards from a local data file. It provides search, filtering (by difficulty, type, and tags), bookmarking, and deep linking — all client-side with no build step.

**Important:** The current Q&A dataset is synthetically generated as a structural template. The content demonstrates the engine's rendering and filtering capabilities but is not authored educational material. See [CHANGELOG](./CHANGELOG.md) for the current release status.

---

## Features

- 2,001 Q&A cards with expand/collapse accordion
- Keyword search across questions and answers
- Filter by difficulty, question type, and topic tags
- Bookmark questions (persisted via localStorage)
- URL hash-based deep linking
- Dark-mode glassmorphism UI
- Zero dependencies — no build tools, no server required

---

## Quick Start

```bash
git clone <repo-url>
cd ai-ux-guide
open index.html
```

Works in any modern browser. No installation required.

---

## Project Structure

```
ai-ux-guide/
├── index.html          # Main HTML file
├── styles.css          # All styles (dark theme, glassmorphism)
├── app.js              # Application logic (render, search, filter, bookmark)
├── data.js             # Q&A dataset (2,001 records)
├── generate_data.js    # Node.js script used to generate the dataset
├── ael-logo.svg        # AEL brand logo
├── README.md
├── LICENSE             # MIT
├── CHANGELOG.md
└── .gitignore
```

---

## Data

- **Format:** JSON-style object with fields: id, question, detailedAnswer, difficulty, type, tags, source, and more.
- **Count:** 2,001 records.
- **Generator:** `generate_data.js` produces the dataset from a topic/verb template.
- **Note:** 2,000 of 2,001 records are synthetically generated. Only `q-001` is hand-crafted.

---

## Generating Data

```bash
node generate_data.js
```

This will overwrite `data.js`. The script uses `require('fs')` and runs in Node.js.

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Author

**Ayman Elmasry** — AEL Digital Studio
