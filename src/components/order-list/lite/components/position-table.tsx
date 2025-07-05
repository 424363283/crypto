import { AlertFunction } from '@/components/modal/alert-function';
import PlusIcon from '@/components/trade-ui/trade-view/lite/components/plus-icon';
import { getZendeskLink } from '@/components/zendesk';
import { useKycState, useTheme, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, AccountType, Lite, LiteListItem, LiteTradeItem, TradeMap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsx, formatDefaultText, getActive, MediaInfo } from '@/core/utils';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import RecordList from '../../components/record-list';
import AddMarginModal from './add-margin-modal';
import Clipboard from './clipboard';
import SettingModal, { TabType } from './setting-modal';
import ShareModal from './share-modal';
import ShiftStopLossModal from './shift-stop-loss-modal';
import YIcon from '@/components/YIcons';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { linkClassName, linkStyles } from '@/components/link';
import { ColumnType } from 'antd/lib/table';
import { useLiteDeferState } from '@/core/hooks/src/use-lite-defer-state';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { EmptyComponent } from '@/components/empty';
import { ItemHeader, ItemStatistics } from './position-item';
import { BottomModal, MobileModal } from '@/components/mobile-modal';

const Position = Lite.Position;
const Trade = Lite.Trade;

const getType = (item: LiteListItem) => {
  if (item.traderUsername !== null) {
    return (
      <>
        <span>{LANG('跟随____1')}:</span>
        <br />
        <span>{item.traderUsername}</span>
      </>
    );
  } else if (item.followCount && item.followCount > 0) {
    return (
      <>
        <span>{LANG('跟随人数')}:</span>
        <br />
        <span>{item.followCount}</span>
      </>
    );
  } else {
    return item.placeSource;
  }
};

const PositionTable = () => {
  const { positionList, loading, marketMap, hideOther, shareModalData, settingModalData, addMarginModalData } =
    Position.state;
  const { closeConfirm, id, balance, accountType } = Trade.state;
  const { isMobile } = useResponsive();
  const { liteMap, showDeferStatus } = useLiteDeferState();
  const [shiftStopLossModalState, setShiftStopLossModalState] = useImmer({
    visible: false,
    id: '',
    commodity: '',
    contract: '',
    offset: '' as number | string
  });
  const [mobileModal, setMobileModal] = useImmer({
    id: '',
    closeModalVisible: false,
    reverseModalVisible: false
  });
  const { isKyc } = useKycState();
  const { theme } = useTheme();
  const { locale } = useAppContext();
  const isLogin = Account.isLogin;

  const onClosePositionClicked = useCallback(
    (id: string) => {
      if (closeConfirm) {
        if (!isMobile) {
          AlertFunction({
            title: LANG('平仓'),
            okText: LANG('确认'),
            className: 'customAlert',
            hideHeaderIcon: true,
            description: (
              <div className={theme}>
                <div className="confirm-title">
                  <YIcon.warningIcon />
                  {LANG('请确认是否平仓')}
                </div>
              </div>
            ),
            onOk: async () => {
              Position.closePositionById(id);
            },
            theme,
            v2: true,
            cancelText: '',
            closable: true,
            cancelButtonProps: { style: { display: 'none' } }
          });
        } else {
          setMobileModal(draft => {
            draft.id = id;
            draft.closeModalVisible = true;
          });
        }
      } else {
        Position.closePositionById(id);
      }
    },
    [closeConfirm, theme, isMobile]
  );

  const onReverseOpenOrderClicked = useCallback(
    (id: string) => {
      if (!isMobile) {
        AlertFunction({
          title: LANG('反向开仓'),
          v2: true,
          hideHeaderIcon: true,
          className: 'customAlert',
          description: (
            <div className={theme}>
              <div className="reverse-title">{LANG('请确认是否一键反向开仓？')}</div>
              <div className="reverse-description">
                {LANG(
                  '您当前操作是「反向开仓」，该操作将会对您当前持有的仓位以最新价格平仓，同时以仓位相同保证金，相同杠杆倍数，当前最新价格进行反反向开仓'
                )}
              </div>
              <div className="reverse-tips">
                <span>
                  <YIcon.tipsIcon />
                </span>
                {LANG('请注意：当行情剧烈波动时，平仓价格与反向开仓价格可能存在一些差异')}
              </div>
            </div>
          ),
          okText: LANG('确认'),
          cancelText: '',
          closable: true,
          onOk: async () => {
            Position.reverseOpenOrder(id);
          },
          cancelButtonProps: { style: { display: 'none' } },
          theme
        });
      } else {
        setMobileModal(draft => {
          draft.id = id;
          draft.reverseModalVisible = true;
        });
      }
    },
    [theme, isMobile]
  );

  const [settingModalTab, setSettingModalTab] = useState(TabType.RATIO);
  const isSimulated = accountType === AccountType.SIMULATED;

  const isReal = accountType === AccountType.REAL;

  const tableList = useMemo(() => {
    if (isLogin) {
      return positionList.filter(({ commodity }) => (hideOther ? commodity === id : true));
    }
    return [];
  }, [id, positionList, hideOther, isLogin]);

  const tdWidth = useMemo(() => {
    if (tableList.length === 0) {
      return 100;
    }
    if (locale === 'ja' || locale === 'zh') {
      if (isSimulated) {
        return 240;
      }
      return 260;
    } else {
      if (isSimulated) {
        return 260;
      }
      return 260;
    }
  }, [tableList, locale, isSimulated]);

  const columns = useMemo(() => {
    const col = [
      {
        title: LANG('合约'),
        dataIndex: 'contract',
        minWidth: 100,
        fixed: 'left',
        render: (_: any, { commodityName, currency, lever, buy }: LiteListItem) => {
          return (
            <div className={`first-td flex ${buy ? 'raise' : 'fall'} td-height `}>
              <span className="liteName">{commodityName.replace(currency, '')}</span>
              <span className="yellow">{lever}x</span>
            </div>
          );
        }
      },
      {
        title: LANG('保证金'),
        dataIndex: 'margin',
        minWidth: 100,
        render: (margin: number) => {
          return <span className="liteName">{margin} USDT</span>;
        }
      },
      {
        title: `${LANG('开仓价')}/${LANG('当前价')}`,
        dataIndex: 'opPrice',
        minWidth: 100,
        render: (_: any, { commodity, contract, opPrice, priceDigit }: LiteListItem) => {
          const price = marketMap[contract]?.price || 0;
          const prevPrice = marketMap[contract]?.prevPrice || 0;
          return (
            <div className="flex td-height">
              <span className="liteName">{opPrice?.toFormat(priceDigit)}</span>
              <span className={Number(price) >= Number(prevPrice) ? 'main-green' : 'main-red'}>
                {formatDefaultText(price.toFormat(priceDigit))}
              </span>
            </div>
          );
        }
      },
      {
        title: `${LANG('止盈价')}/${LANG('强平价')}`,
        dataIndex: 'opPrice',
        minWidth: 100,
        render: (_: any, item: LiteListItem) => {
          const { Fprice, Lprice } = Position.calculateProfitAndLoss(item);
          return (
            <div className="flex td-height">
              <span className="liteName">{Fprice.toFormat(item.priceDigit)}</span>
              <span className="yellow">{Lprice.toFormat(item.priceDigit)}</span>
            </div>
          );
        }
      },
      {
        title: `${LANG('订单盈亏')}(${LANG('盈亏比')})`,
        dataIndex: 'income',
        minWidth: 150,
        render: (_: any, item: LiteListItem) => {
          const { income, incomeRate } = Position.calculateIncome(item, marketMap);
          return (
            <div className={'flex td-height'}>
              <span className={income >= 0 ? 'main-green' : 'main-red'}>
                {income >= 0 ? '+' : ''}
                {income.toFixed(2)}
              </span>

              <span className={income >= 0 ? 'main-green' : 'main-red'}>
                {incomeRate >= 0 ? '+' : ''}
                {incomeRate.toFixed(2)}%
              </span>
            </div>
          );
        }
      },
      {
        title: LANG('开仓时间'),
        dataIndex: 'opTime',
        minWidth: 100,
        render: (_: any, { createTime }: LiteListItem) => {
          return (
            <div className="flex">
              <span className="liteName">{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            </div>
          );
        }
      },
      {
        title: LANG('开仓方式'),
        width: 120,
        dataIndex: 'placeSource',
        render: (_: any, item: LiteListItem) => {
          return <span className="liteName">{getType(item)}</span>;
        }
      },
      {
        title: LANG('订单号'),
        dataIndex: 'id',
        width: 140,
        render: (id: string) => {
          return (
            <div className="orderNum">
              <span className="liteName">
                {id.slice(0, 5)}...
                {id.slice(id.length - 5)}
              </span>
              <Clipboard text={id} />
            </div>
          );
        }
      },
      {
        title: LANG('是否递延'),
        dataIndex: 'defer',
        width: 140,
        render: (defer: boolean) => {
          return <span className="liteName">{defer ? LANG('是') : LANG('否')}</span>;
        }
      },
      // {
      //   title: () => (
      //     <div>
      //       <Tooltip
      //         placement="topRight"
      //         title={
      //           <span
      //             dangerouslySetInnerHTML={{
      //               __html: LANG(
      //                 '移动止损的触发价格会跟随市场波动而变化，可以帮助您在波动行情中动态地锁定利润或减少损失。{more}',
      //                 {
      //                   more: `<a target={'_blank'} class="${linkClassName}" href="${getZendeskLink(
      //                     '/articles/6951123628943'
      //                   )}">${LANG('了解更多')}</a>`
      //                 }
      //               )
      //             }}
      //           />
      //         }
      //         arrow={false}
      //       >
      //         <span className="shiftLabel">{LANG('移动止损(距离)')}</span>
      //         {linkStyles}
      //       </Tooltip>
      //     </div>
      //   ),
      //   width: 160,
      //   dataIndex: 'trailPrice',
      //   render: (_: any, { trailPrice, id, commodity, contract, buy, trailOffset }: LiteListItem) => {
      //     const price = Number(trailPrice?.sub(marketMap[contract]?.price || 0));
      //     return (
      //       <div className="operationWrapper trailPriceWrapper">
      //         {trailPrice == 0 ? (
      //           <button
      //             className="operationBtn closePositionBtn"
      //             onClick={() => {
      //               setShiftStopLossModalState(draft => {
      //                 draft.visible = true;
      //                 draft.id = id;
      //                 draft.commodity = commodity;
      //                 draft.contract = contract;
      //               });
      //             }}
      //           >
      //             <PlusOutlined />
      //             {LANG('添加')}
      //           </button>
      //         ) : (
      //           <div className="addPos">
      //             {buy ? '<=' : '>='}
      //             {trailPrice}
      //             <span className={price >= 0 ? 'main-green' : 'main-red'}>({formatDefaultText(price)})</span>
      //             <div
      //               onClick={() => {
      //                 setShiftStopLossModalState(draft => {
      //                   draft.visible = true;
      //                   draft.id = id;
      //                   draft.commodity = commodity;
      //                   draft.contract = contract;
      //                   draft.offset = trailOffset;
      //                 });
      //               }}
      //             >
      //               <YIcon.editIcon />
      //             </div>
      //           </div>
      //         )}
      //       </div>
      //     );
      //   }
      // },
      {
        title: LANG('操作'),
        align: 'right',
        fixed: 'right',
        width: tdWidth,
        render: (item: LiteListItem) => {
          const lite = liteMap?.get(item.commodity);
          // 默认可添加保证金
          const canAddMargin = true; //lite ? item.lever > (isKyc ? lite?.lever2List[0] : lite?.lever0List[0]) : false;

          return (
            <div className="operationWrapper actions">
              <button className="operationBtn closePositionBtn" onClick={() => onClosePositionClicked(item.id)}>
                {LANG('平仓')}
              </button>
              {!isSimulated && (
                <button
                  className="operationBtn closePositionBtn"
                  disabled={!isReal}
                  onClick={() => onReverseOpenOrderClicked(item.id)}
                >
                  {LANG('反向开仓')}
                </button>
              )}

              <div className="actions-group">
                <YIcon.settinIcon onClick={() => Position.setSettingModalData(item)} />

                <YIcon.addIcon
                  className={`addMarginBtn ${getActive(canAddMargin)}`}
                  onClick={() => Position.setAddMarginModalData(canAddMargin ? item : null)}
                />

                <YIcon.shareIcon
                  onClick={() => {
                    Position.setShareModalData(item);
                  }}
                />
              </div>

              {/* <button className='operationBtn settingBtn fix-v2-btn' onClick={() => Position.setSettingModalData(item)}>
                {LANG('设置')}
              </button>
              <button
                className={`addMarginBtn ${getActive(canAddMargin)}`}
                onClick={() => Position.setAddMarginModalData(canAddMargin ? item : null)}
              >
                <PlusIcon width='10.4px' height='10.4px' color={canAddMargin ? '#fff' : '#9a9a9a'} />
              </button> */}
              {/* < Image
                src='/static/images/lite/share.png'
                className='share'
                width={20}
                height={20}
                alt=''
                onClick={() => {
                  Position.setShareModalData(item);
                }}
              /> */}
            </div>
          );
        }
      }
    ];

    // if (isSimulated) {
    //   col.splice(-2, 1);
    // }
    if (!showDeferStatus()) {
      const index = col.findIndex(item => item.dataIndex === 'defer');
      if (index >= 0) {
        col.splice(index, 1);
      }
    }
    return col;
  }, [marketMap, locale, tableList, liteMap]);

  const rate = useMemo(() => {
    if (shareModalData) {
      const { incomeRate } = Position.calculateIncome(shareModalData, marketMap);
      return Number(incomeRate.toFixed(2));
    }
    return 0;
  }, [shareModalData, marketMap]);

  return (
    <>
      <div className="container">
        <DesktopOrTablet>
          <RecordList
            loading={loading}
            columns={columns}
            data={tableList}
            className={`${theme} lite-history-table`}
            scroll={tableList.length > 0 ? { x: 1400, y: 500 } : undefined}
          />
        </DesktopOrTablet>
        <Mobile>
          <div className="list-view">
            {loading ? (
              <></>
            ) : tableList.length > 0 ? (
              tableList.map(item => {
                const {
                  buy,
                  lever,
                  defer,
                  opPrice,
                  contract,
                  commodity,
                  commodityName,
                  currency,
                  priceDigit,
                  id,
                  volume,
                  margin,
                  trailPrice,
                  trailOffset,
                  createTime
                } = item;
                const { income, incomeRate } = Position.calculateIncome(item, marketMap);
                const { Fprice, Lprice } = Position.calculateProfitAndLoss(item);
                const price = marketMap[contract]?.price || 0;
                const offsetPrice = Number(trailPrice?.sub(marketMap[contract]?.price || 0));
                return (
                  <div key={id} className="position-item">
                    <ItemHeader
                      name={commodityName}
                      isBuy={buy}
                      lever={lever}
                      income={income}
                      incomeRate={incomeRate}
                    />
                    <ItemStatistics
                      id={id}
                      isBuy={buy}
                      price={formatDefaultText(price.toFormat(priceDigit))}
                      opPrice={opPrice?.toFormat(priceDigit)}
                      opTime={dayjs(createTime).format('YYYY-MM-DD HH:mm')}
                      commodityName={commodityName}
                      currency={currency}
                      volume={volume.toString()}
                      margin={margin.toFormat(0)}
                      fPrice={Fprice.toFormat(priceDigit)}
                      lPrice={Lprice.toFormat(priceDigit)}
                      trailPrice={trailPrice}
                      offsetPrice={offsetPrice}
                      defer={defer}
                      addMargin={() => Position.setAddMarginModalData(item)}
                      setShiftStopLoss={() => {
                        setShiftStopLossModalState(draft => {
                          draft.visible = true;
                          draft.id = id;
                          draft.commodity = commodity;
                          draft.contract = contract;
                          if (trailPrice != 0) {
                            draft.offset = trailOffset;
                          }
                        });
                      }}
                    />
                    <div className="item-actions">
                      <div className="btn" onClick={() => onReverseOpenOrderClicked(id)}>
                        {LANG('反向开仓')}
                      </div>
                      <div className="btn" onClick={() => onClosePositionClicked(id)}>
                        {LANG('平仓')}
                      </div>
                      <div className="btn" onClick={() => Position.setSettingModalData(item)}>
                        {LANG('设置')}
                      </div>
                      <div
                        className="share"
                        onClick={() => {
                          Position.setShareModalData(item);
                        }}
                      >
                        <YIcon.shareIcon />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyComponent text={LANG('暂无数据')} active className={clsx('empty')} />
            )}
          </div>
          <MobileModal
            visible={mobileModal.closeModalVisible}
            onClose={() =>
              setMobileModal(draft => {
                draft.closeModalVisible = false;
                draft.id = '';
              })
            }
            type="bottom"
          >
            <BottomModal
              title={LANG('平仓')}
              confirmText={LANG('确认')}
              onConfirm={() => {
                Position.pollingPosition.stop();
                Position.closePositionById(mobileModal.id).finally(() => {
                  Position.pollingPosition.start();
                  setMobileModal(draft => {
                    draft.closeModalVisible = false;
                    draft.id = '';
                  });
                });
              }}
            >
              <div className="confirm-title">
                <YIcon.warningIcon />
                {LANG('请确认是否平仓')}
              </div>
            </BottomModal>
          </MobileModal>
          <MobileModal
            visible={mobileModal.reverseModalVisible}
            onClose={() =>
              setMobileModal(draft => {
                draft.reverseModalVisible = false;
                draft.id = '';
              })
            }
            type="bottom"
          >
            <BottomModal
              title={LANG('反向开仓')}
              confirmText={LANG('确认')}
              onConfirm={() => {
                Position.reverseOpenOrder(mobileModal.id).finally(() =>
                  setMobileModal(draft => {
                    draft.reverseModalVisible = false;
                    draft.id = '';
                  })
                );
              }}
            >
              <div className={`${theme} reverse-wrapper`}>
                <div className="reverse-title">{LANG('请确认是否一键反向开仓？')}</div>
                <div className="reverse-description">
                  {LANG(
                    '您当前操作是「反向开仓」，该操作将会对您当前持有的仓位以最新价格平仓，同时以仓位相同保证金，相同杠杆倍数，当前最新价格进行反反向开仓'
                  )}
                </div>
                <div className="reverse-tips">
                  <span>
                    <YIcon.tipsIcon />
                  </span>
                  {LANG('请注意：当行情剧烈波动时，平仓价格与反向开仓价格可能存在一些差异')}
                </div>
              </div>
            </BottomModal>
          </MobileModal>
        </Mobile>
        {shareModalData && (
          <ShareModal
            isBuy={shareModalData.buy}
            lever={shareModalData.lever}
            commodityName={shareModalData.commodityName}
            type={LANG('简易合约')}
            incomeRate={rate}
            currentPrice={marketMap[shareModalData.contract]?.price.toFormat(shareModalData.priceDigit)}
            opPrice={shareModalData.opPrice.toFormat(shareModalData.priceDigit)}
          />
        )}
        {settingModalData && <SettingModal tab={settingModalTab} setTab={setSettingModalTab} theme={theme} />}
        {addMarginModalData && <AddMarginModal balance={balance} theme={theme} isReal={isReal} />}
        <ShiftStopLossModal
          open={shiftStopLossModalState.visible}
          id={shiftStopLossModalState.id}
          commodity={shiftStopLossModalState.commodity}
          contract={shiftStopLossModalState.contract}
          shiftValue={shiftStopLossModalState.offset as string}
          onCancel={() => {
            setShiftStopLossModalState(draft => {
              draft.visible = false;
              draft.id = '';
              draft.offset = '';
            });
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default PositionTable;
const styles = css`
  :global(.liteName) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
  }
  :global(.lite-history-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-row) {
      :global(.ant-table-cell) {
        padding: 8px 0 !important;
        border-bottom: 1px solid var(--fill_line_1) !important;
      }
      :global(td) {
        font-size: 14px;
        font-weight: 500;
        background-color: transparent;
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }
      :global(.first-td) {
        padding-left: 20px;
        :global(span) {
          color: var(--text_1);
          font-family: 'Lexend';
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;

          &:last-child {
            font-weight: 400;
          }
        }
      }
      :global(.raise.first-td) {
        color: inherit;
        &:after {
          position: absolute;
          display: block;
          content: '';
          width: 4px;
          height: 100%;
          left: 0;
          top: 0;
          background: var(--color-green);
        }
      }
      :global(.fall.first-td) {
        color: inherit;
        &:after {
          position: absolute;
          display: block;
          content: '';
          width: 4px;
          height: 100%;
          left: 0;
          top: 0;
          background: var(--color-red);
        }
      }
      :global(.gray) {
        color: #798296;
      }
      :global(.yellow) {
        color: var(--skin-primary-color);
      }
      :global(.flex) {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      :global(.td-height) {
        height: 36px;
        justify-content: space-between;
      }
      :global(.orderNum, .addPos) {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }
    }
    :global(.order) {
      padding-left: 30px !important;
    }
    :global(.share) {
      cursor: pointer;
      margin-right: 15px;
    }
    :global(.actions) {
      gap: 4px;
      padding: 0 24px 0 0;
    }
    :global(.actions-group) {
      display: flex;
      gap: 16px;
      padding: 0 0 0 4px;
    }
    :global(.operationWrapper) {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      :global(.operationBtn) {
        height: 20px;
        box-sizing: border-box;
        line-height: 19px;
        text-align: center;
        font-size: 12px;
        padding: 0 12px;
        border-radius: 2px;
        cursor: pointer;
        font-weight: 500;

        &:disabled {
          background: #edeff2;
          border-color: transparent;
          color: #9a9a9a;
          cursor: not-allowed;
        }
      }
      :global(.closePositionBtn) {
        min-width: 52px;
        border-radius: 22px;
        background: var(--brand);
        color: var(--text_white);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        display: flex;
        height: 24px;
        justify-content: space-between;
        align-items: center;
        border: none;
      }
      :global(.settingBtn) {
        background: linear-gradient(91deg, #f7d54f, #eebd54);
        border: none;
        color: #fff;
      }
      :global(.addMarginBtn) {
        opacity: 0.7;
      }
      :global(.addMarginBtn.active) {
        opacity: 1;
        cursor: pointer;
      }
    }
    :global(.trailPriceWrapper) {
      justify-content: flex-start;
    }
    :global(.editShiftIcon) {
      color: var(--skin-primary-color);
      cursor: pointer;
      font-size: 12px;
      margin-left: 2px;
    }
  }
  :global(.reverse-title, .confirm-title) {
    color: var(--text_1);
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 150%; /* 21px */
  }
  :global(.confirm-title) {
    padding: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  :global(.reverse-description) {
    margin-top: 26px;
    color: #717b8f;
    text-align: center;
  }
  :global(.reverse-tips) {
    margin-top: 14px;
    color: var(--skin-primary-color);
    text-align: center;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  :global(.dark) {
    :global(.ant-table-row) {
      :global(td) {
        color: #c7c7c7 !important;
      }
    }
    :global(.settingBtn) {
      color: #333 !important;
    }
    :global(.reverse-title) {
      color: #fff;
    }
  }

  :global(.shiftLabel) {
    border-bottom: 1px dotted #798296;
    cursor: default;
  }
  :global(.customAlert) {
    :global(.alert-title, .reverse-title, .reverse-description, .reverse-tips) {
      text-align: left !important;
    }
    :global(.ant-modal-close) {
      color: var(--text_2);
      width: 24px;
      height: 24px;
      top: 24px;
      right: 24px;
      &:hover {
        color: var(--text_2);
        background: transparent !important;
      }
    }
    :global(.ant-modal-content) {
      padding: 24px !important;
      border-radius: 24px !important;
    }
    :global(.ant-modal-body) {
      background: transparent !important;
    }
    :global(.alert-content) {
      padding: 0 !important;
      margin: 0 auto !important;
      width: 100%;
    }
    :global(.reverse-title) {
      padding: 24px 0;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
    }
    :global(.reverse-description) {
      margin: 0;
      color: var(--text_2);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
    :global(.reverse-tips) {
      color: var(--yellow);
      font-size: 12px;
      font-weight: 400;
      line-height: 150%; /* 18px */
      margin: 24px 0;
      :global(span) {
        margin: 3px 0 0;
        display: inline-block;
        vertical-align: middle;
      }
    }
    :global(.ant-modal-footer) {
      margin-top: 0 !important;
      background: transparent !important;
    }
    :global(.ant-btn-primary) {
      border-radius: 40px;
      background: var(--text_brand);
      color: var(--text_white);
      font-size: 16px;
      font-weight: 500;
    }
  }
  @media ${MediaInfo.mobile} {
    .list-view {
      padding: 12px 1rem;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 4.5rem;
    }
    .position-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .item-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 2rem;
        .btn {
          flex: 1;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 22px;
          background: var(--brand);
          color: var(--text_white);
          font-size: 12px;
        }
        .share {
          width: 2rem;
          height: 2rem;
          border-radius: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--brand);
          :global(path) {
            fill: var(--text_white);
          }
        }
      }
    }
    :global(.confirm-title) {
      padding: 1rem 0;
    }
    :global(.reverse-wrapper) {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: flex-start;
      padding: 0 8px;
    }
    :global(.reverse-title) {
      padding: 0;
      line-height: normal;
    }
    :global(.reverse-description) {
      margin: 0;
      color: var(--text_2);
    }
    :global(.reverse-tips) {
      margin: 0;
      color: var(--yellow);
    }
  }
`;
