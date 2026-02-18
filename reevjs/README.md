# reev.js

Lightweight UX frustration tracker — detects rage clicks, dead links, broken images, and form frustration, then asks users what went wrong.

~7KB minified. Zero dependencies. Works on any website.

## Install

### npm

```bash
npm install reev.js
```

### CDN (script tag)

```html
<script src="https://unpkg.com/reev.js/dist/reev.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com">
</script>
```

Or via jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/reev.js/dist/reev.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com">
</script>
```

## Usage

Add the script before `</body>` in your HTML. It self-initializes using `data-*` attributes:

```html
<script src="https://unpkg.com/reev.js/dist/reev.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com">
</script>
```

That's it. Reev starts tracking immediately — no configuration required.

## What it detects

| Issue | How it works |
|---|---|
| **Rage clicks** | 3+ clicks on the same interactive element within 1.5s |
| **Dead links** | Links that timeout or return errors when clicked |
| **Broken images** | Images that fail to load (scans existing + watches new) |
| **Form frustration** | 3+ clear-and-retype cycles on the same field |

When an issue is detected, a small badge appears near the element. Users can click it to submit feedback describing what went wrong.

## Configuration

All features are enabled by default. Use `data-*` attributes to customize:

```html
<script src="https://unpkg.com/reev.js/dist/reev.js"
        data-project-id="your-project-id"
        data-api-url="https://your-reev-instance.com"
        data-rage-click="true"
        data-dead-link="true"
        data-broken-image="true"
        data-form-frustration="true"
        data-popover="true"
        data-popover-theme="light"
        data-max-popups="5"
        data-popover-cooldown="30000"
        data-debug="false">
</script>
```

| Attribute | Default | Description |
|---|---|---|
| `data-rage-click` | `true` | Enable rage click detection |
| `data-dead-link` | `true` | Enable dead link detection |
| `data-broken-image` | `true` | Enable broken image detection |
| `data-form-frustration` | `true` | Enable form frustration detection |
| `data-popover` | `true` | Show feedback popovers when issues detected |
| `data-popover-theme` | `dark` | Popover theme: `dark` or `light` |
| `data-max-popups` | `5` | Max feedback popovers per session |
| `data-popover-cooldown` | `30000` | Milliseconds between popovers |
| `data-debug` | `false` | Log events to console |

## Events tracked

The tracker captures these event types automatically:

- `pageview` — URL, referrer, title, viewport
- `click` — selector, coordinates, rage click detection
- `scroll` — max scroll depth (throttled)
- `form` — field focus, submit, abandonment
- `error` — JS errors and unhandled promise rejections
- `vitals` — LCP, FID, CLS via PerformanceObserver
- `page_leave` — time on page
- `ux_issue` — real-time UX issues (rage click, dead link, broken image, form frustration)
- `ux_feedback` — user feedback submitted via popover

## License

MIT
