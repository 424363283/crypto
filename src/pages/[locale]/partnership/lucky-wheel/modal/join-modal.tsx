import Avatar from '@/components/avatar';
import { modifyImagePath } from '@/components/image/helper';
import { BasicModal } from '@/components/modal';
import { useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { clsx } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import Progress from '../components/progress';
import { BoxPopAnime, BoxUpAnime, OpenBoxAnime } from '../lottie';
import { store } from '../store';

const JoinModal: React.FC<{
  balance?: number;
  amount?: number;
  prizeValueTotal: number;
}> = ({ balance, amount, prizeValueTotal }) => {
  const [guideState, setGuideState] = useState(false);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [step, setStep] = useState(1);

  const { isBlue, skin } = useTheme();

  const onOk = () => {
    if (!guideState) {
      setGuideState(true);
      return;
    }
  };

  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });

    return () => {
      setGuideState(false);
    };
  }, []);

  return (
    <BasicModal
      open={store.showJoinModal}
      title={LANG('领取奖品')}
      okText={LANG('领取')}
      cancelButtonProps={{ style: { display: 'none' } }}
      onCancel={() => (store.showJoinModal = false)}
      width={459}
      onOk={onOk}
      className='model-box'
      closable={guideState}
    >
      {guideState ? (
        <div className='guide-box'>
          <div className='info'>
            <Avatar
              style={{ borderRadius: '50%', marginRight: '10px' }}
              width={45}
              height={45}
              alt={user?.username as string}
              src={user?.avatar as string}
            />
            <div>
              <p>{LANG('恭喜领取轮盘任务')}</p>
              <p>
                {LANG('完成以下3步可获得')} {prizeValueTotal} USDT
              </p>
            </div>
          </div>

          <div className='steps'>
            {[LANG('第一步'), LANG('第二步'), LANG('第三步'), LANG('第四步')].map((n, i) => (
              <div key={n} onClick={() => setStep(i + 1)} className={clsx('step', step === i + 1 && 'active')}>
                {n}
              </div>
            ))}
          </div>

          <div className='img-box'>
            {step === 1 && (
              <div className='img-1'>
                <p>{LANG('手气超棒')}</p>
                <p>{LANG('成功领取本轮轮盘任务')}</p>
                <div className='am-box'>
                  <OpenBoxAnime />
                </div>
                <div className='text-usdt'>
                  <div className='am-one-hundred'>{prizeValueTotal || 100}</div>
                  <div className='am-unit'>USDT</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='img-2'>
                <p>{LANG('恭喜获得抽奖机会')}</p>
                <div className='am-box'></div>
                <div className='text-usdt'>
                  <div className='am-one-hundred'>100</div>
                  <div className='am-unit'>{LANG('次')}</div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='img-3'>
                <div className='am-box'></div>
                <div className='text-desp'>
                  <p>{LANG('抽奖集满100个金币')}</p>
                  <p>
                    {renderLangContent(LANG(`挑战完成，获得 {text}`), {
                      text: <span className='text-main'>{prizeValueTotal || 100} USDT</span>,
                    })}
                  </p>
                  <div style={{ width: '251px', margin: '0 auto' }}>
                    <Progress mini amount={Number(amount)} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className='img-4'>
                  <BoxPopAnime>
                    <div className='step4-text'>
                      <p>{LANG('获得免费抽奖机会')}</p>
                      <p>
                        <span>{balance || 0}</span>
                        <span>{LANG('次')}</span>
                      </p>
                    </div>
                  </BoxPopAnime>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='text'>
          <p>{LANG('恭喜获得')}</p>
          <p>
            {renderLangContent(LANG('您的{t}'), {
              t: <span className='main-text'>{LANG('专属奖励')}</span>,
            })}
          </p>
          <div>
            <BoxUpAnime />
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.text-main) {
          color: var(--skin-main-font-color);
        }
        :global(.ant-modal-header) {
          display: ${guideState ? 'none !important' : 'block'};
        }

        :global(.ant-modal-footer) {
          display: ${guideState ? 'none !important' : 'block'};
        }

        :global(.basic-content) {
        }
        .model-box {
          padding: 20px;
        }

        .text-usdt {
          display: flex;
          align-items: baseline;
          justify-content: center;

          .am-one-hundred {
            text-align: center;
            font-size: 40px;
            font-style: normal;
            font-weight: 900;
            font-family: Roboto;
            -webkit-text-stroke-width: 1;
            -webkit-text-stroke: 1px ${isBlue ? '#065CC2' : '#ff8b23'};
            background: ${isBlue
              ? `linear-gradient(180deg, #9CC4FF 51.49%, #0076FF 51.5%)`
              : `linear-gradient(180deg, #fff5a0 51.49%, #f8bc0b 51.5%)`};
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-right: 8px;
          }

          .am-unit {
            font-size: 16px;
            font-family: Roboto;
            font-weight: 900;
            color: var(--spec-font-btn-color-white);
          }
        }

        .img-box {
          height: 380px;
        }

        .img-1 {
          .am-box {
            width: 350px;
            height: 300px;
            margin: 0 auto;
          }

          div:nth-child(4) {
            margin-top: -30px;
          }

          p:nth-child(1) {
            color: var(--skin-main-font-color);
            text-align: center;
            font-size: 20px;
            font-weight: 900;
          }
          p:nth-child(2) {
            color: var(--spec-font-btn-color-white);
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            position: relative;

            &::after {
              content: ' ';
              opacity: 0.4;
              width: 100%;
              height: 21px;
              position: absolute;
              left: 0;
              top: 50%;
              background-image: url(${modifyImagePath('/static/images/partnership/bg-yun.svg', isBlue, skin)});
              background-position: 100% 100%;
              background-size: cover;
            }
          }
        }

        .img-2 {
          .am-box {
            background-image: url(${modifyImagePath('/static/images/partnership/wheel-img.svg', isBlue, skin)});
            background-position: 100% 100%;
            width: 281px;
            height: 243px;
            background-size: cover;
            margin: 0 auto;
            margin-top: 24px;
          }
          p:nth-child(1) {
            color: var(--spec-font-btn-color-white);
            text-align: center;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            position: relative;

            &::after {
              content: ' ';
              opacity: 0.4;
              width: 100%;
              height: 21px;
              position: absolute;
              left: 0;
              top: 50%;
              background-image: url(${modifyImagePath('/static/images/partnership/bg-yun.svg', isBlue, skin)});
              background-position: 100% 100%;
              background-size: cover;
            }
          }
        }

        .img-3 {
          .am-box {
            background-image: url(${modifyImagePath('/static/images/partnership/wheel-img.svg', isBlue, skin)});
            background-position: 100% 100%;
            width: 281px;
            height: 243px;
            background-size: cover;
            margin: 0 auto;
            margin-top: 24px;
            margin-bottom: 14px;
          }
          .text-desp {
            padding-top: 6px;
            width: 303px;
            height: 109px;
            margin: 0 auto;
            text-align: center;
            font-size: 16px;
            color: var(--spec-font-btn-color-white);
            background-image: url(${modifyImagePath('/static/images/partnership/wheel-tip1.svg', isBlue, skin)});
            background-position: 100% 100%;
            background-size: cover;
            position: relative;
          }
        }

        .img-4 {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 289px;
          height: 257px;
          background-position: 100% 100%;
          background-size: cover;
          margin: 0 auto;
          padding-top: 90px;
          position: relative;

          ::before {
            content: '${LANG('恭喜')}';
            color: var(--skin-font-color);
            font-size: 16px;
            position: absolute;
            top: 110px;
            z-index: 2;
          }

          .step4-text {
            position: absolute;
            z-index: 2;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin-top: 50px;
            text-align: center;
            p:nth-child(1) {
              font-size: 14px;
              font-weight: 500;
              color: var(--spec-font-btn-color-white);
              margin-bottom: 16px;
            }
            p:nth-child(2) {
              display: flex;
              align-items: flex-end;
              justify-content: center;
              span:nth-child(1) {
                font-size: 56px;

                font-weight: 900;
                color: var(--skin-main-font-color);
                line-height: 40px;
              }
              span:nth-child(2) {
                font-size: 14px;
                color: var(--spec-font-btn-color-white);
              }
            }
          }
        }

        .steps {
          color: var(--spec-font-color-2);
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .step {
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            width: 117px;
            height: 34px;
            cursor: pointer;
            background-image: url('/static/images/partnership/luck-step.svg');
            background-size: 100% 100%;
            margin-left: -13px;
          }

          & .step :first-child {
            background-image: url('/static/images/partnership/luck-step1.svg');
            background-size: 100% 100%;
            margin-left: 0px;
          }

          & .active {
            color: var(--skin-font-color);
            font-weight: 500;

            background-image: url(${modifyImagePath(
              '/static/images/partnership/luck-step.gif',
              isBlue,
              skin
            )}) !important;
          }
        }

        :global(.text) {
          text-align: center;
          font-family: 'PingFang SC';
          font-size: 18px;
          color: var(--spec-font-btn-color-white);
          .main-text {
            color: var(--skin-main-font-color);
          }
        }

        .guide-box {
          .info {
            display: flex;
            font-size: 12px;
            color: var(--spec-font-color-1);
            margin-bottom: 8px;
          }
        }
      `}</style>
    </BasicModal>
  );
};

export default JoinModal;
