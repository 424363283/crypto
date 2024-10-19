export const safeCallback = (cb: Function, ...params: any) => {
  try {
    return cb(...params);
  } catch (error) {
    console.warn('----------- Safe callback error: ------------\n', error);
    return '';
  }
};
