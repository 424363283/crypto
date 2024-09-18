import { Button } from '@/components/button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import css from 'styled-jsx/css';

const Error = () => {
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };
  return (
    <div className='error-boundary-wrapper'>
      <Image src='/static/images/common/error-dark.svg' width={200} height={200} alt='error' className='error-img' />
      <p className='tips'>An error has occurred</p>
      <Button type='primary' width={100} height={40} onClick={handleRefresh}>
        Reload
      </Button>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .error-boundary-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    .tips {
      color: var(--theme-font-color-1);
      margin-bottom: 14px;
      font-size: 14px;
    }
    :global(.error-img) {
      margin-bottom: 30px;
    }
  }
`;
export default Error;
