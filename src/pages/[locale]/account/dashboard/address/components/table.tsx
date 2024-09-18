import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { EnableAuthenticationModal } from '@/components/modal';
import { AlertFunction } from '@/components/modal/alert-function';
import Table from '@/components/table';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { useLoginUser } from '@/core/store';
import { MediaInfo, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { AddressContentModal } from './address-content';
import { ColumnItem } from './types';
import { useColumns } from './useColumns';

export default function AddressTable() {
  const { user } = useLoginUser();
  const router = useRouter();
  const { theme } = useTheme();
  const [state, setState] = useImmer({
    dataSource: [],
    addAddressVisible: false,
    addressItem: null as ColumnItem | null,
    current: 1,
    safetyVisible: false,
  });
  const { addressItem, dataSource, addAddressVisible, current, safetyVisible } = state;
  const getAddressList = async () => {
    Loading.start();
    const list = await Account.assets.getAssetsList();
    if (list.code !== 200) {
      message.error(LANG('获取地址列表失败'));
      return;
    }
    setState((draft) => {
      draft.dataSource = list.data || [];
    });
    Loading.end();
  };
  useEffect(() => {
    getAddressList();
  }, []);
  // 删除数据
  const _deleteAddress = async (id: number) => {
    const res = await Account.assets.deleteAddress(id);
    if (res.code === 200) {
      message.success(LANG('删除提币地址成功'));
      getAddressList();
    } else {
      message.error(res.message);
    }
  };
  // 编辑提币地址
  const _edit = (row: ColumnItem) => {
    setState((draft) => {
      draft.addAddressVisible = true;
      draft.addressItem = row;
    });
  };
  const onConfirmDeleteAddress = (id: number) => {
    AlertFunction({
      title: LANG('确定刪除此地址吗？'),
      onOk: () => _deleteAddress(id),
      theme: theme,
      content: '',
    });
  };
  const columns = useColumns({ edit: _edit, onConfirmDeleteAddress });

  const checkUserAuthentication = (allDoneCallback: () => void) => {
    if (!user?.bindEmail) {
      AlertFunction({
        hideHeaderIcon: false,
        centered: true,
        title: LANG('安全提示'),
        content: LANG('为了您的账户安全，请先绑定邮箱再进行提币操作'),
        onOk: () => {
          router.replace('/account/dashboard?type=security-setting&option=bind-email');
        },
      });
    } else if (!user.bindGoogle && user.pw_w === 0) {
      setState((draft) => {
        draft.safetyVisible = true;
      });
    } else {
      allDoneCallback?.();
    }
  };
  const _showModal = () => {
    checkUserAuthentication(() => {
      setState((draft) => {
        draft.addAddressVisible = true;
      });
    });
  };
  const _hideModal = () => {
    setState((draft) => {
      draft.addAddressVisible = false;
      draft.addressItem = null;
    });
  };
  // 添加地址成功回调
  const _confirm = () => {
    getAddressList();
    _hideModal();
  };
  // 切换页码
  const _onChange = (current: number) => {
    setState((draft) => {
      draft.current = current;
    });
  };

  return (
    <div className='address-content'>
      <div className='title-box'>
        <span className='title'>{LANG('地址管理')}</span>
        <Button type='primary' onClick={_showModal} className='add-address-btn'>
          {LANG('新建提币地址')}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        showMobileTable
        pagination={{
          current,
          pageSize: 10,
          total: dataSource?.length,
          onChange: _onChange,
        }}
      />
      <AddressContentModal
        open={addAddressVisible}
        confirm={_confirm}
        addressItem={addressItem}
        onCancel={_hideModal}
        hideModal={_hideModal}
      />
      <EnableAuthenticationModal
        user={user}
        visible={safetyVisible}
        onClose={() => setState((draft) => void (draft.safetyVisible = false))}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .address-content {
    min-height: calc(100vh - 82px);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    @media ${MediaInfo.tablet} {
      min-height: calc(100vh - 300px);
    }
    @media ${MediaInfo.mobile} {
      height: 100%;
    }
    @media ${MediaInfo.mobileOrTablet} {
      border-radius: 15px;
    }
    background: var(--theme-background-color-2);
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 75px;
      border-bottom: 1px solid var(--theme-border-color-2);
      @media ${MediaInfo.tablet} {
        padding: 0 15px;
      }
      .title {
        font-size: 20px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        @media ${MediaInfo.mobile} {
          font-size: 16px;
        }
      }
      :global(.add-address-btn) {
        min-width: 120px;
        padding: 10px 27px;
        font-size: 12px;
      }
    }
    :global(.ant-table-content .ant-table-cell) {
      word-break: break-all;
    }
    :global(.ant-table-thead .ant-table-cell) {
      color: var(--theme-font-color-3);
      font-size: 12px;
    }
    :global(td.ant-table-cell-row-hover) {
      background-color: var(--theme-background-color-8);
    }
  }
  :global(.common-mobile-table) {
    padding: 14px;
    @media ${MediaInfo.mobile} {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  :global(.card-item-content) {
    display: flex;
    justify-content: flex-end;
  }
  :global(.currency) {
    display: flex;
    align-items: center;
    :global(.coin-name) {
      margin-left: 5px;
    }
    :global(.tag-container) {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      padding-left: 4px;
    }
    :global(.tag) {
      background: rgba(67, 188, 156, 0.08);
      border-radius: 2px;
      font-weight: 400;
      font-size: 12px;
      line-height: 12px;
      color: #43bc9c;
      margin: 2px 0;
      margin-left: 4px;
      padding: 2px 6px;
    }
  }
`;
