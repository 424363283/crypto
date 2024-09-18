import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';

export const getAwardType = (data: { currency: any; prizeMax: any; prizeValue: any; prizeType: any }) => {
  let type = data.currency ? (
    <div className='item'>
      <span>{data.prizeMax ?? data.prizeValue}</span>
      <span>{data.currency}</span>
      <style jsx>{`
        .item {
          color: #fff;
          margin: 0 auto;
          font-size: 32px;
          font-weight: 600;
          @media ${MediaInfo.desktop} {
            font-size: 38px;
          }
        }
      `}</style>
    </div>
  ) : (
    <div />
  );
  let text = '';

  switch (data.prizeType) {
    case 1:
      text = LANG('现金');
      break;
    case 2:
      text = LANG('积分');
      break;
    // case 3:
    //   type = (
    //     <div className='item'>
    //       <span>{LANG('Mystery Box')}</span>
    //       <Image src='/static/images/rewards/box.png' width={87} height={107} alt='reward-box' />
    //       <style jsx>{`
    //         .item {
    //           width: 88%;
    //           height: 100%;
    //           position: absolute;
    //           padding: 0 20px;
    //           display: flex;
    //           align-items: center;
    //           justify-content: space-between;
    //           font-size: 30px;
    //           line-height: 30px;
    //           font-weight: 600;
    //           color: var(--skin-color-active);
    //           img {
    //             margin-top: 25px;
    //           }
    //         }
    //       `}</style>
    //     </div>
    //   );
    //   break;
    case 5:
      text = LANG('礼金');
      break;
    case 6:
      text = LANG('抵扣金');
      break;
    case 7:
      text = LANG('折扣');
      break;
    case 8:
      text = LANG('体验金');
      break;
    default:
  }

  return { typeComponent: type, text };
};
