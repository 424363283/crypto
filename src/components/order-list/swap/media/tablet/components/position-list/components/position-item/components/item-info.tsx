import CommonIcon from '@/components/common-icon';

export const ItemInfo = ({
  marginType,
  lever,
  onLeverClick,
  assetsPage,
}: {
  marginType: any;
  lever: any;
  onLeverClick: any;
  assetsPage?: boolean;
}) => {
  return (
    <>
      <div className='item-info'>
        <div className='actions'>
          <div>
            {marginType}
            {' /'}
          </div>
          <div onClick={onLeverClick}>
            {lever}X
            {!assetsPage && (
              <CommonIcon name='common-small-edit-0' width={12} height={13} enableSkin className='icon' />
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .item-info {
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .actions {
            display: flex;
            align-items: center;
            > div {
              display: flex;
              align-items: center;
              padding: 2.5px 0;
              border-radius: 4px;
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
              white-space: nowrap;
              &:last-child {
                color: var(--skin-main-font-color);
                padding-left: 4px;
                padding-right: 4px;
              }
              :global(.icon) {
                margin-left: 4px;
              }
            }
          }
        }
      `}</style>
    </>
  );
};
