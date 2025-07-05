import { EmptyComponent } from '@/components/empty';
import { Loading } from '@/components/loading';
import { MediaInfo } from '@/core/utils';

export const ListView = ({
  data,
  children,
  loading
}: {
  data?: any[];
  loading?: boolean;
  children?: (index: number) => React.ReactNode;
}) => {
  return (
    <>
      <div className="list-view">
        {data?.map((_, i) => children?.(i))}
        {!loading && !data?.length && (
          <div className="empty">
            <EmptyComponent />
          </div>
        )}
        {loading && (
          <div className="loading">
            <Loading.view small />
          </div>
        )}
      </div>
      <style jsx>{`
        .list-view {
          .empty,
          .loading {
            height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .list-view {
          height: auto;
          display: flex;
          flex-direction: column;
          padding: 8px 1rem;
          padding-bottom: 4rem;
          gap: 1rem;
          margin-top: 12px;
          // overflow-y: auto;
          @media ${MediaInfo.mobile} {
            margin-top: 0;
            padding-top: 12px;
          }
        }
      `}</style>
    </>
  );
};
