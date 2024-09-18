import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import Input from '@/components/trade-ui/trade-view/components/input';

import { Loading } from '@/components/loading';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { message } from '@/core/utils';
import Slider from './components/slider';
import { clsx, styles } from './styled';

export const useLeverModal = ({ visible }: { visible: boolean }) => {
  const { isDark } = useTheme();
  const { lever, symbol } = Swap.Trade.store.modal.leverData;
  const cryptoData = Swap.Info.getCryptoData(symbol);
  const riskList = Swap.Info.getRiskListData(symbol);
  const { isMobile } = useResponsive();
  const [maxVolume, setMaxVolume] = useState(0); // 最大可开
  const [value, setValue] = useState(lever);
  const code = cryptoData?.settleCoin;
  const maxLever = cryptoData?.leverageLevel || 0;
  // const leverList = formatLeverList({ leverageConfig: cryptoData.leverageConfig, max: maxLever });
  const onClose = () => Swap.Trade.setModal({ leverVisible: false, leverModalData: {} });

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
    if (lever === value) return true;
    Loading.start();
    try {
      const result = await Swap.Info.updateLever(Swap.Trade.base.isUsdtType, { id: symbol, lever: value });

      if (result.code === 200) {
        Swap.Order.fetchPosition(Swap.Trade.base.isUsdtType);
        Swap.Order.fetchPending(Swap.Trade.base.isUsdtType);
        message.success(LANG('杠杆修改成功'));
        Swap.Trade.clearInputVolume();
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
        />
        {error && <div className={clsx('danger-info2')}>{LANG('杠杆已超出最大杠杆倍数')}</div>}
        {/* <div className={clsx('lever-list')}>
          {(leverList.length > 4 ? leverList.slice(1, 5) : leverList).map((v: any, i: number) => {
            return (
              <div className={clsx(Number(value) === Number(v) && 'active')} onClick={() => setValue(v)} key={i}>
                <div className={clsx()}></div>
                <span className={clsx()}>{v}X</span>
              </div>
            );
          })}
        </div> */}
        <Slider value={value} onChange={(e) => setValue(e)} min={1} max={maxLever} />
        <div className={clsx('max-info')}>
          <div>{LANG('当前杠杆倍数最大可开')}：</div>
          <div>
            {maxVolume}&nbsp;&nbsp;{code}
          </div>
        </div>
        {value > 10 && (
          <div className={clsx('danger-info')}>
            <ExclamationCircleOutlined className={clsx('icon')} />
            {LANG('选取过高的杠杆倍数[10倍] 会增加强行平仓风险，请注意自身的风险等级。')}
          </div>
        )}
      </div>
      {styles}
    </>
  );

  return { content, lever, value, onClose, onConfirm: _onConfirm };
};
