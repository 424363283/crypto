import { useRouter } from '@/core/hooks/src/use-router';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { Svg } from '../svg';

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
      <div className='nav-box'>
        <span onClick={_onBack} className='back'>
          <Svg src='/static/icons/primary/common/back-icon.svg' width={16} color={'var(--text-primary)'} />
        </span>
        <span className='title'>{title}</span>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .nav-title {
    display: flex;
    align-items: center;
    padding: 32px 0;
    line-height: 20px;
    background:var(--fill-2);
    @media ${MediaInfo.mobile} {
      padding: 10px 0;
      background:var(--fill-3);
    }
    .nav-box{
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      max-width: var(--const-max-page-width);
      margin:auto;
      gap: 15px;
    }
    .back {
      cursor: pointer;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      line-height: 20px;
      color: var(--text-primary);
      @media ${MediaInfo.mobile} {
        font-size: 16px;
      }
    }
  }
`;
export default Nav;
