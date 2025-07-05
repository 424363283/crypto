import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { UniversalLayout } from '@/components/layouts/universal';
import { BasicModal } from '@/components/modal';
import Nav from '@/components/nav';
import { Svg } from '@/components/svg';
import Table from '@/components/table';
import { depositAddressCreateApi, depositAddressUpdateApi, getAccountDepositAddressListApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG, Lang } from '@/core/i18n';
import { MediaInfo, clsx, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

const RechargeAddress = () => {
  const router = useRouter();
  const { network, currency } = router.query;
  const [addressList, setAddressList] = useState([] as Array<object>);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [addressObj, setAddressObj] = useState({} as any);
  const [alias, setAlias] = useState('');

  // 关闭弹窗
  const _onCancel = () => setOpen(false);
  const _onCancel1 = () => setOpen1(false);

  // 开启设置地址名称弹窗
  const _openNameModel = (item: any) => {
    setAddressObj(item);
    setAlias(item.alias);
    setOpen1(true);
  };

  // 设置备注
  const _updateRemark = async () => {
    setOpen1(false);
    try {
      const { code, message: msg } = await depositAddressUpdateApi({
        id: addressObj.id,
        selected: addressObj.selected,
        alias,
      });
      if (code === 200) {
        _getDepositAddressList();
        message.success(LANG('更新地址成功'));
      } else {
        message.error(msg);
      }
    } catch (error) {
      message.error(error);
    }
  };

  // 获取充值地址
  const _getDepositAddressList = async () => {
    if (currency && network) {
      try {
        const {
          data = [],
          code,
          message: msg,
        }: { data: Array<object>; code: number; message?: string } = await getAccountDepositAddressListApi({
          currency,
          network,
        });
        if (code === 200) {
          setAddressList(data);
        } else {
          message.error(msg);
        }
      } catch (error) {
        message.error(error);
      }
    }
  };

  // 新增充值地址
  const _addAddress = async () => {
    if (currency && network) {
      try {
        const { code, message: msg } = await depositAddressCreateApi({ currency, network });
        if (code === 200) {
          _getDepositAddressList();
        } else {
          message.error(msg);
        }
      } catch (error) {
        message.error(error);
      }
    }
  };

  // 设置选用地址
  const _updateAddress = async (item: { id: string; selected: boolean }) => {
    if (item?.id && !item.selected) {
      try {
        const { code, message: msg } = await depositAddressUpdateApi({ id: item.id, selected: true });
        if (code === 200) {
          _getDepositAddressList();
          message.success(LANG('更新地址成功'));
        } else {
          message.error(msg);
        }
      } catch (error) {
        message.error(error);
      }
    }
  };

  const columns = [
    {
      title: LANG('创建时间'),
      dataIndex: 'createTime',
      render: (value: number) => {
        return <div>{dayjs(value).format('YYYY/MM/DD HH:mm:ss')}</div>;
      },
      width: 180,
    },
    {
      title: LANG('编号'),
      dataIndex: 'number',
      render: (value: number) => {
        return <div>{value}</div>;
      },
    },
    {
      title: LANG('充币地址'),
      dataIndex: 'address',
      render: (value: string) => {
        return (
          <div className='text-address'>
            {value}
            <CopyToClipboard text={value} onCopy={() => message.success(LANG('复制成功'))}>
              <CommonIcon size={16} name='common-copy' className='icon' enableSkin />
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: LANG('标签'),
      dataIndex: 'addressTag',
      render: (value: string) => {
        return (
          <div className='text-address'>
            {value}
            <CopyToClipboard text={value} onCopy={() => message.success(LANG('复制成功'))}>
              <CommonIcon size={16} name='common-copy' className='icon' enableSkin />
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: LANG('备注'),
      dataIndex: 'alias',
      render: (value: string, item: object) => {
        return (
          <div className='text-address'>
            {value}
            <CommonIcon
              onClick={() => _openNameModel(item)}
              name='common-small-edit-0'
              width={12}
              height={13}
              className='icon'
              enableSkin
            />
          </div>
        );
      },
      width: 120,
    },
    {
      title: LANG('操作'),
      align: 'right',
      dataIndex: 'selected',
      render: (value: number, item: any) => {
        return (
          <div onClick={() => _updateAddress(item)} className={clsx('selected-btn', value && 'selected')}>
            {value ? LANG('当前选用') : LANG('选用')}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    _getDepositAddressList();
  }, [currency, network]);

  return (
    <UniversalLayout bgColor='var(--theme-background-color-9)' headerBgColor='var(--fill_2)'>
      <Nav title={LANG('地址簿')} />
      <div className='recharge-address'>
        <div className='title'>
          <span className='text'>
            {currency}-{network} {LANG('地址簿')}
          </span>
          <div className={clsx('pc-v2-btn', 'btn')} onClick={_addAddress}>
            <Svg
              src='/static/icons/primary/common/add.svg'
              width={20}
              height={20}
              currentColor={'var(--skin-font-color)'}
            />
            &nbsp;
            {LANG('新增地址')}
          </div>
        </div>
        <Table dataSource={addressList} columns={columns} pagination={false} showTabletTable showMobileTable />
        {open && (
          <BasicModal
            open={open}
            onCancel={_onCancel}
            onOk={_onCancel}
            width={380}
            okText={LANG('好的')}
            cancelButtonProps={{ style: { display: 'none' } }}
            className='recharge-address-modal'
            closable={false}
          >
            <div className='add-prompt'>
              <Image src='/static/images/common/success-1.png' alt='' width='64' height='64' />
              <div>{LANG('新地址添加成功')}</div>
            </div>
          </BasicModal>
        )}
        {open1 && (
          <BasicModal
            open={open1}
            onCancel={_onCancel1}
            onOk={_updateRemark}
            width={380}
            okText={LANG('确认修改')}
            cancelButtonProps={{ style: { display: 'none' } }}
            className='recharge-address-modal'
            closable={false}
          >
            <div className='add-prompt'>
              <input
                className={clsx('pc-v2-input', 'input')}
                type='text'
                placeholder={LANG('请输入地址名称')}
                onChange={(e) => setAlias(e.target.value)}
                value={alias}
              />
            </div>
          </BasicModal>
        )}
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
};

const styles = css`
  :global(.recharge-address-modal) {
    color: var(--theme-font-color-1);
    :global(.add-prompt) {
      padding-top: 20px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      :global(.input) {
        border-radius: 5px;
        height: 40px;
        width: 100%;
        padding: 0 20px;
        font-size: 14px;
      }
      :global(img) {
        margin-bottom: 10px;
      }
    }
  }
  .recharge-address {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    width: 100%;
    padding: 30px 0;
    color: var(--theme-font-color-1);
    @media ${MediaInfo.tablet} {
      padding: 30px 32px;
    }
    @media ${MediaInfo.mobile} {
      padding: 30px 16px;
    }
    :global(.text-address) {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      :global(.text-address) {
        justify-content: flex-end;
      }
    }
    :global(.icon) {
      width: auto;
      cursor: pointer;
      height: 12px;
    }
    :global(.selected-btn) {
      display: inline-block;
      line-height: 30px;
      font-size: 12px;
      padding: 0 10px;
      border: 1px solid var(--theme-border-color-1);
      border-radius: 5px;
      margin-left: 20px;
      cursor: pointer;
      min-width: 70px;
      text-align: center;
    }
    :global(.selected) {
      border-color: var(--skin-primary-color);
      color: var(--skin-primary-color);
    }
    :global(svg) {
      fill: var(--skin-font-color);
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 30px;
      .text {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      line-height: 1;
      height: 32px;
      font-size: 14px;
      border-radius: 5px;
      padding: 0 10px;
    }
  }
`;
export default Lang.SeoHead(RechargeAddress);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'account/fund-management/asset-account' });
