import { Svg } from '@/components/svg';
import clsx from 'clsx';
import css from 'styled-jsx/css';
export default function LeverType(props: { leverType: number }) {
  const { leverType } = props;
  return (
    <>
      {leverType <= 3 && (
        <div className={clsx('followLever')}>
          <Svg src={`/static/icons/primary/common/follower-lever.svg`} width={24} height={24} />
          <span className={clsx('leverType','textWhite')}>{leverType}</span>
        </div>
      )}
      {leverType > 3 && (
        <div className={clsx('followLever')}>
          <span className={ clsx('leverType','textPrimary') }>{leverType}</span>
        </div>
      )}
      <style jsx>{LeverTypeStyle}</style>
    </>
  );
}

const LeverTypeStyle = css`
.followLever {
  width: 24px;
  height: 24px;
  position: relative;
}

.textWhite {
  color:var(--text_white);
}
.textPrimary {
  color: var(--text_1);
}
.leverType {
   font-family: "Lexend";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  position: absolute;
  left: 8px;
  top: 13%;
  margin: 0 auto;
}

`
