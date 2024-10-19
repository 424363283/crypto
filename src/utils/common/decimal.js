import Decimal from 'decimal.js';

export const transformNum = (num1 = 0, method, num2 = 0, toNumber=true) =>
{
    if (!num1 || !num2 || !method) return 0;
    const res = new Decimal(num1)[method](new Decimal(num2));
    return toNumber ? res?.toNumber?.(): res;
};