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
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ColumnItem } from './types';
import { useColumns } from './useColumns';
import { Svg } from '@/components/svg';
const AddressContentModal = dynamic(() => import('./address-content'));
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { Size } from '@/components/constants';

export default function AddressTable() {
  const { user } = useLoginUser();
  const router = useRouter();
  const [state, setState] = useImmer({
    dataSource: [],
    addAddressVisible: false,
    addressItem: null as ColumnItem | null,
    current: 1,
    safetyVisible: false
  });
  const { addressItem, dataSource, addAddressVisible, current, safetyVisible } = state;
  const getAddressList = async () => {
    Loading.start();
    const list = await Account.assets.getAssetsList();
    if (list.code !== 200) {
      message.error(LANG('获取地址列表失败'));
      return;
    }
    setState(draft => {
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
    setState(draft => {
      draft.addAddressVisible = true;
      draft.addressItem = row;
    });
  };
  const onConfirmDeleteAddress = (id: number) => {
    AlertFunction({
      title: LANG('确定刪除此地址吗？'),
      onOk: () => _deleteAddress(id),
      content: '',
      centered: true,
      width: 378
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
        }
      });
    } else if (!user.bindGoogle && user.pw_w === 0) {
      setState(draft => {
        draft.safetyVisible = true;
      });
    } else {
      allDoneCallback?.();
    }
  };
  const _showModal = () => {
    checkUserAuthentication(() => {
      setState(draft => {
        draft.addAddressVisible = true;
        draft.addressItem = null;
      });
    });
  };
  const _hideModal = () => {
    setState(draft => {
      draft.addAddressVisible = false;
    });
  };
  // 添加地址成功回调
  const _confirm = () => {
    getAddressList();
    _hideModal();
  };
  // 切换页码
  const _onChange = (current: number) => {
    setState(draft => {
      draft.current = current;
    });
  };

  return (
    <div className="address-content rounded-1">
      <Desktop>
        <div className="title-box">
          <span className="title">{LANG('地址管理')}</span>
          <Button type="primary" onClick={_showModal} className="add-address-btn">
            <Svg src="/static/icons/primary/common/add_address.svg" width={14} height={14} />
            <span style={{ paddingLeft: '5px' }}> {LANG('新建提币地址')}</span>
          </Button>
        </div>
      </Desktop>
      <Table
        columns={columns}
        dataSource={dataSource}
        showMobileTable
        isHistoryList
        pagination={{
          current,
          pageSize: 10,
          total: dataSource?.length,
          onChange: _onChange
        }}
      />
      <AddressContentModal
        open={addAddressVisible}
        confirm={_confirm}
        addressItem={addressItem}
        onCancel={_hideModal}
        hideModal={_hideModal}
      />
      {safetyVisible && (
        <EnableAuthenticationModal
          user={user}
          visible={safetyVisible}
          onClose={() => setState(draft => void (draft.safetyVisible = false))}
        />
      )}
      <MobileOrTablet>
        <div className="title-box">
          <Button type="primary" size={Size.XL} rounded onClick={_showModal} className="add-address-btn">
            <Svg src="/static/icons/primary/common/add_address.svg" width={14} height={14} />
            <span style={{ paddingLeft: '5px' }}> {LANG('新建提币地址')}</span>
          </Button>
        </div>
      </MobileOrTablet>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .address-content {
    min-height: calc(100vh - 64px);
    background: var(--fill_bg_1);
    padding: 24px;
    :global(.bottom-pagination) {
      padding: 15px 20px;
    }
    @media ${MediaInfo.tablet} {
      min-height: calc(100vh - 300px);
    }
    @media ${MediaInfo.mobile} {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      padding: 16px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      border-radius: 15px;
    }
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background:var(--fill_bg_1);
      margin-bottom: 24px;
      @media ${MediaInfo.tablet} {
        position: absolute;
        bottom: 20px;
        left: 0;
      }
      @media ${MediaInfo.mobile} {
        margin-bottom: 3rem;
      }
      .title {
        font-size: 24px;
        font-weight: 500;
        color: var(--text_1);
        @media ${MediaInfo.mobile} {
          font-size: 16px;
        }
      }
      :global(.add-address-btn) {
        min-width: 140px;
        font-size: 14px;
        height: 32px;
        min-height: 32px;
        line-height: 32px;
        @media ${MediaInfo.mobile} {
          width: 100%;
          height: 48px;
        }
      }
    }
    :global(.ant-table-content .ant-table-cell) {
      word-break: break-all;
    }
    :global(.ant-table-thead .ant-table-cell) {
      color: var(--spec-font-color-2);
      font-size: 12px;
    }
    :global(td.ant-table-cell-row-hover) {
      background-color: var(--spec-background-color-3);
    }
  }
  :global(.common-mobile-table) {
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
  :global(.address) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    :global(span) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @media ${MediaInfo.mobileOrTablet} {
        width: 160px;
        white-space: wrap;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    @media ${MediaInfo.mobile} {
      justify-content: flex-end;
    }
  }
`;
