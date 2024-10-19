// import { isServerSideRender } from '../validator';

export function getSubSite(subSite: string, returnProtocol = false, hostname?: string) {
  let _hostname = '';
  if (typeof window === 'undefined' && !hostname) {
    return _hostname;
  }

  const currentHostname = hostname || window.location.hostname;
  if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
    return currentHostname;
  }
  _hostname = currentHostname || '';
  const slice = _hostname.split('.').slice(-2);
  slice.unshift(subSite);
  const newHost = slice.join('.');
  if (returnProtocol) {
    return 'https://' + window.location.hostname.replace(/futures/g, 'www');
  } else {
    return newHost;
  }
}
