export function maskMiddleString(str: string, length: number): string {
    if (!str) return '--';
    // 检查字符串长度
    if (str.length <= length) {
      // 如果字符串长度小于等于4，返回原字符串
      return str;
    }
  
    // 取前两位和后两位字符
    const start = str.slice(0, length / 2);
    const end = str.slice(-length / 2);
  
    const maskLength = str.length - length;
    const mask = '*'.repeat(maskLength);
  
    // 返回格式化后的字符串
    return `${start}${mask}${end}`;
  }
  