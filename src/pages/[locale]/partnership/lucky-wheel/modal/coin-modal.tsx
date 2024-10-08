import Image from '@/components/image';
import { modifyImagePath } from '@/components/image/helper';
import { BasicModal } from '@/components/modal';
import { postLuckydraw } from '@/core/api';
import { useRequestData, useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import Progress from '../components/progress';
import { CoinWeb } from '../lottie';
import { store } from '../store';

type P = { id: number; amount: number; fetchData: () => void; prizeValueTotal: number };

const MoneyDown = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Image
      style={{ display: show ? 'block' : 'none' }}
      className='collect-money-img'
      src={`/static/images/invite-friends/collect-money.gif`}
      width={250}
      height={250}
    />
  );
};

const CoinModal: React.FC<P> = ({ id, amount, fetchData, prizeValueTotal }) => {
  const [prizeValue, setPrizeValue] = useState(0);
  const { isBlue, skin } = useTheme();
  const [showProgress, setShowProgress] = useState(false);
  const [, handleActionLuckyDraw] = useRequestData(postLuckydraw, {
    enableCache: false,
    params: {
      processId: id,
    },
    successCallback(data) {
      setPrizeValue(data?.prizeValue);
      fetchData();
    },
  });
  useEffect(() => {
    if (store.showCoinModal) {
      handleActionLuckyDraw();
    }
  }, [store.showCoinModal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 1500);

    return () => {
      setShowProgress(false);
      clearTimeout(timer);
    };
  }, []);

  return (
    <BasicModal
      okText={LANG('确定')}
      closeIcon={null}
      open={store.showCoinModal}
      onCancel={() => (store.showCoinModal = false)}
      onOk={() => (store.showCoinModal = false)}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <div>
        <div className='top'>
          <p>
            {renderLangContent(LANG('恭喜抽中 {t}'), {
              t: (
                <span className='text-main'>
                  {prizeValue}
                  {LANG('个金币')}
                </span>
              ),
            })}
          </p>
          <p>
            {renderLangContent(LANG('距离 {t} 奖励又近一步'), {
              t: <span className='text-main'>{prizeValueTotal || 100} USDT</span>,
            })}
          </p>
        </div>

        <div className='am'>
          <div className='am-box-up'>
            <CoinWeb showUsdt={showProgress} />
          </div>

          {showProgress && (
            <div className='bottom-pr'>
              <MoneyDown />
              <div className='pr-box'>
                <p className='title'>{LANG('领奖进度')}</p>
                <Progress mini amount={amount} isShowCount />
              </div>
            </div>
          )}
        </div>

        <div className='num'>
          <span style={{ fontSize: '30px' }}>x </span>
          <span>{prizeValue}</span>
        </div>
      </div>

      <style jsx>{`
        :global(.ant-modal-close) {
          display: none;
        }

        :global(.text-main) {
          color: var(--skin-main-font-color);
        }

        .top {
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          color: var(--spec-font-btn-color-white);

          & p :nth-child(2) {
            position: relative;
            &::after {
              content: ' ';
              opacity: 0.4;
              width: 100%;
              height: 21px;
              position: absolute;
              left: 0;
              top: 60%;
              background-image: url(${modifyImagePath('/static/images/partnership/bg-yun.svg', isBlue, skin)});
              background-position: 100% 100%;
              background-size: cover;
            }
          }
        }

        .am {
          min-height: 300px;
          .am-box-up {
            width: 301px;
            height: 299px;
            margin: 0 auto;
          }
          .bottom-pr {
            position: relative;
          }
          .pr-box {
            width: 303px;
            height: 108px;
            margin: 0 auto;
            text-align: center;
            font-size: 18px;
            color: var(--spec-font-btn-color-white);
            background-image: url(${modifyImagePath('/static/images/partnership/wheel-tip1.svg', isBlue, skin)});
            background-position: 100% 100%;
            background-size: cover;
            position: relative;
            padding: 12px 14px;

            .title {
              margin-bottom: 16px;
            }
          }
          :global(.collect-money-img) {
            position: absolute;
            left: 65px;
            bottom: -7px;
            @media ${MediaInfo.mobile} {
              left: -15px;
            }
          }
        }

        .num {
          text-align: center;

          font-size: 40px;
          font-style: normal;
          font-weight: bold;
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
      `}</style>
    </BasicModal>
  );
};

export default CoinModal;
