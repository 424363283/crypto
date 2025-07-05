import CommonIcon from '@/components/common-icon';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { MediaInfo, isSpotEtf } from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const LOCALES: {
  [name: string]: string;
} = {
  de: 'de-de',
  th: 'fil',
  fr: 'fr',
  id: 'id',
  ja: 'ja',
  pt: 'pt',
  ru: 'ru',
  tr: 'tr',
  vi: 'vi',
  zh: 'zh-tw',
  en: 'en-us',
};

const EtfTips = () => {
  const [showEtfTips, setShowEtfTips] = useState(false);
  const router = useRouter();
  const routerId = router.query.id as string;
  const locale = router?.locale as string;

  useEffect(() => {
    if (routerId) {
      const isEtf = isSpotEtf(routerId);
      const isUserClose = localStorageApi.getItem(LOCAL_KEY.SPOT_ETF_RISK_VISIBLE);

      const bool = isEtf && !isUserClose;
      setShowEtfTips(bool);
    }
  }, [routerId]);

  const onCloseBtnClicked = useCallback(() => {
    setShowEtfTips(false);
    localStorageApi.setItem(LOCAL_KEY.SPOT_ETF_RISK_VISIBLE, 'close');
  }, []);

  if (!showEtfTips) return null;

  return (
    <>
      <div className='etf-tips'>
        <CommonIcon name='common-spot-tips-0' size={12} enableSkin />
        <CommonIcon
          name='common-close-filled'
          size={16}
          enableSkin
          className='close-icon'
          onClick={onCloseBtnClicked}
        />
        <span className='bold'>{LANG('风险提示：')}</span>
        <span>
          {LANG(
            '交易前请注意查看净值价格，该产品在极端行情下会存在价格趋近于归零的风险，请投资者注意控制风险，并仔细阅读'
          )}
        </span>
        <a
          target='_blank'
          href={`https://support.YMEX.com/hc/${
            LOCALES?.[locale] ? LOCALES?.[locale] : 'en-us'
          }/articles/5692456018319`}
          style={{
            color: 'var(--skin-main-font-color )',
          }}
        >
          {LANG('杠杆代币介绍')}
        </a>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default EtfTips;
const styles = css`
  .etf-tips {
    background: var(--theme-tips-color);
    color: var(--theme-font-color-1);
    margin-top: 20px;
    border-radius: 8px;
    position: relative;
    padding: 20px;
    .bold {
      font-weight: 500;
    }
    :global(img) {
      margin-right: 10px;
    }
    @media ${MediaInfo.tablet} {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    a {
      margin-left: 4px;
    }
    :global(.close-icon) {
      position: absolute;
      top: 6px;
      right: 6px;
      margin-right: 0;
      cursor: pointer;
    }
  }
`;
