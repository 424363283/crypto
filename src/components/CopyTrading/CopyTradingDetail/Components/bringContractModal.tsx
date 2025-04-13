import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useResponsive } from '@/core/hooks';
import { useState } from 'react';
import CopyTradingContract from '../../Components/copyTradingContract';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { Copy } from '@/core/shared';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  contractSetting:string,
  type?:string
}
const BringContractModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const { isOpen, close,type } = props;
  const [checkedContract, setCheckedContract] = useState([]);
  const [contractLen, setContractLen] = useState(0);
  const handleSelect = (list:any,len?:number) => {
    setCheckedContract(list)
    setContractLen(len||0)
  }
  const confrimContract = async() => {
    if (type === 'bring') {
      Loading.start()
      const user: any = Copy.getUserInfo();
      const result: Record<number, string> = checkedContract.reduce((obj, item, index) => {
        obj[index] = item.id;
        return obj;
      }, {} as Record<number, string>);
      const res = await Copy.fetchUpdateShareConfig({
        uid: user?.user.uid,
        contractInfo: JSON.stringify(result)
      })
      Loading.end()
      if( res.code === 200) {
        close(true)
      } else {
        message.error(res.message)
      }
    } else {
      close(checkedContract,contractLen)
    }
  }
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('带单合约')}
          width={640}
          onCancel={() => close()}
          onOk={() => confrimContract()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <div className="copy-modal-container">
            <CopyTradingContract selectPositon="bottom"  selectContract={handleSelect}/>
          </div>
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer open={isOpen} title={'带单合约'} direction="bottom" height={454} width={'100%'} onClose={() => close()}>
          <div className="copy-modal-container">
            <CopyTradingContract selectPositon="bottom" selectContract={handleSelect} />
            <div className="handle-btn">
              <Button type="primary" rounded height={48} width={'100%'} onClick={confrimContract}>
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
`;

export default BringContractModal;
