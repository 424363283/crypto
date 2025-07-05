import { Button } from '@/components/button';
import { useDeviceDownloadUrl } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { MainContent } from './main-content';
import { MediaInfo } from '@/core/utils';

export const Download = ({ next }: { next: () => void }) => {
  const { downloadLink } = useDeviceDownloadUrl();
  return (
    <MainContent className='download-wrapper' title={LANG('第一步：安装验证器应用')}>
      <div className='dis'>
        <img src='/static/images/account/ga-verify.svg' width={100} height={100} className='google-log'/>
        <p>{ LANG('身份验证器应用') }</p>
        <span>(Authenticator)</span>
      </div>
      <Button type='primary' onClick={next} className='next-btn'>
        {LANG('我已安装，下一步')}
      </Button>
      <style jsx>{styles}</style>
    </MainContent>
  );
};

const styles = css`
  :global(.download-wrapper) {
    .dis{
      margin: 30px auto;
      display: flex;
      flex-direction:column;
      align-items: center;
      justify-content: center;
      color:var(--text_3);
      .google-log{
        margin-bottom:45px;
      }
    }
    :global(.next-btn) {
      width: 100%;
      height: 56px;
      line-height: 56px;
      border-radius:28px;
      display: block;
      @media ${MediaInfo.mobile} {
        height: 48px;
        line-height: 48px;
      }
    }
  }
`;
