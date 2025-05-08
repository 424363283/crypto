import { useCallback, useEffect, useState } from 'react';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { LANG, TrLink } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Info, Swap } from '@/core/shared';
import { useRouter, useTheme } from '@/core/hooks';
import { useAppContext } from '@/core/store';
import Image from 'next/image';
import { Zendesk } from '@/components/zendesk';

const Step1 = ({ isLogin, showTransfer }: { isLogin: boolean; showTransfer: () => void }) => {
  const router = useRouter();
  return (
    <div className="guide-content">
      <span className="info">{LANG('交易前，请确保您的现货账户资产充足。')}</span>
      <div className="btn-wrapper">
        <TrLink href="/account/fund-management/asset-account/recharge" className="btn deposit" native>
          {LANG('充值')}
        </TrLink>

        <div
          className="btn transfer"
          onClick={() => {
            if (isLogin) {
              showTransfer();
            } else {
              router.push('/login');
            }
          }}
        >
          {LANG('划转')}
        </div>
      </div>
    </div>
  );
};
const Step2 = () => (
  <div className="guide-content">
    <span className="info">{LANG('在行情图左侧列表挑选您将要交易的币对，也可通过搜索框输入币对名称快速搜索。')}</span>
  </div>
);
const Step3 = () => (
  <div className="guide-content">
    <span className="info">
      {LANG(
        '在买入区域输入您预期的买入价格与数量，并点击下方买入，当市场价格与您设置的价格相符时，则完成了一笔买入交易。'
      )}
    </span>
  </div>
);
const Step4 = () => (
  <div className="guide-content">
    <span className="info">{LANG('您在这里可以查看当前委托、历史委托、历史成交和资产管理。')}</span>
  </div>
);
const Step5 = () => {
  const router = useRouter();
  return (
    <div className="guide-content">
      <span className="info">
        {LANG(
          '在卖出区域输入您预期的卖出价格与数量，并点击下方卖出，当市场价格与您设置的价格相符时，则完成了一笔卖出交易。'
        )}
      </span>
    </div>
  );
};

const SpotGuideModal = ({ onClose, isShow }: { isShow: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [startX, setStartX] = useState(null);
  const [iconsUrl, setIconsUrl] = useState('');
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const { locale: lang } = router.query;
  const { isLogin } = useAppContext();

  useEffect(() => {
    Info.getInstance().then(info => {
      setIconsUrl(info.iconsUrl);
    });
  }, []);
  const handleTouchStart = e => {
    setStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = e => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // 滑動超過50px才觸發
      if (diff > 0 && step < 5) {
        // 向左滑
        setStep(step + 1);
      } else if (diff < 0 && step > 1) {
        // 向右滑
        setStep(step - 1);
      }
    }
    setStartX(null);
  };
  const _onClose = useCallback(() => {
		setStep(1);
		setStartX(null);
		onClose();
	}, []);

  const contents = [
    <Step1
      key={1}
      isLogin={isLogin}
      showTransfer={() => {
        _onClose();
        setTransferModalVisible(true);
      }}
    />,
    <Step2 key={2} />,
    <Step3 key={3} />,
    <Step4 key={4} />,
    <Step5 key={5} />
  ][step - 1];
  const title = [LANG('查看资产'), LANG('搜索交易对'), LANG('买入现货'), LANG('查看订单'), LANG('卖出现货')][step - 1];
  let langMap = {
    zh: 'zh_cn',
    'zh-tw': 'zh_tw',
    en: 'en_us'
  };
  const getLang = langMap[lang];
  const guideImgUrl = `${iconsUrl}tutorial/mobile/swap_${getLang}_${theme}_${step}.png`;

  return (
    <>
      <MobileModal visible={isShow} onClose={_onClose} type="bottom">
        <BottomModal displayConfirm={false} title={LANG('如何完成一笔现货交易')}>
          <div className="container">
            <div className="title-wrapper">
              <span className="title">
                {step}.{title}
              </span>
              <div className="page">
                {step}
                <span>/5</span>
              </div>
            </div>
            <div className="swipe-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className={`swipe-item ${index === step - 1 ? 'active' : ''}`}>
                  {contents}
                  <div className="img-wrapper">
                    <Image
                      src={guideImgUrl}
                      // src={'/static/images/swap-info/Transfer.png'}
                      alt=""
                      width={320}
                      height={320}
                      objectFit="fill"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BottomModal>
        <style jsx>{styles}</style>
      </MobileModal>
      {transferModalVisible && (
        <TransferModal
          open={transferModalVisible}
          defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
          defaultTargetAccount={ACCOUNT_TYPE.SPOT}
          onCancel={() => setTransferModalVisible(false)}
        />
      )}
    </>
  );
};

const styles = css`
  .container {
    display: flex;
    flex-direction: column;
    padding: 0 0.5rem;
    padding-bottom: 0.5rem;
    color: var(--text_1);
    overflow-y: auto;
    // min-height: 35rem;
  }
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--text_brand);
    }
    .page {
      font-size: 14px;
      span {
        color: var(--text_3);
      }
    }
  }
  .swipe-container {
    position: relative;
    overflow: hidden;
    flex: 1;
    min-height: 25rem;
    .swipe-item {
      position: absolute;
      width: 100%;
      height: auto;
      transition: transform 0.3s ease;
      transform: translateX(100%);
      &.active {
        transform: translateX(0);
      }
      &:nth-child(1) {
        transform: translateX(0);
      }
      &:nth-child(2) {
        transform: translateX(100%);
      }
      &:nth-child(3) {
        transform: translateX(200%);
      }
      &:nth-child(4) {
        transform: translateX(300%);
      }
      &:nth-child(5) {
        transform: translateX(400%);
      }
    }
  }
  :global(.guide-content) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 1rem;
    font-size: 14px;
    :global(.info, .prompt) {
      line-height: 1.25rem;
      font-weight: 400;
    }
    :global(.more) {
      color: var(--brand);
    }
    :global(.prompt) {
      margin-top: 1rem;
      color: var(--color-red);
    }
    :global(.btn-wrapper) {
      width: 100%;
      display: flex;
      gap: 1rem;
    }
    :global(.btn) {
      flex: 1;
      margin-top: 1rem;
      height: 3rem;
      display: flex;
      padding: 0px 1rem;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      border-radius: 2.75rem;
      background: var(--brand);
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-white);
    }
    :global(.transfer) {
      background: var(--fill_shadow);
      color: var(--text_1);
    }
  }
  .img-wrapper {
    margin-top: 1.5rem;
    height: auto;
    :global(img) {
      width: 100%;
      object-fit: fill;
      height: auto;
    }
  }
  :global(.modal) {
    background-color: var(--fill_pop)!important;
  }
`;
export default SpotGuideModal;
