import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { getEtfCryptoInfo } from '@/core/utils';
import { CloseOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';

const EtfTips = ({ isLimit }: { isLimit: boolean }) => {
  const id = useRouter().query.id as string;

  const [showEtfTips, setShowEtfTips] = useState(false);
  const { theme, isDark } = useTheme();

  const { locale } = useAppContext();

  useEffect(() => {
    if (id) {
      const { isEtf } = getEtfCryptoInfo(id);
      const isUserClose = localStorage['isUserClose'];
      const bool = isEtf && !isUserClose;
      setShowEtfTips(bool);
    }
  }, [id]);

  const renderGlobalStyles = useMemo(() => {
    const eftHeight = showEtfTips ? 0 : 48;
    const leftHeight = 991 - eftHeight + 'px';
    const rightHeight = 439 - eftHeight + 'px';
    const centerHeight = 370 - eftHeight + 'px';
    return (
      <style jsx global>
        {`
          .spot-layout-top-left {
            height: ${leftHeight} !important;
          }
          .spot-layout-top-right {
            .recent-trades {
              height: ${rightHeight} !important;
            }
          }
          .spot-layout-top-center {
            .trade-view {
              height: ${centerHeight} !important;
            }
          }
        `}
      </style>
    );
  }, [showEtfTips, isLimit]);

  const onCloseBtnClicked = useCallback(() => {
    setShowEtfTips(false);
    localStorage['isUserClose'] = 'close';
  }, []);
  return (
    <>
      <div>
        {showEtfTips && (
          <div className='eft-tips'>
            <div>
              <span>{LANG('ETF杠杆代币波动较大，请在交易前注意查看净值价格，并仔细阅读')}</span>
              <a
                target='_blank'
                href={`https://support.YmexYmex.com/hc/${
                  locale === 'zh' ? 'zh-cn' : 'en-us'
                }/sections/5691989278095-Leveraged-Tokens`}
                style={{
                  fontSize: '10px',
                  color: 'var(--skin-primary-color)',
                }}
              >
                {LANG('《ETF杠杆代币使用说明》')}
              </a>
            </div>
            <button className='closeIcon' onClick={onCloseBtnClicked}>
              <CloseOutlined style={{ fontSize: '10px', color: `${isDark ? '#fff' : '#000'}` }} />
            </button>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
      {renderGlobalStyles}
    </>
  );
};

export default EtfTips;

const styles = css`
  .eft-tips {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-bottom: var(--theme-trade-layout-gap) solid var(--theme-trade-bg-color-1);
    font-size: 12px;
    padding: 12px;
    background: var(--theme-trade-bg-color-2);
    color: var(--theme-font-color-1);
    font-weight: 500;
    .closeIcon {
      cursor: pointer;
      padding: 5px;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--theme-tips-color);
      border-radius: 2px;
      border: none;
      outline: none;
    }
  }
`;
