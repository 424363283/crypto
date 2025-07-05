import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import clsx from 'clsx';
import css from 'styled-jsx/css';

type TableContentProps = {
  children: React.ReactNode;
  title: string;
  allUrl: string;
  query?: { [key: string]: string };
};

const TableContent = ({ children, title, allUrl, query }: TableContentProps) => {
  const {isMobile} = useResponsive();
  return (
    <div className={clsx('asset-table-content', !isMobile && 'border-1')}>
      <div className='header'>
        <div className='title'>{title}</div>
        <TrLink href={allUrl} query={query} className='all-record'>
          <CommonIcon name='common-convert-history-0' width='20' height='20' className='icon'/>
          {LANG('全部记录')}
        </TrLink>
      </div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .asset-table-content {
    margin: 0 auto;
    max-width: 1224px;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    @media ${MediaInfo.tablet} {
      padding: 0 20px;
    }
    @media ${MediaInfo.mobile} {
      padding: 16px;
      margin: 0;
      border-radius: 8px;
      background:var(--fill_bg_1);
      width: auto;
    }
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 16px 24px;
      @media ${MediaInfo.mobile} {
        padding: 14px 0;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      :global(.all-record) {
        display: flex;
        align-item: center;
        font-size: 14px;
        font-weight: 400;
        color: var(--text_3);
        line-height: 18px;
        :global(.icon) {
          margin-right: 8px;
        }
      }
    }
  }
`;
export default TableContent;
