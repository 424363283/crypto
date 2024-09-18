import { Button } from '@/components/button';
import { CouponItem } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import css from 'styled-jsx/css';

const Item = ({
  type = 1,
  state = 1,
  amount,
  lever = 0,
  expireTime,
  couponType = 'lite',
  id,
  currency = 'USDT',
  label = '',
  usedAmount = 0,
}: CouponItem) => {
  // 1-待使用；2-已使用；3-已过期
  const stateList = [LANG('去使用'), LANG('已使用'), LANG('已过期')];
  const stateImg = [
    '',
    '/static/images/account/coupon/coupon-used.svg',
    '/static/images/account/coupon/coupon-expired.svg',
  ][state - 1];
  // 类别：1-体验券；2-抵扣金
  const typeList = [couponType === 'lite' ? LANG('体验券') : LANG('体验金'), LANG('抵扣金')];
  const typeTextList: { [key: string]: string } = {
    lite: LANG('简单合约'),
    swap: LANG('永续合约'),
  };
  const typeText = typeTextList[couponType];
  const tipsList = [
    [
      [LANG('最高支持{lever}x杠杆', { lever }), LANG('使用后24小时自动平仓')],
      [LANG('{type}手续费抵扣', { type: typeText })],
    ],
    [[LANG('可抵扣U本位合约保证金，手续费，资金费用')], [LANG('{type}手续费抵扣', { type: typeText })]],
  ];
  const index = couponType === 'lite' ? 0 : 1;
  const typeTips = tipsList[index];
  const className = state !== 1 ? 'disabled' : type === 2 ? 'yellow' : '';
  const path = couponType === 'lite' ? '/lite/BTCUSDT' : '/swap/BTC-USDT';
  const hideUsedAmount = couponType === 'lite' && type === 1;
  const classes = clsx('coupon-card', className);
  const defaultTitle = type === 1 ? LANG('Perpetual Bonus') : LANG('Perpetual Coupon');
  const couponImgUrl =
    state !== 1
      ? '/static/images/account/coupon/coupon-used-card.svg'
      : type === 1
      ? '/static/images/rewards/conpon.png'
      : '/static/images/rewards/bonus.png';
  return (
    <div className={classes}>
      {stateImg && <Image src={stateImg} alt='state-img' className='state-img' width={169} height={150} />}
      <div className='bonus-header'>
        <Image src={couponImgUrl} width={288} height={132} alt='coupon' className='coupon-img' />
        <div className='item'>
          <div className='top line-item'>
            <i></i>
            <span className='title'>{typeList[type - 1]}</span>
            <i></i>
          </div>
          <div className='content'>
            {amount} {currency}
          </div>
          <div className='bottom line-item'>
            <i></i>
            <span className='title'>{LANG('永续合约')}</span>
            <i></i>
          </div>
        </div>
      </div>
      <div className='bonus-content'>
        {<div className='label'>{label ? LANG(label) : defaultTitle}</div>}
        {typeTips[type - 1]?.map((tips, index) => (
          <div className='tips bonus-item' key={index}>
            {tips}
          </div>
        ))}
        {!hideUsedAmount && (
          <div className='used-amout bonus-item'>
            <span>{LANG('剩余')}:</span>
            {amount?.sub(usedAmount)?.toFormat(1) || 0}
          </div>
        )}
        <div className='dountdown-date bonus-item'>
          <span>{LANG('到期时间')}</span>
          <span> {dayjs(expireTime).format('YYYY-MM-DD')}</span>
        </div>
      </div>
      <TrLink href={path?.toLowerCase()} query={type === 1 ? 'cid=' + id : ''} native target='_blank'>
        <Button type='primary' className='right-link '>
          <p>{stateList[state - 1]}</p>
        </Button>
      </TrLink>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Item;
const styles = css`
  .coupon-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 328px;
    min-height: 392px;
    z-index: 2;
    background: var(--theme-background-color-2);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--theme-border-color-2);
    .bonus-header {
      position: relative;
      :global(.coupon-img) {
        width: 100%;
        height: auto;
      }
      .item {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .line-item {
          color: #fff;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0 20px;
          i {
            display: inline-block;
            height: 1px;
            flex: 1;
            background: #19ad8a;
          }
          .title {
            font-size: 14px;
            color: #fff;
            font-weight: 500;
            padding: 0 10px;
          }
        }
        .top {
          position: absolute;
          left: 0;
          top: 16px;
        }
        .bottom {
          position: absolute;
          left: 0;
          bottom: 16px;
        }
        .content {
          color: #fff;
          margin: 0 auto;
          font-size: 38px;
          font-weight: 600;
        }
      }
    }
    .bonus-content {
      .label {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      margin-top: 20px;
      .bonus-item {
        margin-top: 11px;
        color: var(--theme-font-color-3);
        font-size: 14px;
      }
    }
    :global(.right-link) {
      padding: 12px 114px;
      cursor: pointer;
      :global(a) {
        width: 100%;
        height: 100%;
        display: block;
      }
      span {
        font-size: 14px;
        font-weight: 500;
        color: var(--skin-font-color);
        margin-top: 8px;
      }
    }
    :global(.state-img) {
      position: absolute;
      width: auto;
      right: 0;
      bottom: 64px;
    }
    &.disabled {
      pointer-events: none !important;
      :global(.right-link) {
        background: var(--theme-background-color-disabled-light);
        :global(span) {
          color: var(--const-color-grey) !important;
        }
      }
      :global(.bonus-header .item .line-item i) {
        background-color: #8d8d8d !important;
      }
      .label {
        color: #9f9f9f !important;
      }
    }
    &.yellow {
      .bonus-header {
        .item {
          .line-item {
            i {
              background: #e8a324;
            }
          }
        }
      }
    }
  }
`;
