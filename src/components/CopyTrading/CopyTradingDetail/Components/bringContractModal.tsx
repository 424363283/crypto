import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useState } from 'react';
import CopyTradingContract from '../../Components/copyTradingContract';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { Copy } from '@/core/shared';
import { message } from '@/core/utils/src/message';
import { MediaInfo} from '@/core/utils'
import { Loading } from '@/components/loading';
import { Size } from '@/components/constants';
interface CancelSettingProps {
  isOpen: boolean;
  type?: string;
  close: Function;
  contractSetting: any; // 合约设置的列表
  contractList: any; // 合约列表
  contractShowList?: string; // 合约需要显示的列表
  title?: string; // 标题
}
const BringContractModal = (props: CancelSettingProps) => {
  // const { isMobile } = useResponsive();
  const { isOpen, close, type, contractSetting, contractList, contractShowList, title } = props;
  const [checkedContract, setCheckedContract] = useState([]);
  const [contractLen, setContractLen] = useState(0);
  const handleSelect = (list: any, len?: number) => {
    setCheckedContract(list);
    setContractLen(len || 0);
  };
  const confrimContract = async () => {
    if (type === 'bring') {
      if (!checkedContract?.length) {
        message.error(LANG('请选择合约'));
        return;
      }
      Loading.start();
      const user: any = await Copy.getUserInfo();
      const result: Record<number, string> = checkedContract.reduce((obj, item, index) => {
        obj[index] = item.symbol;
        return obj;
      }, {} as Record<number, string>);
      const res = await Copy.fetchUpdateShareConfig({
        uid: user?.uid,
        contractInfo: checkedContract.length > 0 ? JSON.stringify(result) : ''
      });
      Loading.end();
      if (res?.code === 200) {
        close(true);
      } else {
        message.error(res.message);
      }
    } else {
      close(checkedContract, contractLen);
    }
  };
  return (
    <>
      {!MediaInfo.isMobile && (
        <BasicModal
          open={isOpen}
          title={title || LANG('合约')}
          width={640}
          onCancel={() => close()}
          onOk={() => confrimContract()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <div className="copy-modal-container">
            <CopyTradingContract
              type={type}
              selectPositon="bottom"
              contractSetting={contractSetting}
              contractList={contractList}
              contractShowList={contractShowList}
              selectContract={handleSelect}
            />
          </div>
        </BasicModal>
      )}
      {MediaInfo.isMobile && (
        <MobileDrawer
          open={isOpen}
          title={'带单合约'}
          direction="bottom"
          height={454}
          width={'100%'}
          onClose={() => close()}
        >
          <div className="copy-modal-container">
            <CopyTradingContract
              selectPositon="bottom"
              type={type}
              contractSetting={contractSetting}
              contractList={contractList}
              contractShowList={contractShowList}
              selectContract={handleSelect}
            />
            <div className="handle-btn">
              <Button type="primary" rounded size={Size.MD} width={'100%'} onClick={confrimContract}>
                {'确定'}
              </Button>
            </div>
          </div>
        </MobileDrawer>
      )}

      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
    .flexCenter {
      display: flex;
      align-items: center;
    }

    :global(.ant-modal-content) {
      padding: 24px 0;
      :global(.basic-content) {
        padding: 8px 24px;
      }
      :global(.ant-modal-title) {
        padding-bottom: 8px!important;
      }
    }
    .flexSpan {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .copy-modal-container {
    }
  }
  :global(.handle-btn) {
    margin: 24px 0;
  }
    :global(.ant-modal-footer) {
         :global(.ant-btn) {
         font-size: 16px;
      }
    }
  
`;

export default BringContractModal;
