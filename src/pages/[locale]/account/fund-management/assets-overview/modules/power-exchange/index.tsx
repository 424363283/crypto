import { Button } from '@/components/button';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import Nav from '@/components/nav';
import { RateText } from '@/components/rate-text';
import { DesktopOrTablet } from '@/components/responsive';
import Table from '@/components/table';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { applyConvertCoinApi, getAccountConvertPointAssetsListApi } from '@/core/api';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo, Polling, message } from '@/core/utils';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

type ConvertAssetsList = {
  balance: number;
  currency: string;
  points: number;
  value: number;
};

export default function PowerExchange() {
  const [convertAssetsList, setConvertAssetsList] = useState<ConvertAssetsList[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useResponsive();

  const getConvertPointAssetsList = async () => {
    setIsLoading(true);
    const res = await getAccountConvertPointAssetsListApi();
    if (res?.code === 200) {
      setConvertAssetsList(res?.data || []);
      setIsLoading(false);
    } else {
      message.error(res.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const polling = new Polling({
      interval: 30000,
      callback: getConvertPointAssetsList,
    });
    polling.start();
    return () => polling.stop();
  }, []);

  // 生成plainOptions数组
  const plainOptions = convertAssetsList.map((item) => item.currency);

  const checkAll = plainOptions.length === checkedList.length && plainOptions.length !== 0 && checkedList.length !== 0;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  const onCheckboxChange = (e: CheckboxChangeEvent, currency: string) => {
    if (e.target.checked) {
      setCheckedList((prev) => [...prev, currency]);
    } else {
      setCheckedList((prev) => prev.filter((item) => item !== currency));
    }
  };
  const TooltipContent = () => {
    return (
      <div className='tooltip-content'>
        <p
          className='tooltip-desc'
          dangerouslySetInnerHTML={{
            __html: LANG(
              '算力是{brand}平台的权益通行证，可用于参与空投奖励、算力商城购买商品、转盘抽奖以及竞猜等多种玩法，具体规则可前往APP的算力中心查看。',
              {
                brand: `<span  style='color: var(--skin-main-font-color);'>YMEX</span>`,
              }
            ),
          }}
        ></p>
        <br />
        <p>{LANG('兑换规则')}</p>
        <p>{LANG('1. 总资产估值低于10 USDT且大于0.1 USDT的币种才可兑换')}</p>
        <p>{LANG('2. 24H内仅可兑换1次')}</p>
        <p>{LANG('3. 不支持兑换已下架交易对或币种')}</p>
        <p>{LANG('4. 兑换算力不收取手续费')}</p>
      </div>
    );
  };
  const columns = [
    {
      title: (
        <>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}></Checkbox>
          <span style={{ marginLeft: '10px' }}>{LANG('名称')}</span>
        </>
      ),
      align: 'left',
      dataIndex: 'currency',
      width: '25%',
      render: (value: string, item: any) => (
        <div className='currency-wrap'>
          <Checkbox checked={checkedList.includes(value)} onChange={(e) => onCheckboxChange(e, value)} />
          <DesktopOrTablet>
            <CoinLogo coin={value} width={20} height={20} style={{ margin: '0 5px 0 10px' }} />
          </DesktopOrTablet>
          <div className='coin-name-wrapper'>
            <span className='name'>{value}</span>
            <DesktopOrTablet>
              <span className='sur-name'>{item?.name || '--'}</span>
            </DesktopOrTablet>
          </div>
        </div>
      ),
    },
    {
      title: LANG('可用余额'),
      width: '35%',
      dataIndex: 'balance',
      render(value: string, item: any) {
        return (
          <div style={{ wordBreak: 'break-all', marginRight: '20px' }}>
            <RateText money={value} formatWithScale currency={item?.currency} />
          </div>
        );
      },
    },
    {
      title: LANG('USDT估值'),
      width: '20%',
      dataIndex: 'value',
      render(value: string) {
        return (
          <span className='value' style={{ wordBreak: 'break-all' }}>
            {value?.toFormat(4) || '--'}
          </span>
        );
      },
    },
    {
      title: (
        <Tooltip title={<TooltipContent />} placement='bottom'>
          <span className='tooltip-label'>{LANG('可兑换算力')}</span>
        </Tooltip>
      ),
      width: '20%',
      align: 'right',
      dataIndex: 'points',
      render(value: string) {
        return <span className='points'>≈{value || '--'}</span>;
      },
    },
  ];
  const applyConvertCoin = async () => {
    Loading.start();
    const res = await applyConvertCoinApi({
      currencies: checkedList,
    });
    if (res.code === 200) {
      AlertFunction({
        title: LANG('完成兑换'),
        closable: false,
        width: 460,
        description: (
          <div className='confirm-content'>
            <CommonIcon name='common-complete-done-0' size={64} className='complete-icon' />
            <p>{LANG('您已兑换')}</p>
            <p>
              <span className='count'>{calculatePoints()}</span> {LANG('算力')}
            </p>
          </div>
        ),
        cancelButtonProps: { style: { display: 'none' } },
        centered: !isMobile,
        placeBottom: isMobile,
      });
      setCheckedList([]);
      await getConvertPointAssetsList();
    } else {
      message.error(res.message);
    }
    Loading.end();
  };
  const onExchangeBtnClick = () => {
    AlertFunction({
      title: LANG('确认兑换算力'),
      width: 460,
      closable: false,
      description: (
        <div className='confirm-content'>
          <p className='title'>{LANG('您将获得')}</p>
          <p className='power-area'>
            ≈<span className='value'>{calculatePoints()} </span>
            <span className='label'>{LANG('算力')}</span>
          </p>
          <div className='selected-content'>
            <div className='row'>
              <div className='label'>{LANG('选择币种')}</div>
              <div className='value'>{checkedList.join(',')}</div>
            </div>
            <div className='row'>
              <div className='label'>{LANG('手续费')}</div>
              <div className='fee'>0 {LANG('手续费')}</div>
            </div>
          </div>
        </div>
      ),
      cancelButtonProps: { style: { display: 'none' } },
      centered: !isMobile,
      placeBottom: isMobile,
      onOk: applyConvertCoin,
    });
  };
  const calculatePoints = () => {
    const checkedItem = convertAssetsList.filter((item) => {
      return checkedList.includes(item.currency);
    });
    // 对checkedItem数组的points字段的值进行累加
    const sumPoints = checkedItem.reduce((prev, item) => {
      return prev + item.points;
    }, 0);
    return sumPoints;
  };
  return (
    <div className='power-exchange-container'>
      <div className='header-area'>
        <Nav title={LANG('小额兑换算力')} />
        <div className='right-area'>
          <CommonIcon name='common-history-record-0' size={16} enableSkin style={{ marginRight: '4px' }} />
          <TrLink
            className='label'
            href='/account/fund-management/assets-overview'
            query={{ type: query.type, module: 'power-exchange-record' }}
          >
            {LANG('兑换记录')}
          </TrLink>
        </div>
      </div>
      <div className='main-content'>
        <div className='inner-content'>
          <div className='top-content'>
            <div className='tips-area'>
              <CommonIcon name='common-colorful-tooltip-0' size={12} enableSkin className='tooltip-icon' />
              {LANG('总资产估值低于 10 USDT且大于0.1 USDT的币种才可兑换，24H内仅可兑换一次')}
            </div>
            <Table loading={isLoading} dataSource={convertAssetsList} columns={columns} pagination={false} virtual />
          </div>
          <div className='footer-area'>
            <div
              className='left-area'
              dangerouslySetInnerHTML={{
                __html: LANG('已选 {num} 个，您将获得 {count} 算力', {
                  num: `<span style='color: var(--skin-main-font-color);'>${checkedList.length}</span>`,
                  count: `<span style='color: var(--skin-main-font-color);font-size: 20px;font-weight: 600;'>${calculatePoints()}</span>`,
                }),
              }}
            ></div>
            <div className='right-area'>
              <Button
                type='primary'
                onClick={onExchangeBtnClick}
                className='exchange-btn'
                disabled={checkedList.length === 0}
              >
                {LANG('兑换')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .power-exchange-container {
    background-color: var(--theme-background-color-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    height: 100%;
    @media ${MediaInfo.mobile} {
      padding: 15px 10px 22px;
    }
    .header-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      @media ${MediaInfo.mobile} {
        padding: 15px 5px 15px;
      }
      :global(.nav-title) {
        padding-bottom: 0px;
      }
      .title {
        font-size: 20px;
        font-weight: 500;
        color: var(--theme-font-color-6);
        padding-bottom: 21px;
      }

      .right-area {
        display: flex;
        align-items: center;
        :global(.label) {
          color: var(--skin-primary-color);
        }
      }
    }
    .main-content {
      height: 100%;
      padding: 0 20px 20px;
      .inner-content {
        border: 1px solid var(--theme-border-color-2);
        display: flex;
        height: calc(100vh - 180px);
        flex-direction: column;
        justify-content: space-between;
        border-radius: 8px;
        padding: 20px;
        @media ${MediaInfo.tablet} {
          padding: 20px 14px 20px;
        }
        @media ${MediaInfo.mobile} {
          padding: 10px 0 0;
          border: none;
        }
        .top-content {
          overflow-y: scroll;
          margin-bottom: 30px;
          .tips-area {
            background-color: var(--skin-primary-bg-color-opacity-1);
            padding: 10px;
            font-size: 12px;
            display: flex;
            align-items: center;
            color: var(--skin-main-font-color);
            border-radius: 5px;
            :global(.tooltip-icon) {
              margin-right: 6px;
            }
          }
          :global(.common-table .ant-table-container .ant-table-cell) {
            :global(.currency-wrap) {
              display: flex;
              align-items: center;
              :global(.coin-name-wrapper) {
                display: flex;
                flex-direction: column;
                :global(.name) {
                  color: var(--theme-font-color-1);
                  font-size: 14px;
                  @media ${MediaInfo.mobile} {
                    padding-left: 10px;
                  }
                }
                :global(.sur-name) {
                  color: #9e9e9d;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      @media ${MediaInfo.mobile} {
        padding: 0;
      }

      .footer-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media ${MediaInfo.mobile} {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .right-area {
            width: 100%;
            margin-top: 10px;
            :global(.exchange-btn) {
              padding: 10px 50px;
              width: 100%;
            }
          }
        }
        :global(.left-area) {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
        }
        .right-area {
          :global(.exchange-btn) {
            padding: 10px 50px;
          }
        }
      }
    }
  }
  :global(.tooltip-label) {
    border-bottom: 1px solid #9e9e9d;
  }
  :global(.ant-tooltip .tooltip-content) {
    font-size: 14px;
    color: var(--theme-font-color-1);
    :global(p) {
      margin-bottom: 4px;
    }
  }
  :global(.common-table.mobile .ant-table-cell) {
    padding: 16px 0;
  }
  :global(.ant-modal-content .ant-modal-body .alert-content) {
    :global(.alert-title) {
      font-size: 24px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    :global(.alert-description .confirm-content) {
      :global(.title) {
        font-size: 16px;
        font-weight: 500;
      }
      :global(.power-area) {
        :global(.value) {
          font-size: 40px;
          font-weight: 600;
          color: var(--skin-main-font-color);
        }
        :global(.label) {
          color: var(--theme-font-color-1);
          font-size: 16px;
        }
      }
      :global(.complete-icon) {
        margin-bottom: 20px;
      }
      :global(.count) {
        font-size: 20px;
        font-weight: 600;
      }
      :global(.selected-content) {
        background-color: var(--theme-background-color-3);
        padding: 10px;
        border-radius: 5px;
        :global(.row) {
          display: flex;
          justify-content: space-between;
          :global(.fee) {
            color: var(--skin-primary-color);
            font-size: 14px;
          }
          :global(.label) {
            min-width: 100px;
            text-align: left;
          }
          :global(.value) {
            color: var(--theme-font-color-1);
            font-size: 14px;
            word-break: break-all;
            text-align: right;
          }
        }
      }
    }
  }
`;
