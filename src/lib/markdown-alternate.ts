export function markdownAlternate(pathname: string) {
  return {
    rel: 'alternate',
    type: 'text/markdown',
    href: `${pathname}index.md`,
  }
}
