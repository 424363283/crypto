import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import { message } from 'antd';
import { useResponsive } from '@/core/hooks';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import UserTagsModule from './userTagsModule'
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
}
const BringContractModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const { isOpen, close } = props;
  const setCancel = () => {};
  const tags = [
    {
      label: LANG('高收益额'),
      isChecked: false,
      value: 1
    },
    {
      label:LANG('高频'),
      isChecked: false,
      value: 2
    },
    {
      label:LANG('高回报率'),
      isChecked: false,
      value: 3
    },
    {
      label: LANG('稳健'),
      isChecked: false,
      value: 4
    },
    {
      label:LANG('常胜'),
      isChecked: false,
      value: 5
    },
    {
      label: LANG('低频'),
      isChecked: false,
      value: 6
    },
    {
      label: LANG('激进'),
      isChecked: false,
      value: 7
    },
    {
      label: LANG('轻仓'),
      isChecked: false,
      value: 8
    },
    {
      label: LANG('低风险'),
      isChecked: false,
      value: 9
    },
    {
      label: LANG('保守'),
      isChecked: false,
      value: 10
    },
    {
      label: LANG('止损'),
      isChecked: false,
      value: 11
    },
    {
      label: LANG('网格'),
      isChecked: false,
      value: 12
    },
    {
      label: LANG('短线'),
      isChecked: false,
      value: 13
    },
    {
      label: LANG('低杠杆'),
      value: 14
    },
    {
      label: LANG('热衷BTC,ETH'),
      isChecked: false,
      value: 15
    },
    {
      label: LANG('短线'),
      isChecked: false,
      value: 16
    }
  ];

  const [tagsList, setTagsList] = useState(tags);
  const handleSelect = (row: any) => {
    const checkList = tagsList.filter(item => item.isChecked);
    if (checkList.length >= 8) {
      message.warning(LANG('最多可选择8个标签'));
      return;
    }
    const rowIdx = tagsList.findIndex(item => item.value === row.value);
    tagsList[rowIdx].isChecked = true;
    setTagsList([...tagsList]);
  };

  const TagsModule = () => {
    return (
      <div className="copy-modal-container">
        <p className="tips">{LANG('最多可选择8个标签')}</p>
        <UserTagsModule selected={(item)=>handleSelect(item)} tagsList={tagsList} />
        <style jsx>{copyCancelStyle}</style>
      </div>
    );
  };
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('个性化标签')}
          width={640}
          onCancel={() => close()}
          onOk={() => setCancel()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <TagsModule />
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('带单合约')}
          direction="bottom"
          height={350}
          width={'100%'}
          className='copy-cancel-modal'
          onClose={() => close()}
        >
          <TagsModule />
          <div className="my24">
            <Button type="primary" rounded height={48} width={'100%'}>
              {LANG('确定')}
            </Button>
          </div>
        </MobileDrawer>
      )}
      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
    .item-row {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
       font-family: "Lexend";;
      font-size: 12px;
      font-weight: 400;
      border: 0.5px solid var(--fill_line_3);
      border-radius: 8px;
      cursor: pointer;
      &.item-active {
        color: var(--text_brand);
      }
    }
    .tips {
       font-family: "Lexend";;
      font-size: 12px;
      font-weight: 400;
      color: var(--text_3);
      margin-bottom: 24px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 8px;
      grid-row-gap: 8px;
    }
      .my24 {
        margin:24px;
      }
  }
`;

export default BringContractModal;
