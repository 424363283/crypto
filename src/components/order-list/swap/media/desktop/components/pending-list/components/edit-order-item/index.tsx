import EditButton from '@/components/order-list/components/edit-button';
import { EditOrderSpslModal, StopProfitStopLossModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { Swap } from '@/core/shared';
import { Dropdown } from 'antd';
import dynamic from 'next/dynamic';
import { ReactNode, useMemo, useState } from 'react';

const EditOrderView = dynamic(() => import('./components/edit-order-view'), { ssr: false });

const EditOrderItem = ({
  children,
  data,
  editPrice,
  editVolume,
  editSpsl,
  editTriggerPrice,
}: {
  children: ReactNode;
  data: any;
  editPrice?: boolean;
  editTriggerPrice?: boolean;
  editVolume?: boolean;
  editSpsl?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const symbol = data?.symbol;
  const isUsdtType = Swap.Info.getIsUsdtType(symbol);
  const isLimit = ['1', '4'].includes(data.type);
  const isSpslType2 = ['4', '5'].includes(data.type);
  const isSpslType = ['2', '1'].includes(`${data['strategyType']}`);
  const pendings = Swap.Order.getPending(isUsdtType);

  const onEdit = () => {
    if (editSpsl || isSpslType2 || data.closePosition) {
      setOpen(true);
    }
  };
  const spsls = useMemo(
    () =>
      pendings.filter(
        (e) =>
          e['positionSide'] == data['positionSide'] &&
          e['symbol'] == data['symbol'] &&
          e['subWallet'] == data['subWallet'] &&
          e['closePosition'] == true
      ),
    [pendings, data]
  );
  if (!(isLimit || isSpslType)) {
    return <>{children}</>;
  }
  return (
    <>
      {open && (editSpsl || isSpslType2) && !data.closePosition && (
        <EditOrderSpslModal
          editSpsl={editSpsl}
          data={{
            ...data,
            avgCostPrice: isLimit ? data['price'] : data['triggerPrice'],
            currentPosition: Number(`${data.volume}`.sub(data.dealVolume || 0)),
            availPosition: Number(`${data.volume}`.sub(data.dealVolume || 0)),
          }}
          visible={open}
          onClose={() => setOpen(false)}
        />
      )}
      {data.closePosition && open && (
        <StopProfitStopLossModal
          data={{
            ...data,
            side: data['side'] == '1' ? '2' : '1',
            leverage: data['leverageLevel'],
            currentPosition: data['positionVolume'],
            availPosition: data['positionVolume'],
            avgCostPrice: data['positionAvgPrice'],
            margin: 0,
            orders: spsls,
          }}
          visible={open}
          onClose={() => setOpen(false)}
        />
      )}
      <div className='edit-order-item'>
        {children}
        {!editSpsl && !data.closePosition && !isSpslType2 ? (
          <Dropdown
            menu={{ items: [] }}
            destroyPopupOnHide
            dropdownRender={(menu) => (
              <EditOrderView
                active={open}
                data={data}
                onClose={() => setOpen(false)}
                editPrice={editPrice}
                editVolume={editVolume}
                editSpsl={editSpsl}
                editTriggerPrice={editTriggerPrice}
              />
            )}
            open={open}
            onOpenChange={setOpen}
            trigger={['click']}
            placement='topCenter'
            align={{ offset: [0, -10] }}
            // overlayClassName={}
          >
            <EditButton className='edit-button' hovered={open} onClick={onEdit} />
          </Dropdown>
        ) : (
          <EditButton className='edit-button' hovered={open} onClick={onEdit} />
        )}
      </div>
      <style jsx>{`
        .edit-order-item {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          > :global(.edit-button) {
            margin-left: 5px;
          }
        }
      `}</style>
    </>
  );
};

export default EditOrderItem;
