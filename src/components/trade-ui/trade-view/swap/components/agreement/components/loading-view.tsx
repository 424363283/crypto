import { Loading } from '@/components/loading';

export const LoadingView = () => {
  const loadingView = Loading.view({ className: 'loading', small: true });
  return (
    <>
      <div className={'loading-view'}>{loadingView}</div>
      <style jsx>{`
        .loading-view {
          min-height: 200px;
          position: relative;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
};
