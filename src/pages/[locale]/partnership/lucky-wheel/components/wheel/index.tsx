import CommonIcon from '@/components/common-icon';
import {
  getAssistDetailApi,
  postCancelAssistApi,
  postCancelLuckydrawApi,
  postjoinLuckydrawApi,
  postShareLuckydrawApi,
} from '@/core/api';
import { useRequestData, useRouter, useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { PoweroffOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { store } from '../../store';

import { DotLottie } from '@/components/with-lottie';
import { clsx, debounce, MediaInfo } from '@/core/utils';

import { modifyImagePath } from '@/components/image/helper';
import { AlertFunction } from '@/components/modal';
import { message } from 'antd';
import Finger from '../../../components/finger';
import ShareModal, { SHARE_MODAL_TYPE } from '../../../components/share-modal';
import { WheelAnime } from '../../lottie';
import { CoinModal, JoinModal, NextModal, NotDrawModal, ReceiveModal, ShareAdd } from '../../modal';

const Wheel: React.FC<{
  detail: any;
  fetchData: (p?: any, obj?: { onSuccess?: any; onError?: any }) => Promise<any>;
  totalValue: number;
  loading: boolean;
}> = ({ detail, fetchData, totalValue }) => {
  const { theme } = useTheme();
  const { isLogin } = useAppContext();
  const { balance, link, remainShareAsset, remainRegisterAsset, state, luckydraw }: any = isLogin ? detail : {};
  const { isBlue, skin } = useTheme();
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const router = useRouter();

  const [, postCancelLuckydraw] = useRequestData(postCancelLuckydrawApi, {
    enableCache: false,
    params: { processId: detail.id },
    successCallback: () => {
      fetchData();
    },
  });

  const [, handleJoinLuckydrawDApi] = useRequestData(postjoinLuckydrawApi, {
    enableCache: false,
    successCallback: () => {
      store.showJoinModal = true;
      fetchData();
    },
  });

  const [, postOnShareLuckydraw] = useRequestData(postShareLuckydrawApi, {
    enableCache: false,
    successCallback: () => {
      store.showNotDraw = false;
      store.showShare = false;
      store.showShareAdd = true;
      fetchData();
    },
    errorCallback: () => {
      store.showNotDraw = true;
      store.showShare = false;
    },
    useErrorMsg: false,
  });

  const isLastShare = !remainShareAsset;

  const handleSubmit = (detail: any): { text: string; action: () => void } => {
    if (!isLogin) {
      return {
        text: LANG('去登录'),
        action: () => {
          router.push('/login');
        },
      };
    }

    if (!detail.round && !detail.lastState) {
      return {
        text: LANG('立即报名参加'),
        action: async () => {
          handleJoinLuckydrawDApi();
        },
      };
    }

    if (!detail.state && detail.lastState) {
      return {
        text: LANG('报名参加下一轮'),
        action: () => {
          store.showNextModal = true;
        },
      };
    }

    if (detail.state === 2) {
      return {
        text: LANG('待审核'),
        action: () => {},
      };
    }
    if (detail.state === 3) {
      return {
        text: LANG('立即领取'),
        action: () => {
          store.showReceiveModal = true;
        },
      };
    }
    return {
      text: LANG('邀请好友获得抽奖机会'),
      action: () => {
        store.showShare = true;
      },
    };
  };

  const onConfirm = async () => {
    if (!isLogin) {
      return router.push('/login');
    }

    const { data: assistDetai } = await getAssistDetailApi();

    if ((assistDetai?.state === 1 || assistDetai?.state === 2 || assistDetai?.state === 3) && isLogin) {
      switch (assistDetai?.state) {
        case 1:
          AlertFunction({
            content: LANG(
              '同一时间内段仅可参与1个福利加码活动，目前您已参与助力券。若想继续参与幸运轮盘，并结束幸运轮盘倒计时，请点击【确定】'
            ),
            centered: true,
            keyboard: false,
            width: 376,
            headerIcon: <CommonIcon name='common-alert-warning-0' latestSkin={skin} size={64} enableSkin />,
            closable: false,
            maskClosable: false,
            okText: LANG('再想想'),
            cancelText: LANG('确定'),
            onCancel: async () => {
              const res = await postCancelAssistApi({ processId: assistDetai?.id });
              if (res?.code === 200) {
                fetchData();
                handleSubmit(detail).action();
              }
            },
          });
          break;

        case 2:
          AlertFunction({
            title: LANG('提示'),
            content: LANG('助力券活动已达标，正在审核中，请耐心等候'),
            centered: true,
            keyboard: false,
            width: 376,
            headerIcon: <CommonIcon name='common-alert-warning-0' latestSkin={skin} size={64} enableSkin />,
            closable: false,
            maskClosable: false,
            okText: LANG('好的'),
            cancelButtonProps: { style: { display: 'none' } },
          });
          break;

        case 3:
          AlertFunction({
            title: LANG('提示'),
            content: LANG('请先领取助力券活动奖励'),
            keyboard: false,
            centered: true,
            closable: false,
            maskClosable: false,
            width: 376,
            headerIcon: <CommonIcon name='common-alert-warning-0' latestSkin={skin} size={64} enableSkin />,
            okText: LANG('好的'),
            cancelButtonProps: { style: { display: 'none' } },
          });
          break;
      }

      return;
    }

    handleSubmit(detail).action();
  };

  const onEnd = () => {
    if (!isLogin) {
      return;
    }
    AlertFunction({
      okText: LANG('再想想'),
      cancelText: LANG('确定'),
      title: LANG('确认结束 ?'),
      keyboard: false,
      maskClosable: false,
      closable: false,
      centered: true,
      content: (
        <p style={{ textAlign: 'center', width: '312px', fontSize: '14px' }}>
          {LANG(
            '确认提前结束本轮幸运轮盘活动 ? 结束后，您本轮的邀请数据将失效。你可选择参与其他邀请活动领取丰厚奖励。'
          )}
        </p>
      ),
      onOk: async () => {},
      onCancel: () => {
        postCancelLuckydraw();
      },
      theme,
      v2: true,
    });
  };

  const onDraw = () => {
    if (!isLogin) {
      return router.push('/login');
    }

    if (state !== 1) {
      return;
    }

    if (!balance) {
      store.showNotDraw = true;
      return;
    }
    dotLottie?.play();
    setTimeout(() => {
      dotLottie?.stop();
      store.showCoinModal = true;
    }, 1500);
  };

  const shareCallback = async (name: string) => {
    const res = await postOnShareLuckydraw({
      processId: detail.id,
      shareType: name,
    });
  };

  const onReload = () => {
    if (!isLogin) {
      return;
    }

    fetchData(undefined, {
      onError: () => {
        message.error(LANG('刷新失败'));
      },
      onSuccess: () => {
        message.success(LANG('刷新成功'));
      },
    });
  };

  return (
    <div className='box'>
      <div className='top'>
        <QuestionCircleOutlined className='question' onClick={() => (store.ruleModal = true)} />
        {state === 1 && <PoweroffOutlined onClick={onEnd} className='power' />}
      </div>

      <div className='wheel-box'>
        <div className='tip1'>
          <p> {detail.state === 2 || detail.state === 3 ? LANG('恭喜您,') : LANG('点击 GO')}</p>
          {detail.state === 2 || detail.state === 3 ? (
            <p>{LANG('完成本轮幸运挑战！')}</p>
          ) : (
            <p>
              {renderLangContent(LANG('领取 {usdt}'), {
                usdt: <span className='text-main'>{totalValue || 100} USDT</span>,
              })}
            </p>
          )}
        </div>
        <div className='tip2'>
          <p>
            {renderLangContent(LANG('抽奖机会 {count} 次'), {
              count: <span className='text-main'>{balance || 0}</span>,
            })}
          </p>
          <p
            onClick={debounce(() => {
              onReload();
            })}
          >
            <ReloadOutlined size={12} style={{ marginRight: '4px' }} />
            {LANG('点击刷新')}
          </p>
        </div>

        <div className='wheel'>
          <WheelAnime dotLottieRefCallback={(dotLottie) => setDotLottie(dotLottie)} />
          <div className='wheel-press' onClick={onDraw}></div>
          {!!Number(balance) && (
            <div className='finger-box'>
              <Finger />
            </div>
          )}
        </div>

        <div className='tip3'>
          {renderLangContent(LANG('邀请好友，赢取{t} USDT，可交易可提现'), {
            t: totalValue,
          })}
        </div>

        <div className='explain'>{LANG('每邀请1位好友注册且好友完成交易任务后，邀请人必得幸运币')}</div>

        <div className='whell-btn-box'>
          <div className={clsx('whell-btn', state === 2 && 'whell-check')} onClick={onConfirm}>
            {handleSubmit(detail).text}
            {!Number(balance) && (state === 1 || state === 3 || state === null) && (
              <div className='finger-box'>
                <Finger />
              </div>
            )}
          </div>
          {state === 1 && (
            <CommonIcon
              onClick={() => (store.showShareModal = true)}
              name='common-wheel-qrcode-0'
              size={40}
              enableSkin
            />
          )}
        </div>
      </div>
      {store.showJoinModal && <JoinModal balance={balance} amount={detail.amount} prizeValueTotal={totalValue} />}
      {store.showNotDraw && (
        <NotDrawModal
          requiredTradingAmount={luckydraw?.requiredTradingAmount}
          remainRegisterAsset={remainRegisterAsset}
          isLast={isLastShare}
          prizeValueTotal={totalValue}
        />
      )}
      {store.showShare && (
        <ShareModal
          modalType={SHARE_MODAL_TYPE.SHARE_LUCKY_WHEEL_MODAL}
          open={store.showShare}
          shareUrl={link}
          onCancel={() => (store.showShare = false)}
          shareCallback={shareCallback}
        />
      )}
      {store.showShareAdd && <ShareAdd prizeValueTotal={totalValue} />}
      {store.showCoinModal && (
        <CoinModal prizeValueTotal={totalValue} id={detail.id} amount={detail.amount} fetchData={fetchData} />
      )}
      {store.showReceiveModal && (
        <ReceiveModal rewardId={detail?.reward?.id} fetchData={fetchData} prizeValueTotal={totalValue} />
      )}

      {store.showNextModal && <NextModal fetchData={handleJoinLuckydrawDApi} />}
      <style jsx>{`
        .box {
          background-color: var(--spec-background-color-2);
          width: 696px;
          margin-right: 10px;
          min-height: 762px;
          border-radius: 15px;
          padding: 10px 10px 0 10px;
          @media ${MediaInfo.mobileOrTablet} {
            width: 100%;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .top {
            display: flex;
            justify-content: space-between;
            @media ${MediaInfo.mobileOrTablet} {
              margin-bottom: 15px;
            }
            :global(.question) {
              color: var(--spec-font-color-2);
              cursor: pointer;
              font-size: 20px;
            }
            :global(.power) {
              color: var(--skin-main-font-color);
              cursor: pointer;
              font-size: 20px;
            }
          }

          .wheel-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .wheel-press {
              width: 80px;
              height: 80px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              cursor: pointer;
              z-index: 99;
              opacity: 0;
            }

            .tip1 {
              cursor: pointer;
              width: 303px;
              height: 108.5px;
              padding-top: 26px;
              margin-bottom: 10px;
              text-align: center;
              font-size: 20px;
              background-image: url(${modifyImagePath('/static/images/partnership/wheel-tip1.svg', isBlue, skin)});
              background-position: 100% 100%;
              background-size: cover;
            }

            .tip2 {
              width: 131px;
              height: 65px;
              background-image: url(${modifyImagePath('/static/images/partnership/wheel-tip2.svg', isBlue, skin)});
              background-position: 100% 100%;
              background-size: cover;
              text-align: center;
              padding-top: 6px;
              cursor: pointer;
              & p:nth-child(1) {
                color: var(--spec-font-btn-color-white);
              }
              & p:nth-child(2) {
                color: #9e9e9d;
              }
            }
            .wheel {
              height: 385px;
              margin-bottom: 6px;
              position: relative;
              .finger-box {
                width: 116px;
                height: 128px;
                position: absolute;
                left: 46%;
                top: 35%;
                z-index: 2;
              }
            }
            .tip3 {
              min-width: 384px;
              height: 40px;
              line-height: 40px;
              font-weight: 500;
              margin-bottom: 12px;
              text-align: center;
              background-image: url(${modifyImagePath('/static/images/partnership/tip3-border.svg', isBlue, skin)});
              background-size: 100% 100%;
              white-space: nowrap;
              @media ${MediaInfo.mobile} {
                width: 343px;
              }
            }

            .explain {
              margin-bottom: 17px;
              font-size: 12px;
              color: var(--spec-font-color-2);
              font-weight: 500;
              text-align: center;
            }

            .whell-btn-box {
              display: flex;
              align-items: center;
              cursor: pointer;
              .whell-btn {
                color: var(--skin-font-color);
                background-image: url(${modifyImagePath('/static/images/partnership/whell-btn.svg', isBlue, skin)});
                background-size: 100% 100%;
                width: 329px;
                height: 48px;
                line-height: 44px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                margin-right: 7.5px;
                position: relative;

                @media ${MediaInfo.mobile} {
                  width: 281px;
                }
                .finger-box {
                  width: 116px;
                  height: 128px;
                  position: absolute;
                  right: -20px;
                  top: 0;
                  z-index: 2;
                }
              }
              .whell-check {
                background-image: url('/static/images/partnership/whell-btn2.svg');
                color: var(--spec-font-btn-color-white);
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(Wheel);
