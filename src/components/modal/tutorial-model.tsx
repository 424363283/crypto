import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { Zendesk } from '@/components/zendesk';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Info, Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicModal } from '../modal';

const TutorialModel = ({ type = 'spot', ...props }: any) => {
  const agreeAgreement = Swap.Info.store.agreement.allow;
  const [index, setIndex] = useState(0);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const { theme } = useTheme();
  const [iconsUrl, setIconsUrl] = useState('');
  const router = useRouter();
  const { locale: lang } = router.query;
  const { isLogin } = useAppContext();

  useEffect(() => {
    Info.getInstance().then((info) => {
      setIconsUrl(info.iconsUrl);
    });
  }, []);

  const arr: any = {
    swap: [
      {
        title: LANG('划转保证金'),
        text: [LANG('从您的现货钱包中划转资金到合约账户作为合约账户保证金')],
        btn: (
          <div className='btn'>
            <span
              onClick={() => {
                props.onCancel();
                if (agreeAgreement) {
                  Swap.Trade.setTransferModalVisible();
                } else {
                  router.push('/login');
                }
              }}
            >
              {LANG('立即划转')}
            </span>
          </div>
        ),
      },
      {
        title: LANG('杠杆与保证金模式'),
        text: [
          LANG(
            '根据自身喜好选择保证金模式（全仓或逐仓），同时根据自身的风险承受能力选择合适的杠杆倍数；XK最高支持200倍杠杆倍数。'
          ),
        ],
        prompt: LANG('新手用户建议使用10倍以下杠杆'),
      },
      {
        title: LANG('开仓'),
        text: [LANG('根据您对涨跌的预判在填写价格和数量之后，可选买多/买空。'), LANG('预测涨则买多；预测跌则卖空')],
      },
      {
        title: LANG('查看仓位和订单'),
        text: [LANG('您可以在行情图下方查看您的仓位和订单详情，当订单成交后即可会拥有对应的仓位')],
      },
      {
        title: LANG('平仓'),
        text: [LANG('持有仓位后，您可以在持有仓位区域平仓。')],
        textBtn: (
          <Zendesk className='more' href='/sections/5692040237583-Perpetual-Contracts-USDT-M-'>
            {LANG('了解更多')}
          </Zendesk>
        ),
        btn: (
          <div className='btn'>
            <span onClick={props.onCancel}>{LANG('开始交易')}</span>
          </div>
        ),
      },
    ],
    spot: [
      {
        title: LANG('查看资产'),
        text: [LANG('交易前，请确保您的现货账户资产充足。')],
        btn: (
          <div className='button'>
            <TrLink href='/account/fund-management/asset-account/recharge' native>
              {LANG('充币')}
            </TrLink>
            <div
              onClick={() => {
                props.onCancel();
                if (isLogin) {
                  setTransferModalVisible(true);
                } else {
                  router.push('/login');
                }
              }}
            >
              {LANG('划转')}
            </div>
          </div>
        ),
      },
      {
        title: LANG('搜索交易对'),
        text: [LANG('在行情图左侧列表挑选您将要交易的币对，也可通过搜索框输入币对名称快速搜索。')],
      },
      {
        title: LANG('买入现货'),
        text: [
          LANG(
            '在买入区域输入您预期的买入价格与数量，并点击下方买入，当市场价格与您设置的价格相符时，则完成率一笔买入交易。'
          ),
        ],
      },
      {
        title: LANG('查看订单'),
        text: [LANG('您在这里可以查看当前委托、历史委托、历史成交和资产管理。')],
      },
      {
        title: LANG('卖出现货'),
        text: [
          LANG(
            '在卖出区域输入您预期的买入价格与数量，并点击下方卖出，当市场价格与您设置的价格相符时，则完成了一笔卖交易。'
          ),
        ],
      },
    ],
  };

  const _onCloseTransferModal = () => {
    setTransferModalVisible(false);
  };
  return (
    <>
      <BasicModal width={720} {...props} footer={null}>
        <div className='box'>
          <div className='left'>
            {arr[type]?.map((item: any, key: number) => {
              return (
                <div key={key} className={clsx('item', index === key && 'active')} onClick={() => setIndex(key)}>
                  <div className='title'>
                    {key + 1}.{item.title}
                  </div>
                  <div className='content'>
                    {item.text?.map((text: string) => (
                      <div key={text} className='text'>
                        {text}
                        {item.textBtn}
                      </div>
                    ))}
                  </div>
                  {item.prompt && (
                    <div
                      className='prompt'
                      dangerouslySetInnerHTML={{
                        __html: item.prompt,
                      }}
                    />
                  )}
                  {item.btn}
                </div>
              );
            })}
          </div>
          <div className='right'>
            <Image
              src={`${iconsUrl}tutorial/${type}_${lang}_${theme}_${index + 1}.png`}
              alt=''
              width={325}
              height={416}
            />
          </div>
          <style jsx>{styles}</style>
        </div>
      </BasicModal>
      <TransferModal
        open={transferModalVisible}
        defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
        defaultTargetAccount={ACCOUNT_TYPE.SPOT}
        onCancel={_onCloseTransferModal}
      />
    </>
  );
};

const styles = css`
  .box {
    display: flex;
    .left {
      flex: 1;
      .item {
        cursor: pointer;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .title {
          font-size: 16px;
          font-weight: 500;
          color: var(--theme-font-color-3);
          display: block;
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-1);
          :global(.more) {
            color: var(--color-active-yellow);
            text-decoration: underline;
          }
        }
        .prompt {
          font-size: 14px;
          font-weight: 400;
          color: var(--color-error);
        }
        & > :global(div) {
          display: none;
        }
        &.active {
          background: var(--theme-background-color-8);
          border-radius: 8px;
          padding: 10px;
          .title {
            color: var(--color-active-yellow);
          }
          & > :global(div) {
            display: block;
          }
          :global(.button) {
            display: flex;
            align-items: center;
            gap: 10px;
            & > :global(div),
            & > :global(a) {
              line-height: 30px;
              border-radius: 6px;
              min-width: 90px;
              background: var(--color-yellow);
              text-align: center;
              display: inline-block;
              font-size: 14px;
              font-weight: 500;
              color: #141717;
              &:nth-child(2) {
                background: var(--theme-background-color-2);
                color: var(--theme-font-color-1);
              }
            }
          }
        }
        :global(.btn) {
          width: 100%;
          :global(span) {
            line-height: 30px;
            border-radius: 6px;
            width: 100%;
            background: var(--color-yellow);
            text-align: center;
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            color: #141717;
          }
        }
      }
    }
    .right {
      padding-left: 35px;
      :global(img) {
        border: 2px solid var(--color-yellow);
        border-radius: 16px;
        width: 325px;
        height: auto;
      }
    }
  }
`;

export default TutorialModel;
