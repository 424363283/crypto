export function isLocalHost(hostname: string | null | undefined) {
  const host = hostname || '';
  const locals = ['localhost'];
  return locals.includes(host.toLowerCase());
}
