import CommonIcon from '@/components/common-icon';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import Image from 'next/image';
import css from 'styled-jsx/css';
import State from '../state';

type ItemProps = {
  title: string;
  amount: string;
  maxAmount: string;
  progress: number;
  prompt: string;
  link: string;
  linkText: string;
};

const Content = ({ list }: any) => {
  return (
    <div className='progress'>
      <div className='title'>{LANG('My VIP level progress')}</div>
      <div className='content'>
        {list.map(({ title, amount, progress, link, prompt, linkText, maxAmount }: ItemProps, index: number) => (
          <div className={'item'} key={index}>
            <div className='i-title'>{title}</div>
            <div className='i-amount'>{amount}</div>
            <div className='i-progress'>
              <div style={{ width: progress + '%' }}></div>
            </div>
            <div className='i-maxAmount'>
              {amount}/{maxAmount?.toFormat()}USDT
            </div>
            <div className='i-prompt' dangerouslySetInnerHTML={{ __html: prompt }} />
            <TrLink className='i-link' href={link}>
              {linkText}
              <CommonIcon name='common-arrow-right-active-0' width='12' height='12' className='right' enableSkin />
            </TrLink>
          </div>
        ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const Box = ({ list }: any) => {
  return (
    <div className='progress'>
      <div className='content'>
        <div className='title'>{LANG('My VIP level progress')}</div>
        <div className='prompt'>
          {LANG('Once you’ve achieved either of the specified criteria, you will automatically be upgraded.')}
        </div>
        {list.map(({ title, amount, progress, link, prompt, linkText, maxAmount }: ItemProps, index: number) => (
          <div className={'item'} key={index}>
            <div className='i-title'>
              {title}
              <TrLink className='i-link' href={link}>
                {linkText}
                <Image src={'/static/images/common/right.png'} alt='right' width='12' height='12' className='right' />
              </TrLink>
            </div>
            <div className='i-progress'>
              <div style={{ width: progress + '%' }}></div>
            </div>
            <div className='i-amount'>
              {amount}/{maxAmount?.toFormat()}USDT
            </div>
          </div>
        ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const Progress = () => {
  const { state } = State();
  const { levelData, level } = state;
  const { isLogin } = useAppContext();
  const { query }: any = useRouter();
  const showRate = query?.showRate;
  const _getProgress = (progress: string) => {
    return Number(progress) > 100 ? 100 : progress;
  };
  const list = [
    // {
    //   title: LANG('Spot trading volume(30 days/USDT)')?.replace('/USDT', ''),
    //   amount: levelData?.spot?.current?.toFormat(0) + 'USDT',
    //   maxAmount: levelData?.spot?.target,
    //   progress: _getProgress(levelData?.spot?.current.div(levelData?.spot?.target).mul(100).toFixed(2)),
    //   // prompt:LANG('To unlock the next level, increase your trading volume by <span>{number}</span>', {
    //   //   number: levelData?.spot?.target?.toFormat(0) + 'USDT',
    //   // }),
    //   prompt: LANG('您当前的现货交易量进度'),
    //   link: '/spot/btc_usdt',
    //   linkText: LANG('Spot Trade'),
    // },
    {
      title: LANG('Futures trading volume(30 days/USDT)')?.replace('/USDT', ''),
      amount: levelData?.swap?.current?.toFormat(0) + 'USDT',
      progress: _getProgress(levelData?.swap?.current.div(levelData?.swap?.target).mul(100).toFixed(2)),
      maxAmount: levelData?.swap?.target,
      prompt:
        level === 5
          ? LANG('恭喜您已经升到vip最高等级')
          : LANG('To unlock the next level, increase your trading volume by <span>{number}</span>', {
              number: levelData?.swap?.target?.toFormat(0) + 'USDT',
            }),
      link: '/swap/btc-usdt',
      linkText: LANG('Futures Trade'),
    },
    {
      title: LANG('Asset balance(30 days)'),
      amount: levelData?.asset?.current?.toFormat(2) + 'USDT',
      progress: _getProgress(levelData?.asset?.current.div(levelData?.asset?.target).mul(100).toFixed(2)),
      maxAmount: levelData?.asset?.target,
      prompt:
        level === 5
          ? LANG('恭喜您已经升到vip最高等级')
          : LANG('To unlock the next level, increase your asset balance by <span>{number}</span>', {
              number: levelData?.asset?.target?.toFormat(2) + 'USDT',
            }),
      link: '/account/fund-management/asset-account/recharge',
      linkText: LANG('Deposit'),
    },
  ];

  if (!isLogin || !showRate) return null;
  return (
    <>
      <Content list={list} />
      <Box list={list} />
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .progress {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    color: var(--theme-font-color-1);
    .title {
      font-size: 36px;
      font-weight: 600;
      line-height: 146px;
    }
    .prompt {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: var(--theme-font-color-2);
      margin-top: 6px;
    }
    .content {
      display: flex;
      align-items: center;
      border-radius: 12px;
      border: 1px solid var(--skin-border-color-1);
      padding: 30px 0;
      .item {
        padding: 0 32px 0;
        flex: 1;
        &:nth-child(2) {
          border-left: 1px solid var(--skin-border-color-1);
          /* border-right: 1px solid var(--skin-border-color-1); */
        }
        .i-title {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: var(--theme-font-color-2);
        }
        .i-amount {
          font-size: 26px;
          font-weight: 600;
          padding-bottom: 16px;
        }
        .i-maxAmount {
          font-size: 14px;
          font-weight: 500;
          text-align: right;
        }

        .i-progress {
          background: var(--theme-background-color-disabled-light);
          height: 6px;
          border-radius: 3px;
          position: relative;
          div {
            background: var(--skin-color-active);
            height: 6px;
            border-radius: 3px;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .i-prompt {
          font-size: 14px;
          font-weight: 400;
          line-height: 19px;
          color: var(--theme-font-color-2);
          padding: 10px 0 20px;
          :global(span) {
            font-size: 14px;
            font-weight: 600;
            color: var(--theme-font-color-1);
          }
        }
        :global(.i-link) {
          color: var(--skin-color-active);
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          :global(.right) {
            width: auto;
            height: 12px;
            margin-left: 8px;
          }
        }
      }
    }
    @media ${MediaInfo.desktop} {
      &:nth-child(2) {
        display: none;
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 0 32px;

      &:nth-child(1) {
        display: none;
      }
      .title {
        font-size: 24px;
        line-height: 30px;
      }
      .content {
        display: block;
        padding: 32px 24px 20px;
        .item {
          padding: 12px 0;
          .i-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
          }
          .i-amount {
            font-size: 14px;
            font-weight: 400;
            padding-top: 10px;
            padding-bottom: 0;
          }
        }
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
      &:nth-child(1) {
        display: none;
      }
      .title {
        font-size: 20px;
        line-height: 26px;
      }
      .prompt {
        font-size: 12px;
      }
      .content {
        display: block;
        padding: 24px 12px 10px;
        .item {
          padding: 8px 0;
          .i-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 8px;
            font-size: 12px;
          }
          .i-amount {
            font-size: 12px;
            padding-top: 6px;
            padding-bottom: 0;
          }
          :global(.i-link) {
            font-size: 12px;
            :global(.right) {
              width: auto;
              height: 10px;
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
`;

export default Progress;
