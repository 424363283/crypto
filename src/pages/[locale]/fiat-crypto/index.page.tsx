import { VerifyForm } from '@/components/account/verify';
import { PasswordInput } from '@/components/basic-input';
import { UniversalLayout } from '@/components/layouts/login/universal';
import { BasicModal, IdentityVerificationModal, SafetyModel } from '@/components/modal';
import { LANG, Lang } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import Info from './components/info';
import Payment from './components/payment/index';
import QuicklyBuyCoins from './components/quickly-buy-coins/index';
import Rule from './components/rule';
import useFiatCrypto from './use-fiat-crypto';

const FiatCryptoPage = () => {
  const {
    state,
    goToBindEmail,
    setPayModal,
    setVal,
    onDone,
    onInputNewPwd,
    onCloseIdVerificationModal,
    onSubmit,
    setAmountIndex,
    setBankIndex,
    setKey,
    setState,
    onChangeCrypto,
    onChangeCurrencyAmount,
    onChangeCurrency,
    onRefresh,
    onChangeCoinAmount,
    setType,
    onQuery,
  } = useFiatCrypto();
  const {
    safetyVerificationModel,
    safetyModel,
    emailModel,
    kycModel,
    withdrawModel,
    hasError,
    password,
    showIdVerificationModal,
    sellParams,
    vToken,
    pwdModel,
    payModal,
    isBuy,
    currencyCode,
    cryptoCode,
    rate,
  } = state;
  return (
    <UniversalLayout bgColor='var(--theme-secondary-bg-color)'>
      <div className={'fiat-crypto'}>
        <div className='box'>
          <div className='trade'>
            <div className='left'>
              <Info />
            </div>
            <div className='right'>
              <QuicklyBuyCoins
                state={state}
                setState={setState}
                onChangeCrypto={onChangeCrypto}
                onChangeCurrencyAmount={onChangeCurrencyAmount}
                onChangeCurrency={onChangeCurrency}
                onRefresh={onRefresh}
                onChangeCoinAmount={onChangeCoinAmount}
                setType={setType}
                setPayModal={setPayModal}
                onQuery={onQuery}
              />
            </div>
          </div>
        </div>
        <div className='payment'>
          <Rule />
        </div>
        <BasicModal open={payModal} title={LANG('选择支付渠道')} footer={null} onCancel={() => setPayModal(false)}>
          <Payment
            isBuy={isBuy}
            currencyCode={currencyCode}
            cryptoCode={cryptoCode}
            rate={rate}
            setAmountIndex={setAmountIndex}
            setBankIndex={setBankIndex}
            setKey={setKey}
            state={state}
            setPayModal={setPayModal}
          />
        </BasicModal>
        <BasicModal
          type='alert'
          title={LANG('充值前，为确保您的权益，请先完成KYC')}
          open={kycModel}
          onCancel={() => setVal('kycModel', false)}
          onOk={() => {
            setVal('kycModel', false);
            setVal('showIdVerificationModal', true);
          }}
        />
        <BasicModal
          type='alert'
          title={LANG('提币功能暂不可用')}
          description={LANG('您的账户目前在受保护状态中，提币功能暂未恢复。')}
          open={withdrawModel}
          onCancel={() => setVal('withdrawModel', false)}
          onOk={() => setVal('withdrawModel', false)}
        />
        <BasicModal
          type='alert'
          title={LANG('安全提示')}
          description={LANG('为了您的账户安全，请先绑定邮箱再进行提币操作')}
          open={emailModel}
          onCancel={() => setVal('emailModel', false)}
          onOk={goToBindEmail}
        />
        <SafetyModel open={safetyModel} onCancel={() => setVal('safetyModel', false)} />
        <BasicModal
          open={safetyVerificationModel}
          title={LANG('安全验证')}
          footer={null}
          onCancel={() => setVal('safetyVerificationModel', false)}
        >
          <VerifyForm params={sellParams} onDone={onDone} modelSence='FIATSELL' vToken={vToken} />
        </BasicModal>
        <BasicModal title={LANG('资金密码')} open={pwdModel} footer={null} onCancel={() => setVal('pwdModel', false)}>
          <div className='verify-form'>
            <PasswordInput
              label={LANG('资金密码')}
              placeholder={LANG('请输入资金密码')}
              value={password}
              onInputChange={onInputNewPwd}
            />
            <button className={clsx('pc-v2-btn', 'confirm-btn', hasError ? 'disabled' : '')} onClick={onSubmit}>
              {LANG('确定')}
            </button>
          </div>
        </BasicModal>
        <IdentityVerificationModal
          open={showIdVerificationModal}
          onCancel={onCloseIdVerificationModal}
          onVerifiedDone={onCloseIdVerificationModal}
        />
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
};

const styles = css`
  :global(.verify-form) {
    max-width: 530px;
    width: auto !important;
    .confirm-btn {
      width: 100%;
    }
  }
  .fiat-crypto {
    background: var(--theme-secondary-bg-color);
    flex: 1;
    display: flex;
    flex-direction: column;
    .box {
      .trade {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 0 40px;
        .left {
          flex: 1;
          gap: 30px;
          display: none;
        }
      }
    }
    .payment {
      border-radius: 30px 30px 0 0;
      background: var(--theme-background-color-2);
      padding: 30px 0;
      flex: 1;
    }

    @media ${MediaInfo.desktop} {
      :global(.quickly-buy-coins) {
        min-width: 456px;
      }
      .left {
        display: block !important;
      }
    }
    @media ${MediaInfo.tablet} {
      .right {
        flex: 1;
        padding: 0 32px;
      }
      .payment {
        border-radius: 0;
      }
    }
    @media ${MediaInfo.mobile} {
      .right {
        flex: 1;
        padding: 0 16px;
      }
      .payment {
        border-radius: 0;
      }
    }
  }
`;

export default Lang.SeoHead(FiatCryptoPage);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'fiat-crypto' });
