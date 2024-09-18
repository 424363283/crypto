export const PriceInfos = ({ data }: { data: any[] }) => {
    return (
      <>
        <div className='price-infos'>
          {data.map((v, i) => {
            return (
              <div className='item' key={i}>
                <div className='label'>{v[0]}</div>
                <div className='price'>{v[1]}</div>
              </div>
            );
          })}
        </div>
        <style jsx>{`
          .price-infos {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid var(--theme-trade-border-color-2);
            align-items: center;
            padding-bottom: 17px;
            margin-bottom: 9px;
  
            .item {
              &:nth-child(2) {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              &:nth-child(3) {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              }
              .label {
                font-size: 12px;
                color: var(--theme-trade-text-color-3);
                margin-bottom: 4px;
              }
              .price {
                font-size: 14px;
                color: var(--theme-trade-text-color-1);
              }
            }
          }
        `}</style>
      </>
    );
  };
  