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
      render: (value: string) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CoinLogo coin={value} width={18} key={value} height={18} />
            <span>{value}</span>
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
            {formatMoney} {item.sourceCurrency}
          </div>
        );
      },
      width: 180,
    },
    {
      title: LANG('充币地址'),
      render: (val: RechargeItem, item: any) => {
        const { web, url } = switchBlockUrl(item);
        let arrowFunction = web === '' ? () => {} : () => window.open(web + '?from=y-mex', '_blank');
        const bankCard = formatBankCard(item?.address) || '--';
        return (
          <div className={'addressBox'} style={{ fontSize: '12px' }}>
            <div className={'address fw-300'} style={{ whiteSpace: 'nowrap' }}>
              {bankCard}
              {item.address && (
                <CopyToClipboard text={item.address} onCopy={(_text, bool) => onCopy(_text, bool, item?.address)}>
                  <div className='copy-btn'>
                    <CommonIcon size={8} name='common-copy-2-grey-0' />
                  </div>
                </CopyToClipboard>
              )}
            </div>
            {item.address !== '' && item.status === 1 && item?.txid?.length !== 32 && (
              <BlockUrl onBlockUrlClick={arrowFunction} url={url} />
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
  .addressBox .address {
    display: flex;
    align-items: center;
    @media ${MediaInfo.mobileOrTablet} {
      justify-content: end;
    }
    .copy-btn {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      margin-left: 6px;
      padding: 4px;
      border-radius: 6px;
      background-color: var(--theme-background-color-disabled-light);
    }
  }
`;
