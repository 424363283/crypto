export function isServerSideRender() {
  return typeof window === 'undefined';
}
