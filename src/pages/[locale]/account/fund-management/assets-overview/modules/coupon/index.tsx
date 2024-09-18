import { Desktop } from '@/components/responsive';
import { useCouponState } from '@/core/hooks';
import { useState } from 'react';
import css from 'styled-jsx/css';
import Banner from './components/banner';
import List from './components/list';
import Rule from './components/rule';
import { Tab } from './components/tab';

function Coupon() {
  const { normalList, invalidList, usedList } = useCouponState();
  const [tab, setTab] = useState(0);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  return (
    <div className='coupon'>
      <Desktop>
        <Banner
          setTab={setTab}
          normalLen={normalList?.length || 0}
          usedLen={usedList?.length || 0}
          invalidLen={invalidList?.length || 0}
        />
      </Desktop>
      <div className='main-content'>
        <Tab setRuleModalVisible={setRuleModalVisible} tab={tab} setCurTab={setTab} />
        {tab === 0 && <List data={normalList} />}
        {tab === 1 && <List data={usedList} />}
        {tab === 2 && <List data={invalidList} />}
        <Rule ruleModalVisible={ruleModalVisible} setRuleModalVisible={setRuleModalVisible} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .coupon {
    height: 100%;
    overflow-y: auto;
    .main-content {
      height: 100%;
      min-height: calc(100vh - 214px);
      background-color: var(--theme-background-color-2);
      border-radius: 15px;
    }
  }
`;
export default Coupon;
