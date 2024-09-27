/** 现货表格colums */
import CommonIcon from '@/components/common-icon';
import { RateText } from '@/components/rate-text';
import { useResponsive } from '@/core/hooks';
import { LANG, TrLink, TradeLink } from '@/core/i18n';
import { SpotItem } from '@/core/shared';
import { Dropdown, Menu } from 'antd';
import { memo, useState } from 'react';
import { CustomCodeNameMemo } from '../coin-name';
import { useCoinOperateOptions } from './useCoinOperateOptions';

type UseSpotTableColumnsProps = {
  data: any;
};

const CustomTotalAssetsColumn = ({
  code,
  id,
  total,
  maxScale,
}: {
  code: string;
  id: string;
  total: string;
  maxScale: number;
}) => {
  if (code === 'Y-MEX' && !id) {
    return (
      <div className={'money-box'}>
        <div className='current'>{total} Y-MEX</div>
      </div>
    );
  } else {
    const money = total?.toFormat(maxScale);
    return (
      <div className='money-box'>
        <div className='current'>{`${money}`} </div>
        <div className='target'>
          ≈ <RateText money={total} currency={code} suffix showCurrencySymbol useFormat />
        </div>
      </div>
    );
  }
};

const CustomTotalAssetsColumnMemo = memo(CustomTotalAssetsColumn);
const OPERATE_BUTTONS: { [key: string]: any } = {
  trade: {
    key: 'trade',
    label: LANG('交易'),
    link: '',
  },
  recharge: {
    key: 'recharge',
    label: LANG('充币'),
    link: '/account/fund-management/asset-account/recharge',
  },
  withdraw: {
    key: 'withdraw',
    label: LANG('提币'),
    link: '/account/fund-management/asset-account/withdraw',
  },
  transfer: {
    key: 'transfer',
    label: LANG('转账'),
    link: '/account/fund-management/asset-account/transfer/',
  },
  convert: {
    key: 'convert',
    label: LANG('闪兑'),
    link: '',
  },
};
export const useSpotTableColumns = ({ data }: UseSpotTableColumnsProps) => {
  const [operateOptions] = useCoinOperateOptions();
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const coinSize = isDesktop ? 30 : 26;
  const buttonCounts = isDesktop ? 3 : isTablet ? 1 : 0;
  const [coin, setCoin] = useState('');
  const onBtnClick = (evt: React.MouseEvent, key: string, coin: string) => {
    if (key === 'convert') {
      evt.preventDefault();
      evt.stopPropagation();
      setCoin(coin);
      setConvertModalVisible(true);
    }
  };
  const renderOperateButtons = (value: SpotItem) => {
    // 首先获取当前coin的所有操作按钮,然后按照交易-充币-提币-转账-闪兑的顺序排列，当大于三个按钮时使用dropdown显示
    const { code, trade } = value;
    const result = Object.keys(operateOptions).filter((key: string) => (operateOptions as any)[key].includes(code));
    // 闪兑和交易需要排除USDT
    if (result.includes('convert') && code === 'USDT') result.splice(result.indexOf('convert'), 1);
    if (trade && code !== 'USDT') result.unshift('trade');
    const sortedOptions = [...result].sort((a, b) => {
      const targetOrder = ['trade', 'recharge', 'withdraw', 'transfer', 'convert'];
      return targetOrder.indexOf(a) - targetOrder.indexOf(b);
    });
    // 如果大于三个按钮，使用dropdown显示最后一个按钮
    if (sortedOptions.length > buttonCounts) {
      const menuItems = sortedOptions.slice(buttonCounts).map((item: string) => {
        const { key, label, link } = OPERATE_BUTTONS[item];
        return (
          <Menu.Item key={key}>
            {key === 'trade' ? (
              <TradeLink id={`${code}_usdt`} native className='operate-button'>
                {label}
              </TradeLink>
            ) : (
              <TrLink
                href={`${link}`}
                query={{ code }}
                className='operate-button'
                onClick={(evt: React.MouseEvent) => onBtnClick(evt, key, code)}
              >
                {label}
              </TrLink>
            )}
          </Menu.Item>
        );
      });
      const menu = <Menu>{menuItems}</Menu>;
      return (
        <>
          {sortedOptions.slice(0, buttonCounts).map((item: string) => {
            const { key, label, link } = OPERATE_BUTTONS[item];
            return key === 'trade' ? (
              <TradeLink id={`${code}_usdt`} native className='operate-button'>
                {label}
              </TradeLink>
            ) : (
              <TrLink
                key={key}
                className='operate-button'
                native
                href={`${link}`}
                query={{ code }}
                onClick={(evt: React.MouseEvent) => onBtnClick(evt, key, code)}
              >
                {label}
              </TrLink>
            );
          })}
          <Dropdown overlay={menu} trigger={['hover']}>
            <CommonIcon name='common-more-option-0' size={16} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </>
      );
    }
    return sortedOptions.map((item: string) => {
      const { key, label, link } = OPERATE_BUTTONS[item];
      return key === 'trade' ? (
        <TradeLink id={`${code}_usdt`} className='operate-button' native>
          {label}
        </TradeLink>
      ) : (
        <TrLink key={key} className='operate-button' href={`${link}`} query={{ code: code }}>
          {label}
        </TrLink>
      );
    });
  };

  const columns = [
    {
      title: LANG('币种名称'),
      dataIndex: 'code',
      key: 'code',
      hideTitle: true,
      width: '20%',
      sorter:
        data.length > 0
          ? {
              compare: (a: SpotItem, b: SpotItem) => String(a.code).localeCompare(String(b.code)),
            }
          : false,
      render: (code: string, item: SpotItem) => {
        let iconCode = code?.replace(/\d+(L|S)$/i, '');
        iconCode = iconCode === 'B' ? 'BTC' : iconCode;
        if (isMobile) {
          return (
            <div className='code-name-header'>
              <CustomCodeNameMemo iconCode={iconCode} code={item.code} fullName={item.fullname} coinSize={coinSize} />
              {renderOperateButtons(item)}
            </div>
          );
        }
        return <CustomCodeNameMemo iconCode={iconCode} code={item.code} fullName={item.fullname} coinSize={coinSize} />;
      },
    },
    {
      title: LANG('全部资产'),
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      sorter:
        data.length > 0
          ? {
              compare: (a: SpotItem, b: SpotItem) => Number(a.targetU) - Number(b.targetU),
            }
          : false,
      render: (total: string, item: SpotItem) => {
        return (
          <CustomTotalAssetsColumnMemo code={item.code} id={item.id || ''} maxScale={item?.scale || 2} total={total} />
        );
      },
    },
    {
      title: LANG('可用资产'),
      dataIndex: 'balance',
      key: 'balance',
      width: '20%',
      sorter:
        data.length > 0
          ? {
              compare: (a: SpotItem, b: SpotItem) => Number(a.targetU) - Number(b.targetU),
            }
          : false,
      render: (money: number, item: SpotItem) => {
        if (item.code === 'Y-MEX' && !item.id) {
          return <div />;
        }
        return (
          <div className='money-box'>
            <div className='current'>{`${money?.toFormat(item.scale || 2)}`} </div>
          </div>
        );
      },
    },
    {
      title: LANG('冻结余额'),
      dataIndex: 'frozen',
      key: 'frozen',
      width: '20%',
      sorter:
        data.length > 0
          ? {
              compare: (a: SpotItem, b: SpotItem) => Number(a.frozen) - Number(b.frozen),
            }
          : false,
      render: (freeze: number, item: SpotItem) => {
        if (item.code === 'Y-MEX' && !item.id) {
          return <div />;
        }
        return (
          <div className='money-box'>
            <div className='current'>{`${freeze?.toFormat(item?.scale || 2)}`} </div>
          </div>
        );
      },
    },
    {
      title: LANG('操作'),
      key: 'operation',
      align: 'left',
      width: '20%',
      hideColumn: true,
      render: (value: SpotItem, item: SpotItem) => {
        return <div className='right-box'>{renderOperateButtons(item)}</div>;
      },
    },
  ];
  return {
    columns,
    coin,
    convertModalVisible,
    setConvertModalVisible,
  } as {
    columns: any[];
    coin: string;
    convertModalVisible: boolean;
    setConvertModalVisible: (visible: boolean) => void;
  };
};
