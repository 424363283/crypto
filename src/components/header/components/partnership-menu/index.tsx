import { LANG, TrLink } from '@/core/i18n';

export default function PartnerShipMenu() {
  const list = [
    { name: LANG('全球合伙人'), tips: LANG('将你的流量转换为加密货币佣金'), href: '/partnership/affiliate' },

    { name: LANG('成为Y-MEX ARMY'), tips: LANG('推广Y-MEX并获得奖励'), href: '/partnership/army' },
  ];
  return (
    <>
      <ul className='partnership-list'>
        {list.map((item, key) => {
          return (
            <li className='partnership-item' key={key}>
              <TrLink href={item.href} native>
                <p className='name'> {item.name}</p>
                <p className='description'>{item.tips}</p>
              </TrLink>
            </li>
          );
        })}
      </ul>
      <style jsx>
        {`
          .partnership-list {
            margin: 0;
            padding: 10px 12px;
            p {
              margin: 0;
            }
            .partnership-item {
              display: flex;
              justify-content: center;
              flex-direction: column;
              font-size: 14px;
              cursor: pointer;
              height: 68px;
              padding-left: 10px;
              padding-right: 20px;
              border-radius: 5px;
              white-space: nowrap;
              word-break: keep-all;
              :global(> a) {
                display: block;
                width: 100%;
              }
              .description {
                color: var(--theme-font-color-3);
                font-size: 12px;
                font-weight: 400;
              }
              .name {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 11px;
                color: var(--theme-font-color-1);
              }
              :global(.icon-arrow) {
                display: none;
              }
              &:hover {
                background-color: var(--theme-background-color-3);
                .name {
                  color: var(--skin-hover-font-color);
                }
                :global(.icon-arrow) {
                  display: inline-block;
                  position: absolute;
                  right: 22px;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
}
