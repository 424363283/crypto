import { VerifyForm } from '@/components/account/verify';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { store } from './store';

const MyVerify = () => {
  const { antiPhishingCode } = store;
  return (
    <div className='verify'>
      <VerifyForm antiPhishingCode={antiPhishingCode} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .verify {
    width: 530px;
    margin: 20px auto 0;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
export { MyVerify };
