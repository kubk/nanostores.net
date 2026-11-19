import { expect, it } from 'vitest'
import { toMarkdown } from './markdown-pages.ts'

const page = `<html><body>
<header>Site nav</header>
<main>
  <h1 id="_top">Title<a class="sl-anchor-link" href="#_top"><span class="sr-only">Section titled</span></a></h1>
  <p>Text with <strong><svg></svg></strong>a link to <a href="/docs/">docs</a>.</p>
  <pre data-language="ts"><code><div class="ec-line"><div class="code">const a = 1</div></div><div class="ec-line"><div class="code">
</div></div><div class="ec-line"><div class="code">const b = 2</div></div></code></pre>
  <button>Copy</button>
  <starlight-tabs>
    <ul role="tablist">
      <li><a role="tab" href="#tab-panel-0"> React </a></li>
      <li><a role="tab" href="#tab-panel-1"> Vue </a></li>
    </ul>
    <div role="tabpanel" id="tab-panel-0"><p>React code</p></div>
    <div role="tabpanel" id="tab-panel-1" hidden><p>Vue code</p></div>
  </starlight-tabs>
  <footer>Previous page</footer>
</main>
</body></html>`

it('converts a page’s <main> to Markdown', async () => {
  expect(String(await toMarkdown.process(page))).toMatchInlineSnapshot(`
    "# Title

    Text with a link to [docs](/docs/).

    \`\`\`ts
    const a = 1

    const b = 2
    \`\`\`

    React

    React code

    Vue

    Vue code
    "
  `)
})
