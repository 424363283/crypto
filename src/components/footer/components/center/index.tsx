import Report from '@/components/footer/components/report';
import { ExternalLink } from '@/components/link';
import { useResponsive, useResponsiveClsx, useRouter } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { getList } from '../../getList';
import LogoIcon from '@/components/header/components/icon/logo-icon';
import { Collapse } from 'antd';
import CommonIcon from '@/components/common-icon';

import Twitter from '@/icons/home/Twitter.svg';
import Telegram from '@/icons/home/Telegram.svg';
import LinkedIn from '@/icons/home/LinkedIn.svg';
import Facebook from '@/icons/home/Facebook.svg';
import Discord from '@/icons/home/Discord.svg';
import CoinMarketCap from '@/icons/home/CoinMarketCap.svg';
import { Svg } from '@/components/svg';
import YIcon from '@/components/YIcons';

const { Panel } = Collapse;
const Center = () => {
  const { locale } = useRouter();
  const list = getList(locale);
  const { isDesktop } = useResponsive();
  const { setResponsiveClsx } = useResponsiveClsx();
  const { isMobile } = useResponsive(false);
  const ListLogo = [
    {
      label: 'Twitter',
      href: 'https://x.com/ymex_official?s=11&mx=2',
      blank: true,
      icon: '/static/images/home/Twitter.svg'
    },
    // { label: 'Telegram', href: 'https://t.me/YMEXChinese/1', blank: true, icon: '/static/images/home/Telegram.svg' },
    { label: 'Discord', href: 'https://discord.gg/jNxDeNVe', blank: true, icon: '/static/images/home/Discord.svg' }
  ];

  return (
    <div className="footer">
      {!isMobile ? (
        <div className={clsx('footer-wrap')}>
          <div className={clsx('footer-header')}>
            <div className={clsx('footer-logo')}>
              <LogoIcon />
              <span className={clsx('copyright')}>© 2025 YMEX</span>
            </div>
            <div className="footer-logoLink">
              {ListLogo?.map(item => {
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                    <Svg className="ListLogoSvg" src={item.icon} width={20} height={20} />
                  </a>
                );
              })}
            </div>
          </div>
          <div className={clsx('common-center-wrapper', setResponsiveClsx('center-wrapper', 'tablet-center-wrapper'))}>
            {list?.map(({ label = '', children = [] }, key) => {
              return (
                <div key={key} className="item">
                  <h4 className="title">{label}</h4>
                  {children?.map(({ label = '', href = '', blank = false, tooltip = false }, i) => {
                    if (blank) {
                      return (
                        <p key={i}>
                          <ExternalLink key={i} href={href}>
                            {label}
                          </ExternalLink>
                        </p>
                      );
                    }
                    if (tooltip) {
                      return (
                        <p key={i}>
                          <Report text={label} />
                        </p>
                      );
                    }

                    return (
                      <p key={i}>
                        <TrLink href={href} native target={blank ? '_blank' : '_self'} hrefLang={locale}>
                          {label}
                        </TrLink>
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="footer">
          <Collapse
            bordered={false}
            className="custom-collapse"
            expandIconPosition="end"
            expandIcon={() => <CommonIcon name='common-mobile-triangle-down' size={16} />}
          >
            {list?.map(({ label = '', children = [] }, key) => {
              return (
                <Panel header={label} key={key} className="footer-panel">
                  {children?.map(({ label = '', href = '', blank = false, tooltip = false }, i) => {
                    if (blank) {
                      return (
                        <p key={i}>
                          <ExternalLink key={i} href={href}>
                            {label}
                          </ExternalLink>
                        </p>
                      );
                    }
                    if (tooltip) {
                      return (
                        <p key={i}>
                          <Report text={label} />
                        </p>
                      );
                    }

                    return (
                      <p key={i}>
                        <TrLink href={href} native target={blank ? '_blank' : '_self'} hrefLang={locale}>
                          {label}
                        </TrLink>
                      </p>
                    );
                  })}
                </Panel>
              );
            })}
          </Collapse>
        </div>
      )}

      <style jsx>{`
        :global(.custom-collapse) {
          display: flex ;
          flex-direction: column;
          gap: 8px;
          padding: 40px 16px;
          :global(.ant-collapse-item) {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-bottom: none;
            :global(.ant-collapse-header) {
              display: flex;
              align-items: center;
              color: var(--text_1);
              font-family: "Lexend";
              font-size: 16px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              height: 40px;
            }
          }
          :global(.ant-collapse-item-active) {
            :global(.ant-collapse-arrow) {
              transform: rotate(180deg);
            }
          }
          :global(.ant-collapse-content-box) {
            padding: 0 !important;
            display: flex;
            flex-direction: column;
            gap: 8px;
            p {
              display: flex;
              align-items: center;
              line-height: normal;
              height: 40px;
              padding: 0 16px;
            }
            :global(a), :global(span) {
              color: var(--text_3);
               font-family: "Lexend";
              font-size: 14px;
              font-style: normal;
              font-weight: 300;
              line-height: normal;
            }
          }
          :global(.ant-collapse-header) {
            padding: 0 !important;
            :global(.ant-collapse-expand-icon) {
              height: 10px;
            }
          }
        }
        .footer-wrap {
          width: 100%;
          display: flex;
        }
        .footer-logoLink {
          display: flex;
          align-items: center;
          margin-top: 24px;

          :global(.ListLogoSvg) {
            margin-right: 16px;
            cursor: pointer;
            :global(svg) {
              fill: var(--text_3);
            }
            &:hover {
              :global(svg) {
                fill: var(--brand);
              }
            }
          }
        }
        .footer-logo {
          display: flex;
          align-items: center;
          align-self: stretch;
          font-size: 20px;
          font-weight: 900;
          gap: 4px;
          :global(.ymex) {
            color: var(--text_white);
          }
          :global(.global) {
            color: var(--brand);
          }
          :global(.copyright) {
            color: var(--text_3);
            font-size: 14px;
            font-weight: 300;
          }
        }
        .common-center-wrapper {
          flex: 1;
          margin-left: 120px;
          .item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            p {
              color: var(--text_3);
              font-size: 14px;
              font-weight: 400;
            }
            :global(a),
            :global(span) {
              text-decoration: none;
              outline: none;
              color: var(--text_3);
              font-size: 14px;
              font-weight: 300;
            }
            .title {
              color: var(--text_1);
              font-size: 16px;
              font-weight: 500;
            }
          }
        }
        .center-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          align-self: stretch;
          /* padding: 40px 0; */
          padding: 0px 0px 40px 0px;

          @apply common-center-wrapper;
        }
        .tablet-center-wrapper {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin-left: 100px;
          .item {
            flex-basis: 50%;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};
export default Center;
