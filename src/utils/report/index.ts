import { isServerSideRender } from '../validator';

export function report(
  // type = 'default_type',
  // requestUrl: string,
  // cost = '',
  // code = '',
  // message = '',
) {
  // if (isServerSideRender()) return;
  // window.trackPageError({
  //   type,
  //   cost,
  //   requestUrl,
  //   message,
  //   httpCode: code === 'OK' ? 0 : code
  // });
}

if (!isServerSideRender()) {
  // window.g_report = report;
}
