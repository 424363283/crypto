// import type { IntlFormatters } from 'react-intl';

/**
 *
 * @param intl 实例
 * @returns
 */
// export function useIntlMsg(intl: IntlFormatters) {
//   return (message: string | { id: string }, ...params: any[]): string => {
//     if (typeof message == 'string') message = { id: message };
//     return message ? intl?.formatMessage(message, ...params) : '';
//   };
// }

// @ts-ignore
import type { IntlFormatters } from 'react-intl';

export function useIntlMsg(intl: IntlFormatters) {
  return (message: string | { id: string }, ...params: any[]): string => {
    if (typeof message === 'string') {
      message = { id: message };
    }
    return message ? intl?.formatMessage(message, ...params) : '';
  };
}
