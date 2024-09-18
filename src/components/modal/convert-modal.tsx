import { BasicModal } from '@/components/modal';
import Exchange from '@/components/modal/exchange';

const ConvertModal = (props: any) => {
  const { coin } = props;
  return (
    <BasicModal width={570} {...props} footer={null}>
      <Exchange isModel coin={coin} />
    </BasicModal>
  );
};

export default ConvertModal;
