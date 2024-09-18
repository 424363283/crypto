import { useRouter, useSettingGlobal } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import css from 'styled-jsx/css';

interface Props {
  isBuy: boolean;
  text: string;
  onClick: () => void;
}

const TradeBtn = ({ isBuy, onClick, text }: Props) => {
  const isLogin = Account.isLogin;
  const router = useRouter();
  const handleLogin = () => {
    const pathname = router.asPath;
    sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
  };
  const { spotTradeEnable } = useSettingGlobal();
  if (!spotTradeEnable) {
    return (
      <>
        <button className='btn maintain' disabled>
          {LANG('维护中')}
        </button>
        <style jsx>{styles}</style>
      </>
    );
  }
  return (
    <>
      {isLogin ? (
        <button className={`btn ${isBuy ? 'green' : 'red'}`} onClick={onClick}>
          {text}
        </button>
      ) : (
        <div className='container'>
          <TrLink href='/login' onClick={handleLogin}>
            {LANG('登录')}
          </TrLink>
          <span>{LANG('或')}</span>
          <TrLink href='/register'>{LANG('注册')}</TrLink>
        </div>
      )}
      <style jsx>{styles}</style>
    </>
  );
};

export default TradeBtn;
const styles = css`
  .btn {
    display: block;
    color: #fff;
    height: 36px;
    line-height: 35px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    border-radius: 5px;
    user-select: none;
    text-decoration: none;
    outline: none;
    border: none;
    width: 100%;
    cursor: pointer;
    &:disabled {
      color: var(--theme-trade-text-2) !important;
      cursor: not-allowed !important;
      background-color: var(--theme-trade-bg-color-4);
      &:hover {
        background-color: var(--theme-trade-bg-color-4);
      }
    }
  }
  .green {
    background: var(--color-green);
  }
  .red {
    background: var(--color-red);
  }
  .container {
    width: 100%;
    border-radius: 5px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--theme-tips-color);
    color: var(--theme-trade-text-color-1);
    :global(a) {
      margin: 0 6px;
      color: var(--skin-primary-color);
      font-weight: 500;
    }
  }
`;
