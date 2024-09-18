// import MiniChartPro from '@/components/chart/mini-chart-pro';
// import CoinLogo from '@/components/coin-logo';
// import CommonIcon from '@/components/common-icon';
// import Image from '@/components/image';
// import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
// import TutorialModel from '@/components/modal/tutorial-model';
// // import { ResultModal } from '@/components/spot-strategy-result-modal';
// import { getTradeGridSquareListApi, postTradeCreateGridStrategyApi } from '@/core/api';
// import { FORMULAS } from '@/core/formulas';
// import { useResponsive, useRouter, useTheme } from '@/core/hooks';
// import { LANG } from '@/core/i18n';
// import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
// import { Account, CREATE_TYPE, GridAiItem, LIST_TYPE, Spot, TRADE_TAB } from '@/core/shared';
// import { LOCAL_KEY, localStorageApi } from '@/core/store';
// import { RootColor } from '@/core/styles/src/theme/global/root';
// import { getActive, toFixedCeil } from '@/core/utils';
// import { Dropdown, Switch, Tooltip, message } from 'antd';
// import { MenuProps } from 'antd/lib';
// import dayjs from 'dayjs';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import css from 'styled-jsx/css';
// import { useImmer } from 'use-immer';
// import Slider from '../../components/slider';
// import { NS } from '../../spot';
// import { BaseModalStyle } from './base-modal-style';
// import { CreateConfirmModal } from './create-grid-confirm-modal';
// import Input from './input';

// const Strategy = Spot.Strategy;
// const Trade = Spot.Trade;

// export const GridView = () => {
//   const { createType, currentQuoteInfo, balance, baseCoin, quoteCoin, aiList, symbolList, collapse } = Strategy.state;
//   const router = useRouter();
//   const routerId = router.query.id as string;
//   const { isSmallDesktop, isTablet } = useResponsive();
//   const { isDark } = useTheme();
//   const isLogin = Account.isLogin;
//   const t = router.query.t as string;
//   const from = router.query.from as string;
//   const [now, setNow] = useState(0);
//   const colorHex = RootColor.getColorHex;
//   const [rankList, setRankList] = useState<any[]>([]);

//   const [tutorialModelVisible, setTutorialModelVisible] = useState(false);

//   // 实时数据
//   useWs(SUBSCRIBE_TYPES.ws4001, (data) => {
//     if (data) {
//       setState((draft) => {
//         draft.price = data.price;
//       });
//     }
//   });

//   const [state, setState] = useImmer({
//     price: '' as NS,
//     minPrice: '' as NS,
//     maxPrice: '' as NS,
//     lowPrice: '' as NS,
//     highPrice: '' as NS,
//     gridCount: '' as NS,
//     gridLowProfit: '' as NS,
//     gridHighProfit: '' as NS,
//     transferModalVisible: false,
//     investmentMinMoney: 0 as NS,
//     amount: '' as NS,
//     triggerPrice: '',
//     slPrice: '' as NS,
//     tpPrice: '' as NS,
//     stopSell: true,
//     copyId: '',
//     dayIndex: 0,
//     gridAiLowProfit: '' as NS,
//     gridAiHighProfit: '' as NS,
//     aiInvestmentMinMoney: 0 as NS,
//     createModalVisible: false,
//     confirmModalVisible: false,
//     payload: null as any,
//     success: false,
//   });

//   const [sliderData, setSliderData] = useImmer({
//     type: 'range',
//     step: 1,
//     value: 0,
//     min: 0,
//     max: 100,
//   });

//   useEffect(() => {
//     setNow(new Date().getTime());
//     let payload: any = {
//       symbol: routerId,
//       sort: 'roi',
//       page: 1,
//       rows: 3,
//     };
//     getTradeGridSquareListApi(payload).then(({ data, code }) => {
//       if (code === 200) {
//         const { list } = data;
//         const newList = list.slice();
//         newList.map((item: any) => {
//           item.chartData = item.pnlList.map((i: any) => i.pnl);
//           return item;
//         });
//         setRankList(newList);
//       }
//     });
//   }, [routerId]);

//   useEffect(() => {
//     const data: any = localStorageApi.getItem(LOCAL_KEY.COPY_DATA);

//     if ((data && t) || from === 'trading-bot-grid') {
//       Strategy.changeCreateType(CREATE_TYPE.MANUAL);

//       setState((draft) => {
//         draft.gridCount = data?.gridCount;
//         draft.lowPrice = data?.lowPrice;
//         draft.highPrice = data?.highPrice;
//         draft.triggerPrice = data?.triggerPrice ? data?.triggerPrice : '';
//         draft.tpPrice = data?.tpPrice ? data?.tpPrice : '';
//         draft.slPrice = data?.slPrice ? data?.slPrice : '';
//         draft.stopSell = data?.stopSell || true;
//         draft.copyId = data?.copyId;
//         localStorageApi.setItem(LOCAL_KEY.COPY_DATA, '');
//       });
//     }
//   }, [t, from]);

//   useEffect(() => {
//     setState((draft) => {
//       draft.minPrice = state.price.mul(currentQuoteInfo?.priceMinRate || 0).toFixed(currentQuoteInfo?.priceScale);
//       draft.maxPrice = state.price.mul(currentQuoteInfo?.priceMaxRate || 0).toFixed(currentQuoteInfo?.priceScale);
//     });
//   }, [state.price, currentQuoteInfo]);

//   useEffect(() => {
//     if (state.lowPrice && state.highPrice && state.gridCount) {
//       const { lowProfit, highProfit } = FORMULAS.SPOT_GRID.getGridProfitRate(
//         state.lowPrice,
//         state.highPrice,
//         Number(state.gridCount),
//         currentQuoteInfo?.makerRate || 0,
//         currentQuoteInfo?.priceScale || 2
//       );

//       setState((draft) => {
//         draft.gridLowProfit = lowProfit;
//         draft.gridHighProfit = highProfit;
//       });
//     } else {
//       setState((draft) => {
//         draft.gridLowProfit = '';
//         draft.gridHighProfit = '';
//       });
//     }
//   }, [state.gridCount, state.lowPrice, state.highPrice, currentQuoteInfo]);

//   useEffect(() => {
//     if (state.lowPrice && state.highPrice && state.gridCount) {
//       const investmentMinMoney = FORMULAS.SPOT_GRID.getInvestmentMinMoney(
//         state.triggerPrice ? Number(state.triggerPrice) : Number(state.price),
//         Number(state.lowPrice),
//         Number(state.highPrice),
//         Number(state.gridCount),
//         currentQuoteInfo?.factor || 0,
//         currentQuoteInfo?.priceScale || 2
//       );

//       setState((draft) => {
//         if (currentQuoteInfo) {
//           draft.investmentMinMoney =
//             Number(investmentMinMoney) > Number(currentQuoteInfo?.amountMin)
//               ? investmentMinMoney
//               : currentQuoteInfo?.amountMin;
//         } else {
//           draft.investmentMinMoney = investmentMinMoney;
//         }
//       });
//     }
//   }, [state.price, state.gridCount, state.lowPrice, state.highPrice, currentQuoteInfo, state.triggerPrice]);

//   const aiListMemo = useMemo(() => {
//     const count = currentQuoteInfo?.countMax || 99;
//     return aiList.map((item) => {
//       item.gridCount = item.gridCount > count ? count : item.gridCount;
//       return item;
//     });
//   }, [aiList, currentQuoteInfo]);

//   useEffect(() => {
//     if (aiListMemo.length > 0) {
//       const { lowProfit, highProfit } = FORMULAS.SPOT_GRID.getGridProfitRate(
//         aiListMemo[state.dayIndex].priceMin,
//         aiListMemo[state.dayIndex].priceMax,
//         aiListMemo[state.dayIndex].gridCount,
//         currentQuoteInfo?.makerRate || 0,
//         currentQuoteInfo?.priceScale || 2
//       );

//       const investmentMinMoney = FORMULAS.SPOT_GRID.getInvestmentMinMoney(
//         state.triggerPrice ? Number(state.triggerPrice) : Number(state.price),
//         aiListMemo[state.dayIndex].priceMin,
//         aiListMemo[state.dayIndex].priceMax,
//         aiListMemo[state.dayIndex].gridCount,
//         currentQuoteInfo?.factor || 0,
//         currentQuoteInfo?.priceScale || 2
//       );

//       setState((draft) => {
//         draft.gridAiLowProfit = lowProfit.mul(100).toFixed(2) + '%';
//         draft.gridAiHighProfit = highProfit.mul(100).toFixed(2) + '%';
//         if (currentQuoteInfo) {
//           draft.aiInvestmentMinMoney =
//             Number(investmentMinMoney) > Number(currentQuoteInfo?.amountMin)
//               ? investmentMinMoney
//               : currentQuoteInfo?.amountMin;
//         } else {
//           draft.aiInvestmentMinMoney = investmentMinMoney;
//         }
//       });
//     }
//   }, [aiListMemo, state.dayIndex, currentQuoteInfo, state.price, state.triggerPrice]);

//   const items: MenuProps['items'] = useMemo(() => {
//     return symbolList.map((item) => {
//       return {
//         id: item.symbol,
//         key: item.symbol,
//         label: (
//           <div
//             className={getActive(item.symbol === routerId)}
//             onClick={() => {
//               setState((draft) => {
//                 draft.lowPrice = '';
//                 draft.highPrice = '';
//                 draft.gridCount = '';
//                 draft.amount = '';
//                 draft.triggerPrice = '';
//                 draft.tpPrice = '';
//                 draft.slPrice = '';
//                 draft.investmentMinMoney = '';
//               });
//               setSliderData((draft) => {
//                 draft.value = 0;
//               });
//               router.replace(`/spot/${item.symbol.toLocaleLowerCase()}?from=trading-bot-grid`);
//             }}
//           >
//             <span>{item.symbol.replace('_', '/')}</span>
//             {item.symbol === routerId && <CommonIcon name='common-checked-0' size={14} enableSkin />}
//           </div>
//         ),
//       };
//     });
//   }, [symbolList, routerId]);

//   const ExchangeIconMemo = useMemo(() => {
//     return (
//       <CommonIcon
//         name='common-spot-exchange-0'
//         size={12}
//         enableSkin
//         onClick={() => {
//           if (isLogin) {
//             setState((draft) => {
//               draft.transferModalVisible = true;
//             });
//           } else {
//             router.push('/login');
//           }
//         }}
//       />
//     );
//   }, [isLogin]);

//   const percent = useMemo(() => {
//     const { value, min, max } = sliderData;
//     return value ? ((value - min) / (max - min)) * 100 : 0;
//   }, [sliderData]);

//   const onSliderChanged = useCallback(
//     (val: number) => {
//       setSliderData((draft) => {
//         draft.value = val;
//       });
//       if (isLogin) {
//         setState((draft) => {
//           draft.amount = balance.mul(val).div(100);
//         });
//       }
//     },
//     [balance, isLogin]
//   );

//   const minInvestmentMoney = useMemo(() => {
//     const money = createType === CREATE_TYPE.AI ? state.aiInvestmentMinMoney : state.investmentMinMoney;

//     return toFixedCeil(money as number, currentQuoteInfo?.priceScale || 3);
//   }, [createType, state.aiInvestmentMinMoney, state.investmentMinMoney, currentQuoteInfo]);

//   const showProfitError = useMemo(() => {
//     if (currentQuoteInfo && state.gridLowProfit) {
//       return !(currentQuoteInfo && currentQuoteInfo.profitRate < Number(state.gridLowProfit));
//     }
//     return false;
//   }, [currentQuoteInfo, state.gridHighProfit, state.gridLowProfit]);

//   const createDisabled = useMemo(() => {
//     if (!isLogin) {
//       return true;
//     }
//     if (createType === CREATE_TYPE.AI) {
//       if (Number(state.triggerPrice) >= Number(state?.price)) {
//         return false;
//       } else if (
//         state.tpPrice &&
//         (Number(state.tpPrice) < Number(aiListMemo[state.dayIndex]?.priceMax) ||
//           Number(state.tpPrice) < Number(state?.price))
//       ) {
//         return false;
//       } else if (
//         state.slPrice &&
//         (Number(state.slPrice) > Number(aiListMemo[state.dayIndex]?.priceMin) ||
//           Number(state.slPrice) > Number(state?.price))
//       ) {
//         return false;
//       } else if (state.slPrice && state.triggerPrice && Number(state.slPrice) > Number(state.triggerPrice)) {
//         return false;
//       } else if (Number(state.amount) < Number(minInvestmentMoney)) {
//         return false;
//       }
//       return state.amount !== '' && Number(state.amount) >= Number(minInvestmentMoney);
//     } else {
//       if (!state.lowPrice || !state.highPrice || !state.gridCount) {
//         return false;
//       } else if (Number(state.lowPrice) < Number(state.minPrice)) {
//         return false;
//       } else if (!state.lowPrice && Number(state.highPrice) < Number(state.minPrice)) {
//         return false;
//       } else if (state.lowPrice && Number(state.highPrice) <= Number(state.lowPrice)) {
//         return false;
//       } else if (Number(state.triggerPrice) > Number(state?.price)) {
//         return false;
//       } else if (
//         state.tpPrice &&
//         (Number(state.tpPrice) < Number(state.highPrice) || Number(state.tpPrice) < Number(state?.price))
//       ) {
//         return false;
//       } else if (
//         state.slPrice &&
//         (Number(state.slPrice) > Number(state.lowPrice) || Number(state.slPrice) > Number(state?.price))
//       ) {
//         return false;
//       } else if (state.slPrice && state.triggerPrice && Number(state.slPrice) > Number(state.triggerPrice)) {
//         return false;
//       } else if (Number(state.amount) < Number(minInvestmentMoney)) {
//         return false;
//       } else if (showProfitError) {
//         return false;
//       }

//       return true;
//     }
//   }, [
//     isLogin,
//     createType,
//     state.amount,
//     state.lowPrice,
//     state.minPrice,
//     state.highPrice,
//     state.triggerPrice,
//     state.price,
//     state.slPrice,
//     state.tpPrice,
//     minInvestmentMoney,
//     showProfitError,
//   ]);

//   const maxInvestmentMoney = useMemo(() => {
//     return Math.min(currentQuoteInfo?.amountMax || 0, Number(balance));
//   }, [currentQuoteInfo, balance]);

//   const onCreateClicked = () => {
//     if (!isLogin) {
//       router.push('/login');
//     } else {
//       let params: any = {
//         symbol: routerId,
//         type: 1,
//         amount: Number(state.amount),
//         stopSell: state.stopSell,
//         copyId: state.copyId,
//       };
//       if (createType === CREATE_TYPE.AI) {
//         params.gridCount = aiListMemo[state.dayIndex]?.gridCount;
//         params.priceMin = aiListMemo[state.dayIndex]?.priceMin;
//         params.priceMax = aiListMemo[state.dayIndex]?.priceMax;
//       } else {
//         params.gridCount = Number(state.gridCount);
//         params.priceMin = Number(state.lowPrice);
//         params.priceMax = Number(state.highPrice);
//       }

//       if (Number(params.priceMax) <= Number(params.priceMin)) {
//         message.error(LANG('最高价格必须高于最低价格'));
//         return;
//       }

//       if (Number(params.amount) > Number(balance)) {
//         message.error(LANG('可用余额不足'));
//         return;
//       }

//       if (state.slPrice) {
//         params.slPrice = state.slPrice;
//       }
//       if (state.tpPrice) {
//         params.tpPrice = state.tpPrice;
//       }
//       if (state.triggerPrice) {
//         params.triggerPrice = state.triggerPrice;
//       }
//       setState((draft) => {
//         draft.createModalVisible = true;
//         draft.payload = { ...params };
//       });
//     }
//   };

//   const onCopyClicked = useCallback(() => {
//     Strategy.changeCreateType(CREATE_TYPE.MANUAL);
//     setState((draft) => {
//       draft.gridCount = aiListMemo[state.dayIndex]?.gridCount;
//       draft.lowPrice = aiListMemo[state.dayIndex]?.priceMin;
//       draft.highPrice = aiListMemo[state.dayIndex]?.priceMax;
//     });
//   }, [aiListMemo, state.dayIndex]);

//   const onCreateModalClose = () => {
//     setState((draft) => {
//       draft.createModalVisible = false;
//     });
//   };

//   const onConfirmModalClose = () => {
//     setState((draft) => {
//       draft.confirmModalVisible = false;
//     });
//   };

//   const onConfirmCreate = () => {
//     try {
//       postTradeCreateGridStrategyApi(state?.payload).then(({ code, message: msg }) => {
//         if (code === 200) {
//           setState((draft) => {
//             draft.createModalVisible = false;
//             draft.confirmModalVisible = true;
//             draft.success = true;
//           });
//           Strategy.getBalance();
//         } else {
//           message.error(msg);
//           setState((draft) => {
//             draft.createModalVisible = false;
//             draft.confirmModalVisible = true;
//             draft.success = false;
//           });
//         }
//       });
//     } catch (err) {}
//   };

//   const onRankCopyClicked = (index: number) => {
//     const data = rankList[index];
//     const _data = {
//       gridCount: data?.gridCount,
//       lowPrice: data?.priceMin,
//       highPrice: data?.priceMax,
//       triggerPrice: data?.triggerPrice,
//       tpPrice: data?.tpPrice,
//       slPrice: data?.slPrice,
//       stopSell: data?.stopSell,
//       copyId: data?.strategyId,
//     };
//     localStorageApi.setItem(LOCAL_KEY.COPY_DATA, _data);
//     router.push(`/spot/${data?.symbol.toLowerCase()}?t=${new Date().getTime()}`);
//     setTimeout(() => {
//       Trade.changeTradeTab(TRADE_TAB.GRID);
//       Strategy.changeSelectType(LIST_TYPE.GRID);
//       Strategy.changeCreateType(CREATE_TYPE.MANUAL);
//     }, 300);
//   };

//   return (
//     <>
//       <div className='grid-container'>
//         <div className='back'>
//           <button className='btn' onClick={() => Strategy.changeSelectType(null)}>
//             <CommonIcon name='common-grid-arrow-left-0' size={12} />
//             {LANG('现货网格')}
//           </button>
//           <button className='guide' onClick={() => setTutorialModelVisible(true)}>
//             <CommonIcon name='common-grid-guide-0' size={18} />
//           </button>
//         </div>
//         <div className='quote-select-container'>
//           <Dropdown
//             menu={{ items }}
//             trigger={['click']}
//             placement='bottom'
//             autoAdjustOverflow={false}
//             overlayClassName='quote-select-menu'
//           >
//             <div className='quote-select'>
//               <span>{routerId.replace('_', '/')}</span>
//               <CommonIcon name='common-arrow-down-0' size={14} />
//             </div>
//           </Dropdown>
//         </div>
//         <div className='type-group'>
//           <button
//             className={getActive(createType === CREATE_TYPE.AI)}
//             onClick={() => Strategy.changeCreateType(CREATE_TYPE.AI)}
//           >
//             {LANG('AI策略')}
//           </button>
//           <button
//             className={getActive(createType === CREATE_TYPE.MANUAL)}
//             onClick={() => Strategy.changeCreateType(CREATE_TYPE.MANUAL)}
//           >
//             {LANG('手动创建')}
//           </button>
//         </div>
//         {createType === CREATE_TYPE.AI ? (
//           <div className='ai-wrapper'>
//             <div className='tips'>
//               <CommonIcon name='common-spot-tips-0' size={12} enableSkin />
//               {LANG('AI推荐参数，是通过行情数据回测产生的，请您谨慎使用！')}
//             </div>
//             <div className='time-group'>
//               <div className='label'>{LANG('回测时长')}</div>
//               <div className='time-btns'>
//                 {aiListMemo.map((item: GridAiItem, index) => (
//                   <button
//                     key={item.id}
//                     className={getActive(state.dayIndex === index)}
//                     onClick={() =>
//                       setState((draft) => {
//                         draft.dayIndex = index;
//                         draft.amount = '';
//                       })
//                     }
//                   >
//                     {item.days}
//                     {LANG('天')}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className='label-item'>
//               <div>{LANG('最低价格')}</div>
//               <div>
//                 {aiListMemo[state.dayIndex]?.priceMin.toFormat(currentQuoteInfo?.priceScale)} {quoteCoin}
//               </div>
//             </div>
//             <div className='label-item'>
//               <div>{LANG('最高价格')}</div>
//               <div>
//                 {aiListMemo[state.dayIndex]?.priceMax.toFormat(currentQuoteInfo?.priceScale)} {quoteCoin}
//               </div>
//             </div>
//             <div className='label-item'>
//               <div>{LANG('网格数量')}</div>
//               <div>{aiListMemo[state.dayIndex]?.gridCount}</div>
//             </div>
//             <div className='label-item'>
//               <div>{LANG('每格利润(已扣除费用)')}</div>
//               {state.gridAiLowProfit !== '' && (
//                 <div className='grid-profit'>
//                   {state.gridAiLowProfit}-{state.gridAiHighProfit}
//                 </div>
//               )}
//             </div>
//             <button className='copy' onClick={onCopyClicked}>
//               {LANG('免费复制到手动创建')}
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className='create-content'>
//               <div className='item'>
//                 <div className='label'>{LANG('价格区间')}</div>
//                 <div className='price-wrapper'>
//                   <Input
//                     placeholder={LANG('最低价格')}
//                     decimal={currentQuoteInfo?.priceScale}
//                     min={Number(state.minPrice)}
//                     max={Number(state.maxPrice)}
//                     value={state.lowPrice}
//                     onChange={(val) =>
//                       setState((draft) => {
//                         draft.lowPrice = val;
//                       })
//                     }
//                     errorText={
//                       Number(state.lowPrice) <= Number(state.minPrice)
//                         ? LANG('最低价格不能低于{price}USDT', { price: state.minPrice })
//                         : ''
//                     }
//                   />
//                   <Input
//                     placeholder={LANG('最高价格')}
//                     decimal={currentQuoteInfo?.priceScale}
//                     min={Number(state.minPrice)}
//                     max={Number(state.maxPrice)}
//                     value={state.highPrice}
//                     onChange={(val) =>
//                       setState((draft) => {
//                         draft.highPrice = val;
//                       })
//                     }
//                     errorText={() => {
//                       if (!state.lowPrice && Number(state.highPrice) < Number(state.minPrice)) {
//                         return LANG('最高价格不能低于{price}USDT', { price: state.minPrice });
//                       } else if (state.lowPrice && Number(state.highPrice) <= Number(state.lowPrice)) {
//                         return LANG('最高价格必须高于最低价格');
//                       }
//                       return '';
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className='create-content'>
//               <div className='item'>
//                 <div className='label'>{LANG('网格数量')}</div>
//                 <div className='price-wrapper grid'>
//                   <Input
//                     placeholder={`${currentQuoteInfo?.countMin}-${currentQuoteInfo?.countMax}`}
//                     min={Number(currentQuoteInfo?.countMin)}
//                     max={Number(currentQuoteInfo?.countMax)}
//                     value={state.gridCount}
//                     onChange={(val) =>
//                       setState((draft) => {
//                         draft.gridCount = val;
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className='profit-wrapper'>
//               <div className='tips'>
//                 <Tooltip color='#fff' placement='top' title={LANG('每格收益率的估值，已扣除手续费')}>
//                   {LANG('每格利润率')}
//                 </Tooltip>
//               </div>
//               {state.gridLowProfit !== '' && (
//                 <div className='grid-profit'>
//                   {state.gridLowProfit.mul(100).toFixed(2)}%-{state.gridHighProfit.mul(100).toFixed(2)}%
//                 </div>
//               )}
//             </div>
//             {showProfitError && (
//               <div className='profit-error'>
//                 {LANG('每格利润率必须大于{profit}%，请减少网格数量或增大价格区间', {
//                   profit: currentQuoteInfo?.profitRate.mul(100),
//                 })}
//               </div>
//             )}
//             <div className='divider' />
//           </>
//         )}
//         <div className='amount-wrapper'>
//           <div className='label'>{LANG('投入金额')}</div>
//           <div className='amount'>
//             <span className='text'>{LANG('可用')}:</span>
//             <div>
//               <span>{`${(isLogin ? balance : 0)?.toFormat()} ${quoteCoin}`}</span>
//               {ExchangeIconMemo}
//             </div>
//           </div>
//           <div className='amount-input'>
//             <Input
//               placeholder={`${minInvestmentMoney} ${LANG('起投')}`}
//               decimal={currentQuoteInfo?.priceScale}
//               max={maxInvestmentMoney}
//               value={state.amount}
//               onChange={(val) => {
//                 setState((draft) => {
//                   draft.amount = val;
//                 });
//                 setSliderData((draft) => {
//                   draft.value = Number(val.div(maxInvestmentMoney).mul(100).toFixed(0));
//                 });
//               }}
//               maxText={LANG('最大')}
//               onMaxTextClicked={() => {
//                 setState((draft) => {
//                   draft.amount = maxInvestmentMoney;
//                 });
//                 setSliderData((draft) => {
//                   draft.value = 100;
//                 });
//               }}
//               errorText={
//                 Number(state.amount) < Number(minInvestmentMoney)
//                   ? LANG('投入金额应大于或等于{price}USDT', { price: minInvestmentMoney })
//                   : ''
//               }
//             />
//           </div>
//           <div className='slider-wrapper'>
//             <Slider
//               percent={percent}
//               isDark={isDark}
//               grid={5}
//               grids={[0, 25, 50, 75, 100]}
//               onChange={(val: number) => onSliderChanged(val)}
//               renderText={() => `${sliderData.value}%`}
//               {...sliderData}
//             />
//           </div>
//         </div>
//         <div className='divider' />
//         <div className='advanced-wrapper'>
//           <div
//             className='collapse'
//             onClick={() => {
//               Strategy.setCollapse(!collapse);
//             }}
//           >
//             {LANG('高级参数(选填)')}
//             <CommonIcon name='common-sort-down-0' className={getActive(collapse)} size={6} />
//           </div>
//           {collapse && (
//             <div>
//               <div className='create-content'>
//                 <div className='item'>
//                   <div className='label'>{LANG('触发价格')}</div>
//                   <div className='price-wrapper'>
//                     <Input
//                       placeholder={LANG('触发价格')}
//                       min={0}
//                       decimal={currentQuoteInfo?.priceScale}
//                       value={state.triggerPrice}
//                       onChange={(val) =>
//                         setState((draft) => {
//                           draft.triggerPrice = val;
//                         })
//                       }
//                       errorText={
//                         Number(state.triggerPrice) >= Number(state?.price)
//                           ? LANG('触发价格必须低于{price}USDT', { price: Number(state?.price) })
//                           : ''
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className='create-content'>
//                 <div className='item'>
//                   <div className='price-label'>
//                     <div className='label'>{LANG('止盈价格')}</div>
//                     <div className='label'>{LANG('止损价格')}</div>
//                   </div>
//                   <div className='price-wrapper'>
//                     <Input
//                       placeholder={LANG('止盈价格')}
//                       min={0}
//                       decimal={currentQuoteInfo?.priceScale}
//                       value={state.tpPrice}
//                       onChange={(val) =>
//                         setState((draft) => {
//                           draft.tpPrice = val;
//                         })
//                       }
//                       errorText={() => {
//                         const highPrice =
//                           createType === CREATE_TYPE.AI ? aiListMemo[state.dayIndex]?.priceMax : state.highPrice;
//                         if (
//                           state.tpPrice &&
//                           (Number(state.tpPrice) <= Number(highPrice) || Number(state.tpPrice) <= Number(state?.price))
//                         ) {
//                           return LANG('止盈价格必须高于最高价和最新价');
//                         }
//                         return '';
//                       }}
//                     />
//                     <Input
//                       placeholder={LANG('止损价格')}
//                       min={0}
//                       decimal={currentQuoteInfo?.priceScale}
//                       value={state.slPrice}
//                       onChange={(val) =>
//                         setState((draft) => {
//                           draft.slPrice = val;
//                         })
//                       }
//                       errorText={() => {
//                         const lowPrice =
//                           createType === CREATE_TYPE.AI ? aiListMemo[state.dayIndex]?.priceMin : state.lowPrice;
//                         if (
//                           state.slPrice &&
//                           (Number(state.slPrice) >= Number(lowPrice) || Number(state.slPrice) >= Number(state?.price))
//                         ) {
//                           return LANG('止损价格必须低于最低价和最新价');
//                         } else if (
//                           state.slPrice &&
//                           state.triggerPrice &&
//                           Number(state.slPrice) >= Number(state.triggerPrice)
//                         ) {
//                           return LANG('止损价格必须低于触发价格');
//                         }
//                         return '';
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className='divider' />
//               <div className='radio-wrapper'>
//                 <div className='text'>{LANG('停止时卖出所有基础币')}</div>
//                 <Switch
//                   checked={state.stopSell}
//                   onChange={(checked) => {
//                     setState((draft) => {
//                       draft.stopSell = checked;
//                     });
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <button className='create-btn' onClick={onCreateClicked} disabled={!createDisabled}>
//           {isLogin ? LANG('创建网格') : LANG('登录后创建')}
//         </button>
//       </div>
//       <div
//         className={`footer grid-rank-wrapper ${isSmallDesktop ? 'small-layout-footer' : ''} ${isTablet ? 'hide' : ''}`}
//       >
//         <div className='title'>{LANG('排行榜')}</div>
//         <ul className={`rank-wrapper ${collapse ? 'collapse' : ''}`}>
//           {rankList.map((item, index) => (
//             <li key={item.strategyId}>
//               <div className='header'>
//                 <div>
//                   <div className='quote'>
//                     <CoinLogo coin={item.baseCoin} width={18} height={18} alt={item.baseCoin} />
//                     {item.symbol.replace('_', '/')}
//                   </div>
//                   <div>Spot Grid</div>
//                 </div>
//                 <button onClick={() => onRankCopyClicked(index)}>{LANG('免费复制')}</button>
//               </div>
//               <div className='divider' />
//               <div className='item'>
//                 <div>
//                   <div>{LANG('收益率')}</div>
//                   <div>
//                     {LANG('复制人数')} <span>{item.copyCount}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <div className='roi'>
//                     <div className={`${item.roi > 0 ? 'main-green' : 'main-red'}`}>
//                       {item.roi > 0 ? '+' : ''}
//                       {item.roi.mul(100).toFormat(2)}%
//                     </div>
//                     <div>
//                       {LANG('收益额')}{' '}
//                       <span>
//                         {item?.pnl > 0 ? '+' : ''}
//                         {item?.pnl.toRound(currentQuoteInfo?.priceScale)} {quoteCoin}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     {item?.chartData.length > 0 ? (
//                       <MiniChartPro
//                         id={`_trading_bot_card_${index}`}
//                         data={item?.chartData}
//                         width={100}
//                         height={46}
//                         lineWidth={0}
//                         upColor={colorHex['up-color-hex']}
//                         downColor={colorHex['down-color-hex']}
//                       />
//                     ) : null}
//                   </div>
//                 </div>
//                 <div className='time-wrapper'>
//                   <div>
//                     <Image
//                       src={item?.avatar ? item?.avatar : '/static/images/common/avatar-default.png'}
//                       width={14}
//                       height={14}
//                     />
//                     <span>****{item?.username?.slice(-2)}</span>
//                   </div>
//                   <div>
//                     <div>{LANG('运行时长')}</div>
//                     <span>
//                       {dayjs(item.stopTime ?? now).diff(item.startTime, 'd')}D{' '}
//                       {dayjs(item.stopTime ?? now).diff(item.startTime, 'h') % 24}h{' '}
//                       {dayjs(item.stopTime ?? now).diff(item.startTime, 'minute') % 60}m
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <CreateConfirmModal
//         open={state.createModalVisible}
//         onClose={onCreateModalClose}
//         onOk={onConfirmCreate}
//         baseCoin={baseCoin}
//         quoteCoin={quoteCoin}
//         priceMin={state.payload?.priceMin}
//         priceMax={state.payload?.priceMax}
//         scale={currentQuoteInfo?.priceScale || 2}
//         gridCount={state.payload?.gridCount}
//         gridLowProfit={
//           createType === CREATE_TYPE.AI ? state.gridAiLowProfit : state.gridLowProfit.mul(100).toFixed(2) + '%'
//         }
//         gridHighProfit={
//           createType === CREATE_TYPE.AI ? state.gridAiHighProfit : state.gridHighProfit.mul(100).toFixed(2) + '%'
//         }
//         triggerPrice={state.payload?.triggerPrice}
//         tpPrice={state.payload?.tpPrice}
//         slPrice={state.payload?.slPrice}
//         stopSell={state.payload?.stopSell}
//         amount={state.payload?.amount}
//       />
//       {/* <ResultModal
//         open={state.confirmModalVisible}
//         onClose={onConfirmModalClose}
//         isSuccess={state.success}
//         onOk={state.success ? () => {} : onConfirmModalClose}
//         type='grid'
//       /> */}
//       <TutorialModel
//         open={tutorialModelVisible}
//         onCancel={() => setTutorialModelVisible(false)}
//         type='spot_grid'
//         title={LANG('如何开始现货网格')}
//       />
//       {state.transferModalVisible && (
//         <TransferModal
//           defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
//           defaultTargetAccount={ACCOUNT_TYPE.SPOT}
//           open={state.transferModalVisible}
//           onCancel={() => {
//             setState((draft) => {
//               draft.transferModalVisible = false;
//             });
//           }}
//           onTransferDone={() => Strategy.getBalance()}
//         />
//       )}
//       <BaseModalStyle />
//       <style jsx>{styles}</style>
//     </>
//   );
// };

// const styles = css`
//   .grid-container {
//     background: var(--theme-background-color-2-2);
//     border-bottom-left-radius: var(--theme-trade-layout-radius);
//     border-bottom-right-radius: var(--theme-trade-layout-radius);
//     padding: 10px;
//     .back {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       .btn {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 26px;
//         border-radius: 8px;
//         background-color: var(--theme-background-color-3-2);
//         border: none;
//         color: var(--theme-font-color-3);
//         cursor: pointer;
//         font-size: 12px;
//         font-weight: 500;
//         :global(img) {
//           margin-right: 5px;
//         }
//       }
//       .guide {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 26px;
//         border-radius: 8px;
//         padding: 3px;
//         border: 1px solid var(--theme-border-color-2);
//         cursor: pointer;
//         background-color: transparent;
//       }
//     }
//     .quote-select-container {
//       margin: 10px 0;
//       margin-top: 14px;
//       cursor: pointer;
//       :global(.quote-select) {
//         height: 38px;
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         background-color: var(--theme-tips-color);
//         border-radius: 8px;
//         padding: 0 10px;
//         color: var(--theme-font-color-1);
//       }
//     }
//     .type-group {
//       margin-top: 14px;
//       height: 30px;
//       display: flex;
//       align-items: center;
//       padding: 2px 3px;
//       border-radius: 8px;
//       background-color: var(--theme-background-color-2-3);
//       button {
//         flex: 1;
//         background-color: transparent;
//         border: none;
//         color: var(--theme-font-color-3);
//         font-size: 12px;
//         font-weight: 500;
//         height: 24px;
//         border-radius: 8px;
//         cursor: pointer;
//         &.active {
//           background-color: var(--skin-primary-color);
//           color: var(--skin-font-color);
//         }
//       }
//     }
//     .ai-wrapper {
//       .tips {
//         margin-top: 10px;
//         margin-bottom: 18px;
//         display: flex;
//         align-items: center;
//         color: var(--theme-font-color-3);
//         :global(img) {
//           margin-right: 5px;
//         }
//       }
//       .time-group {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 20px;
//         .label {
//           font-size: 12px;
//           color: var(--theme-font-color-3);
//         }
//         .time-btns {
//           display: flex;
//           align-items: center;
//           button {
//             height: 24px;
//             padding: 0 12px;
//             border-radius: 6px;
//             margin-left: 6px;
//             background-color: var(--theme-background-color-2-3);
//             color: var(--theme-font-color-3);
//             cursor: pointer;
//             font-size: 12px;
//             border: 0;
//             &.active {
//               background-color: var(--skin-primary-color);
//               color: var(--skin-font-color);
//             }
//           }
//         }
//       }
//       .label-item {
//         line-height: 20px;
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 12px;
//         > div {
//           &:first-child {
//             color: var(--theme-font-color-3);
//           }
//           &:last-child {
//             color: var(--theme-font-color-1);
//           }
//         }
//       }
//       .copy {
//         margin-bottom: 16px;
//         border: 0;
//         color: var(--skin-main-font-color);
//         font-weight: 500;
//         background-color: transparent;
//         cursor: pointer;
//         padding: 0;
//       }
//     }
//     .create-content {
//       margin-top: 15px;
//       .item {
//         .price-label {
//           display: flex;
//           align-items: center;
//         }
//         .label {
//           flex: 1;
//           font-size: 12px;
//           font-weight: 500;
//           color: var(--theme-font-color-1);
//           margin-bottom: 8px;
//         }
//         .price-wrapper:not(.grid) {
//           display: flex;
//           width: 100%;
//           :global(.container:first-child) {
//             margin-right: 6px;
//           }
//         }
//       }
//     }
//     .profit-wrapper {
//       margin: 12px 0;
//       color: var(--theme-font-color-3);
//       display: flex;
//       align-items: center;
//       .tips {
//         border-bottom: 1px dashed var(--theme-font-color-2);
//       }
//       .grid-profit {
//         flex: 1;
//         text-align: right;
//       }
//     }
//     .profit-error {
//       font-size: 12px;
//       color: var(--color-red);
//     }
//     .divider {
//       height: 1px;
//       background-color: var(--theme-border-color-2);
//       margin: 12px 0;
//     }
//     .amount-wrapper {
//       .label {
//         font-size: 12px;
//         font-weight: 500;
//         color: var(--theme-font-color-1);
//         margin-bottom: 12px;
//       }
//       .amount {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         color: var(--theme-font-color-1);
//         .text {
//           font-size: 12px;
//           color: var(--theme-font-color-3);
//         }
//         :global(img) {
//           margin-left: 4px;
//           cursor: pointer;
//         }
//       }
//     }
//     .amount-input {
//       margin-top: 6px;
//     }
//     .slider-wrapper {
//       margin-top: 6px;
//     }
//     .amount-wrapper + .divider {
//       margin-top: 6px;
//     }
//     .advanced-wrapper {
//       .collapse {
//         color: var(--theme-font-color-1);
//         display: flex;
//         align-items: center;
//         cursor: pointer;
//         width: fit-content;
//         :global(img) {
//           margin-left: 4px;
//           transition: 0.2s;
//           transform: rotate(-180deg);
//         }
//         :global(img.active) {
//           transform: rotate(0deg);
//         }
//       }
//     }
//     .radio-wrapper {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       .text {
//         color: var(--theme-font-color-3);
//       }
//       :global(.ant-switch-checked) {
//         background: var(--skin-color-active) !important;
//       }
//     }
//     .create-btn {
//       margin-top: 30px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background-color: var(--skin-primary-color);
//       height: 38px;
//       width: 100%;
//       border-radius: 6px;
//       border: none;
//       color: var(--skin-font-color);
//       cursor: pointer;
//       &:disabled {
//         background-color: var(--theme-tips-color);
//         color: var(--theme-font-color-3);
//         cursor: not-allowed;
//       }
//     }
//   }
//   .grid-rank-wrapper {
//     .title {
//       color: var(--theme-font-color-1);
//     }
//     .rank-wrapper {
//       margin: 0;
//       padding: 0;
//       margin-top: 17px;
//       height: 660px;
//       overflow: auto;
//       padding-bottom: 10px;
//       &.collapse {
//         height: 523px;
//       }
//       li {
//         padding: 14px 11px;
//         border: 1px solid var(--theme-grid-card-color);
//         border-radius: 8px;
//         margin-bottom: 10px;
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           .quote {
//             display: flex;
//             align-items: center;
//             color: var(--theme-font-color-1);
//             font-weight: 500;
//             :global(img) {
//               margin-right: 6px;
//             }
//             & + div {
//               font-size: 12px;
//               margin-top: 7px;
//               color: var(--theme-font-color-3);
//             }
//           }
//           button {
//             height: 30px;
//             border-radius: 6px;
//             border: 1px solid var(--skin-primary-color);
//             padding: 0 12px;
//             background-color: transparent;
//             font-size: 12px;
//             font-weight: 500;
//             color: var(--skin-main-font-color);
//             cursor: pointer;
//           }
//         }
//         .divider {
//           background-color: var(--theme-grid-card-color);
//           height: 1px;
//           margin: 14px 0;
//         }
//         .item {
//           font-size: 12px;
//           color: var(--theme-font-color-3);
//           > div {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//           }
//           span {
//             color: var(--theme-font-color-1);
//           }
//           .roi {
//             margin-top: 4px;
//             > div {
//               &:first-child {
//                 font-size: 16px;
//                 margin-bottom: 12px;
//               }
//               &:last-child {
//                 font-size: 12px;
//               }
//             }
//           }
//           .time-wrapper {
//             margin-top: 14px;
//             > div {
//               &:first-child {
//                 display: flex;
//                 align-items: center;
//                 span {
//                   color: var(--theme-font-color-3);
//                 }
//                 :global(img) {
//                   border-radius: 50%;
//                   margin-right: 6px;
//                 }
//               }
//               &:last-child {
//                 display: flex;
//                 align-items: center;
//                 span {
//                   display: inline-block;
//                   margin-left: 2px;
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
//   :global(.quote-select-menu) {
//     :global(ul) {
//       max-height: 190px;
//       overflow: auto;
//       :global(li) {
//         height: 38px;
//         display: flex;
//         align-items: center;
//         margin-bottom: 4px !important;
//         :global(div) {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//       }
//       :global(li:has(.active)) {
//         color: var(--skin-primary-color) !important;
//         background-color: var(--skin-primary-bg-color-opacity-1);
//       }
//     }
//   }
// `;
