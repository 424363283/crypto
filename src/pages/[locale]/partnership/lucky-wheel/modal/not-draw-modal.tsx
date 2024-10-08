import CommonIcon from '@/components/common-icon';
import { modifyImagePath } from '@/components/image/helper';
import { BasicModal } from '@/components/modal';
import { useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { store } from '../store';

const NotDrawModal = ({
  isLast,
  remainRegisterAsset,
  prizeValueTotal,
  requiredTradingAmount,
}: {
  isLast: boolean;
  remainRegisterAsset: number;
  prizeValueTotal: number;
  requiredTradingAmount: number;
}) => {
  const { isBlue, skin } = useTheme();
  return (
    <BasicModal
      open={store.showNotDraw}
      onCancel={() => (store.showNotDraw = false)}
      title={LANG('邀请好友')}
      footer={
        <div className='whell-btn-box'>
          <div
            className='whell-btn'
            onClick={() => {
              store.showNotDraw = false;
              store.showShare = true;
            }}
          >
            {LANG('邀请好友')}
          </div>
          <CommonIcon
            className='qrcode'
            onClick={() => {
              store.showShareModal = true;
              store.showNotDraw = false;
            }}
            name='common-wheel-qrcode-0'
            enableSkin
            size={40}
          />
        </div>
      }
    >
      {isLast ? (
        <div className='null-box'>
          <p className='tip'>{LANG('暂无抽奖机会，可通过以下方式获得抽奖次数：')}</p>
          <div className='bt'>
            <p>{LANG('分享给好友：还可以获得 0 次')}</p>
            <p>
              {renderLangContent(LANG('邀请好友完成注册：还可以获得 {count} 次'), {
                count: remainRegisterAsset,
              })}
            </p>
            <p>
              {renderLangContent(LANG('好友充值且交易累计满 {t} USDT：还可以获得无限次'), {
                t: requiredTradingAmount,
              })}
            </p>
          </div>
        </div>
      ) : (
        <div className='nd-box'>
          <div>
            {renderLangContent(LANG('只需10个金币，即可领取 {t}'), {
              t: <span className='text-main'>{prizeValueTotal} USDT</span>,
            })}
          </div>
          <div className='nd-info'>
            <p>
              <div className='nd-step'>
                <p className='ball'>1</p>
              </div>
              {LANG('分享活动给好友')}
            </p>
            <p>
              <div className='nd-step'>
                <p className='ball'>2</p>
              </div>
              {LANG('好友注册充值并交易')}
            </p>
            <p>
              <div className='nd-step'>
                <p className='ball'>3</p>
              </div>
              {renderLangContent(LANG('领奖 {t} USDT'), {
                t: prizeValueTotal,
              })}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .null-box {
          font-size: 20px;
          color: var(--spec-font-btn-color-white);
          width: 331px;
          margin: 0 auto;

          .tip {
            margin: 16px 0;
          }

          .bt {
            width: 337px;
            height: 202px;
            background-image: url(${modifyImagePath('/static/images/partnership/nu-box.svg', isBlue, skin)});
            background-size: cover;
            padding: 14px 16px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            > p {
              display: flex;
              align-items: center;
            }

            & p:nth-child(1)::before {
              content: ' ';
              display: block;
              top: 0;
              width: 30px;
              height: 30px;
              margin-right: 12px;
              background-image: url(/static/images/partnership/nu-box1.svg);
              background-size: cover;
            }
            & p:nth-child(2)::before {
              content: ' ';
              display: block;
              top: 0;
              width: 30px;
              height: 30px;
              margin-right: 12px;
              background-image: url(/static/images/partnership/nu-box2.svg);
              background-size: cover;
            }
            & p:nth-child(3)::before {
              content: ' ';
              display: block;
              top: 0;
              width: 30px;
              height: 30px;
              margin-right: 12px;
              background-image: url(/static/images/partnership/nu-box3.svg);
              background-size: cover;
            }
          }
        }

        .nd-box {
          width: 335px;
          margin: 0 auto;
          font-size: 20px;
          font-weight: 600;
          color: var(--spec-font-btn-color-white);
          padding: 20px 0px;

          :global(.text-main) {
            color: var(--skin-main-font-color);
          }

          .nd-info {
            width: 335px;
            height: 152px;
            background-image: url(${modifyImagePath('/static/images/partnership/nd-info.svg', isBlue, skin)});
            background-size: cover;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            padding: 32px 0 32px 23px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 24px 0 16px 0;

            .nd-step {
              width: 24px;
              height: 24px;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            & > p {
              display: flex;
              justify-content: left;
              align-items: center;
            }

            & p:nth-child(1),
            & p:nth-child(2) {
              .ball {
                width: 16px;
                height: 16px;
                line-height: 16px;
                background-color: var(--skin-primary-color);
                font-size: 12px;
                font-weight: 600;
                color: #000;
                border-radius: 50%;
                text-align: center;
                position: relative;

                &.ball::after {
                  content: ' ';
                  width: 2px;
                  height: 19px;
                  background-color: var(--skin-primary-color);
                  position: absolute;
                  left: 45%;
                  top: 12px;
                }
              }
            }
            & p:nth-child(3) {
              .ball {
                width: 24px;
                height: 24px;
                line-height: 24px;
                background-color: var(--skin-primary-color);
                font-size: 12px;
                font-weight: 600;
                color: #000;
                border-radius: 50%;
                text-align: center;
              }
            }
          }
        }

        .whell-btn-box {
          margin: 0 auto;
          display: flex;
          align-items: center;
          .whell-btn {
            color: var(--skin-font-color);
            background-image: url(${modifyImagePath('/static/images/partnership/whell-btn.svg', isBlue, skin)});
            background-size: cover;
            background-position: 100% 100%;
            width: 329px;
            height: 48px;
            line-height: 44px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            margin-right: 7.5px;
          }

          :global(.qrcode) {
            @media ${MediaInfo.mobile} {
              display: none;
            }
          }
        }
      `}</style>
    </BasicModal>
  );
};

export default NotDrawModal;
