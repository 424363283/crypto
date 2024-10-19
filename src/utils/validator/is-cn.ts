//判断是不是中文
export function isCN(str: string) {
  return str.match(/[^\x00-\xff]/gi);
}
