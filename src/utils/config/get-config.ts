import { isServerSideRender } from '../validator';

const globalSymbol = Symbol.for('BITVENUES_GLOBAL_CONFIG');

export function getGlobalConfig(name: string) {
  if (isServerSideRender()) return;
  return (window as any)[globalSymbol]?.[name];
}

export function setGlobalConfig(data: any) {
  if (isServerSideRender()) return;
  (window as any)[globalSymbol] = data;
}

export const TRICHULUS_PRD_API = 'https://net-awareness.bvsopen.com/api';
export const TRICHULUS_DEV_API = 'https://net-awareness.bvtests.com/api';
