import { LANG, TrLink } from '@/core/i18n';

export default function SpotCoinContent() {
  const list = [
    {
      name: LANG('专业版'),
      tips: LANG('所有操作可在一个荧幕完成'),
      href: '/spot/btc_usdt',
    },
    // { name: LANG('币币闪兑'), tips: LANG('一键兑换不同数字货币'), href: '/convert' },
  ];

  return (
    <>
      <ul className='header-spot-list'>
        {list.map((item, key) => {
          return (
            <li key={key} className='header-spot-item'>
              <TrLink native href={item.href}>
                <p className='name'> {item.name}</p>
                <p className='description'>{item.tips}</p>
              </TrLink>
            </li>
          );
        })}
      </ul>
      <style jsx>
        {`
          .header-spot-list {
            margin: 0;
            padding: 10px 12px;
            p {
              margin: 0;
            }
            .header-spot-item {
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
              width: 100%;
              :global(> a) {
                display: block;
                width: 100%;
                color: var(--text_2)!important;
                :global(>*:nth-last-child(2)) {
                  color: var(--text_1);
                }
                :global(>*:nth-child(2)) {
                  color: var(--text_3);
                }
              }
              .description {
                font-size: 12px;
                font-weight: 400;
              }
              .name {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 11px;
              }
              :global(.icon-arrow) {
                display: none;
              }
              &:hover {
                .name {
                  color: var(--text_brand);
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
