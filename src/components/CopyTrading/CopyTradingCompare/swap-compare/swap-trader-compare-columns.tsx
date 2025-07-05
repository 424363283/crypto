import type { ColumnsType } from 'antd/es/table';
import { useRouter } from '@/core/hooks';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';

// 定义表格列
const columns: ColumnsType<any> = [
  {
    title: '属性',
    dataIndex: 'property',
    key: 'property',
    width: '20%',
  },
  {
    title: '交易员No.1',
    dataIndex: 'trader1',
    key: 'trader1',
    width: '20%',
  },
  {
    title: '交易员No.2',
    dataIndex: 'trader2',
    key: 'trader2',
    width: '20%',
  },
  {
    title: '交易员No.3',
    dataIndex: 'trader3',
    key: 'trader3',
    width: '20%',
  },
  {
    title: '交易员No.4',
    dataIndex: 'trader4',
    key: 'trader4',
    width: '20%',
  },
];

export { columns };
