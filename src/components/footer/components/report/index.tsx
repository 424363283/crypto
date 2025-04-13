import Tooltip from '@/components/trade-ui/common/tooltip';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

export default function Report({ text }: { text?: string }) {
  return (
      <>
        <Tooltip
            placement='top'
            title={
              <div className='report'>
                <div className='title'>{LANG('若您发现如下内容')}:</div>
                <div className='text'>1、{LANG('收受贿赂')}</div>
                <div className='text'>2、{LANG('弄虚作假')}</div>
                <div className='text'>3、{LANG('泄漏机密')}</div>
                <div className='text'>4、{LANG('侵占资产')}</div>
                <div className='text'>5、{LANG('盗用资源')}</div>
                <div className='text'>6、{LANG('让渡利益')}</div>
                <div className='text'>7、{LANG('其他')}</div>
                <div className='prompt'>
                  {LANG('您可向{brand}进行举报。我们将根据举报内容，向线索提供者予以奖励，并对提供者信息予以保密', {
                    brand: process.env.NEXT_PUBLIC_APP_NAME,
                  })}
                </div>
                <div
                    className='email'
                    dangerouslySetInnerHTML={{
                      __html: LANG('举报邮箱：<span>{email}</span>', { email: 'service@ml.y-mex.com' }),
                    }}
                />
                <style jsx>{styles}</style>
              </div>
            }
        >
          <span>{text}</span>
        </Tooltip>
      </>
  );
}

const styles = css`
  .report {
    padding: 10px;
    .title {
      color: var(--theme-font-color-1);
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 40px;
    }
    .text {
      color: var(--theme-font-color-3);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
    }
    .prompt {
      color: var(--theme-font-color-3);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      padding: 30px 0;
    }
    .email {
      color: var(--theme-font-color-3);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      :global(span) {
        color: var(--color-active-yellow);
      }
    }
  }
`;
