export const Infos = ({ data }: { data: any[] }) => {
    return (
      <>
        <div className='infos'>
          {data.map((v, i) => {
            const { color } = v[2] || {};
            return (
              <div key={i}>
                <div>{v[0]}</div>
                <div>{v[1]}</div>
              </div>
            );
          })}
        </div>
        <style jsx>{`
          .infos {
            padding: 30px 0 8px;
  
            > div {
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              > div {
                font-size: 12px;
                &:first-child {
                  color: var(--theme-trade-text-color-3);
                }
                &:last-child {
                  color: var(--theme-trade-text-color-1);
                }
              }
            }
          }
        `}</style>
      </>
    );
  };
  