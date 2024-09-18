import { Dropdown } from 'antd';
import { ReactNode, useState } from 'react';

import { DropdownMenus, DropdownOption as Option } from '@/components/trade-ui/common/dropdown';

import { Zendesk } from '@/components/zendesk';
import { useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { isSwapDemo } from '@/core/utils/src/is';
import dynamic from 'next/dynamic';
import { useLocation } from 'react-use';
import { clsx, styles } from './styled';

const RuleModal = dynamic(() => import('../modal/rule-modal'), { ssr: false, loading: () => <div /> });
const TutorialModel = dynamic(() => import('@/components/modal/tutorial-model'), {
  ssr: false,
  loading: () => <div />,
});
export const GuideMenu = ({ children }: { children: (visible: boolean) => ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [stepGuide, setStepGuide] = useState(false);
  const { isDark } = useTheme();
  const { isUsdtType } = Swap.Trade.base;
  const query = isUsdtType ? '&type=usdt' : '';
  const _handleRuleModalVisible = () => {
    const visible = Swap.Trade.store.modal.ruleVisible;
    setVisible(false);
    Swap.Trade.setModal({ ruleVisible: !visible });
  };
  const isDemo = isSwapDemo(useLocation().pathname);
  const swapInfo = !isDemo ? `/swap-info` : `/swap-info/demo`;
  const data = [
    [LANG('指南'), isUsdtType ? '/sections/5692040237583' : '/sections/5692040658191', true],
    [LANG('新手引导'), () => setStepGuide(!stepGuide)],
    [LANG('交易规则'), _handleRuleModalVisible],
    [LANG('实时资金费率'), swapInfo, false, `page=0${query}`],
    [LANG('资金费率历史'), swapInfo, false, `page=1${query}`],
    [LANG('风险保障基金'), swapInfo, false, `page=2${query}`],
    [LANG('指数'), swapInfo, false, `page=3${query}`],
  ];
  const ruleVisible = Swap.Trade.store.modal.ruleVisible;

  const overlay = (
    <>
      <DropdownMenus className={clsx('menus', !isDark && 'light')}>
        {data.map(([label, url, isZendesk, _query], index) => {
          const props = {
            className: clsx('menu'),
            onClick: () => {
              setVisible(false);
            },
            children: <>{label}</>,
          };
          if (isZendesk) {
            return <Option key={index} component={Zendesk} {...props} href={url} />;
          } else if (typeof url === 'function') {
            return <Option key={index} {...props} onClick={url} />;
          } else {
            return (
              <Option
                key={index}
                component={TrLink}
                {...props}
                href={url}
                query={_query}
                target='_blank'
                isCurrent={false}
              />
            );
          }
        })}
      </DropdownMenus>
      {styles}
    </>
  );

  return (
    <>
      <Dropdown
        menu={{ items: [] }}
        dropdownRender={(menu) => overlay}
        open={visible}
        trigger={['click']}
        placement='bottomRight'
        onOpenChange={(v) => setVisible(v)}
      >
        {children?.(visible)}
      </Dropdown>
      {ruleVisible && <RuleModal />}
      {stepGuide && (
        <TutorialModel
          open={stepGuide}
          onCancel={() => setStepGuide(false)}
          type='swap'
          title={LANG('如何完成一笔合约交易')}
        />
      )}
    </>
  );
};
