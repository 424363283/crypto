import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { Dropdown, Menu } from 'antd';
import { ColumnItem } from './types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from '@/core/utils';

export const useColumns = ({
  edit,
  onConfirmDeleteAddress
}: {
  edit: (row: ColumnItem) => void;
  onConfirmDeleteAddress: (id: number) => void;
}) => {
  // 表单类型
  const columns = [
    {
      title: LANG('币种'),
      dataIndex: 'currency',
      width: 220,
      showCustomRender: true,
      render: (value: string, row: ColumnItem) => {
        return (
          <div className="currency">
            <CoinLogo coin={value} width={20} height={20} />
            <span className="coin-name">{value}</span>
            <div className="tag-container">
              {row?.white && <span className="tag">{LANG('已验证')}</span>}
              {row?.common && <span className="tag">{LANG('已通用')}</span>}
            </div>
          </div>
        );
      }
    },
    {
      title: LANG('提币地址'),
      dataIndex: 'address',
      render: (address: string) => {
        return (
          <CopyToClipboard text={address} onCopy={() => message.success(LANG('复制成功'))}>
            <div className='address'>
              <span>{address}</span>
               <CommonIcon name="common-copy" size={16} />
            </div>
          </CopyToClipboard>
        );
      }
    },
    {
      title: 'Tag',
      dataIndex: 'addressTag',
      width: 80,
      render: (tag: string) => {
        return <span className="tag">{tag || '--'}</span>;
      }
    },
    {
      title: LANG('链名称'),
      dataIndex: 'chain',
      width: 100
    },
    {
      title: LANG('地址备注'),
      dataIndex: 'remark',
      width: 120,
      render: (remark: string) => {
        return <span className="remark">{remark || '--'}</span>;
      }
    },
    {
      title: LANG('操作'),
      dataIndex: 'id',
      align: 'right',
      width: 100,
      render: (value: number, row: ColumnItem) => {
        const actionMenu = (
          <Menu className="withdraw-action">
            <Menu.Item onClick={() => edit(row)}>{LANG('编辑')}</Menu.Item>
            <Menu.Item onClick={() => onConfirmDeleteAddress(value)}>{LANG('删除')}</Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={actionMenu} trigger={['click']}>
            <CommonIcon name="common-more-option" size={20} style={{ cursor: 'pointer' }} />
          </Dropdown>
        );
      }
    }
  ];
  return columns;
};
