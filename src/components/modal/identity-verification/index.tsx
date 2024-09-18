import { ApiProvider } from './context';
import IdentityModal from './identify-modal';

type IProps = {
  onVerifiedDone?: () => void;
  remainAmount?: number;
  unit?: string;
} & BasicProps;

const IdentityVerificationModal = (props: IProps) => {
  return (
    <ApiProvider>
      <IdentityModal {...props} />
    </ApiProvider>
  );
};
export default IdentityVerificationModal;
