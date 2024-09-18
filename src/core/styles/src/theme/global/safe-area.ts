// 安全距离函数
export default (key: string, value: string, direction: string = 'bottom') => `
  ${key}: ${value};
  ${key}: calc(${value} + constant(safe-area-inset-${direction}));
  ${key}: calc(${value} + env(safe-area-inset-${direction}));
`;
