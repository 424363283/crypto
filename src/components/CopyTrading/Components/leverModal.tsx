import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import { Select } from '@/components/select';
import { Svg } from '@/components/svg';
import css from 'styled-jsx/css';
import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Group, GroupItem } from '@/core/shared';
import Slider from '@/components/Slider';
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import clsx from 'clsx';
import { Input, SliderSingleProps } from 'antd';
import { copySettingInput } from './copySettingInput';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  confrim: Function;
}
const LeverModal = (props: CancelSettingProps) => {
  const [list, setList] = useState<GroupItem[]>([]);
  const { isMobile } = useResponsive();
  const childContractRef = useRef<{ getContractLever: () => string }>(null);
  const isUsdtType = true;
  const { isOpen, close, confrim } = props;
  const setCancel = () => {};
  useEffect(() => {
    const getSwapCoinList = async () => {
      const group = await Group.getInstance();
      const list = (isUsdtType ? group?.getSwapUsdList : group?.getSwapCoinList) || [];
      setList(list);
      return list;
    };
    getSwapCoinList();
  }, []);
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  const maginModelOpts = [
    {
      label: LANG('跟随交易员'),
      value: 1
    },
    {
      label: LANG('全仓'),
      value: 2
    },
    {
      label: LANG('逐仓'),
      value: 3
    }
  ];

  const leverModelOpts = [
    {
      label: LANG('跟随交易员'),
      value: 1
    },
    {
      label: LANG('固定倍数'),
      value: 2
    },
    {
      label: LANG('自定义杠杆'),
      value: 3
    }
  ];

  const [lever, setLever] = useState({
    maginModel: {
      label: LANG('逐仓'),
      value: 3
    },
    leverModel: {
      label: LANG('跟随交易员'),
      value: 1
    },
    sliderValue: '',
    contractList: []
  });
  const onChangeModel = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    setLever({
      ...lever,
      maginModel: pair
    });
  };
  const onChangeLeverModel = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    setLever({
      ...lever,
      leverModel: pair
    });
  };

  const handleChangeSilde = () => {
    setLever({
      ...lever
    });
  };

  const LeverContract = forwardRef((props: {}, ref) => {
    const formatLever = list.map(item => {
      return {
        ...item,
        value: ''
      };
    });
    const [contractLever, setContractLever] = useState(formatLever || []);
    const handleLever = (e, i: number) => {
      contractLever[i].value = e.target.value;
      setContractLever([...contractLever]);
      // props.handleContract([...contractLever])
    };
    useImperativeHandle(ref, () => ({
      getContractLever: () => contractLever,
    }));
    return (
      <div className={clsx('contract-box', 'mt24')}>
        <div className={clsx('grid3 contract-title')}>
          <div>{LANG('合约')}</div>
          <div>{LANG('最大杠杆')}</div>
          <div className="text-right">{LANG('自定义杠杆')}(x)</div>
        </div>
        <div className="contract-content">
          {contractLever &&
            contractLever.map((item, idx) => {
              return (
                <div key={item.id} className="grid3">
                  <div>{item.name}</div>
                  <div>{item.lever}</div>
                  <div className="text-right">
                    <Input
                      value={item.value}
                      onChange={e => {
                        handleLever(e, idx);
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <style jsx>{copyLeverStyle}</style>
      </div>
    );
  });

  const marks: SliderSingleProps['marks'] = {
    1: '1',
    25: '25',
    50: '50',
    75: '75',
    100: '100'
  };
  const MarginAndModule = () => {
    const handleConfrim = () => {
      const  copyMargin = childContractRef.current?.getContractLever()
      if (lever.leverModel.value === 2) {
        confrim({
          lever
        });
      } else if (lever.leverModel.value === 3) {
        confrim({
          lever
        });
      } else {
        confrim({
          lever
        });
      }
    };
    return (
      <div className="copy-modal-container">
        <span className="model-title">{LANG('保证金模式')}</span>
        <Select
          vertical
          options={maginModelOpts}
          width={138}
          values={[lever.maginModel]}
          onChange={onChangeModel}
          className="select-coin-pair"
        />
        <span className={clsx('model-title', 'mt24')}>{LANG('杠杆模式')}</span>
        <Select
          vertical
          options={leverModelOpts}
          width={138}
          values={[lever.leverModel]}
          onChange={onChangeLeverModel}
          className="select-coin-pair"
        />
        {lever.leverModel.value === 2 && (
          <div>
            <div className="w100">
              <p className={clsx('model-title mt24')}>{LANG('杠杆倍数')}</p>
              <div className="lever-input">
                <Input
                  max={100}
                  value={lever.sliderValue}
                  onChange={({ target: { value } }) => {
                    setLever({
                      ...lever,
                      sliderValue: value
                    });
                  }}
                />
              </div>
              <div className="w100 pb32">
                <Slider
                  disabled={false}
                  marks={marks}
                  step={1}
                  value={lever.sliderValue}
                  min={0}
                  max={100}
                  className="w100 mt24"
                  onChange={(value: any) => {
                    setLever({
                      ...lever,
                      sliderValue: value
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {lever.leverModel.value === 3 && <LeverContract ref={childContractRef} /> }
        <Button type="primary" className="mt24" rounded height={48} width={'100%'} onClick={handleConfrim}>
          {LANG('确定')}
        </Button>
        <style jsx>{copyLeverStyle}</style>
      </div>
    );
  };

  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('保证金模式&杠杆模式')}
          width={480}
          onCancel={() => close()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
          hasFooter={false}
        >
          <MarginAndModule />
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('保证金模式&杠杆模式')}
          direction="bottom"
          height={lever.leverModel.value === 3 ? '600' : 'auto'}
          width={'100%'}
          className="copy-cancel-modal"
          onClose={() => close()}
        >
          <MarginAndModule />
        </MobileDrawer>
      )}
      <style jsx>{copyLeverStyle}</style>
    </>
  );
};

const copyLeverStyle = css`
  :global(.copy-cancel-modal) {
    .flexCenter {
      display: flex;
      align-items: center;
    }
    .copy-modal-container {
      .model-title {
        font-family: HarmonyOS Sans SC;
        font-size: 14px;
        font-weight: 500;
        border-bottom: 1px dashed var(--line-2);
        cursor: pointer;
        margin-bottom: 8px;
        display: inline-block;
      }
      .mt24 {
        margin-top: 24px;
      }
    }
    .grid3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 16px;
      align-items: center;
    }
    .contract-box {
      font-family: HarmonyOS Sans SC;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }
    .contract-title {
      color: var(--text-tertiary);
    }
    .contract-content {
      height: 300px;
      overflow: auto;
    }
    .text-right {
      text-align: right;
    }
    .lever-input {
      :global(.ant-input-outlined) {
        background: var(--fill-3);
        border-radius: 12px;
        height: 40px;
      }
    }
  }
  :global(.my24) {
    margin: 24px 0;
  }
  :glabal(.pb32) {
    padding-bottom: 32px;
  }
  :glabal(.mt24) {
    margin-top: 24px;
  }
`;

export default LeverModal;
