// import AffiliateSelect from '@/components/affiliate/select';
// import MiniChartPro from '@/components/chart/mini-chart-pro';
// import CoinLogo from '@/components/coin-logo';
// import CommonIcon from '@/components/common-icon';
// import Image from '@/components/image';
// import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
// import TutorialModel from '@/components/modal/tutorial-model';
// // import { ResultModal } from '@/components/spot-strategy-result-modal';
// import { getTradeInvestSquareListApi } from '@/core/api';
// import { useCurrencyScale, useResponsive, useRouter } from '@/core/hooks';
// import { LANG } from '@/core/i18n';
// import { Account, LoadingType, Spot } from '@/core/shared';
// import { LOCAL_KEY, localStorageApi } from '@/core/store';
// import { RootColor } from '@/core/styles/src/theme/global/root';
// import { message } from 'antd';
// import dayjs from 'dayjs';
// import React, { useEffect, useMemo, useState } from 'react';
// import css from 'styled-jsx/css';
// import { useImmer } from 'use-immer';
// // import { CreateInvestConfirmModal } from '../../../../create-invest-confirm-modal';
// import { BaseModalStyle } from './base-modal-style';
// import Input from './input';

// const { Position, Strategy } = Spot;

// const INVEST_TIME = [
//   {
//     label: LANG('1小时'),
//     value: 1,
//   },
//   {
//     label: LANG('4小时'),
//     value: 4,
//   },
//   {
//     label: LANG('8小时'),
//     value: 8,
//   },
//   {
//     label: LANG('12小时'),
//     value: 12,
//   },
//   {
//     label: LANG('1天'),
//     value: 24,
//   },
//   {
//     label: LANG('1周'),
//     value: 168,
//   },
//   {
//     label: LANG('2周'),
//     value: 336,
//   },
//   {
//     label: LANG('4周'),
//     value: 672,
//   },
// ];

// let INVEST_TIME_MAP = {} as {
//   [key: number]: string;
// };
// INVEST_TIME.forEach((item) => {
//   INVEST_TIME_MAP[item.value] = item.label;
// });

// export { INVEST_TIME, INVEST_TIME_MAP };

// const InvestView = () => {
//   const router = useRouter();
//   const routerId = router.query.id as string;
//   const from = router.query.from as string;
//   const isLogin = Account.isLogin;
//   const { balance, investDataList, period, title, investSymbolList, investSymbolStringList, investSymbolMap } =
//     Strategy.state;
//   const [tutorialModelVisible, setTutorialModelVisible] = useState(false);
//   const [transferModalVisible, setTransferModalVisible] = useState(false);
//   const [confirmModalVisible, setConfirmModalVisible] = useState(false);
//   const [resultModalVisible, setResultModalVisible] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [rankList, setRankList] = useState<any[]>([]);
//   const colorHex = RootColor.getColorHex;
//   const now = new Date().getTime();

//   const { scale } = useCurrencyScale('USDT');
//   const { isSmallDesktop, isTablet } = useResponsive(false);

//   const [state, setState] = useImmer({
//     copyIndex: 0,
//     copyId: '',
//   });

//   useEffect(() => {
//     let payload: any = {
//       sort: 'roi',
//       page: 1,
//       rows: 3,
//     };
//     getTradeInvestSquareListApi(payload).then(({ data, code }) => {
//       if (code === 200) {
//         const { list } = data;
//         const newList = list.slice();
//         newList.map((item: any) => {
//           item.chartData = item.pnls.map((i: any) => i.pnl);
//           return item;
//         });
//         setRankList(newList);
//       }
//     });
//   }, [routerId]);

//   useEffect(() => {
//     const data: any = localStorageApi.getItem(LOCAL_KEY.COPY_DATA);

//     if (from === 'trading-bot-invest' && data) {
//       Strategy.changeInvestDataList(data?.investList);
//       Strategy.changeInvestSymbolStringList(data?.investSymbolStringList);
//       Strategy.setPeriod(data?.period);
//       localStorageApi.setItem(LOCAL_KEY.COPY_DATA, '');
//     }
//   }, [from]);

//   const ExchangeIconMemo = useMemo(() => {
//     return (
//       <CommonIcon
//         name='common-spot-exchange-0'
//         size={12}
//         enableSkin
//         onClick={() => {
//           setTransferModalVisible(true);
//         }}
//       />
//     );
//   }, []);

//   const onAddCoinClicked = () => {
//     const list = investSymbolList.filter((item: any) => !investSymbolStringList.includes(item.symbol));
//     const cloneInvestDataList = investDataList.slice();
//     const cloneInvestSymbolStringList = investSymbolStringList.slice();

//     cloneInvestDataList.push({
//       symbol: list[0].symbol,
//       amount: '',
//     });
//     cloneInvestSymbolStringList.push(list[0].symbol);
//     Strategy.changeInvestDataList(cloneInvestDataList);
//     Strategy.changeInvestSymbolStringList(cloneInvestSymbolStringList);
//   };

//   const onDeleteCoinClicked = (index: number) => {
//     const cloneInvestDataList = investDataList.slice();
//     const cloneInvestSymbolStringList = investSymbolStringList.slice();
//     cloneInvestDataList.splice(index, 1);
//     cloneInvestSymbolStringList.splice(index, 1);
//     Strategy.changeInvestDataList(cloneInvestDataList);
//     Strategy.changeInvestSymbolStringList(cloneInvestSymbolStringList);
//   };

//   const oneCycleTotal = useMemo(() => {
//     return investDataList.reduce((total, item) => {
//       return total + Number(item.amount);
//     }, 0);
//   }, [investDataList]);

//   const onCreateClicked = () => {
//     if (!isLogin) {
//       router.push('/login');
//       return;
//     }
//     if (investDataList.length === 0) {
//       message.error(LANG('请选择定投币种'));
//       return;
//     } else if (investDataList.some((item) => Number(item.amount) === 0)) {
//       message.error(LANG('请输入定投金额'));
//       return;
//     } else if (oneCycleTotal > balance) {
//       message.error(LANG('余额不足'));
//     }
//     setConfirmModalVisible(true);
//   };

//   const onConfirmCreate = async () => {
//     const stringList = investSymbolStringList.map((str) => str.split('_')[0]);
//     let newTitle = '';
//     if (stringList.length <= 2) {
//       newTitle = `${stringList.join(',')}${LANG('定投策略')}`;
//     }
//     if (stringList.length > 2) {
//       newTitle = `${stringList.slice(0, 3).join(',')}...${LANG('定投组合')}`;
//     }

//     const payload = {
//       title: title ? title : newTitle,
//       period,
//       symbols: investDataList,
//       copyId: '',
//     };

//     const listSymbols = rankList[state.copyIndex].symbols;
//     const isChanged = investDataList.some((item) => {
//       const findIndex = listSymbols.findIndex((i: any) => i.symbol === item.symbol);

//       if (findIndex === -1) {
//         return true;
//       }
//       if (item.amount !== listSymbols[findIndex].amount) {
//         return true;
//       }
//       return false;
//     });

//     if (!isChanged) {
//       payload.copyId = rankList[state.copyIndex].id;
//     }

//     const result = await Strategy.createInvest(payload);
//     if (result.code === 200) {
//       setSuccess(true);
//       Strategy.getBalance();
//       Position.fetchSpotInvestPositionList(LoadingType.Hide);
//     } else {
//       setSuccess(false);
//     }
//     setConfirmModalVisible(false);
//     setResultModalVisible(true);
//   };

//   const onRankCopyClicked = (index: number) => {
//     const item = rankList[index];
//     setState((draft) => {
//       draft.copyIndex = index;
//       draft.copyId = item.id;
//     });
//     Strategy.changeInvestDataList(item.symbols.map((item: any) => ({ symbol: item.symbol, amount: item.amount })));
//     Strategy.changeInvestSymbolStringList(item.symbols.map((item: any) => item.symbol));
//     Strategy.setPeriod(item.period);
//   };

//   return (
//     <>
//       <div className='invest-container'>
//         <div className='back'>
//           <button className='btn' onClick={() => Strategy.changeSelectType(null)}>
//             <CommonIcon name='common-grid-arrow-left-0' size={12} />
//             {LANG('现货定投')}
//           </button>
//           <button className='guide' onClick={() => setTutorialModelVisible(true)}>
//             <CommonIcon name='common-grid-guide-0' size={18} />
//           </button>
//         </div>
//         <div className='step-wrapper'>
//           <div className='step step1'>
//             <div>
//               <span>1. {LANG('投资币种')}</span>
//               <div className='balance-wrapper'>
//                 <span className='text'>{LANG('可用')}</span>
//                 <div>
//                   <span>{`${(isLogin ? balance : 0)?.toFormat()} USDT`}</span>
//                   {ExchangeIconMemo}
//                 </div>
//               </div>
//             </div>
//             <div className='base-coin-wrapper'>
//               <CoinLogo coin='USDT' width={18} height={18} alt='base-coin' />
//               USDT
//             </div>
//           </div>
//           <div className='step step2'>
//             <div>2. {LANG('定投币种')}</div>
//             <ul className='invest-coin-list'>
//               {investDataList.map((item, index: number) => (
//                 <li key={item.symbol + index}>
//                   <AffiliateSelect
//                     className='coin-select'
//                     placement='bottomLeft'
//                     popupClassName='coin-select-wrapper'
//                     value={item.symbol}
//                     onChange={(val) => {
//                       const list = investDataList.slice();
//                       const stringList = investSymbolStringList.slice();
//                       list[index].symbol = val as string;
//                       list[index].amount = '';
//                       stringList[index] = val as string;
//                       Strategy.changeInvestDataList(list);
//                       Strategy.changeInvestSymbolStringList(stringList);
//                     }}
//                     list={investSymbolList
//                       .filter((i) => !investSymbolStringList.includes(i.symbol) || i.symbol === item.symbol)
//                       .map((i: any) => ({ value: i.symbol, label: i?.baseCoin }))}
//                     renderItem={(item2) => (
//                       <>
//                         <CoinLogo coin={item2.label} width='18' height='18' alt={item2.label} />
//                         <span>{item2.label}</span>
//                       </>
//                     )}
//                   />
//                   <div className='amount-wrapper'>
//                     <Input
//                       max={investSymbolMap.get(item.symbol)?.amountMax}
//                       decimal={scale}
//                       onChange={(val) => {
//                         const list = investDataList.slice();
//                         list[index].amount = val;
//                         Strategy.changeInvestDataList(list);
//                       }}
//                       placeholder={`${investSymbolMap.get(item.symbol)?.amountMin} - ${
//                         investSymbolMap.get(item.symbol)?.amountMax
//                       }`}
//                       value={item.amount}
//                       onBlur={() => {
//                         const min = investSymbolMap.get(item.symbol)?.amountMin || 0;
//                         if (Number(investDataList[index].amount) < min) {
//                           const list = investDataList.slice();
//                           list[index].amount = min;
//                           Strategy.changeInvestDataList(list);
//                         }
//                       }}
//                     />
//                     <div className='divider' />
//                     <span>USDT</span>
//                   </div>
//                   <button className='delete-btn' onClick={() => onDeleteCoinClicked(index)}>
//                     <CommonIcon name='common-delete-0' size={16} />
//                   </button>
//                 </li>
//               ))}
//               <li>
//                 <button className='add-coin' onClick={onAddCoinClicked} disabled={investDataList.length >= 10}>
//                   <CommonIcon
//                     name={investDataList.length >= 10 ? 'common-plus-round-0' : 'common-wallet-create-0'}
//                     size={12}
//                     enableSkin
//                   />
//                   {LANG('添加币种')}
//                 </button>
//               </li>
//             </ul>
//           </div>
//           <div className='step step3'>
//             <div>3. {LANG('定投间隔')}</div>
//             <div className='info'>
//               <AffiliateSelect
//                 value={period}
//                 onChange={(val) => Strategy.setPeriod(val as number)}
//                 list={INVEST_TIME}
//               />
//               <div className='label'>
//                 {LANG('每期总额')}
//                 <span>{oneCycleTotal} USDT</span>
//               </div>
//               <div className='label'>
//                 {LANG('预计可投次数')}
//                 <span>{oneCycleTotal === 0 ? '--' : Math.floor(Number(balance.div(oneCycleTotal)))}</span>
//               </div>
//             </div>
//           </div>
//           <div className='step step4'>
//             <div className='title'>
//               4. {LANG('策略标题')} <span>({LANG('选填')})</span>
//             </div>
//             <input
//               type='text'
//               maxLength={20}
//               placeholder={LANG('最多{num}个字符', { num: 20 })}
//               value={title}
//               onChange={(e) => {
//                 Strategy.setTitle(e.target.value);
//               }}
//             />
//           </div>
//           <button className='create-btn' onClick={onCreateClicked}>
//             {LANG('创建')}
//           </button>
//         </div>
//       </div>
//       <div
//         className={`footer grid-rank-wrapper ${isSmallDesktop ? 'small-layout-footer' : ''} ${isTablet ? 'hide' : ''}`}
//       >
//         <div className='title'>{LANG('排行榜')}</div>
//         <ul className='rank-wrapper'>
//           {rankList.map((item, index) => (
//             <li key={item.id + index}>
//               <div className='header'>
//                 <div>
//                   <div className='logo-wrapper'>
//                     <div style={{ width: `${item?.symbols.slice(0, 3).length.mul(8).add(8)}px` }}>
//                       {item?.symbols?.slice(0, 3).map((item: any, index: number) => (
//                         <CoinLogo
//                           key={item.symbol + index}
//                           coin={item.baseCoin}
//                           width={16}
//                           height={16}
//                           alt='baseCoin'
//                         />
//                       ))}
//                     </div>
//                     <span>{item?.title}</span>
//                   </div>
//                   <div className='rank-coin'>
//                     {item?.symbols.slice(0, 3).map((item: any) => (
//                       <span key={item.baseCoin}>{item.baseCoin}</span>
//                     ))}
//                     {item?.symbols.length > 3 && '...'}
//                   </div>
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
//                         {item?.pnl.toRound(2)} USDT
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
//       <TutorialModel
//         open={tutorialModelVisible}
//         onCancel={() => setTutorialModelVisible(false)}
//         type='spot_invest'
//         title={LANG('如何开始现货定投')}
//       />
//       {transferModalVisible && (
//         <TransferModal
//           defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
//           defaultTargetAccount={ACCOUNT_TYPE.SPOT}
//           open={transferModalVisible}
//           onCancel={() => {
//             setTransferModalVisible(false);
//           }}
//           onTransferDone={() => Strategy.getBalance()}
//         />
//       )}
//       <CreateInvestConfirmModal
//         open={confirmModalVisible}
//         onClose={() => setConfirmModalVisible(false)}
//         onOk={onConfirmCreate}
//         periodLabel={INVEST_TIME_MAP[period]}
//         symbols={investDataList}
//         oneCycleTotal={oneCycleTotal}
//       />
//       <ResultModal
//         type='invest'
//         open={resultModalVisible}
//         onClose={() => setResultModalVisible(false)}
//         isSuccess={success}
//         onOk={success ? () => {} : () => setResultModalVisible(false)}
//       />
//       <BaseModalStyle />
//       <style jsx>{styles}</style>
//     </>
//   );
// };
// export default React.memo(InvestView);
// const styles = css`
//   .invest-container {
//     background: var(--theme-background-color-2-2);
//     border-bottom-left-radius: var(--theme-trade-layout-radius);
//     border-bottom-right-radius: var(--theme-trade-layout-radius);
//     padding: 10px;
//     min-height: 400px;
//     height: 670px;
//     overflow: auto;
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
//     .step-wrapper {
//       .step {
//         color: var(--theme-font-color-1);
//         > div {
//           &:first-child {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//           }
//         }
//       }
//       .step1 {
//         margin-top: 14px;
//         .balance-wrapper {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           font-size: 12px;
//           .text {
//             color: var(--theme-font-color-3);
//             margin-right: 5px;
//           }
//           :global(img) {
//             margin-left: 4px;
//             cursor: pointer;
//           }
//         }
//         .base-coin-wrapper {
//           margin-top: 6px;
//           height: 38px;
//           display: flex;
//           align-items: center;
//           background-color: var(--theme-background-color-8);
//           padding: 0 12px;
//           font-weight: 600;
//           color: var(--theme-font-color-1);
//           border-radius: 6px;
//           :global(img) {
//             margin-right: 6px;
//           }
//         }
//       }
//       .step2 {
//         margin-top: 21px;
//         .invest-coin-list {
//           padding: 0;
//           margin-top: 16px;
//           margin-bottom: 0;
//           li {
//             display: flex;
//             align-items: center;
//             margin-top: 10px;
//             :global(.input-wrapper) {
//               background-color: transparent;
//               :global(input) {
//                 background-color: transparent;
//                 border: none;
//               }
//             }
//             :global(.coin-select) {
//               border-radius: 0;
//               height: 38px;
//               :global(.ant-select-selector) {
//                 padding-right: 5px;
//                 border-radius: 0;
//                 border-top-left-radius: 6px;
//                 border-bottom-left-radius: 6px;
//               }
//             }
//             :global(.ant-select-arrow) {
//               inset-inline-end: 4px;
//             }
//             .amount-wrapper {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               flex: 1;
//               background-color: var(--theme-background-color-8);
//               height: 38px;
//               border-top-right-radius: 6px;
//               border-bottom-right-radius: 6px;
//               padding-left: 0;
//               padding-right: 12px;
//               color: var(--theme-font-color-1);
//               :global(input) {
//                 padding-left: 0;
//                 padding-right: 0;
//                 text-align: right;
//               }
//               .divider {
//                 height: 12px;
//                 width: 1px;
//                 background-color: var(--theme-grid-button-color);
//                 margin: 0 8px;
//               }
//             }
//             .delete-btn {
//               margin-left: 8px;
//               height: 38px;
//               width: 40px;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               border: 1px solid var(--theme-border-color-1);
//               border-radius: 6px;
//               cursor: pointer;
//               background-color: transparent;
//             }
//             .add-coin {
//               width: 100%;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               border: 1px solid var(--skin-main-font-color);
//               height: 38px;
//               cursor: pointer;
//               background-color: transparent;
//               border-radius: 6px;
//               color: var(--skin-main-font-color);
//               &:disabled {
//                 cursor: not-allowed;
//                 border-color: var(--theme-border-color-1);
//                 color: var(--theme-font-color-2);
//               }
//               :global(img) {
//                 margin-right: 3px;
//               }
//             }
//           }
//           :global(.container) {
//             padding-left: 0;
//           }
//           :global(.ant-select-single) {
//             height: 38px;
//           }
//           :global(.ant-select-selector) {
//             width: 90px;
//             background-color: var(--theme-background-color-8);
//             height: 38px;
//           }
//         }
//       }
//       .step3 {
//         margin-top: 15px;
//         padding-top: 15px;
//         border-top: 1px solid var(--theme-border-color-2);
//         :global(.ant-select-single) {
//           width: 100%;
//           height: 38px;
//         }
//         :global(.container) {
//           padding-left: 0;
//           margin-top: 12px;
//         }
//         :global(.ant-select-selector) {
//           width: 100%;
//           background-color: var(--theme-background-color-8);
//           height: 38px;
//         }
//         .label {
//           color: var(--theme-font-color-3);
//           margin-top: 16px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           span {
//             color: var(--theme-font-color-1);
//           }
//           &:last-child {
//             margin-top: 8px;
//           }
//         }
//       }
//       .step4 {
//         margin-top: 19px;
//         margin-bottom: 10px;
//         .title {
//           justify-content: flex-start !important;
//           color: var(--theme-font-color-1);
//           span {
//             color: var(--theme-font-color-3);
//           }
//         }
//         input {
//           margin-top: 8px;
//           height: 38px;
//           width: 100%;
//           background-color: var(--theme-background-color-8);
//           border: none;
//           padding: 0 12px;
//           border-radius: 8px;
//           color: var(--theme-font-color-1);
//         }
//       }
//       .create-btn {
//         height: 38px;
//         border: none;
//         border-radius: 6px;
//         background-color: var(--skin-primary-color);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         width: 100%;
//         margin-top: 30px;
//         margin-bottom: 10px;
//         cursor: pointer;
//         color: var(--skin-font-color);
//       }
//     }
//   }
//   .grid-rank-wrapper {
//     .small-layout-footer {
//       height: 300px;
//       overflow: auto;
//     }
//     .title {
//       color: var(--theme-font-color-1);
//     }
//     .rank-wrapper {
//       margin: 0;
//       padding: 0;
//       margin-top: 17px;
//       overflow: auto;
//       padding-bottom: 10px;
//       li {
//         padding: 14px 11px;
//         border: 1px solid var(--theme-grid-card-color);
//         border-radius: 8px;
//         margin-bottom: 10px;
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           .logo-wrapper {
//             display: flex;
//             align-items: center;
//             > div {
//               position: relative;
//               height: 19px;
//               :global(img) {
//                 position: absolute;
//                 left: 0;
//                 &:nth-child(2) {
//                   left: 12px;
//                 }
//                 &:nth-child(3) {
//                   left: 24px;
//                 }
//               }
//             }
//             span {
//               margin-left: 10px;
//               font-weight: 500;
//               color: var(--theme-font-color-1);
//               width: 80px;
//               text-overflow: ellipsis;
//               white-space: nowrap;
//               overflow: hidden;
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
//           .rank-coin {
//             margin-top: 10px;
//             color: var(--theme-font-color-3);
//             span {
//               margin-right: 8px;
//               position: relative;
//               &:not(:last-child) {
//                 &:after {
//                   content: ' ';
//                   height: 9px;
//                   width: 1px;
//                   background-color: var(--theme-grid-button-color);
//                   position: absolute;
//                   right: -4px;
//                   bottom: 4px;
//                 }
//               }
//             }
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
//   :global(.coin-select-wrapper) {
//     width: 130px !important;
//   }
// `;
