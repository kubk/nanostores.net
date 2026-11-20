## Development

`pnpm start` runs the dev server in the terminal; stop it with `Ctrl+C`.

When an agent needs the server to keep running after its launch command returns, use background mode:

```
pnpm run dev --background --host 0.0.0.0 --port 4321
```

Manage it with `pnpm run astro dev stop`, `status` and `logs`. The background launcher has a fixed 30-second startup timeout; to verify a slow start in a container, run `pnpm start` in a managed terminal session instead.

Search and the Content-Security-Policy work only in the production build: run `pnpm run check`, then preview it as described in [QA](docs/qa.md).

## Quality checks

Run `pnpm test` before finishing a change; CI runs the same command. For a narrower loop, run a single `test:*` or `check:*` script from `package.json`. Astro diagnostics and the build must stay sequential: both regenerate the API reference.

Size Limit tracks the site's own JS and the search JS in `dist/`, uncompressed. If a change grows them on purpose, raise the limits in `package.json` and say why.

Automated checks do not cover browser layout, focus or keyboard behavior, and Playwright is not a project dependency. Follow [QA](docs/qa.md) for the manual checks relevant to your change and report what you actually checked. The React rendering test on `/why/` is a text-only `*.tsx.txt` example that is never compiled; review it manually.

Content-Security-Policy: Astro hashes its own inline scripts and styles (`security.csp` in `astro.config.mjs`); nginx sends the rules a meta tag cannot hold. A new `is:inline` script is not hashed by Astro: add its hash to the config from the same source file, as for `ThemeProvider.astro`. `check` catches missing hashes and unlisted hosts for scripts, styles, images and frames, but not `fetch`: requests from JS may go only to the site itself and to Plausible at `https://lens.hplush.dev`.

## Content

- Keep site copy short. A page shows only what the reader needs to recognize their situation and decide.
- The homepage matches a person with one problem or one view and should be remembered when the need comes.
- Start from a situation, the opinion or an objection. Use the reader's own terms as the hook.
- Claims about users need a source, or are marked as a hypothesis.

Decided deliberately; change only by asking:

- Quotes are exact; users' words are never invented.
- Never attribute a quote to Andrey Sitnik; if one would help, ask the user.
- Sizes come from `{coreSize}`, never as a number in copy.
- "Hook-free core API", not "no hooks".
- No comparison pages.

## Code

New situation: add `src/content/situations/<slug>.md`, snippets in `src/snippets/<slug>/`, one block in `src/components/blocks/`, its entry in `blocks/index.ts`, the section body inline in `src/pages/index.astro`, the id in `src/config/order.ts`. Do not add layout variants, generic section components or new collections. Its `anchors` are the reader's own terms from the snippets (their APIs, or else their stack), not Nano Stores APIs and not repeating `landmarks`.

Docs: handwritten pages live in `src/content/docs/docs/`. Concepts, frameworks, guides, handbook and ecosystem package pages come from upstream READMEs vendored in `src/vendor/`: never edit those files. Update the source repository, then run `pnpm run sync:readme`.

The API reference under `src/content/docs/docs/api/` is generated from `nanostores` types on every `dev`/`build`: never edit or commit it. Fix API wording in TSDoc upstream in `nanostores/nanostores`. Configure `starlight-typedoc` instead of adding custom TypeDoc adapters. Handwritten API links use lowercase anchors (`/docs/api/#onmount`), with `type-` for types (`#type-readableatom`) and `store-` for the everyday methods (`#store-get`).

Header: home and docs render the same `HeaderContent`, and only its middle slot (search) may differ between pages. Every header query lives in `src/styles/header.css`, never in components. Slots switch with container queries on the header strip so home and docs switch together; viewport media queries are only for `50rem` (Starlight's menu breakpoint) and `37.5rem`. Docs override Starlight's `Header` and `MobileMenuToggle` and rely on private Starlight selectors: after a Starlight upgrade, follow the header checks in [QA](docs/qa.md), and comment any new private selector with why no public option exists.

Astro documentation: https://docs.astro.build
