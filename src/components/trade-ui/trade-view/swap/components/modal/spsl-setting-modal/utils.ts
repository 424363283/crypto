export const formatIncomeStandard = (value: number) => {
    return { incomeStandardRoe: value === 1, incomeStandardIncome: value === 2, haveIncomeStandard: value !== undefined };
  };
  