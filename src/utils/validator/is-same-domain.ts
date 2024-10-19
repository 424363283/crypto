export function isSameDomain(schema?: string) {
  if (!schema) {
    return false;
  }

  const host = window.location.hostname.replace('www.', '').replace('www', '');
  const url = decodeURIComponent(`${schema}`).replace('www.', '').replace('www', '');
  return host.indexOf(url) > -1 || url.indexOf(host) > -1;
}
