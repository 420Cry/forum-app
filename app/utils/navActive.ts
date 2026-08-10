/** Match left-rail / mobile bottom-nav active state (locale-stripped paths). */
export function isNavPathActive(currentPath: string, targetPath: string): boolean {
  const path = currentPath.replace(/\/$/, '') || '/'
  const target = targetPath.replace(/\/$/, '') || '/'
  return path === target || path.startsWith(`${target}/`)
}
