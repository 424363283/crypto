import { useCallback, useEffect, useState } from 'react';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Info, Swap } from '@/core/shared';
import { useRouter, useTheme } from '@/core/hooks';
import { useAppContext } from '@/core/store';
import Image from 'next/image';
import { Zendesk } from '@/components/zendesk';

const Step1 = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  return (
    <div className="guide-content">
      <span className="info">{LANG('从您的现货钱包中划转资金到合约账户作为合约账户保证金')}</span>
      <div
        className="btn"
        onClick={() => {
          const agreeAgreement = Swap.Info.store.agreement.allow;
          onClose();
          if (agreeAgreement) {
            Swap.Trade.setTransferModalVisible();
          } else {
            router.push('/login');
          }
        }}
      >
        {LANG('立即划转')}
      </div>
    </div>
  );
};
const Step2 = () => (
  <div className="guide-content">
    <span className="info">
      {LANG(
        '根据自身喜好选择保证金模式（全仓或逐仓），同时根据自身的风险承受能力选择合适的杠杆倍数；YMEX最高支持200倍杠杆倍数。'
      )}
    </span>
    <span className="prompt">{LANG('新手用户建议使用10倍以下杠杆')}</span>
  </div>
);
const Step3 = () => (
  <div className="guide-content">
    <span className="info">{LANG('根据您对涨跌的预判在填写价格和数量之后，可选买多/买空。')}</span>
    <span className="info">{LANG('预测涨则买多；预测跌则卖空')}</span>
  </div>
);
const Step4 = () => (
  <div className="guide-content">
    <span className="info">{LANG('您可以在行情图下方查看您的仓位和订单详情，当订单成交后即可会拥有对应的仓位')}</span>
  </div>
);
const Step5 = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  return (
    <div className="guide-content">
      <span className="info">
        {LANG('持有仓位后，您可以在持有仓位区域平仓。')}
        {''}
        <Zendesk className="more" href="/categories/11309463310991-%E6%B0%B8%E7%BA%8C%E5%90%88%E7%B4%84">
          {LANG('了解更多')}
        </Zendesk>
      </span>
      <div
        className="btn"
        onClick={() => {
          onClose();
        }}
      >
        {LANG('开始交易')}
      </div>
    </div>
  );
};

const GuideModal = ({ onClose, isShow }: { isShow: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [startX, setStartX] = useState(null);
  const [iconsUrl, setIconsUrl] = useState('');
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

  const contents = [
    <Step1 key={1} onClose={onClose} />,
    <Step2 key={2} />,
    <Step3 key={3} />,
    <Step4 key={4} />,
    <Step5 key={5} onClose={onClose} />
  ][step - 1];
  const title = [LANG('划转保证金'), LANG('杠杆与保证金模式'), LANG('开仓'), LANG('查看仓位和订单'), LANG('平仓')][
    step - 1
  ];
  let langMap = {
    zh: 'zh_cn',
    'zh-tw': 'zh_tw',
    en: 'en_us'
  };
  const getLang = langMap[lang];
  const guideImgUrl = `${iconsUrl}tutorial/h5_swap_${getLang}_${theme}_${step}.png`;
  // console.log(guideImgUrl);
  // console.log(guideImg);
  return (
    <MobileModal visible={isShow} onClose={onClose} type="bottom">
      <BottomModal displayConfirm={false} title={LANG('如何完成一笔合约交易')}>
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
    min-height: 32.5rem;
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
    :global(.btn) {
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
      color: var(--text_white);
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
    background-color: var(--fill_pop) !important;
  }
`;
export default GuideModal;
