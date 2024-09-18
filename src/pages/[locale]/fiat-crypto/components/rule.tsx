import { Svg } from '@/components/svg';
import { Zendesk } from '@/components/zendesk';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';

const kycLang = ['id', 'vi'];

const Item = ({ title, text }: { title: string; text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const faqIcon = isExpanded ? '/static/images/affiliate/minus.svg' : '/static/images/affiliate/plus.svg';

  return (
    <div className={clsx('item', isExpanded && 'active')} onClick={() => setIsExpanded(!isExpanded)}>
      <div className='i-title'>
        <Svg src={faqIcon} width={24} height={24} className={clsx('icon', !isExpanded && 'icon-expanded')} />
        <span>{title}</span>
      </div>
      <div className='i-text'>{text}</div>
      <style jsx>{styles}</style>
    </div>
  );
};

const Rule = () => {
  const router = useRouter();
  const { locale } = router.query;

  const rules = [
    {
      title: LANG('快捷买币是否有手续费？'),
      text: LANG('大部分服务商会收取交易费。具体手续费请查看各服务商的官方网站。'),
    },
    {
      title: LANG('YMEX 是否收取手续费？'),
      text: LANG('用户在使用快捷买币的过程中，YMEX 不会收取任何手续费。'),
    },
    {
      title: LANG('为什么我在服务商获得的最终报价和我在 YMEX 平台上看到的不一样？'),
      text: LANG(
        'YMEX 展示的报价是基于第三方服务商所提供的实时价格计算，仅供参考。最终汇率请参考服务商的官方网站，可能因为行情变化或计算误差有偏离。'
      ),
    },
    {
      title: LANG('我购买的虚拟货币多长时间会到账？'),
      text: LANG(
        '成功购买后，您通常会在2-30分钟内在您的 YMEX 账户中收到您购买的虚拟货币。处理时间可能会因为区块链网络情况或供应商服务状况花费更久，新用户的处理时长或将达到一天。'
      ),
    },
    {
      title: LANG('YMEX 是否需要 KYC？'),
      text: LANG('仅印尼和越南法币充值需要KYC，用户需要在提现前将充值金额的20%以简单合约或永续合约进行交易。'),
    },
  ];

  return (
    <div className='rule'>
      <h3>
        <span>{LANG('常见问题')}</span>
        <Zendesk className='rule-a' href='/sections/5715223197967-Buy-Crypto'>
          {LANG('更多问题')}
        </Zendesk>
      </h3>
      {rules.map(({ text, title }, index) => {
        if (!kycLang?.includes(locale) && index === 4) return null;
        return <Item key={title} title={title} text={text} />;
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

export default Rule;

const styles = css`
  .rule {
    color: var(--theme-font-color-3);
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    padding: 20px 0;
    h3 {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 45px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--theme-font-color-1);
      :global(.rule-a) {
        font-size: 14px;
        font-weight: 500;
        color: var(--skin-main-font-color);
      }
    }
    .item {
      cursor: pointer;
      margin-bottom: 20px;
      .i-title {
        display: flex;
        align-items: center;
        :global(.icon) {
          fill: var(--theme-font-color-1);
        }
        :global(.icon-expanded) {
          fill: var(--theme-font-color-3);
        }
        span {
          margin-left: 15px;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .i-text {
        display: none;
        font-size: 14px;
        font-weight: 400;
        padding-left: 10px;
        margin: 20px 0 0 40px;
        border-left: 2px solid var(--skin-color-active);
      }
      &.active {
        .i-title {
          color: var(--theme-font-color-1);
        }
        .i-text {
          display: block;
        }
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 0 32px;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
    }
  }
`;
