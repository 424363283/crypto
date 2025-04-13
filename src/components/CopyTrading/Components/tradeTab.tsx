'use client';

import CopyTradingTraders from '@/components/CopyTrading/index';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './tradeTab.module.scss'
import PositionsList from '@/components/CopyTrading/Components/positionsList';
//我的带单-tab 选择
export default function CopyTradingTables() {
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '表现',
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: '当前带单',
            children: <PositionsList/>
        },
        {
            key: '3',
            label: '历史带单',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: '跟随者',
            children: 'Content of Tab Pane 3',
        },
    ];



    return (
        <div className={styles.userTraderTabs}>
             <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
        </div>
    )
}
