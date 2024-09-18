import { EmptyComponent } from '@/components/empty';
import { CouponItem } from '@/core/hooks';
import { MediaInfo, clsx, isEmpty } from '@/core/utils';
import css from 'styled-jsx/css';
import Item from './item';

const List = ({ data }: { data: CouponItem[] }) => {
  const renderListItem = () => {
    if (!data?.length) {
      return <EmptyComponent />;
    }
    return data?.map((item: CouponItem, index: number) => <Item {...item} key={index} />);
  };

  return (
    <div className={clsx('list', !isEmpty(data) && 'empty')}>
      {renderListItem()}
      <style jsx>{styles}</style>
    </div>
  );
};
export default List;

const styles = css`
  .list {
    margin: 0 auto;
    margin-left: 22px;
    overflow-y: auto;
    flex: 1;
    padding: 24px 20px 24px 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    @media ${MediaInfo.tablet} {
      grid-template-columns: 1fr 1fr;
    }
    @media ${MediaInfo.mobile} {
      grid-template-columns: 1fr;
    }
    grid-gap: 24px;
    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
    }
  }
`;
