# slidev-addon-logi-spotlight

```
     ))  ((                                  ┌──────────────────────────┐
   ))  .--.  ((        Cmd + Enter           │                          │
      | () |      ─────────────────────▶     │      S L I D E V         │
      |    |                                 │                          │
      | <> |      ◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │  ...    - Google Slides  │
   ))  '--'  ((     bzzt at 1:00, 5:00       └────────────┬─────────────┘
     ))  ((                                          ─────┴─────
   Spotlight 2
```

Makes the Logitech Spotlight 2 timer work in [Slidev](https://sli.dev): press the clicker's start button, the deck goes fullscreen, and the Spotlight vibrates at the intervals you set in Logi Options+, like it does in Google Slides.

## Why

Logi Options+ only starts the Spotlight timer when it thinks you are presenting in Google Slides, which it detects from the window title ending in ` - Google Slides`. Fullscreen alone is not enough.

This addon:

- Adds ` - Google Slides` to the tab title while the deck is fullscreen, and removes it when you exit. This works however you enter fullscreen: the clicker, `f`, or the nav button.
- Toggles fullscreen on Cmd/Ctrl+Enter, which is what the Spotlight start button sends. It sends one `Enter` keydown with `metaKey` set and no separate `Meta` keydown, so the addon reads the modifier flag on the event itself.
- Skips that toggle when Slidev already handled the key. [slidevjs/slidev#2809](https://github.com/slidevjs/slidev/pull/2809) adds Cmd+Enter as a built-in fullscreen shortcut; without this check, fullscreen would turn on and then straight off.

## Install

```bash
npm i -D slidev-addon-logi-spotlight
```

```yaml
---
addons:
  - logi-spotlight
---
```

Then set the timer alerts in Logi Options+ (Spotlight → Timer).

## Caveat

This relies on undocumented Logi Options+ behaviour (title detection). Tested on macOS, Chrome, Spotlight 2. A future Options+ update could break it.

## Develop

Needs Node 22.12+ (see `.nvmrc`).

```bash
npm i
npm test         # vitest
npm run lint     # eslint + prettier
npm run dev      # opens example.md
```

## License

MIT © Erik Zaadi
