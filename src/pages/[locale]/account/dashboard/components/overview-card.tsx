import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { AssetsCard } from './assets-card';
import BottomLoginLog from './login-record-card';
import Notice from './notice';
import Guide from './guide';
import { useEffect, useState } from 'react';
import { Account, UserInfo } from '@/core/shared';

interface OverviewCardProps {
  showCardPopFn:() => void;
  kycState:any;
}
export const OverviewCard = (props:OverviewCardProps) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const getUserInfo = async () => {
    const user = await Account.getUserInfo();
    setUser(user);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="overview-card">
      <div className="card-box">
        {user?.rechargeTime ? <AssetsCard /> : <Guide kycState={props.kycState} showCardPop={props.showCardPopFn} />}
        <Notice />
      </div>
      <BottomLoginLog />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .overview-card {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 256px);
    gap: 8px;
    .card-box {
      display: flex;
      height: 380px;
      flex-direction: row;
      gap: 8px;
      @media ${MediaInfo.mobileOrTablet} {
        height: auto;
        flex-direction: column;
      }
    }

    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }
`;
