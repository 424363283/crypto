import { Input } from "antd";
import { clsx, styles } from './styled';

function getPositionSide(positionSide: string, inputPrice: number, avgCostPrice: number, percent: string | number, type: string) {
  if (percent) {
    percent = String(percent).replace(/-/g, '')
  }
  let a = ''
  // 做多
  if (positionSide === "LONG") {
    // 止盈
    if (type === 'stopProfit') {
      if (inputPrice >= avgCostPrice) {
        a = ''
      } else {
        a = inputPrice > 0 && percent != 0 ? '-' : ''
      }
    } else {
      // 止损

      if (inputPrice < avgCostPrice) {
        a = inputPrice > 0 ? '-' : ''
      } else {
        a = ''
      }
    }

  } else { // 做空

    // 止盈
    if (type === 'stopProfit') {
      // 输入价格大于均价 一定是+
      if (inputPrice > avgCostPrice) {
        a = ''
      } else {
        a = inputPrice > 0 ? '-' : ''
      }

    } else {
      //止损
      if (inputPrice > avgCostPrice) {
        a = ''
      } else {
        a = inputPrice > 0 && percent != 0 ? '-' : ''
      }
    }
  }
  return a + percent

}

export const InputRoe = ({
  value,
  onChange,
  type,
  positionSide,
  avgCostPrice,
  inputPrice,
  ...props
}: any) => {
  const inputValue = getPositionSide(positionSide, Number(inputPrice), Number(avgCostPrice), value, type)


  const handleChange = (e: any) => {
    let value = e.target.value.replace(/-/g, '');
    const reg = /^(\d+(\.\d{0,2})?)?$/;
    if (reg.test(value) || value === '') {
      value = value;
    } else {
      // 如果不符合格式，则移除非法字符
      value = value.slice(0, -1);
    }
    onChange(value)
  };
  const otherProps = props
  otherProps.inputMode = 'decimal'; // 手机数字键盘
  return (
    <>
      <div className={clsx('input-roe')}>
        <Input
          suffix="%"
          value={inputValue}
          onChange={(v) => {
            handleChange(v)
          }}
          {...otherProps}
        />
      </div>
      {styles}
    </>
  )
}



export default InputRoe;
