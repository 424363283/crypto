import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export const AssetsBottomTitle = () => {
  return (
    <p className='assets-title'>
      {LANG('资产分布')}
      <style jsx>{styles}</style>
    </p>
  );
};
const styles = css`
  .assets-title {
    padding-bottom: 14px;
    padding-top: 14px;
    border-bottom: 1px solid var(--theme-border-color-2);
    padding-left: 15px;
    font-size: 16px;
    font-weight: 500;
    color: var(--theme-font-color-6);
    @media ${MediaInfo.desktop} {
      padding-top: 0px;
    }
    @media ${MediaInfo.tablet} {
      margin-top: 30px;
    }
  }
`;
