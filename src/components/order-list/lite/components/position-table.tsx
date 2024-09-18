import { AlertFunction } from '@/components/modal/alert-function';
import PlusIcon from '@/components/trade-ui/trade-view/lite/components/plus-icon';
import { getZendeskLink } from '@/components/zendesk';
import { useKycState, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, AccountType, Lite, LiteListItem, LiteTradeItem, TradeMap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { formatDefaultText, getActive } from '@/core/utils';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
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
  const [liteMap, setLiteMap] = useState<Map<string, LiteTradeItem>>();
  const [shiftStopLossModalState, setShiftStopLossModalState] = useImmer({
    visible: false,
    id: '',
    commodity: '',
    offset: '' as number | string,
  });
  const { isKyc } = useKycState();
  const { theme } = useTheme();
  const { locale } = useAppContext();
  const isLogin = Account.isLogin;

  useEffect(() => {
    TradeMap.getLiteTradeMap().then(async (list) => {
      setLiteMap(list);
    });
  }, []);

  const onClosePositionClicked = useCallback(
    (id: string) => {
      if (closeConfirm) {
        AlertFunction({
          title: LANG('提示'),
          content: LANG('请确认是否平仓'),
          okText: LANG('确认'),
          onOk: async () => {
            Position.closePositionById(id);
          },
          theme,
          v2: true,
        });
      } else {
        Position.closePositionById(id);
      }
    },
    [closeConfirm, theme]
  );

  const onReverseOpenOrderClicked = useCallback(
    (id: string) => {
      AlertFunction({
        title: LANG('提示'),
        v2: true,
        description: (
          <div className={theme}>
            <div className='reverse-title'>{LANG('请确认是否一键反向开仓？')}</div>
            <div className='reverse-description'>
              {LANG(
                '您当前操作是「反向开仓」，该操作将会对您当前持有的仓位以最新价格平仓，同时以仓位相同保证金，相同杠杆倍数，当前最新价格进行反反向开仓'
              )}
            </div>
            <div className='reverse-tips'>
              {LANG('请注意：当行情剧烈波动时，平仓价格与反向开仓价格可能存在一些差异')}
            </div>
          </div>
        ),
        okText: LANG('确认'),
        onOk: async () => {
          Position.reverseOpenOrder(id);
        },
        theme,
      });
    },
    [theme]
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
      return 300;
    } else {
      if (isSimulated) {
        return 280;
      }
      return 410;
    }
  }, [tableList, locale, isSimulated]);

  const columns = useMemo(() => {
    const col = [
      {
        title: LANG('合约'),
        dataIndex: 'contract',
        render: (_: any, { commodityName, currency, lever, buy }: LiteListItem) => {
          return (
            <div className={`first-td flex ${buy ? 'raise' : 'fall'}`}>
              <span>{commodityName.replace(currency, '')}</span>
              <span className='yellow'>{lever}X</span>
            </div>
          );
        },
      },
      {
        title: LANG('保证金'),
        dataIndex: 'margin',
      },
      {
        title: `${LANG('开仓价')}/${LANG('当前价')}`,
        dataIndex: 'opPrice',
        render: (_: any, { commodity, opPrice, priceDigit }: LiteListItem) => {
          const price = marketMap[commodity]?.price || 0;
          const prevPrice = marketMap[commodity]?.prevPrice || 0;
          return (
            <div className='flex'>
              <span>{opPrice?.toFormat(priceDigit)}</span>
              <span className={Number(price) >= Number(prevPrice) ? 'main-green' : 'main-red'}>
                {formatDefaultText(price.toFormat(priceDigit))}
              </span>
            </div>
          );
        },
      },
      {
        title: `${LANG('止盈价')}/${LANG('强平价')}`,
        dataIndex: 'opPrice',
        render: (_: any, item: LiteListItem) => {
          const { Fprice, Lprice } = Position.calculateProfitAndLoss(item);
          return (
            <div className='flex'>
              <span>{Fprice.toFormat(item.priceDigit)}</span>
              <span className='yellow'>{Lprice.toFormat(item.priceDigit)}</span>
            </div>
          );
        },
      },
      {
        title: `${LANG('订单盈亏')}(${LANG('盈亏比')})`,
        dataIndex: 'income',
        render: (_: any, item: LiteListItem) => {
          const { income, incomeRate } = Position.calculateIncome(item, marketMap);
          return (
            <div className={income >= 0 ? 'main-green' : 'main-red'}>
              <span>
                {income >= 0 ? '+' : ''}
                {income.toFixed(2)}
              </span>
              (
              <span>
                {incomeRate >= 0 ? '+' : ''}
                {incomeRate.toFixed(2)}%
              </span>
              )
            </div>
          );
        },
      },
      {
        title: LANG('开仓时间'),
        dataIndex: 'opTime',
        render: (_: any, { createTime }: LiteListItem) => {
          return (
            <div className='flex'>
              <span>{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>
            </div>
          );
        },
      },
      {
        title: LANG('开仓方式'),
        width: 120,
        dataIndex: 'placeSource',
        render: (_: any, item: LiteListItem) => getType(item),
      },
      {
        title: LANG('订单号'),
        dataIndex: 'id',
        width: 140,
        render: (id: string) => {
          return (
            <div>
              <span style={{ marginRight: '10px' }}>
                {id.slice(0, 5)}...
                {id.slice(id.length - 5)}
              </span>
              <Clipboard text={id} />
            </div>
          );
        },
      },
      {
        title: () => (
          <div>
            <Tooltip
              placement='topRight'
              title={
                <span
                  dangerouslySetInnerHTML={{
                    __html: LANG(
                      '移动止损的触发价格会跟随市场波动而变化，可以帮助您在波动行情中动态地锁定利润或减少损失。{more}',
                      {
                        more: `<a target={'_blank'} href="${getZendeskLink('/articles/6951123628943')}">${LANG(
                          '了解更多'
                        )}</a>`,
                      }
                    ),
                  }}
                />
              }
              arrow={false}
            >
              <span className='shiftLabel'>{LANG('移动止损(距离)')}</span>
            </Tooltip>
          </div>
        ),
        width: 160,
        dataIndex: 'trailPrice',
        render: (_: any, { trailPrice, id, commodity, buy, trailOffset }: LiteListItem) => {
          const price = Number(trailPrice.sub(marketMap[commodity]?.price || 0));
          return (
            <div className='operationWrapper trailPriceWrapper'>
              {trailPrice == 0 ? (
                <button
                  className='operationBtn closePositionBtn'
                  onClick={() => {
                    setShiftStopLossModalState((draft) => {
                      draft.visible = true;
                      draft.id = id;
                      draft.commodity = commodity;
                    });
                  }}
                >
                  <PlusOutlined />
                  {LANG('添加')}
                </button>
              ) : (
                <div>
                  {buy ? '<=' : '>='}
                  {trailPrice}
                  <span className={price >= 0 ? 'main-green' : 'main-red'}>({formatDefaultText(price)})</span>
                  <FormOutlined
                    className='editShiftIcon'
                    onClick={() => {
                      setShiftStopLossModalState((draft) => {
                        draft.visible = true;
                        draft.id = id;
                        draft.commodity = commodity;
                        draft.offset = trailOffset;
                      });
                    }}
                  />
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: LANG('操作'),
        align: 'right',
        fixed: 'right',
        width: tdWidth,
        render: (item: LiteListItem) => {
          const lite = liteMap?.get(item.commodity);
          const canAddMargin = lite ? item.lever > (isKyc ? lite?.lever2List[0] : lite?.lever0List[0]) : false;

          return (
            <div className='operationWrapper'>
              <button className='operationBtn closePositionBtn' onClick={() => onClosePositionClicked(item.id)}>
                {LANG('平仓')}
              </button>
              {!isSimulated && (
                <button
                  className='operationBtn closePositionBtn'
                  disabled={!isReal}
                  onClick={() => onReverseOpenOrderClicked(item.id)}
                >
                  {LANG('反向开仓')}
                </button>
              )}
              <button className='operationBtn settingBtn fix-v2-btn' onClick={() => Position.setSettingModalData(item)}>
                {LANG('设置')}
              </button>
              <button
                className={`addMarginBtn ${getActive(canAddMargin)}`}
                onClick={() => Position.setAddMarginModalData(canAddMargin ? item : null)}
              >
                <PlusIcon width='10.4px' height='10.4px' color={canAddMargin ? '#fff' : '#9a9a9a'} />
              </button>
              <Image
                src='/static/images/lite/share.png'
                className='share'
                width={20}
                height={20}
                alt=''
                onClick={() => {
                  Position.setShareModalData(item);
                }}
              />
            </div>
          );
        },
      },
    ];

    if (isSimulated) {
      col.splice(-2, 1);
    }
    return col;
  }, [marketMap, locale, tableList]);

  const rate = useMemo(() => {
    if (shareModalData) {
      const { incomeRate } = Position.calculateIncome(shareModalData, marketMap);
      return Number(incomeRate.toFixed(2));
    }
    return 0;
  }, [shareModalData, marketMap]);

  return (
    <>
      <div className='container'>
        <RecordList
          loading={loading}
          columns={columns}
          data={tableList}
          className={`${theme} lite-history-table`}
          scroll={tableList.length > 0 ? { x: 1400, y: 500 } : undefined}
        />
        {shareModalData && (
          <ShareModal
            isBuy={shareModalData.buy}
            lever={shareModalData.lever}
            commodityName={shareModalData.commodityName}
            type={LANG('Contract ID')}
            incomeRate={rate}
            currentPrice={marketMap[shareModalData.commodity]?.price.toFormat(shareModalData.priceDigit)}
            opPrice={shareModalData.opPrice.toFormat(shareModalData.priceDigit)}
          />
        )}
        {settingModalData && <SettingModal tab={settingModalTab} setTab={setSettingModalTab} theme={theme} />}
        {addMarginModalData && <AddMarginModal balance={balance} theme={theme} isReal={isReal} />}
        <ShiftStopLossModal
          open={shiftStopLossModalState.visible}
          id={shiftStopLossModalState.id}
          commodity={shiftStopLossModalState.commodity}
          shiftValue={shiftStopLossModalState.offset as string}
          onCancel={() => {
            setShiftStopLossModalState((draft) => {
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
  :global(.lite-history-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-row) {
      :global(td) {
        padding: 2px 5px !important;
        padding-left: 0 !important;
        font-size: 14px;
        color: #666 !important;
        font-weight: 500;
        background-color: var(--theme-background-color-1);
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }
      :global(.first-td) {
        position: relative;
        padding-left: 20px;
        :global(span) {
          &:last-child {
            font-size: 12px;
            margin-top: 4px;
          }
        }
        &:before {
          position: absolute;
          display: block;
          content: '';
          width: 3px;
          height: 24px;
          left: 1px;
          background: 0 0;
          border-top: 2.4px solid transparent;
          border-bottom: 2.4px solid transparent;
          border-right: 2.4px solid transparent;
        }
      }
      :global(.raise.first-td) {
        color: inherit;
        &:before {
          border-left: 3px solid var(--color-green);
        }
      }
      :global(.fall.first-td) {
        color: inherit;
        &:before {
          border-left: 3px solid var(--color-red);
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
    }
    :global(.order) {
      padding-left: 30px !important;
    }
    :global(.share) {
      cursor: pointer;
      margin-right: 15px;
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
        margin-right: 12px;
        &:disabled {
          background: #edeff2;
          border-color: transparent;
          color: #9a9a9a;
          cursor: not-allowed;
        }
      }
      :global(.closePositionBtn) {
        background: transparent;
        border: 1px solid var(--skin-primary-color);
        color: var(--skin-primary-color);
      }
      :global(.settingBtn) {
        background: linear-gradient(91deg, #f7d54f, #eebd54);
        border: none;
        color: #fff;
      }
      :global(.addMarginBtn) {
        width: 20px;
        height: 20px;
        border: none;
        outline: none;
        display: flex;
        cursor: not-allowed;
        jusitify-content: center;
        align-items: center;
        margin-right: 12px;
        border-radius: 3px;
        background: #edeff2;
      }
      :global(.addMarginBtn.active) {
        background: var(--skin-primary-color);
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
  :global(.reverse-title) {
    font-size: 18px;
    color: #333;
    text-align: center;
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
  :global(.ant-tooltip-inner),
  :global(.ant-tooltip-arrow:before) {
    background: var(--theme-background-color-2-3) !important;
  }
  :global(.ant-tooltip-inner) {
    :global(a) {
      color: var(--skin-primary-color) !important;
    }
  }
  :global(.shiftLabel) {
    border-bottom: 1px dotted #798296;
    cursor: default;
  }
`;
