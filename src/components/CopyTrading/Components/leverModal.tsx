import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import { Select } from '@/components/select';
import css from 'styled-jsx/css';
import { useState, useEffect, useImperativeHandle, forwardRef, useRef, useMemo } from 'react';
import { Group, GroupItem } from '@/core/shared';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { Svg } from '@/components/svg';
import Slider from '@/components/Slider';
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import clsx from 'clsx';
import { Input, SliderSingleProps } from 'antd';
import { Copy } from '@/core/shared';
import { maginModelOpts, leverModelOpts } from '@/components/CopyTrading/CopyTradingDetail/meta';
import CopySettingInput from '../CopySetting/copySettingInput';
import { ContractType } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
interface LeverModalProps {
  isOpen: boolean;
  close: Function;
  confrim: Function;
  leverInfo: Object;
}
const LeverModal = (props: LeverModalProps) => {
  const [list, setList] = useState<GroupItem[]>([]);
  const [leverSetting, setLeverSetting] = useState({
    marks: {},
    max: 100
  });
  const { isMobile } = useResponsive();
  const childContractRef = useRef<{ getContractLever: () => string }>(null);
  const isUsdtType = true;
  const { isOpen, close, confrim, leverInfo } = props;
  useEffect(() => {
    const getSwapCoinList = async () => {
      const group = await Copy.fetchSwapTradeList();
      if (group.code === 200) {
        const filterGroup = group.data.filter((item) => item.contractType === ContractType.swap)
        setList(filterGroup);
        setShowMaxLever(filterGroup, leverInfo.contractShowList);
      }
    };
    getSwapCoinList();
  }, []);
  useEffect(() => {
    const showList = leverInfo?.contractShowList;
    setShowMaxLever(list, showList);
  }, [isOpen]);
  const setShowMaxLever = (list: any, contractShowList: any) => {
    const showLeverList = Copy.getObjectIntersection(list, contractShowList, 'symbol');
    // 1. 找出最大值
    const maxValue = Math.max(...showLeverList.map(item => item.leverageLevel));
    // 2. 分成5个档位
    const numberOfTiers = 5;
    const step = maxValue / numberOfTiers;
    // 3. 初始化档位 Object
    const tiers: any = {
      1: '1'
    };
    for (let i = 0; i < numberOfTiers; i++) {
      tiers[(i + 1) * step] = (i + 1) * step + '';
    }
    setLeverSetting({
      max: maxValue,
      marks: tiers
    });
  };
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const [lever, setLever] = useState({
    ...leverInfo,
    maginModel: leverInfo.maginModel,
    leverModel: leverInfo.leverModel
  });
  const XIcon = () => {
    return (
      <span >
        x
      </span>
    );
  };
  const onChangeModel = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    const model: any = {
      maginModel: pair
    };
    if (pair.value === 2 || pair.value === 3) {
      model.leverModel = leverModelOpts[1];
    }
    setLever({
      ...lever,
      ...model
    });
  };
  const onChangeLeverModel = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    setLever({
      ...lever,
      leverModel: pair
    });
    const kkk = childContractRef.current?.getContractLever();
    console.log(kkk, 'kkk------');
  };

  const LeverContract = forwardRef((props: {}, ref) => {
    const inputContract = leverInfo.contractLeverList;
    const showList =
      leverInfo.contractShowList?.length > 0
        ? Copy.getObjectIntersection(list, leverInfo.contractShowList, 'symbol')
        : list;
    const formatLever = showList.map(item => {
      const findValue = inputContract.find(sym => sym.symbol === item.symbol);
      return {
        ...item,
        value: findValue?.value || 20
      };
    });
    const [contractLever, setContractLever] = useState(formatLever || []);
    const handleLever = (e, i: number) => {
      contractLever[i].value = e;
      setContractLever([...contractLever]);
      // props.handleContract([...contractLever])
    };
    useImperativeHandle(ref, () => ({
      getContractLever: () => contractLever
    }));

    return (
      <div className={clsx('contract-box', 'mt24')}>
        <div className={clsx('grid3 contract-title')}>
          <div>{LANG('合约')}</div>
          <div>{LANG('最大杠杆')}（x）</div>
          <div className="text-right">{LANG('自定义杠杆')}(x)</div>
        </div>
        <div className="contract-content">
          {contractLever &&
            contractLever.map((item, idx) => {
              return (
                <div key={item.symbol} className="grid3">
                  <div>{item.alias}</div>
                  <div>{item.leverageLevel} X</div>
                  <div className="text-right  fill-3">
                    <CopySettingInput
                      unit={<XIcon />}
                      value={item.value}
                      min={1}
                      max={item.leverageLevel}
                      onChange={e => {
                        handleLever(e, idx);
                      }}
                    ></CopySettingInput>
                  </div>
                </div>
              );
            })}
        </div>
        <style jsx>{copyLeverStyle}</style>
      </div>
    );
  });

  
  const MarginAndModule = () => {
    const [leverageLevel, setleverageLevel] = useState(leverInfo.leverageLevel || '');
    const handleConfrim = () => {
      const copyMargin = childContractRef.current?.getContractLever();
      console.log(copyMargin, 'copyMargin=====', lever.leverModel);
      const prams: any = lever;
      if (lever.leverModel.value === 2) {
        prams.leverageLevel = leverageLevel;
      } else if (lever.leverModel.value === 3) {
        prams.contractList = copyMargin;
      }
      confrim(prams);
      close();
    };
    const contentMagin = (
      <div>
        <p>{LANG('此设置会影响跟单交易活动的风险管理。')}</p>
        <p>{LANG('跟随交易员：所有仓位复制交易员的风险设置')}</p>
        <p>{LANG('全仓：跟单仓位设置为全仓，将可用资金分散到所有交易中，平衡风险。')}</p>
        <p>{LANG('逐仓：跟单仓位设置为逐仓，每个持仓分配特定金额，隔离风险。')}</p>
      </div>
    );
    const contentLevel = (
      <div>
        <p>{LANG('控制交易的借贷水平。')}</p>
        <p>{LANG('跟随交易员：使用与交易员相同的杠杆')}</p>
        <p>
          {LANG(
            '固定杠杆：所有交易采用一致的杠杆水平。若某些品种的最大杠杆低于设置的杠杆值，则会按照品种的最大杠杆进行开仓。'
          )}
        </p>
        <p>{LANG('自定义杠杆：每个品种可独立设置杠杆水平。')}</p>
      </div>
    );
    const leverageLevelContent = (
      <div>
        <p>
          {LANG('所有交易采用一致的杠杆水平。若某些品种的最大杠杆低于设置的杠杆值，则会按照品种的最大杠杆进行开仓。')}
        </p>
      </div>
    );
    const leverModelFilter = useMemo(() => {
      if (lever?.maginModel.value === 1) {
        return leverModelOpts;
      }
      return leverModelOpts.filter(item => item.value !== 1);
    }, [lever?.maginModel?.value]);
    return (
      <div className="copy-modal-container">
        <Tooltip title={contentMagin}>
          <span className="model-title">{LANG('保证金模式')}</span>
        </Tooltip>
        <Select
          vertical
          options={maginModelOpts}
          width={138}
          height={48}
          icon={'common-icon-down'}
          values={[lever.maginModel]}
          onChange={onChangeModel}
          className="select-coin-pair"
        />
        <Tooltip title={contentLevel}>
          <span className={clsx('model-title', 'mt24')}>{LANG('杠杆模式')}</span>
        </Tooltip>

        <Select
          vertical
          options={leverModelFilter}
          width={138}
          height={48}
          icon={'common-icon-down'}
          values={[lever.leverModel]}
          onChange={onChangeLeverModel}
          className="select-coin-pair"
        />
        {lever.leverModel.value === 2 && (
          <div>
            <div className="w100">
              <Tooltip title={leverageLevelContent}>
                <p className={clsx('model-title mt24')}>{LANG('杠杆倍数')}</p>
              </Tooltip>

              <div className="lever-input">
                <CopySettingInput
                  min={1}
                  max={leverSetting.max}
                  value={leverageLevel}
                  unit={<XIcon />}
                  onChange={value => {
                    setleverageLevel(value);
                  }}
                ></CopySettingInput>
              </div>
              <div className="w-full pb32">
                <Slider
                  disabled={false}
                  marks={leverSetting.marks}
                  value={leverageLevel}
                  min={1}
                  max={leverSetting.max}
                  className="mt24"
                  onChange={(value: any) => {
                    setleverageLevel(value);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {lever.leverModel.value === 3 && <LeverContract ref={childContractRef} />}
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
    :global(.ant-modal-content .ant-modal-title) {
      padding-bottom: 8px !important;
    }
    .copy-modal-container {
      .model-title {
        font-family: HarmonyOS Sans SC;
        font-size: 14px;
        font-weight: 500;
        border-bottom: 1px dashed var(--fill_line_2);
        cursor: pointer;
        margin-bottom: 8px;
        display: inline-block;
        color: var(--text_1);
      }
      .mt24 {
        margin-top: 24px;
      }
    }
    .w-full {
      width: 100%;
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
      color: var(--text_1);
    }
    .contract-title {
      color: var(--text_3);
    }
    .contract-content {
      max-height: 300px;
      height: auto;
      overflow: auto;
    }

    .text-right {
      text-align: right;
    }
    .fill-3 {
      :global(.input-wrapper) {
        border: 1px solid var(--fill_line_2);
        border-radius: 8px;
        height: 32px;
        padding: 8px;
      }
      :global(.focus) {
        :global(.input-wrapper) {
          border: 1px solid var(--brand);
        }
      }
    }
    .lever-input {
      :global(.ant-input-outlined) {
        background: var(--fill_3);
        border-radius: 12px;
        height: 40px;
      }
      :global(.container) {
        background: var(--fill_3);
        height: 48px;
        border-radius: 12px;
        :global(input) {
          margin: 0 16px;
          height: 40px;
          font-size: 14px;
          background: var(--fill_3);
        }
      }
    }
  }
  :global(.my24) {
    margin: 24px 0;
  }
  :glabal(.pb32) {
    padding-bottom: 4px;
  }
  :glabal(.mt24) {
    margin-top: 24px;
  }
`;

export default LeverModal;
