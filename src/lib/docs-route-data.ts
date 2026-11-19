import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import mono from '@fontsource/fragment-mono/files/fragment-mono-latin-400-normal.woff2?url'
import { basePreloads, fontPreload } from './font-preloads'
import { markdownAlternate } from './markdown-alternate'

export const onRequest = defineRouteMiddleware(({ locals, url }) => {
  const route = locals.starlightRoute
  if (route.id !== '404') {
    route.head.push({ tag: 'link', attrs: markdownAlternate(url.pathname) })
  }
  const api = route.id === 'docs/api'
  const fonts = api ? [...basePreloads, mono] : basePreloads
  for (const href of fonts) {
    route.head.push({ tag: 'link', attrs: fontPreload(href) })
  }
  // The API index and shared sidebar already link to each public section.
  if (api) route.toc = undefined
})
