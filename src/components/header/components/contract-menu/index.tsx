import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { LANG, TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useHover } from 'react-use';
import css from 'styled-jsx/css';
import Simple from './components/simple';
import SpotEtf from './components/spot-etf';
import Perpetual from './components/swap';

export const resetZeroHeight = () => {
  const element = document.querySelector('.commodity-menu-box') as HTMLDivElement;
  element && (element.style.height = '0px');
};

interface MenuProps {
  title: string;
  tips: string;
  hot?: boolean;
  newTag?: boolean;
  className?: string;
  subMenu?: React.ReactNode;
  active?: boolean;
  onHover?: () => void;
  href: string;
  arrow?: boolean;
}

const Menu = ({ title, tips, hot, className, subMenu, active, onHover, href, arrow = true, newTag }: MenuProps) => {
  const { ref, inView } = useInView();
  const content = (
    <div className={clsx(active ? 'hover' : '', 'menu-wrapper', className)} ref={ref}>
      <div className='left-wrapper'>
        <div className='item-wrapper'>
          <TrLink native className='title' href={href}>
            <div className='text'>
              {title}
              {hot && <CommonIcon size={12} name='common-hot-0' className='hot' />}
              {newTag && (
                <div className='new-tag'>
                  <Image src='/static/images/common/new.svg' alt='' height={14} width={23} className='new-icon' />
                </div>
              )}
            </div>
          </TrLink>
          <TrLink native href={href} className={'tips'}>
            {tips}
          </TrLink>
        </div>
        {arrow && (
          <CommonIcon
            name={active ? 'common-arrow-right-active-0' : 'common-arrow-right-0'}
            width={24}
            height={24}
            className='arrow'
            enableSkin
          />
        )}
      </div>
      {subMenu && (
        <div className={'sub-menu'} style={{ zIndex: active ? 1 : 0 }}>
          {inView && subMenu}
        </div>
      )}
      <style jsx>{menuStyles}</style>
    </div>
  );
  const [hoverable, isHovering] = useHover(content);

  useEffect(() => {
    isHovering && onHover?.();
  }, [isHovering]);

  return hoverable;
};

const menuStyles = css`
  .menu-wrapper {
    border-radius: 5px;
    .left-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 304px;
      .item-wrapper {
        padding: 16px;
        color: var(--text-secondary)!important;
        :global(>*:nth-last-child(2)) {
          color: var(--text-primary);
        }
        :global(>*:nth-child(2)) {
          color: var(--text-tertiary);
        }
        :global(a) {
          color: inherit;
        }

        :global(.title) {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          :global(.text) {
            white-space: pre-wrap;
            display: flex;
            flex-direction: row;
            align-items: center;
            line-height: 14px;
            font-size: 16px;
            font-weight: 500;
            :global(.hot) {
              line-height: 0;
              margin-left: 5px;
            }
            :global(.new-tag) {
              margin-left: 5px;
            }
            :global(.soon-img) {
              margin-left: 3px;
              line-height: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 43px;
              height: 16px;
              > * {
                height: auto;
                width: 54px;
              }
            }
            :global(.coming-soon) {
              letter-spacing: -0.5px;
              margin-left: 3px;
              user-select: none;
              color: var(--theme-font-color-1);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 1px 4px;
              font-size: 12px;
              font-weight: 500;
              background: linear-gradient(89deg, #fa8565, #fb5e3f);
              box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
              border-radius: 6px 6px 6px 0px;
              line-height: 14px;
            }
          }
        }
        :global(.tips) {
          line-height: 15px;
          white-space: pre-wrap;
          padding-top: 11px;
          font-size: 12px;
          font-weight: 400;
          display: block;
        }
      }

      :global(.arrow) {
        margin-right: 20px;
      }
    }
    .sub-menu {
      position: absolute;
      top: 0;
      bottom: 6px;
      left: 324px;
      border-left: 1px solid var(--common-line-color);
    }
  }
  .hover .left-wrapper {
    border-radius: 6px;
    .sub-menu {
      z-index: 1;
      width: 265px;
      opacity: 1;
    }
    .item-wrapper {
      :global(.title) {
        :global(.text) {
          color: var(--skin-hover-font-color);
        }
      }
    }
  }
`;

const ContractMenu = ({ onContractLeftMenuHover }: { onContractLeftMenuHover: (id: number) => void }) => {
  // 获取环境变量
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const [subIndex, setSubIndex] = useState(0);
  useEffect(() => {
    setSubIndex(0);
  }, []);
  const _onHover = (id: number) => {
    setSubIndex(id);
    onContractLeftMenuHover(id);
  };
  return (
    <div className='contract-menu-wrapper'>
      <div className='main-content'>
        <Menu
          title={LANG('U本位合约')}
          tips={LANG('以USDT结算的永续合约')}
          hot
          active={subIndex === 2}
          onHover={() => _onHover(2)}
          subMenu={<Perpetual isUsdtType={true} />}
          href='/swap/btc-usdt'
        />
        {/* <Menu
          title={LANG('币本位合约')}
          tips={LANG('以数字货币结算的永续合约')}
          // hot
          active={subIndex === 1}
          onHover={() => _onHover(1)}
          subMenu={<Perpetual />}
          href='/swap/btc-usd'
        /> */}
        { enableLite && (
          <Menu
            title={LANG('简易合约')}
            tips={LANG('适合初学者的简单差价合约交易')}
            active={subIndex === 0}
            onHover={() => _onHover(0)}
            subMenu={<Simple active={subIndex === 0} />}
            href='/lite/btcusdt'
          />
        )}
        {/* <Menu
          title={LANG('杠杆代币')}
          tips={LANG('永不爆仓，安享收益')}
          // hot
          active={subIndex === 3}
          onHover={() => _onHover(3)}
          subMenu={<SpotEtf />}
          href='/spot/btc3l_usdt'
        /> */}
        {/* <Menu
          className='header-guide-swap-demo-step-2'
          title={LANG('模拟交易')}
          tips={LANG('精进合约技能，无资金风险')}
          newTag
          subMenu={null}
          active={subIndex === 4}
          onHover={() => _onHover(4)}
          href='/swap/demo?id=sbtc-susdt'
          arrow={false}
        /> */}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export { ContractMenu };

const styles = css`
  :global(.contract-menu-wrapper) {
    width: 340px;
    height: 480px;
    background: var(--dropdown-select-bg-color);
    box-sizing: border-box;
    padding: 16px;
    position: relative;
    .main-content {
      z-index: 999;
      position: relative;
      height: 100%;
    }
    .empty-sub-menu {
      width: 265px;
      height: 479px;
      background: var(--theme-background-color-2);
    }
  }
`;
