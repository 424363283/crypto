import { BlockUrl } from '@/components/block-url';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { MediaInfo, message, switchBlockUrl } from '@/core/utils';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { StatusButton } from '../status-button';
import WithdrawDetailModal from '../withdraw-detail-modal';
import Tooltip from '@/components/trade-ui/common/tooltip';
import clsx from 'clsx';
import { useResponsive } from '@/core/hooks';

type RechargeItem = {
  address: string;
  addressTag: string | null;
  addressUrl: string | null;
  amount: number;
  chain: string;
  channel: string | null;
  charge: number;
  confirm: number;
  confirmMin: number | null;
  createTime: number;
  currency: string;
  exrate: number;
  finishTime: number;
  id: string;
  network: string;
  price: number;
  sourceAmount: number;
  sourceCurrency: string;
  status: number;
  txUrl: string | null;
  txid: string | null;
};

export const useRechargeColumns = () => {
  const { isMobile } = useResponsive();
  const formatBankCard = (bankCard = '') => {
    return bankCard?.length <= 50 ? (
      bankCard
    ) : (
      <ProTooltip title={bankCard}>{`${bankCard?.slice(0, 15)}...${bankCard?.slice(
        bankCard.length - 15,
        bankCard.length
      )}`}</ProTooltip>
    );
  };

  const { locale } = useAppContext();
  const onCopy = (_text: string, bool: boolean, text: string) => {
    // 不全等
    if (text == _text && bool) {
      message.success(LANG('复制成功'), 1);
    } else {
      message.error(LANG('复制失败'), 1);
    }
  };

  const columns = [
    {
      title: LANG('充币时间'),
      dataIndex: 'createTime',
      render: (value: number) => {
        return (
          <div style={{ fontSize: '14px' }} className={'fw-300'}>
            {dayjs(value).format('YYYY/MM/DD HH:mm:ss')}
          </div>
        );
      },
      className: 'first-col',
      width: 180,
    },
    {
      title: LANG('类型'),
      render: () => {
        return <div className={locale === 'zh' ? '' : 'fw-300'}>{LANG('充币')}</div>;
      },
      width: 100,
    },
    {
      title: LANG('币种'),
      dataIndex: 'currency',
      render: (value: string, item: RechargeItem) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CoinLogo coin={value} width={18} key={value} height={18} />
            <span>{value}</span>
            {item.sourceCurrency !== item.currency && <Tooltip
              placement='topRight'
              arrow={false}
              title={LANG('由于充值源头币种与实际到账币种不一致，实际到账时会转换为USDT。')}
            >
              <CommonIcon name='common-info-0' size={16} />
            </Tooltip>}
          </div>
        );
      },
      width: 130,
    },
    {
      title: LANG('充币数量'),
      render: (val: RechargeItem, item: RechargeItem) => {
        let formatMoney = item?.amount?.toFormat();
        return (
          <div className={'fw-300'}>
            {formatMoney} {item.currency}
          </div>
        );
      },
      width: 180,
    },
    {
      title: LANG('充币地址'),
      render: (val: RechargeItem, item: any) => {
        const transactionDetailsUrl = item.txUrl + item.txid;
        const addressDetailUrl = item.addressUrl + item.address;
        const bankCard = formatBankCard(item?.address) || '--';
        return (
          <div className={'addressBox'} style={{ fontSize: '12px' }}>
            <div className={'address fw-300'} style={{ whiteSpace: 'nowrap' }}>
              <span className='address-url' onClick={() => { addressDetailUrl && window.open(addressDetailUrl, '_blank') }} >{bankCard}</span>
              {item.address && (
                <CopyToClipboard text={item.address} onCopy={(_text, bool) => onCopy(_text, bool, item?.address)}>
                  <div className='copy-btn'>
                    <CommonIcon size={12} name='common-copy' />
                  </div>
                </CopyToClipboard>
              )}
            </div>
            {item.address !== '' && item.status === 1 && item?.txid?.length !== 32 && (
              <BlockUrl onBlockUrlClick={() => { transactionDetailsUrl && window.open(transactionDetailsUrl, '_blank') }} url='' />
            )}
            <style jsx>{styles}</style>
          </div>
        );
      },
    },
    {
      title: LANG('状态'),
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (value: number) => {
        const status = value ? value : 0;
        return <StatusButton status={status} />;
      },
    },
    {
      title: LANG('操作'),
      dataIndex: 'id',
      width: 120,
      align: 'right',
      render: (value: any, row: any) => {
        return <WithdrawDetailModal data={row} type={0} />;
      },
    },
  ];
  return columns;
};

const styles = css`
  .addressBox {
    display: flex;
    .address {
      display: flex;
      align-items: center;
      @media ${MediaInfo.mobileOrTablet} {
        justify-content: end;
      }
      .address-url {
        color: var(--text-primary);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px; /* 100% */
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-skip-ink: auto;
        text-decoration-thickness: auto;
        text-underline-offset: auto;
        text-underline-position: from-font;
        cursor: pointer;
      }
      .copy-btn {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        border-radius: 6px;
      }
    }
  }

`;
