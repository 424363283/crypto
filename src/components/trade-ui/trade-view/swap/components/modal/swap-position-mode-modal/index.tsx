import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { message } from '@/core/utils';

import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';

import { clsx, styles } from './styled';
import Radio from '@/components/Radio';
import { useEffect, useState } from 'react';

export const SwapPositionModeModal = ({
  onClose,
  visible,
  zIndex,
  ...props
}: {
  onClose?: any;
  visible?: boolean;
  zIndex?: any;
}) => {
  const isUsdtType = Swap.Trade.base.isUsdtType;
  const value = Swap.Trade.twoWayMode;
  const [isTwoWayMode, setIsTwoWayMode] = useState(false);
  useEffect(()=> setIsTwoWayMode(Swap.Trade.twoWayMode),[Swap.Trade.twoWayMode]);

  const { isMobile } = useResponsive();
  const onTwoWayModeChange = async (next: boolean) => {
    if (next === value) {
      if(isMobile){
        onClose();
      }
      return;
    }
    try {
      Loading.start();
      const result = await Swap.Info.updatePositionType(isUsdtType, next);
      if (result.code !== 200) {
        setIsTwoWayMode(!isTwoWayMode);
        message.error(result);
        //
      } else {
        message.success(LANG('操作成功'));
        onClose();
      }

      if (!next) {
        Swap.Trade.setPositionMode('open');
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };

  const { isDark } = useTheme();

  const options = [
    [LANG('单向持仓'), LANG('单向持仓模式下，一个合约只允许持有一个方向的仓位。'), { twoWayMode: false }],
    [
      LANG('双向持仓'),
      isUsdtType
        ? LANG(
            '双向持仓模式下，一个合约可允许同时持有多空两个方向的仓位模式。 调整对所有合约统一生效。该设置仅对U本位合约生效。'
          )
        : LANG(
            '双向持仓模式下，一个合约可允许同时持有多空两个方向的仓位模式。 调整对所有合约统一生效。该设置仅对币本位合约生效。'
          ),
      { twoWayMode: true }
    ]
  ];

  const content = (
    <>
      <div className={clsx('content', !isDark && 'light')}>
        <div className={clsx('info')}>
          {isUsdtType ? (
            <div>
              <p> {LANG('若U本位合约在持仓或者挂单，不允许调整仓位模式。')} </p>
              <p> {LANG('仓位模式调整对所有合约统一生效。')} </p>
              <p> {LANG('该设置仅对U本位合约生效。')} </p>
            </div>
          ) : (
            <div>
              <p>{LANG('若币本位合约在持仓或者挂单，不允许调整仓位模式。')}</p>
              <p>{LANG('<br>仓位模式调整对所有合约统一生效。')}</p>
              <p>{LANG('<br>该设置仅对币本位合约生效。')}</p>
            </div>
          )}
        </div>
        <div>
          {options.map(([label, msg, { twoWayMode }]: any, index) => {
            return (
              <div
                key={index}
                className={clsx('item', twoWayMode === (isMobile ? isTwoWayMode : value) && 'active')}
                onClick={() => (isMobile ? setIsTwoWayMode(twoWayMode) : onTwoWayModeChange(twoWayMode))}
              >
                <div className={clsx('caption')}>
                  <div className={clsx()}>{label}</div>
                  <div className={clsx()}>{msg}</div>
                </div>
                <Radio label={''} checked={twoWayMode === (isMobile ? isTwoWayMode : value)} {...{ width: 16, height: 16 }} />
              </div>
            );
          })}
        </div>
      </div>
      {styles}
    </>
  );
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type="bottom" zIndex={zIndex}>
        <BottomModal title={LANG('仓位模式')} onConfirm={() => onTwoWayModeChange(isTwoWayMode)}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal onClose={onClose} contentClassName={clsx('modal')} visible={visible} {...props}>
        <ModalTitle title={LANG('仓位模式')} onClose={onClose} closable></ModalTitle>
        {content}
      </Modal>
    </>
  );
};
