import Image from '@/components/image';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { Tooltip } from 'antd';
import css from 'styled-jsx/css';
import { Desktop } from '../responsive';
import { ScaleText } from '../scale-text';

export enum INCOME_TYPE {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  TOTAL = 'total',
}

interface Props {
  type: INCOME_TYPE;
  value: number | string;
}

const Data = {
  today: {
    icon: '/static/images/affiliate/today-income.svg',
    title: LANG('今日佣金收入') + '(USDT)',
    tooltip: LANG('数据是U本位永续合约和币币交易的总数据，每小时更新一次。'),
  },
  yesterday: {
    icon: '/static/images/affiliate/yesterday-income.svg',
    title: LANG('昨日佣金收入') + '(USDT)',
    tooltip: LANG('数据是U本位永续合约和币币交易的总数据，每小时更新一次。'),
  },
  total: {
    icon: '/static/images/affiliate/total-income.svg',
    tooltip: LANG('数据是U本位永续合约和币币交易的总数据，实时更新。'),
    title: LANG('总佣金收入') + '(USDT)',
  },
};

const Income = ({ type, value }: Props) => {
  const { isDesktop } = useResponsive();
  return (
    <>
      <div className={`container`}>
        <div className={`${type === INCOME_TYPE.TODAY ? 'yellow' : ''} income`}>
          <ScaleText money={value} currency={'USDT'} />
          {!isDesktop && (
            <Tooltip color='#fff' placement='top' title={Data[type].tooltip}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
            </Tooltip>
          )}
        </div>
        <div className='divider' />
        <div className={`description`}>
          <Image src={Data[type].icon} height='15' width='15' enableSkin />
          <span>{Data[type].title}</span>
          <Desktop>
            <Tooltip color='#fff' placement='top' title={Data[type].tooltip}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
            </Tooltip>
          </Desktop>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Income;

const styles = css`
  .container {
    flex: 1;
    min-height: 100px;
    background: var(--theme-background-color-2);
    border-radius: 15px;
    padding: 15px 19px;
    @media ${MediaInfo.mobile} {
      padding: 15px 10px;
      .income {
        font-size: 20px;
      }
    }
    .income {
      line-height: 30px;
      font-size: 24px;
      font-weight: 500;
      color: var(--theme-common-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.yellow {
        color: var(--skin-primary-color);
      }
    }
    .divider {
      height: 1px;
      background: var(--theme-border-color-2);
      margin-top: 13px;
      margin-bottom: 10px;
    }
    .description {
      display: flex;
      align-items: center;
      text-wrap: wrap;
      > span {
        color: var(--theme-font-color-3);
        margin-left: 6px;
      }
      :global(.tips) {
        margin-left: auto;
      }
      @media ${MediaInfo.mobile} {
        > span {
          font-size: 12px;
        }
      }
    }
  }
  :global(.ant-tooltip-inner),
  :global(.ant-tooltip-arrow:before) {
    background: var(--theme-background-color-2-3) !important;
    color: var(--theme-font-color-1) !important;
  }
`;
