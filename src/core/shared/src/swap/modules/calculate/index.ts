import { FORMULAS } from '@/core/formulas';
import { formatNumber2Ceil } from '@/core/utils';
import { assetsInstance as Assets, BalanceData } from '../assets';
import { infoInstance as Info } from '../info';
import { getCryptoData, getFlagPrice, getIsVolUnit } from './utils';
import { BN } from '@/core/prototype/src/bn.conf';

export class Calculate {
  // 仓位数量显示
  static formatPositionNumber({ usdt, value, code, fixed, flagPrice, isVolUnit: _isVolUnit, isRoundup }: { usdt: boolean; value: number; code: string; fixed: number; flagPrice?: number; isVolUnit?: boolean; isRoundup?: boolean }) {
    const isVolUnit = _isVolUnit === undefined ? getIsVolUnit(usdt) : _isVolUnit;
    if (!usdt) {
      if (isVolUnit) {
        return Number(value || 0).toFixed(0);
      } else {
        return this.volumeToAmount({ usdt, value, code, fixed, flagPrice, isRoundup });
      }
    } else {
      return this.volumeToAmount({ usdt, value, code, fixed, flagPrice, isVolUnit, isRoundup });
    }
  }
  // 张数转币数
  static volumeToAmount({ usdt, value, code, fixed, flagPrice: _flagPrice, isVolUnit, isRoundup }: { usdt: boolean; value: number; code: string; fixed: number; flagPrice?: number; isVolUnit?: boolean; isRoundup?: boolean }) {
    const cryptoData = getCryptoData(code);
    const flagPrice = getFlagPrice(code, _flagPrice);
    if (!usdt) {
      const coin = value ? FORMULAS.SWAP.coin.coinVol(value, cryptoData.contractFactor, flagPrice) : 0;
      if (isRoundup) {
        return (!coin ? 0 : coin).toFixed(fixed, BN.ROUND_UP);

      } else {
        return (!coin ? 0 : coin).toFixed(fixed);
        // return (!coin ? 0 : formatNumber2Ceil(coin, fixed)).toFixed(fixed);
      }
    } else {
      const coin = isVolUnit ? FORMULAS.SWAP.usdt.usdtCoinVol(value, cryptoData.contractFactor, flagPrice) : FORMULAS.SWAP.usdt.coinVol(value, cryptoData.contractFactor);
      if (isRoundup) {
        return (!coin ? 0 : coin).toFixed(fixed, BN.ROUND_UP);

      } else {
        return (!coin ? 0 : coin).toFixed(fixed);
        // return (!coin ? 0 : isVolUnit ? formatNumber2Ceil(coin, fixed) : coin).toFixed(fixed);
      }
    }
  }
  // 币数转张数
  static amountToVolume({ usdt, value, code, flagPrice: _flagPrice, isVolUnit: _isVolUnit, shouldCeil = false }: { usdt: boolean; value: number; code: string; flagPrice?: number; isVolUnit?: boolean; shouldCeil?: boolean }) {
    const cryptoData = getCryptoData(code);
    const flagPrice = getFlagPrice(code, _flagPrice);
    const isVolUnit = _isVolUnit === undefined ? getIsVolUnit(usdt) : _isVolUnit;

    if (!usdt) {
      const vol = isVolUnit ? value : value ? FORMULAS.SWAP.coin.pieceVol(value, cryptoData.contractFactor, flagPrice) : 0;
      return shouldCeil ? Math.ceil(Number(vol)) : parseInt(`${vol}`);
    } else {
      const vol = isVolUnit ? FORMULAS.SWAP.usdt.pieceVol2(value, cryptoData.contractFactor, flagPrice) : FORMULAS.SWAP.usdt.pieceVol1(value, cryptoData.contractFactor);
      return shouldCeil ? Math.ceil(Number(vol)) : parseInt(`${vol}`);
    }
  }

  // 成本转张数
  static costToVol({ usdt, code, isBuy, isLimit, inputPrice, buy1Price, sell1Price, volume: value, lever, shouldCeil = false }: { usdt: boolean; code: string; isBuy: boolean; isLimit: boolean; inputPrice: number; buy1Price: number; sell1Price: number; volume: number; lever: number; shouldCeil?: boolean }) {
    const cryptoData = getCryptoData(code);
    const feeRateTaker = cryptoData.feeRateTaker; // 合约乘数
    const flagPrice = getFlagPrice(code);
    let vol = 0;
    if (usdt) {
      vol = FORMULAS.SWAP.usdt.costToVol(isBuy, isLimit, inputPrice, buy1Price, sell1Price, value, lever, cryptoData.contractFactor, feeRateTaker, flagPrice);
    }
    return shouldCeil ? Math.ceil(vol) : Number(vol).toFixed(0);
  }
  // 最大开张数量
  static maxVolume({
    usdt,
    code,
    isLimitType,
    sell1Price,
    buy1Price,
    twoWayMode,
    balanceData,
    inputPrice,
    flagPrice: _flagPrice,
    lever,
    isBuy,
    crossIncome,
    buyPositionValue,
    buyPendingValue,
    sellPositionValue,
    sellPendingValue,
    maxVolume
  }: {
    usdt: boolean;
    maxVolume: number;
    code: string;
    inputPrice: number;
    isLimitType: boolean;
    flagPrice?: number;
    isBuy?: boolean;
    isLimit?: boolean;
    sell1Price?: number;
    buy1Price?: number;
    buyPositionValue?: number;
    sellPositionValue?: number;
    buyPendingValue?: number;
    sellPendingValue?: number;
    crossIncome?: number;
    balanceData: BalanceData;
    twoWayMode: boolean;
    lever: number;
  }) {
    const cryptoData = getCryptoData(code);
    const flagPrice = getFlagPrice(code, _flagPrice);
    const { accb, positionMargin, frozen, bonusAmount } = balanceData;

    let am = accb - positionMargin - frozen;
    if (!twoWayMode) {
      // 体验金
      am = Number(am.add(bonusAmount));
    }
    // hp 限价=输入价格 市价=买卖1价
    const hp = Number(!isLimitType ? (isBuy ? sell1Price : buy1Price) : inputPrice || 0);

    if (!usdt) {
      return FORMULAS.SWAP.coin.maxVolume(
        am,
        lever,
        !!isBuy,
        hp,
        flagPrice,
        crossIncome || 0,
        maxVolume || 0,
        buyPositionValue || 0,
        buyPendingValue || 0,
        cryptoData.feeRateTaker,
        cryptoData.contractFactor,
        sellPositionValue || 0,
        sellPendingValue || 0,
        isLimitType ? cryptoData.maxDelegateNum : cryptoData.maxMarketDelegateNum
      );
    } else {
      return FORMULAS.SWAP.usdt.maxVolume(
        am,
        lever,
        !!isBuy,
        hp,
        flagPrice,
        crossIncome || 0,
        maxVolume || 0,
        buyPositionValue || 0,
        buyPendingValue || 0,
        cryptoData.feeRateTaker,
        cryptoData.contractFactor,
        sellPositionValue || 0,
        sellPendingValue || 0,
        isLimitType ? cryptoData.maxDelegateNum : cryptoData.maxMarketDelegateNum,
        buy1Price || 0
      );
    }
  }

  // 持仓数据计算
  static positionData({
    usdt: rootUsdt,
    data,
    twoWayMode,
    getRateValue = (code, v) => v
  }: {
    usdt?: boolean;
    data: any[];
    symbol?: string;
    twoWayMode?: boolean;
    getRateValue?: (code: string, value: any) => any;
  }): {
    list: any[];
    wallets: PositionWalletData;
    // item: {},
    // allMargin: allMargin,
    // allIncome: allIncome, // 所有盈亏之和
    // allCrossIncome: Number(allCrossIncome), // 所有全仓盈亏之和
    // allCrossIncomeLoss: Number(allCrossIncomeLoss), // 所有全仓亏损之和
    // positionsAccb: positionsAccb,
    // buyPositionValue: Number(buyPositionValue),
    // sellPositionValue: Number(sellPositionValue),
  } {
    const allWalletData: PositionWalletData = {};
    const allList: any = [];
    const defaultItemData = {
      code: '',
      income: 0,
      incomeLoss: 0,
      crossIncome: 0,
      crossIncomeLoss: 0,
      buyPositionValue: 0,
      sellPositionValue: 0
    };
    const defaultAllData = {
      data: {},
      allMargin: 0,
      allIncome: 0,
      allCrossIncome: 0,
      allCrossIncomeLoss: 0,
      positionsAccb: 0,
      buyPositionValue: 0,
      sellPositionValue: 0
    };

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const subWallet = item['subWallet'];
      const code: string = item['symbol'].toUpperCase();
      allList.push({ ...item });

      if (!allWalletData[subWallet]) {
        allWalletData[subWallet] = { ...defaultAllData, data: {} };
      }
      const allData = allWalletData[subWallet];
      const itemData = allData.data;
      const next = itemData[code] || { ...defaultItemData };
      itemData[code] = next;

      next['code'] = code;
      const margin = Number(item['margin']);
      const buy = item['side'] == '1';
      const avgCostPrice = item['avgCostPrice'];

      const isCross = item['marginType'] == 1;
      const currentPosition = item['currentPosition'] || 0.0;
      const cryptoData = getCryptoData(code);
      const contractFactor = cryptoData.contractFactor;
      const _usdt = Info.getIsUsdtType(code);

      const positionValue = _usdt
        ? currentPosition.mul(contractFactor).mul(avgCostPrice)
        : currentPosition.mul(contractFactor).div(avgCostPrice); // 持仓价值

      const scale = _usdt ? 2 : Number(item.basePrecision);
      let income = this.income({
        usdt: _usdt,
        code: code,
        isBuy: buy,
        avgCostPrice: avgCostPrice,
        volume: currentPosition
      });

      income = Number(formatNumber2Ceil(income, scale, false).toFixed(scale));

      allList[i].income = income;

      allData.allMargin = allData.allMargin.add(margin);

      next['income'] = next['income'].add(income);
      const usdtIncome = getRateValue(_usdt ? 'USDT' : code.replaceAll('-USD', ''), income);
      allData.allIncome = allData.allIncome.add(usdtIncome);

      if (income < 0) {
        next['incomeLoss'] = next['incomeLoss'].add(income);
      }

      if (isCross) {
        next['crossIncome'] = Number(next['crossIncome'].add(income));
        allData.allCrossIncome = allData.allCrossIncome.add(usdtIncome);
        if (income < 0) {
          next['crossIncomeLoss'] = Number(next['crossIncomeLoss'].add(income));
          allList[i].crossIncomeLoss = income;
          allData.allCrossIncomeLoss = allData.allCrossIncomeLoss.add(usdtIncome);
        }
      }

      if (buy) {
        next['buyPositionValue'] = next['buyPositionValue'].add(positionValue);
        allData.buyPositionValue = allData.buyPositionValue.add(positionValue);
      } else {
        next['sellPositionValue'] = next['sellPositionValue'].add(positionValue);
        allData.sellPositionValue = allData.sellPositionValue.add(positionValue);
      }
    }
    Assets.getWallets({ withHooks: false, usdt: rootUsdt })?.forEach(asset => {
      const subWallet = asset.wallet;
      const balanceData = Assets.getBalanceData({ withHooks: false, walletId: subWallet, usdt: rootUsdt });
      if (!allWalletData[subWallet]) {
        allWalletData[subWallet] = { ...defaultAllData, data: {} };
      }
      const { allCrossIncomeLoss, allMargin } = allWalletData[subWallet];
      const positionsAccb = Number(
        Number(balanceData.accb - Number(allMargin)) - balanceData.frozen + Number(allCrossIncomeLoss)
      );
      allWalletData[subWallet].positionsAccb = positionsAccb;
    });

    allList.forEach((item: any) => {
      const code = item['symbol'].toUpperCase();

      const margin = item['margin'];
      const avgCostPrice = item['avgCostPrice'];
      const subWallet = item['subWallet'];
      const isCross = item['marginType'] == 1;
      const balanceData = Assets.getBalanceData({ withHooks: false, code: code, walletId: item.subWallet });
      const positionsAccb = Number(allWalletData[subWallet].positionsAccb);

      const bonusAmount = twoWayMode ? 0 : balanceData.bonusAmount;
      const _usdt = Info.getIsUsdtType(code);
      const income = item.income;
      const incomeLoss = income < 0 ? income : 0;
      const volume = Number(item.currentPosition);

      item.currentPositionFormat = Number(
        this.formatPositionNumber({
          usdt: _usdt,
          code: code,
          flagPrice: avgCostPrice,
          fixed: _usdt ? Info.getVolumeDigit(item.symbol, { withHooks: false }) : Number(item.basePrecision),
          value: volume
        })
      );
      const liquidationPrice = this.liquidationPrice({
        usdt: _usdt,
        code: item.symbol,
        volume: Number(item.currentPosition),
        openPrice: Number(item.avgCostPrice),
        accb: positionsAccb - incomeLoss,
        margin,
        mmr: Number(item.mmr),
        isBuy: item.side === '1',
        isCross,
        lever: item.leverage,
        fixed: Number(item.baseShowPrecision),
        bonusAmount
      });

      item.liquidationPrice = !_usdt ? item.liquidationPrice : liquidationPrice;

      const positionMarginRate = this.marginRate({
        usdt: _usdt,
        code,
        volume,
        liquidationPrice: item.liquidationPrice,
        avgCostPrice,
        MMR: Number(item.mmr),
        margin: Number(item.margin),
        isCross: isCross,
        // u本位 余额 AccB - IPM - OM + Unrealised PNL
        // 除了自己的盈亏 所以这里减去自己的盈亏
        ACCB: !_usdt ? item.accb : positionsAccb - incomeLoss,
        income,
        bonusAmount
      });

      item.positionMarginRate = positionMarginRate;
    });
    return {
      list: allList,
      wallets: allWalletData
      // data: allData,
      // item: allData[symbol || ''] || defaultData,
      // allMargin: allMargin,
      // allIncome: allIncome, // 所有盈亏之和
      // allCrossIncome: Number(allCrossIncome), // 所有全仓盈亏之和
      // allCrossIncomeLoss: Number(allCrossIncomeLoss), // 所有全仓亏损之和
      // positionsAccb: positionsAccb,
      // buyPositionValue: Number(buyPositionValue),
      // sellPositionValue: Number(sellPositionValue),
    };
  }
  // 委托数据计算
  static pendingData(data: any[]): PendingWalletData {
    const wallets: PendingWalletData['wallets'] = {};

    data.forEach(item => {
      const code = item['symbol'].toUpperCase();
      const subWallet = item['subWallet'];

      // default value
      wallets[subWallet] = wallets[subWallet] || {
        buyPendingValue: '0',
        sellPendingValue: '0',
        pendingValue: '0',
        data: {}
      };
      const reuslt = wallets[subWallet];
      reuslt.data[code] = reuslt.data[code] || { buyPendingValue: '0', sellPendingValue: '0', pendingValue: '0' };
      const itemData = reuslt.data[code];

      const _usdt = Info.getIsUsdtType(code);
      const cryptoData = getCryptoData(code);
      const volume =
        item['price'] > 0
          ? _usdt
            ? item['volume'].mul(cryptoData.contractFactor).mul(item['price'])
            : item['volume'].mul(cryptoData.contractFactor).div(item['price'])
          : 0;
      if (item['side'] == '1') {
        // 多
        reuslt.buyPendingValue = reuslt.buyPendingValue.add(volume);
        itemData.buyPendingValue = itemData.buyPendingValue.add(volume);
      } else {
        // 空
        reuslt.sellPendingValue = reuslt.sellPendingValue.add(volume);
        itemData.sellPendingValue = itemData.sellPendingValue.add(volume);
      }
      reuslt.pendingValue = reuslt.pendingValue.add(volume);
      itemData.pendingValue = itemData.pendingValue.add(volume);
    });

    return {
      wallets
    };
  }
  // 委托成本
  static commissionCost({
    usdt,
    code,
    isBuy,
    sell1Price,
    buy1Price,
    inputVolume,
    inputPrice,
    maxVolume,
    flagPrice: _flagPrice,
    initMargins,
    lever,
    isLimitType,
    positionMode = false
  }: {
    usdt: boolean;
    code: string;
    isBuy?: boolean;
    isLimitType: boolean;
    flagPrice?: number;
    sell1Price?: number;
    buy1Price?: number;
    inputVolume: number;
    inputPrice?: number;
    maxVolume: number;
    initMargins: number;
    lever: number;
    positionMode?: boolean;
  }) {
    const { contractFactor, feeRateTaker } = getCryptoData(code);
    const currentPrice = isBuy ? sell1Price : buy1Price;
    const flagPrice = getFlagPrice(code, _flagPrice);
    // 委托价格
    let price = Number(!isLimitType ? currentPrice : inputPrice || 0);
    price = Number.isNaN(price) ? 0 : price;

    let next = Number(inputVolume);
    if (!inputVolume || Number.isNaN(next)) {
      return 0;
    }
    if (!inputPrice) {
      return 0;
    }
    if (next >= maxVolume) {
      next = maxVolume;
    }
    if (!usdt) {
      const price2 = isBuy ? Math.min(price, sell1Price || 0) : price; // Min(OP,SP)
      return FORMULAS.SWAP.coin.commissionCost(
        price2,
        initMargins,
        lever,
        contractFactor,
        flagPrice,
        next,
        feeRateTaker,
        !!isBuy,
        positionMode
      );
    } else {
      const price2 = isBuy || !buy1Price ? price : Math.max(price, buy1Price); // Max(OP,BP)
      return FORMULAS.SWAP.usdt.commissionCost(
        price2,
        lever,
        contractFactor,
        flagPrice,
        next,
        feeRateTaker,
        !!isBuy,
        positionMode
      );
    }
  }
  // 保证金率
  static marginRate({
    usdt,
    code,
    volume,
    avgCostPrice,
    liquidationPrice,
    margin,
    MMR,
    income,
    isCross,
    ACCB,
    bonusAmount
  }: {
    usdt: boolean;
    code: string;
    volume: number;
    avgCostPrice: number;
    liquidationPrice: number;
    margin: number;
    MMR: number;
    income: number;
    isCross: boolean;
    ACCB: number;
    bonusAmount: number;
  }) {
    const { contractFactor, liqFeeRate } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.marginRate(
        volume,
        avgCostPrice,
        contractFactor,
        liquidationPrice,
        liqFeeRate,
        margin,
        MMR,
        income,
        isCross,
        ACCB,
        bonusAmount
      );
    } else {
      return FORMULAS.SWAP.usdt.marginRate(
        volume,
        avgCostPrice,
        contractFactor,
        liquidationPrice,
        liqFeeRate,
        margin,
        MMR,
        income,
        isCross,
        ACCB,
        bonusAmount
      );
    }
  }
  // 盈亏
  static income({
    usdt,
    code,
    flagPrice: _flagPrice,
    isBuy,
    volume,
    avgCostPrice
  }: {
    usdt: boolean;
    code: string;
    flagPrice?: number;
    isBuy?: boolean;
    volume: number;
    avgCostPrice: number;
  }) {
    const { contractFactor } = getCryptoData(code);
    const flagPrice = getFlagPrice(code, _flagPrice);
    if (!usdt) {
      const value = FORMULAS.SWAP.coin.income(!!isBuy, volume, contractFactor, avgCostPrice, flagPrice);
      return formatNumber2Ceil(value, 8, false);
    } else {
      const value = FORMULAS.SWAP.usdt.income(!!isBuy, volume, contractFactor, avgCostPrice, flagPrice);
      return formatNumber2Ceil(value, 8, false);
    }
  }
  // 起始仓位保证金（委托）
  static IPM({
    usdt,
    code,
    volume,
    avgCostPrice,
    initMargins
  }: {
    usdt: boolean;
    code: string;
    volume: number;
    avgCostPrice: number;
    initMargins: number;
  }) {
    const { contractFactor, feeRateTaker } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.IPM(volume, contractFactor, feeRateTaker, avgCostPrice, initMargins);
    } else {
      return FORMULAS.SWAP.usdt.IPM(volume, contractFactor, feeRateTaker, avgCostPrice, initMargins);
    }
  }
  // ROE  盈利率/回报率
  static ROE({ usdt, income, ipm }: { usdt: boolean; income: number; ipm: number }) {
    if (!usdt) {
      return FORMULAS.SWAP.coin.ROE(income, ipm);
    } else {
      return FORMULAS.SWAP.usdt.ROE(income, ipm);
    }
  }
  // 目标价格
  static targetPrice({
    usdt,
    code,
    isBuy,
    openPrice,
    initMargins,
    roe
  }: {
    usdt: boolean;
    code: string;
    isBuy?: boolean;
    openPrice: number;
    initMargins: number;
    roe: number;
  }) {
    const { contractFactor } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.targetPrice(!!isBuy, contractFactor, openPrice, initMargins, roe);
    } else {
      return FORMULAS.SWAP.usdt.targetPrice(!!isBuy, openPrice, initMargins, roe);
    }
  }
  // 强平价格
  static liquidationPrice({
    usdt,
    code,
    margin,
    volume,
    isCross,
    isBuy,
    openPrice,
    lever,
    mmr,
    bonusAmount = 0,
    accb = 0,
    fixed,
    openFee,
    sell1Price,
    buy1Price
  }: {
    usdt: boolean;
    code: string;
    margin: number;
    volume: number;
    isCross: boolean;
    isBuy?: boolean;
    openPrice: number;
    lever: number;
    fixed: number;
    mmr: number;
    bonusAmount?: number;
    accb?: number;
    openFee?: boolean;
    sell1Price?: number;
    buy1Price?: number;
  }) {
    const { contractFactor, liqFeeRate, feeRateTaker, feeRateMaker } = getCryptoData(code);
    if (!usdt) {
      const _accb = margin;
      const price = FORMULAS.SWAP.coin.liquidationPrice(
        volume,
        !!isCross,
        !!isBuy,
        contractFactor,
        openPrice,
        lever,
        liqFeeRate,
        feeRateTaker,
        _accb,
        mmr,
        bonusAmount,
        feeRateMaker,
        openFee,
        sell1Price
      );
      return formatNumber2Ceil(price, fixed, isBuy);
    } else {
      const price = FORMULAS.SWAP.usdt.liquidationPrice(
        volume,
        isCross,
        !!isBuy,
        contractFactor,
        openPrice,
        liqFeeRate,
        accb,
        mmr,
        bonusAmount,
        margin,
        feeRateMaker,
        openFee,
        buy1Price
      );

      return formatNumber2Ceil(price, fixed, isBuy);
    }
  }
  // 保证金
  static margin({
    usdt,
    code,
    volume,
    openPrice,
    initMargins
  }: {
    usdt: boolean;
    code: string;
    volume: number;
    openPrice: number;
    initMargins: number;
  }) {
    const { contractFactor } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.margin(volume, contractFactor, openPrice, initMargins);
    } else {
      return FORMULAS.SWAP.usdt.margin(volume, contractFactor, openPrice, initMargins);
    }
  }
  // 计算器 可开
  static canBeOpened({
    usdt,
    code,
    openPrice,
    maxAmount,
    balance,
    lever
  }: {
    usdt: boolean;
    code: string;
    openPrice: number;
    maxAmount: number;
    balance: number;
    lever: number;
  }) {
    const { contractFactor, basePrecision } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.canBeOpened(openPrice, maxAmount, balance, lever, contractFactor, basePrecision);
    } else {
      return FORMULAS.SWAP.usdt.canBeOpened(openPrice, maxAmount, balance, lever);
    }
  }
  // 开仓均价
  static openAveragePrice({
    usdt,
    code,
    data
  }: {
    usdt: boolean;
    code: string;
    data: { number: string; price: string; cryptoNumber: string }[];
  }) {
    const { contractFactor } = getCryptoData(code);
    if (!usdt) {
      return FORMULAS.SWAP.coin.openAveragePrice(data, contractFactor);
    } else {
      return FORMULAS.SWAP.usdt.openAveragePrice(data, contractFactor);
    }
  }
  // 可用余额计算
  static balance({
    usdt,
    isCross,
    isTransfer,
    twoWayMode,
    crossIncome,
    balanceData
  }: {
    usdt: boolean;
    balanceData: BalanceData;
    isCross: boolean;
    isTransfer?: boolean;
    twoWayMode: boolean;
    crossIncome: number;
  }) {
    if (!usdt) {
      return FORMULAS.SWAP.coin.balance(
        isCross,
        !!isTransfer,
        twoWayMode,
        balanceData.accb,
        balanceData.positionMargin,
        balanceData.frozen,
        crossIncome,
        balanceData.bonusAmount
      );
    } else {
      return FORMULAS.SWAP.usdt.balance(
        isCross,
        !!isTransfer,
        twoWayMode,
        balanceData.accb,
        balanceData.positionMargin,
        balanceData.frozen,
        crossIncome,
        balanceData.bonusAmount
      );
    }
  }
  // 持仓回报率
  static positionROE({
    usdt,
    data,
    income
  }: {
    usdt: boolean;
    data: {
      basePrecision: number;
      marginType: number;
      symbol: string;
      currentPosition: number;
      margin: number;
      avgCostPrice: number;
      side: string;
      leverage: number;
    };
    income: number;
  }) {
    const isCross = data.marginType === 1; // 全仓
    const code = data.symbol.toUpperCase();
    const { contractFactor } = getCryptoData(code);
    const flagPrice = getFlagPrice(code);
    const currentPosition = Number(data.currentPosition);

    const margin = Number(data.margin);
    const _margin = Number(
      usdt ? formatNumber2Ceil(data.margin, 2).toFixed(2) : Number(data.margin).toFixed(Number(data.basePrecision))
    );
    const avgCostPrice = Number(data.avgCostPrice);
    let _income =
      income !== undefined
        ? income
        : this.income({
          usdt: usdt,
          code: code,
          isBuy: data.side === '1',
          flagPrice,
          avgCostPrice,
          volume: currentPosition,
        });

    const scale = usdt ? 2 : Number(data.basePrecision);
    _income = Number(formatNumber2Ceil(income, scale, false).toFixed(scale));
    if (!usdt) {
      return FORMULAS.SWAP.coin.positionROE(
        isCross,
        _margin,
        currentPosition,
        contractFactor,
        flagPrice,
        data.leverage,
        _income || 0
      );
    } else {
      return FORMULAS.SWAP.usdt.positionROE(
        isCross,
        _margin,
        currentPosition,
        contractFactor,
        flagPrice,
        data.leverage,
        _income || 0
      );
    }
  }

  // 新持仓回报率公式
  // 多 收益率=(触发价格-持仓均价)/(持仓均价*max(IMR,1/杠杆))
  // 空 收益率=(持仓均价-触发价格)/(持仓均价*max(IMR, 1/杠杆))
  static newPositionROE({ positionSide, positionPrice, triggerPrice, leverage, imr = 0 }: { positionSide: string, positionPrice: number, triggerPrice: number, leverage: number, imr?: number }) {
    // 计算 max(IMR, 1 / 杠杆)
    const marginFactor = Math.max(imr, 1 / leverage);

    // 计算收益率
    const spread = positionSide === 'SHORT' ? Number(positionPrice).sub(triggerPrice) : Number(triggerPrice).sub(positionPrice)
    return spread.div(positionPrice.mul(marginFactor)).mul(100);
  }

  static positionRoeToPrice({
    usdt,
    data,
    roe,
    volume: currentPosition
  }: {
    volume?: number;
    usdt: boolean;
    data: {
      symbol: string;
      currentPosition: number;
      margin: number;
      avgCostPrice: number;
      side: string;
      leverage: number;
    };
    roe: number;
  }) {
    const buy = data.side === '1';
    const code = data.symbol.toUpperCase();
    const { contractFactor } = getCryptoData(code);

    if (!usdt) {
      const volume = Number(currentPosition || data.currentPosition);
      return FORMULAS.SWAP.coin.positionRoeToPrice(contractFactor, volume, data.avgCostPrice, roe, data.margin, buy);
    } else {
      const volume = Number((currentPosition || data.currentPosition).mul(contractFactor));
      return FORMULAS.SWAP.usdt.positionRoeToPrice(contractFactor, volume, data.avgCostPrice, roe, data.margin, buy);
    }
  }
  static positionIncomeToPrice({
    usdt,
    data,
    income,
    volume: currentPosition
  }: {
    volume?: number;
    usdt: boolean;
    data: {
      symbol: string;
      currentPosition: number;
      margin: number;
      avgCostPrice: number;
      side: string;
      leverage: number;
    };
    income: number;
  }) {
    const buy = data.side === '1';
    const code = data.symbol.toUpperCase();
    const { contractFactor } = getCryptoData(code);

    if (!usdt) {
      const volume = Number(currentPosition || data.currentPosition);
      return FORMULAS.SWAP.coin.positionIncomeToPrice(contractFactor, volume, data.avgCostPrice, income, buy);
    } else {
      const volume = Number((currentPosition || data.currentPosition).mul(contractFactor));
      // return FORMULAS?.SWAP?.usdt?.positionIncomeToPrice(contractFactor, volume, data.avgCostPrice, income, buy);
      return FORMULAS?.SWAP?.usdt?.positionRoeToPrice(
        contractFactor,
        volume,
        data.avgCostPrice,
        income,
        data.margin,
        buy
      );
    }
  }
}

type PositionWalletData = {
  [key: string]: {
    data: {
      [key: string]: {
        code: string;
        income: string | number;
        incomeLoss: string | number;
        crossIncome: string | number;
        crossIncomeLoss: string | number;
        buyPositionValue: string | number;
        sellPositionValue: string | number;
      };
    };
    allMargin: string | number;
    allIncome: string | number;
    allCrossIncome: string | number;
    allCrossIncomeLoss: string | number;
    positionsAccb: string | number;
    buyPositionValue: string | number;
    sellPositionValue: string | number;
  };
};

type PendingWalletData = {
  wallets: {
    [key: string]: {
      buyPendingValue: string;
      sellPendingValue: string;
      pendingValue: string;
      data: { [key: string]: { buyPendingValue: string; sellPendingValue: string; pendingValue: string } };
    };
  };
};
