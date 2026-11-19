import { readFile, writeFile } from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
import type { Element, Root, RootContent } from 'hast'
import { matches, select, selectAll } from 'hast-util-select'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

const chrome = [
  'script',
  'template',
  'button',
  'svg',
  'footer',
  '.sl-anchor-link',
  '.sr-only',
  '[aria-hidden="true"]',
  '[data-pagefind-ignore]',
].join(',')

function text(node: RootContent): string {
  if (node.type === 'text') return node.value
  return 'children' in node ? node.children.map(text).join('') : ''
}

function clean(parent: Element) {
  parent.children = parent.children.filter((node) => {
    if (node.type === 'comment') return false
    if (node.type !== 'element') return true
    if (matches(chrome, node)) return false
    clean(node)
    return !['strong', 'em', 'span'].includes(node.tagName) || text(node) !== ''
  })
}

function mainContent(tree: Root): Root {
  const main = select('main', tree)!
  for (const pre of selectAll('pre[data-language]', main)) {
    const code = select('code', pre)!
    code.properties.className = [`language-${pre.properties.dataLanguage}`]
    const lines = selectAll('.ec-line', code).map((line) =>
      text(line).replace(/\n$/, ''),
    )
    code.children = [{ type: 'text', value: lines.join('\n') }]
  }
  for (const tabs of selectAll('starlight-tabs', main)) {
    const labels = selectAll('[role="tab"]', tabs).map(text)
    tabs.children = selectAll('[role="tabpanel"]', tabs).flatMap(
      (panel, index) => [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{ type: 'text', value: labels[index]!.trim() }],
        },
        panel,
      ],
    )
  }
  clean(main)
  return { type: 'root', children: main.children }
}

const toMarkdown = unified()
  .use(rehypeParse)
  .use(() => mainContent)
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify)

export function markdownPages(): AstroIntegration {
  return {
    name: 'markdown-pages',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        await Promise.all(
          pages
            .filter(({ pathname }) => pathname !== '404/')
            .map(async ({ pathname }) => {
              const html = await readFile(new URL(`${pathname}index.html`, dir))
              const markdown = await toMarkdown.process(html)
              await writeFile(
                new URL(`${pathname}index.md`, dir),
                String(markdown),
              )
            }),
        )
      },
    },
  }
}
