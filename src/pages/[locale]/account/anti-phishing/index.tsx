import { AccountBox } from '@/components/account/components/account-box';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { Home } from './components/home';
import { MyVerify } from './components/verify';

export default function AntiPhishing() {
  const router = useRouter();
  const { user } = router.state || {};
  const antiPhishing = user?.antiPhishing;
  const [state, setState] = useImmer({
    page: 0,
  });
  const { page } = state;

  // 内容组件
  const Content = [Home, MyVerify][page];

  // 下一步
  const _next = () => {
    setState((draft) => {
      draft.page = page + 1;
    });
  };

  // 上一步
  const _prev = () => {
    setState((draft) => {
      draft.page = page - 1;
    });
  };

  // 返回上一步
  const _back = () => {
    if (page <= 0) {
      router.back();
    } else {
      _prev();
    }
  };
  return (
    <AccountBox title={antiPhishing ? LANG('更改防钓鱼码') : LANG('设置防钓鱼码')} back={_back}>
      <div className='anti-phishing-container'>
        <Content next={_next} />
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .anti-phishing-container {
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
