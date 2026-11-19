export const markdownAlternate = (pathname: string) => ({
  rel: 'alternate',
  type: 'text/markdown',
  href: `${pathname}index.md`,
})
