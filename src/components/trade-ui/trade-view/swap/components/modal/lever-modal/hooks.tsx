import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Input from '@/components/trade-ui/trade-view/components/input';
import YIcon from '@/components/YIcons';
import { Loading } from '@/components/loading';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { message } from '@/core/utils';
import Slider from '@/components/Slider';
import { clsx, styles } from './styled';
import CommonIcon from '@/components/common-icon';
import { Layer } from '@/components/constants';

const formatLeverList = ({ leverageConfig, maxLever }: { leverageConfig: any; maxLever: any }) => {
  const leverList = leverageConfig
    ? leverageConfig.reduce((acc: any, value: any) => {
        acc[value] = `${value}x`;
        return acc;
      }, {})
    : [];
  // if (leverList[leverList.length - 1] !== maxLever) {
  //   leverList.push(maxLever);
  // }

  return leverList;
};
export const useLeverModal = ({ visible }: { visible: boolean }) => {
  const { isDark } = useTheme();
  const { lever, symbol, side, pid } = Swap.Trade.store.modal.leverData;
  const cryptoData = Swap.Info.getCryptoData(symbol);
  const riskList = Swap.Info.getRiskListData(symbol);
  const { isMobile } = useResponsive();
  const [maxVolume, setMaxVolume] = useState(0); // 最大可开
  const [value, setValue] = useState(lever);
  const code = cryptoData?.settleCoin;
  const maxLever = cryptoData?.leverageLevel || 0;
  // const leverList = formatLeverList({ leverageConfig: cryptoData.leverageConfig, max: maxLever });
  const onClose = () => Swap.Trade.setModal({ leverVisible: false, leverModalData: {} });

  const leverageConfig = cryptoData?.leverageConfig;
  const leverList = formatLeverList({ leverageConfig, maxLever });
  // 计算最大可开
  const _upateMaxVolume = () => {
    const next = Number(value);

    if (!Number.isNaN(next) && riskList.length) {
      [{ maxUserLeverage: 0 }, ...riskList]?.some((item, index, arr) => {
        if (index !== arr.length - 1) {
          const item2: any = arr[index + 1];
          if (next > item.maxUserLeverage && next <= item2.maxUserLeverage) {
            setMaxVolume(item2?.maxVolume);
            return true;
          }
        }
        return false;
      });
    }
  };

  const _onConfirm = async () => {
    if (lever === value) return onClose();
    Loading.start();
    try {
      const result = await Swap.Info.updateLever(Swap.Trade.base.isUsdtType, { id: symbol, lever: value, side: side, pid });
      Swap.Trade.initQuote();
      if (result.code === 200) {
        Swap.Order.fetchPosition(Swap.Trade.base.isUsdtType);
        Swap.Order.fetchPending(Swap.Trade.base.isUsdtType);
        message.success(LANG('杠杆修改成功'));

        Swap.Trade.clearInputVolume();
        Swap.Trade.setModal({ leverVisible: false, leverModalData: {} });
        // 更新账户资产
        Account.assets.getAllSpotAssets(true);
        Account.assets.getPerpetualUAsset();
        Swap.Trade.initQuote();

        return true;
      } else {
        message.error(result);
      }
    } catch (err: any) {
      if (err?.error?.code === '100012') {
        message.error(LANG('调低杠杆需要更多的起始保证金。由于当前可用保证金不足，不支持调低杠杆。'));
      } else {
        message.error(err);
      }
    } finally {
      Loading.end();
    }
  };

  useEffect(() => {
    _upateMaxVolume();
  }, [riskList, value]);

  useEffect(() => {
    if (visible && lever) {
      setValue(lever);
      Swap.Info.fetchRiskList(symbol.toLowerCase());
    }
  }, [visible, lever]);
  const error = value > maxLever;
  const content = (
    <>
      <div className={clsx('lever-modal', !isDark && 'light')}>
        <Input
          controllerV2
          focusActive
          className={clsx('input', error && 'error')}
          style={{ width: '50%', textAlign: 'right' }}
          type={'number'}
          value={value}
          // label={LANG('杠杆')}
          onChange={(e: any) => {
            setValue(e);
          }}
          max={maxLever}
          min={1}
          digit={0}
          step={1}
          suffix={<span>x</span>}
        />
        <div className={clsx('lever-slider')}>
          <Slider marks={leverList} value={value} onChange={e => setValue(e)} min={1} max={maxLever} layer={Layer.Overlay}/>
        </div>
        <div className={clsx('max-info')}>
          <div>{LANG('当前杠杆倍数最大可开')}：</div>
          <span>
            {maxVolume}&nbsp;&nbsp;{code}
          </span>
        </div>
      </div>
      {styles}
    </>
  );
  const footerContent = (
    <>
      <div className={clsx('lever-modal', !isDark && 'light')}>
        {value > 10 && (
          <div className={clsx('danger-info')}>
            <CommonIcon name="common-warning-outline-tips-0" size={16} />
            {LANG('选取过高的杠杆倍数[10倍] 会增加强行平仓风险，请注意自身的风险等级。')}
          </div>
        )}
      </div>
      {styles}
    </>
  );

  return { content, side, lever, value, onClose, footerContent, onConfirm: _onConfirm };
};
