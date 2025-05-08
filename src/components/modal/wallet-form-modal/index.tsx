import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { AlertFunction } from '@/components/modal';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { WalletAvatar, WalletAvatarDefaultAvatar } from '@/components/wallet-avatar';
import { postSwapCreateWalletApi, updateSwapWalletApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { AvatarSelectModal } from './components/avatar-select-modal';
import { CreatedWallets } from './components/created-wallets';
import { Input } from './components/input';
import { WhatIsWallet } from './components/what-is-wallet';
import { clsx, styles } from './styled';

export const WalletFormModal = ({
  visible,
  isUsdtType: _isUsdtType,
  data,
  onClose,
  onTransferNow,
  onWalletItemClick,
  update,
}: {
  visible?: boolean;
  onClose: any;
  data?: any;
  onTransferNow?: (args: { wallet: string; isUsdtType: boolean }) => any;
  isUsdtType: boolean;
  onWalletItemClick: (args: { walletData: any; isUsdtType: boolean }) => any;
  update?: any;
}) => {
  const [avatarSelectVisible, setAvatarSelectVisible] = useState(false);
  const [isUsdtType, setUsdtTab] = useState(false);
  const [form, setForm] = useState<{ pic: string; alias: string; remark: string }>({
    pic: '',
    alias: '',
    remark: '',
  });
  const { isMobile } = useResponsive();
  const isEdit = !!data;

  useEffect(() => {
    if (visible) {
      setForm(data ? { pic: data.pic, alias: data.alias, remark: data.remark } : { pic: '', alias: '', remark: '' });
      setUsdtTab(_isUsdtType);
    }
  }, [visible, update]);

  const content = (
    <>
      <AvatarSelectModal
        visible={avatarSelectVisible}
        onClose={() => setAvatarSelectVisible(false)}
        value={form.pic}
        onChange={(pic) => setForm((v) => ({ ...v, pic }))}
      />
      <div className={clsx('modal-content')}>
        {!isEdit && (
          <div className={clsx('header')}>
            <div className={clsx('tabs')}>
              <div className={clsx('tab', isUsdtType && 'active')} onClick={() => setUsdtTab(true)}>
                {LANG('U本位合约')}
              </div>
              <div className={clsx('tab', !isUsdtType && 'active')} onClick={() => setUsdtTab(false)}>
                {LANG('币本位合约')}
              </div>
            </div>
          </div>
        )}
        <div className={clsx('content')}>
          <div className={clsx('scroll', isUsdtType && 'usdt')}>
            {!isUsdtType && (
              <div
                className={clsx('type-warn')}
                dangerouslySetInnerHTML={{
                  __html: LANG(
                    '您当前正在创建「币本位子钱包」创建币本位子钱包时，该子钱包内将生成所有币本位支持的所有资产，包括：{cryptos}',
                    { cryptos: '<span>BTC、ETH、XRP、DOT、DOGE</span>' }
                  ),
                }}
              />
            )}
            <div className={clsx('avatar-section')}>
              <WalletAvatar type={form.pic} size={48} />
              <div className={clsx('modify')} onClick={() => setAvatarSelectVisible(true)}>
                {LANG('更改')}
              </div>
            </div>
            <Input
              label={LANG('子钱包名称')}
              placeholder={LANG('请输入子钱包名称')}
              value={form.alias}
              onChange={(alias) => {
                setForm((v) => ({ ...v, alias: alias.replace(/\s/gi, '') }));
              }}
              rule={/^[0-9a-zA-Z\s]{0,16}$/}
            />
            <div className={clsx('repeat-tips')}>{LANG('注意：所创建的子钱包名称不可重复')}</div>
            <Input
              label={LANG('备注')}
              placeholder={LANG('请输入备注')}
              value={form.remark}
              onChange={(remark) => setForm((v) => ({ ...v, remark }))}
              rule={/^.{0,50}$/}
            />
            <CreatedWallets isUsdtType={isUsdtType} onItemClick={onWalletItemClick} />
            <Button className={clsx('submit')} type={'primary'} disabled={!form.alias} onClick={() => _onConfirm()}>
              {isEdit ? LANG('保存') : LANG('立即创建')}
            </Button>
            <WhatIsWallet />
          </div>
        </div>
      </div>
    </>
  );

  const _onConfirm = async () => {
    Loading.start();
    try {
      const params = {
        alias: form['alias'],
        pic: form['pic'] || WalletAvatarDefaultAvatar,
        remark: form['remark'],
      };
      const result = await (!isEdit
        ? postSwapCreateWalletApi({
            contractType: isUsdtType ? 2 : 1,
            ...params,
          })
        : updateSwapWalletApi({
            contractType: isUsdtType ? 2 : 1,
            ...params,
            wallet: data['wallet'],
            // currency: _form['currency'],
          }));
      if (result['code'] == 200) {
        Swap.Assets.fetchBalance(isUsdtType);

        if (!isEdit) {
          const usdt = isUsdtType;
          AlertFunction({
            title: LANG('创建成功！'),
            content: LANG('创建成功，请问是否要现在转入资产？'),
            cancelText: LANG('取消'),
            okText: LANG('确认'),
            onOk: () => {
              onTransferNow?.({ wallet: result['data'], isUsdtType: usdt });
            },
            v2: true,
            zIndex: 10001,
          });
        }

        onClose();
      } else {
        message.error(result, 1);
      }
    } catch (e) {
      message.error(e, 1);
    } finally {
      Loading.end();
    }
  };

  const title = !isEdit ? LANG('创建子钱包') : LANG('编辑子钱包');

  if (isMobile) {
    return (
      <>
        <MobileModal
          visible={visible}
          onClose={onClose}
          type='bottom'
          zIndex={zIndexMap['--zindex-trade-pc-modal'] + 1}
        >
          <BottomModal
            title={title}
            onConfirm={_onConfirm}
            contentClassName={clsx('wallet-form-mobile-content')}
            displayConfirm={false}
            className={clsx('wallet-form-mobile-modal')}
          >
            <div style={{ marginTop: -10 }}>{content}</div>
          </BottomModal>
        </MobileModal>
        {styles}
      </>
    );
  }

  return (
    <>
      <Modal
        zIndex={zIndexMap['--zindex-trade-pc-modal'] + 1}
        onClose={onClose}
        visible={visible}
        contentClassName={clsx('wallet-form-content')}
        modalContentClassName={clsx('wallet-form-modal-content')}
      >
        <ModalTitle title={title} onClose={onClose} />
        {content}
      </Modal>
      {styles}
    </>
  );
};
