export const getIsDigitNumber = (digit: number, isNegative?: boolean) => (value: string) => {
    const prefix = isNegative ? '-?' : '';
    const number =
      digit === 0
        ? new RegExp(`^${prefix}[0-9]*$`).test(value)
        : new RegExp(`^${prefix}[0-9]+\\.?[0-9]{0,${digit}}$`).test(value);
    const empty = value === '';
    const negative = isNegative ? value === '-' : false;
    return number || empty || negative;
  };
  