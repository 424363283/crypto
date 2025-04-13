import { Svg } from '@/components/svg';
import { clsx } from '@/core/utils';

const Pointer = ({ value, className }: { value: number; className?: string }) => {
  const deg = (130 - -140) * value; // -140deg ~ 130deg
  return (
    <>
      <div className={clsx('pointer', className)}>
        <div className={'index'} style={{ transform: `rotate(${-140 + deg}deg)` }}>
          <Svg src={'/static/images/swap/index_pointer.svg'} className={'img'} width='7.2' height='11.7' />
        </div>
        <Svg src={'/static/images/swap/index_round.svg'} className={'round'} height='16' width='22.532' />
      </div>
      <style jsx>{`
        .pointer {
          position: relative;
          display: flex;
          width: 24px;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .index {
            margin-top: 3px;
            margin-right: 2px;
            height: 22.532px;
            width: 22.532px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            z-index: 2;
            position: absolute;
            :global(.img) {
              margin-top: -4px;
            }
          }
        }
      `}</style>
    </>
  );
};

export default Pointer;
