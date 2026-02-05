# ShakeebJustify — Poetry Justification for Urdu / Nastaliq

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/shakesvision/PoetryJustification/pages%2Fpages-build-deployment?style=for-the-badge&logo=buddy&logoColor=%23F5C400)

A lightweight JavaScript library that automatically formats Urdu poetry into beautifully justified layouts. Supports classical poetic forms including Ghazal, Qat'a, Mukhammas, and Musaddas with intelligent structural awareness.

[![NPM](shakeeb_justify.png)](https://www.npmjs.com/package/shakeeb-justify)

**NPM:** https://www.npmjs.com/package/shakeeb-justify  
**Demo:** https://shakesvision.github.io/PoetryJustification/

---

## Why This Exists

Urdu poetry is not prose. It has structure:

- Lines must be **justified** (both edges aligned)
- Couplets (sher) must stay together visually
- Stanzas need proper spacing
- Nastaliq script requires RTL + bidi safety

This library formats poetry the way it is **read**, not just displayed.

---

## Features

- **Zero configuration** — just include the script and add classes
- **Namespaced CSS** — all styles scoped to `.shakeeb-justify` to avoid conflicts
- **RTL & Nastaliq safe** — proper `unicode-bidi` and direction handling
- **Intelligent stanza grouping** — automatic gaps between couplets/stanzas
- **Classical form support** — Ghazal, Qat'a, Mukhammas, Musaddas variants
- **Custom patterns** — `data-pattern` and `data-mixed` attributes for flexibility
- **WordPress/Gutenberg compatible**
- **No dependencies**

---

## Installation

### CDN (Recommended)

```html
<script src="https://cdn.jsdelivr.net/gh/shakesvision/PoetryJustification@1.0.5/dist/shakeeb-justify.min.js"></script>
```

### NPM

```bash
npm install shakeeb-justify
```

```javascript
import { ShakeebJustify } from 'shakeeb-justify';
ShakeebJustify.apply();
```

### Local

```html
<script src="shakeeb-justify.min.js"></script>
```

---

## Basic Usage

### Single Column (`.sher`)

Standard ghazal layout — one line per row with gap after every couplet (2 lines).

```html
<div class="sher">
ہم پہ ساقی کی عنایت سے جلے جاتے ہیں
یہ جو اَب تک کفِ افسوس ملے جاتے ہیں
یاد آ جاتی ہیں بے ساختہ باتیں ان کی
بے سبب ہونٹ تبسم میں ڈھلے جاتے ہیں
</div>
```

### Two Columns (`.sher2`)

Side-by-side layout — pairs of lines displayed in two columns.

```html
<div class="sher2">
اِک دن رسولِ پاک نے اصحاب سے کہا
دیں مال راہِ حق میں جو ہوں تم میں مالدار
ارشاد سن کے فرطِ طرب سے عمر اٹھے
اس روز انکے پاس تھے درہم کئی ہزار
</div>
```

---

## Classical Poetic Forms

### Mukhammas (5-line stanzas)

#### Standard — gap after every 5 lines

```html
<div class="mukhammas">
خوگر قربت و دیدار پہ کیسی گزرے
کیا خبر اس کے دل زار پہ کیسی گزرے
ہجر میں اس ترے بیمار پہ کیسی گزرے
دور کیا جانیے بد کار پہ کیسی گزرے
تیرے ہی در پہ مرے بیکس و تنہا تیرا
</div>
```

#### 3+2 Pattern — gap after 3 lines, then 2 lines

```html
<div class="mukhammas-3-2">
<!-- First 3 lines, gap, then 2 lines -->
</div>
```

#### Mixed Layout — 4 lines in 2-column, 1 line in single-column

```html
<div class="mukhammas-mixed">
<!-- Emphasis on final line -->
</div>
```

---

### Musaddas (6-line stanzas)

#### Classic (4+2) — gap after 4 lines, then 2 lines

```html
<div class="musaddas">
اس قدر شوخ کہ اللہ سے بھی برہم ہے
تھا جو مسجود ملائک یہ وہی آدم ہے
عالم کیف ہے دانائے رموز کم ہے
ہاں مگر عجز کے اسرار سے نامحرم ہے
ناز ہے طاقت گفتار پہ انسانوں کو
بات کرنے کا سلیقہ نہیں نادانوں کو
</div>
```

#### All 6 Together — single stanza, gap after 6 lines

```html
<div class="musaddas-6">
<!-- Continuous flow, single unit -->
</div>
```

#### Mixed Layout — 4 lines in 2-column, 2 lines in single-column

```html
<div class="musaddas-mixed">
<!-- Marsiya-style emphasis on closing couplet -->
</div>
```

---

## Custom Patterns

### `data-pattern` Attribute

Define custom grouping patterns using `+` separator.

```html
<!-- Gap after every 4 lines (Qat'a / Rubai) -->
<div class="sher" data-pattern="4">...</div>

<!-- Gap after 3, then 2, repeating -->
<div class="sher" data-pattern="3+2">...</div>

<!-- Gap after 6 lines -->
<div class="sher" data-pattern="6">...</div>
```

### `data-mixed` Attribute

Combine single-column and two-column layouts.

```html
<!-- 4 lines in 2-column, then 2 lines in 1-column -->
<div data-mixed="4:2col,2:1col">...</div>

<!-- 3 lines single, 2 lines double -->
<div data-mixed="3:1col,2:2col">...</div>
```

**Modes:**
- `1col` — single-column layout
- `2col` — two-column layout

---

## Markup Flexibility

The library normalizes HTML before processing. You can use:

- `<br>` tags
- `<p>` paragraphs
- `<div>` blocks
- Plain text with newlines

All will be converted to clean lines for formatting.

---

## Manual Trigger

The library auto-runs on `DOMContentLoaded`. For dynamic content:

```javascript
ShakeebJustify.apply();
```

---

## Development

```bash
git clone https://github.com/ShakesVision/PoetryJustification.git
cd PoetryJustification
npm install
```

Build minified version:

```bash
npm run build
```

---

## Version History

### 1.0.5
- **Namespaced CSS** — all styles under `.shakeeb-justify` to prevent conflicts
- **Spacer rows** — gaps implemented via empty rows, not padding (better hover behavior)
- **Single table per poem** — pattern-based forms now use one table with spacer rows
- **Improved code structure** — cleaner, documented functions

### 1.0.4
- Added `data-pattern` and `data-mixed` attributes
- Mukhammas variants (standard, 3-2, mixed)
- Musaddas variants (classic 4+2, all-6, mixed)

### 1.0.0
- Initial release
- Sher & Sher2 formatting

---

## License

MIT License © 2020-2026 **Shakeeb Ahmad** — https://shakeeb.in

---

# Nostalgia Section

_Older instructions, kept for nostalgia._

1. Add the script and styles in the pages you want. Refer index.html file in the doc folder for the code.
2. Add a new

- `<div class="sher"></div>` for one column and
- `<div class="sher2"></div>` for two columns.

3. Write poetry lines inside div tags.

### Features (Original)

Double column:
- Distributed by space you can change
- Responsive, as widths are defined using percentages
- Both column widths are same irrespective of the content length in them

Single column:
- Gap after every she'r (2 lines)

### Demo

https://shakesvision.github.io/PoetryJustification/

**Note (22 Oct 2025):** The older / original version of the demo file can be seen at this commit (since I removed it after converting the project into an NPM package.) [See this commit of Mar 12, 2021](https://github.com/ShakesVision/PoetryJustification/blob/38ffbdb125525ce8a1f4b0ef0903d2c064e3df6e/docs/index.html)

Star the repo if you've used it.

Want to see more interesting stuff? Here's my Urdu blog: https://ur.shakeeb.in/
