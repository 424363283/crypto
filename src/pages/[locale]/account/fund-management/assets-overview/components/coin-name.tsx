import CoinLogo from '@/components/coin-logo';
import memoize from 'fast-memoize';
import css from 'styled-jsx/css';

const CustomCodeNameColumn = ({
  iconCode,
  code,
  fullName,
  coinSize,
}: {
  iconCode: string;
  code: string;
  fullName: string;
  coinSize: number;
}) => {
  return (
    <div className='name-box' key={code}>
      <div className='coin-logo'>
        <CoinLogo coin={iconCode} key={iconCode} width={coinSize} height={coinSize} />
      </div>
      <div className='currency-name'>
        <span className='name'>{code}</span>
        <span className='fullname'>{fullName}</span>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .name-box {
    display: flex;
    align-items: center;
    .currency-name {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-left: 10px;
      text-align: left;
      .fullname {
        font-size: 12px;
        color: var(--theme-font-color-3);
      }
    }
  }
`;
export const CustomCodeNameMemo = memoize(CustomCodeNameColumn);
