import { LANG } from '@/core/i18n';

export const StatusButton = ({ status, isTransfer }: { status: number; isTransfer?: boolean }) => {
  // 1 成功 2 失败 6 退币
  const style = {
    borderRadius: '5px',
    padding: '2px 11px',
    textAlign: 'center',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  };
  const styleOptions: any = {
    0: {
      color: 'var(--skin-main-font-color)',
      background: 'var(--skin-primary-bg-color-opacity-1)',
    },
    1: {
      color: '#43BC9C',
      background: 'rgba(67,188,156,0.15)',
    },
    2: {
      color: '#F04E3F',
      background: 'rgba(240,78,63,0.15)',
    },
    3: {
      color: '#9E9E9D',
      background: '#F5F5F3',
    },
    6: {
      color: '#141717',
      background: '#F5F5F3',
    },
  };
  const transferStyleOption: any = {
    0: {
      color: '#EBB30E',
      background: 'rgba(255,211,15,0.15)',
    },
    1: {
      color: '#43BC9C',
      background: 'rgba(67,188,156,0.15)',
    },
    2: {
      color: '#F04E3F',
      background: 'rgba(240,78,63,0.15)',
    },
    3: {
      color: '#9E9E9D',
      background: 'var(--theme-background-color-3)',
    },
    6: {
      color: '#141717',
      background: '#F5F5F3',
    },
  };
  const colorStatus = [1, 2, 6, 3].includes(status) ? status : 0;
  const TITLE_MAP: { [key: string]: string } = {
    1: LANG('成功'),
    2: LANG('失败'),
    6: LANG('已退币'),
    3: LANG('取消'),
    0: LANG('待处理'),
    4: LANG('处理中'),
    5: LANG('提币中'),
  };
  const TRANSFER_TITLE: { [key: string]: string } = {
    0: LANG('待处理'),
    1: LANG('成功'),
    2: LANG('失败'),
    3: LANG('待审核'),
    6: LANG('已退币'),
  };
  if (isTransfer) {
    return TRANSFER_TITLE[status] ? (
      <div style={{ ...style, ...transferStyleOption[colorStatus] }}>{TRANSFER_TITLE[status]}</div>
    ) : (
      <>--</>
    );
  }
  return TITLE_MAP[status] ? (
    <div style={{ ...style, ...styleOptions[colorStatus] }}>{TITLE_MAP[status]}</div>
  ) : (
    <>--</>
  );
};
