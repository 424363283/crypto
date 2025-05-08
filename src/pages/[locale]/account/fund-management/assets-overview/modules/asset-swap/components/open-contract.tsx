import { Button } from '@/components/button';
import Image from '@/components/image';
import { Loading } from '@/components/loading';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

interface OpenContractProps {
  children: React.ReactNode | JSX.Element;
}
const OpenContractView = (props: OpenContractProps): JSX.Element => {
  const { children } = props;

  const { allow: isArgeeAgreement, loading } = Swap.Info.store.agreement;

  useEffect(() => {
    Swap.Info.fetchAgreement();
  }, []);

  useEffect(() => {
    if (loading) {
      Loading.start();
    } else {
      Loading.end();
    }
  }, [loading]);
  const agreeAgreement = async () => {
    await Swap.Info.agreementConfirm();
  };
  if (loading) return <></>;
  if (isArgeeAgreement) {
    return children as JSX.Element;
  }

  return (
    <div className='open-contract-view'>
      <Image
        className='logo'
        src='/static/images/account/fund/contract_agreement.svg'
        width='86'
        height='80'
        enableSkin
      />
      <div className='title'>{LANG('开通合约账户')}</div>
      <div className='description'>
        {LANG(
          '合约交易属于高风险交易行为，在带来更多潜在利润的同时，也蕴含巨大风险。请注意，当市场出现剧烈波动时，您合约钱包中的余额有可能全部亏损。来自部分地区的用户无法使用合约交易。'
        )}
      </div>
      <Button type='primary' className='open-account-button' onClick={agreeAgreement}>
        {LANG('立即开户')}
      </Button>

      <style jsx>{styles}</style>
    </div>
  );
};

export { OpenContractView };

const styles = css`
  .open-contract-view {
    height: 822px;
    background: var(--fill_bg_1);
    margin-top: 110px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    .logo {
      width: 86px;
      height: 80px;
      margin-bottom: 34px;
    }
    .title {
      font-size: 20px;
      color: var(--theme-font-color-1);
      margin-bottom: 33px;
      margin-top: 14px;
    }
    .description {
      text-align: center;
      max-width: 812px;
      font-size: 14px;
      color: var(--theme-font-color-3);
      margin-bottom: 41px;
    }
    :global(.open-account-button) {
      cursor: pointer;
      text-align: center;
      min-width: 264px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
    }
  }
`;
