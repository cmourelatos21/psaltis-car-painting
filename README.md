# Psaltis Car Paintings — v2

A redesigned, buildless website for Psaltis Car Paintings. Its dark automotive layout focuses on paint refinishing and body repair, with an illustrative BMW in a paint-preparation bay, clearly marked spaces for real shop photography, and an accessible enquiry preparation flow.

## Open the website

Open `dist/index.html` directly, or run:

```sh
npm start
```

Then visit **http://127.0.0.1:4174**. The v2 server uses port 4174 by default so it can run beside the original site's port 4173. Node.js is only needed for the local server and checks. The website itself has no runtime dependencies or external font requests.

## Business information

Edit `dist/config.js` to provide the verified address, location, hours, and telephone number. Empty values display explicit placeholders. A valid phone number automatically enables click-to-call.

Set `bookingEmail` to the shop's real email address to enable a mailto handoff after reviewing an enquiry. This opens the visitor's email application; it is not a server-side submission or confirmed booking. With no email configured, visitors can prepare, edit, and copy their enquiry. Form data is never stored in localStorage or sent to a backend.

The six listed offerings focus on car paint refinishing and bodywork. Confirm the exact service list with the shop before a public launch.

## Reviews

The review section intentionally contains no names, ratings, or invented testimonials. Replace the `#review-content` empty state in `dist/index.html` with customer-approved, real testimonials when available.

## Files

- `dist/index.html`: semantic page content and service cards.
- `dist/styles.css`: responsive layout, theme, focus states, reduced-motion rules.
- `dist/app.js`: navigation, service selection, validation, enquiry preview, copy, optional email.
- `dist/config.js`: business contact information.
- `dist/assets/`: illustrative BMW paint-preparation and finish-inspection imagery, plus SVG favicon.
- `docs/assets.md`: image provenance and generation briefs.
- `scripts/serve.mjs`: dependency-free local server.
- `scripts/check.mjs`: syntax, anchor, asset, and basic accessibility checks.
- `tests/browser.html`: real-browser interaction and responsive regression checks.
- `docs/verification.json`: current verification status.

## Checks

```sh
npm run check
```

For browser regression checks, run `node scripts/serve.mjs --qa` and open `http://127.0.0.1:4174/__qa` in a browser with reduced-motion enabled. Results appear as JSON. Tests use synthetic contact data and never send it. Browser checks for this latest redesign have not yet been run because localhost browser access was denied in this session. `tests/browser.html` is the maintained source for this check and `qa/check.html` is its served copy.

## Hosting

The entire `dist/` directory is ready for static hosting. This v2 copy has not been published. The copied `.openai/hosting.json` belongs to the original project and is not a v2 deployment record.

## Images

The generated BMW hero and craftsmanship image are illustrative, not photographs of Psaltis premises, staff, or completed customer work. The page labels workshop and completed-work photo slots until approved real images are provided.
