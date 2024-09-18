import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const Info = () => {
  return (
    <div className='info'>
      <h1 className='title'>
        <Image src='/static/images/fiat-crypto/icon1.png' alt='' height='20' width='42' />
        <span>{LANG('如何使用快捷买币')}</span>
      </h1>
      <div className='step'>
        <div className='step-item'>
          <div className='round-box'>
            <div className='round'>
              <i />
            </div>
            <div className='line'></div>
          </div>
          <div className='i-text'>{LANG('输入购买金额，选择支付方式')}</div>
        </div>
        <div className='step-item'>
          <div className='round-box'>
            <div className='round'>
              <i />
            </div>
            <div className='line'></div>
          </div>
          <div className='i-text'>{LANG('选择支付渠道')}</div>
        </div>
        <div className='step-item'>
          <div className='round-box'>
            <div className='round'>
              <i />
            </div>
            <div className='line'></div>
          </div>
          <div className='i-text'>{LANG('确认订单信息后进入第三方页面')}</div>
        </div>
        <div className='step-item'>
          <div className='round-box'>
            <div className={clsx('round', 'yellow')}>
              <Image src='/static/images/fiat-crypto/icon4.png' alt='' height='16' width='16' />
            </div>
          </div>
          <div className='i-text'>{LANG('通过第三方完成付款，数字货币将自动存入您的钱包账户')}</div>
        </div>
      </div>
      <div className='title'>{LANG('我们已支持')}</div>
      <div className='box'>
        <div className='b-item'>
          <div className='b-title'>{LANG('加密货币')}</div>
          <div className='b-number'>360+</div>
          <div className='more'>
            <Image src='/static/images/fiat-crypto/icon2.png' alt='' height='30' width='135' />
            <div className='more-btn'>{LANG('更多')}+</div>
          </div>
        </div>
        <div className='b-item'>
          <div className='b-title'>{LANG('法币')}</div>
          <div className='b-number'>90+</div>
          <div className='more'>
            <Image src='/static/images/fiat-crypto/icon3.png' alt='' height='30' width='135' />
            <div className='more-btn'>{LANG('更多')}+</div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Info;

const styles = css`
  .info {
    color: var(--theme-font-color-1);
    .title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 500;
      :global(img) {
        height: 20px;
        width: auto;
      }
    }
    .step {
      padding: 30px 0 60px;
      .step-item {
        display: flex;
        gap: 20px;
        .round-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .round {
            width: 20px;
            height: 20px;
            border: 1px solid var(--skin-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &.yellow {
              background: var(--skin-primary-color);
            }
            i {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--skin-primary-color);
            }
          }
          .line {
            height: 28px;
            border-right: 1px dashed var(--skin-primary-color);
          }
        }
        .i-text {
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
    .box {
      display: flex;
      gap: 56px;
      padding-top: 30px;
      .b-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
        .b-title {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
        }
        .b-number {
          font-size: 24px;
          line-height: 1.5;
          font-weight: 500;
        }
        .more {
          display: flex;
          align-items: center;
          gap: 15px;
          .more-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 400;
            height: 30px;
            padding: 0 12px;
            border: 1px solid var(--theme-border-color-3);
            border-radius: 15px;
            cursor: pointer;
          }
        }
      }
    }
  }
`;
