import { generateButton } from './button';

export const OrderBuyButton = generateButton({ id: 'btn_buy' });
export const OrderSellButton = generateButton({ id: 'btn_sell' });
export const OrderTypeButton = ({ buy, sell, ...props }: any) => {
  const Comp = buy ? OrderBuyButton : OrderSellButton;
  return <Comp {...props} />;
};
export const RegisteButton = generateButton({ id: 'btn_register' });
