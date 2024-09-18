export const formatBalanceResult = (item: any) => {
    return {
      accb: Number(item['accb'] || 0),
      positionMargin: Number(item['positionMargin'] || 0),
      frozen: Number(item['frozen'] || 0),
      bonusAmount: Number(item['bonusAmount'] || 0),
      availableBalance: Number(item['availableBalance'] || 0),
      canWithdrawAmount: Number(item['canWithdrawAmount'] || 0),
      unrealisedPNL: Number(item['unrealisedPNL'] || 0),
      voucherAmount: Number(item['voucherAmount'] || 0),
      currency: item['currency'],
    };
  };
  