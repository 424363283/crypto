import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

export const StatusIndication = ({ status }: { status: number }) => {
  const TITLE_MAP: { [key: string]: string } = {
    1: LANG('成功'),
    2: LANG('失败'),
    6: LANG('已退币'),
    3: LANG('取消'),
    0: LANG('待处理'),
    4: LANG('处理中'),
    5: LANG('提币中'),
  };
  const COLOR_MAP: { [key: string]: string } = {
    1: '#43BC9C',
    2: '#F04E3F',
    6: 'var(--theme-font-color-placeholder)',
    3: 'var(--theme-font-color-placeholder)',
    0: '#FFD30F',
    4: '#FFD30F',
    5: '#FFD30F',
  };
  return (
    <div className='status-indication'>
      <p className='dot' style={{ backgroundColor: COLOR_MAP[status] }}></p>
      <span className='text'>{TITLE_MAP[status] || '--'}</span>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .status-indication {
    display: flex;
    align-items: center;
    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .text {
      color: var(--theme-font-color-3);
      font-size: 12px;
    }
  }
`;
