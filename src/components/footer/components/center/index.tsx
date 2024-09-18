import Report from '@/components/footer/components/report';
import { ExternalLink } from '@/components/link';
import { useResponsive, useResponsiveClsx, useRouter } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { getList } from '../../getList';

const Center = () => {
  const { locale } = useRouter();
  const list = getList(locale);
  const { isDesktop } = useResponsive();
  const { setResponsiveClsx } = useResponsiveClsx();
  return (
    <div className={clsx('common-center-wrapper', setResponsiveClsx('center-wrapper', 'tablet-center-wrapper'))}>
      {list?.map(({ label = '', children = [] }, key) => {
        return (
          <div key={key} className='item'>
            <h4 className='title'>{label}</h4>
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
      <style jsx>{`
        .common-center-wrapper {
          .item {
            text-align: left;
            p {
              padding: 6px 0;
              margin: 0;
            }
            :global(a),
            :global(span) {
              text-decoration: none;
              outline: none;
              color: var(--theme-font-color-3);
              font-size: 16px;
              font-weight: 400;
              &:hover {
                color: var(--theme-font-color-1);
              }
            }
            .title {
              color: var(--theme-font-color-1);
              padding-bottom: 10px;
              font-size: 20px;
              font-weight: 500;
            }
          }
        }
        .center-wrapper {
          border: ${isDesktop ? '1px solid var(--theme-border-color-2);' : 'none'};
          padding: 40px 0;
          border-left: none;
          border-right: none;
          display: flex;
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-right: 10px;
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
