import { useRouter } from '@/core/hooks/src/use-router';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

// 安全中心设置项返回导航
const Nav = ({ title, back }: { title: string; back?: () => void }) => {
  const router = useRouter();
  const _onBack = () => {
    if (back) {
      back();
    } else {
      router.back();
    }
  };
  return (
    <div className='nav-title'>
      <span onClick={_onBack} className='back'>
        <CommonIcon size={20} className='back-img' name='common-back-icon' />
      </span>
      <span className='title'>{title}</span>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .nav-title {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    .back {
      cursor: pointer;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid var(--skin-border-color-1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      @media ${MediaInfo.mobile} {
        width: 24px;
        height: 24px;
        :global(img) {
          width: 14px;
          height: 14px;
        }
      }
    }
    .title {
      font-weight: 500;
      font-size: 20px;
      color: var(--theme-font-color-1);
      @media ${MediaInfo.mobile} {
        font-size: 16px;
      }
    }
  }
`;
export default Nav;
