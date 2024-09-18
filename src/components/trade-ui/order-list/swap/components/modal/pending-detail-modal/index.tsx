import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { Card } from './components/card';

import Image from '@/components/image';
import { DrawerModal } from '@/components/mobile-modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, styles } from './styled';

const PendingDetailModal = ({ visible, onClose, data: item, formatItemVolume }: any) => {
  const data = item['otocoOrder'] || item;
  const { priceUnitText } = Swap.Trade.base;
  const { isMobile } = useResponsive();
  const typeData: any = data.symbol ? Swap.Order.formatPendingType(data) : {};
  const type = typeData['type'] ?? typeData['strategyType'] ?? '';
  const status = {
    0: LANG('未生效'),
    1: LANG('已生效'),
    2: LANG('完全成交'),
    3: LANG('部分成交'),
    4: LANG('已取消'),
    7: LANG('部分成交取消'),
  };
  const volume = data.volume ? formatItemVolume(data.volume, data) : 0;

  const renderChildData = (item: any) => {
    if (!item) {
      return;
    }
    const volume = item.volume || data.volume ? formatItemVolume(item.volume || data.volume, data) : 0;
    item = { symbol: data['symbol'], baseShowPrecision: data['baseShowPrecision'], ...item };
    const typeData: any = item.symbol ? Swap.Order.formatPendingType(item) : {};
    const type = typeData['type'] ?? typeData['strategyType'] ?? '';
    const result = [
      [type, (status as any)[item['status']]],
      [LANG('方向'), Swap.Order.formatPendingType(item)['side'], { buy: item['side'] == '1' }],
      [LANG('数量'), `${volume} ${Swap.Info.getUnitText({ symbol: item.symbol || '', withHooks: false })}`],
    ];
    if (Number(item.price) > 0)
      result.push([
        LANG('价格'),
        `${item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--'}
${priceUnitText}`,
      ]);
    return [
      ...result,
      [LANG('触发价格'), `${`${item['triggerPrice']}`.toFixed(Number(item['baseShowPrecision']))} ${priceUnitText}`],
      [LANG('触发类型'), `${item['priceType']}` === '1' ? LANG('最新价格') : LANG('标记价格')],
      [LANG('只减仓'), item.reduceOnly ? LANG('是') : LANG('否')],
    ];
  };

  // dataFormat
  const dataA = [
    [type, (status as any)[data['status']]],
    [LANG('方向'), typeData['side'], { buy: data['side'] == '1' }],
    [LANG('数量'), `${volume} ${Swap.Info.getUnitText({ symbol: data.symbol || '', withHooks: false })}`],
    [
      LANG('价格'),
      `${data.price ? Number(data.price).toFixed(Number(data.baseShowPrecision)) : '--'}
    ${priceUnitText}`,
    ],
  ];
  if (Number(data.triggerPrice) > 0) {
    dataA.push([
      LANG('触发价'),
      `${data.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${data.direction === '1' ? '≥' : '≤'} ${Number(
        data.triggerPrice
      ).toFixed(Number(data.baseShowPrecision))}`,
    ]);
  }
  dataA.push([LANG('只减仓'), data.reduceOnly ? LANG('是') : LANG('否')]);
  const dataB = renderChildData(data['triggerOrders']?.[0]);
  const dataC = renderChildData(data['triggerOrders']?.[1]);

  const content = (
    <>
      <div className={clsx('content')}>
        <div className={clsx('row')}>
          <Card
            title={
              dataC ? LANG('如果委托A部分或完全成交, 则提交委托B和C。') : LANG('如果委托A部分或完全成交, 则提交委托B。')
            }
            cardTitle={LANG('委托{A}', { A: 'A' })}
            data={dataA}
          />
        </div>
        <div className={clsx('row')}>
          <div className={clsx('section')}>
            <div className={clsx(dataC ? 'section-line-first' : 'section-line-last')}>
              <div className={clsx()}></div>
              <div className={clsx()}></div>
            </div>
            <Card
              title={dataC ? LANG('如果委托C完全成交, 则取消委托B。') : undefined}
              cardTitle={LANG('委托{A}', { A: 'B' })}
              data={dataB as any}
            />
          </div>

          {dataC && (
            <div className={clsx('section')}>
              <div className={clsx('section-line-last')}>
                <div className={clsx()}></div>
                <div className={clsx()}></div>
              </div>
              <Card
                title={LANG('如果委托B完全成交, 则取消委托C。')}
                cardTitle={LANG('委托{A}', { A: 'C' })}
                data={dataC}
              />
            </div>
          )}
        </div>
        <div className={clsx('info')}>
          <Image className={clsx('icon')} src={'/static/images/swap/info2.png'} width={11} height={11} alt='icon' />
          {LANG('这是一个OTOCO委托。OTOCO委托支持同时提交一个主委托和两个从属委托。')}
        </div>
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <DrawerModal onClose={onClose} open={visible} title={LANG('止盈/止损')}>
        {content}
      </DrawerModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('modal-content')}>
        <ModalTitle title={LANG('止盈/止损')} fullHeight onClose={onClose} />
        {content}
        <ModalFooter onCancel={onClose} onConfirm={onClose} />
      </Modal>
    </>
  );
};

export default PendingDetailModal;
