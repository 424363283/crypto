import {getWindow} from './get'
export const getCmcPath = (path: string) => {
    return (process.env.NEXT_PUBLIC_CMC_URL || (getWindow()?.location || '')) + '/api'+path;
  };