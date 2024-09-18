import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { LANG } from '@/core/i18n';
import { FAVORITE_TYPE, FAVORS_LIST, Favors, Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation } from 'react-use';
import css from 'styled-jsx/css';
import { Item } from './item';
import { store } from './store';
export const SortModal = ({ visible, onClose }: { visible: any; onClose: any }) => {
  const { isUsdtType } = Swap.Trade.base;
  // const ref = useRef<any>({ data: [] }).current;
  const [favorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);
  // const [list, setList] = useState<any>([]);
  const { sorts } = store;
  const isDemo = isSwapDemo(useLocation().pathname);
  let data: any = useMemo(
    () =>
      favorsList.reduce<any>(
        (r, v) => [
          ...r,
          ...((!isDemo
            ? [FAVORITE_TYPE.SWAP_USDT, FAVORITE_TYPE.SWAP_COIN]
            : [FAVORITE_TYPE.SWAP_USDT_TESTNET, FAVORITE_TYPE.SWAP_COIN_TESTNET]
          ).includes(v.type)
            ? v.list
            : []),
        ],
        []
      ),
    [favorsList, isUsdtType]
  );
  data = data
    .map((v: string, i: number) => [v, sorts[v] !== undefined ? sorts[v] : i])
    .sort((a: any, b: any) => a[1] - b[1])
    .map((v: any) => v[0]);
  data = data;
  // data = data.map((v) => list.find((i: any) => i.id === v));

  const fetchFavorsList = async () => {
    const favors = await Favors.getInstance();
    const favList = favors.getFavorsList();
    setFavorsList(favList || []);
  };
  // useWs(
  //   SUBSCRIBE_TYPES.ws3001,
  //   (data) => {
  //     if (!isUsdtType) {
  //       setList(data.getSwapCoinList());
  //     }
  //     if (isUsdtType) {
  //       setList(data.getSwapUsdtList());
  //     }
  //   },
  //   [isUsdtType]
  // );

  useEffect(() => {
    fetchFavorsList();
  }, [visible]);

  const _onDragTop = (item: any) => {
    const id = data.findIndex((v: any) => v === item);
    const afterId = 0;
    _onDragItem(id, afterId);
  };

  const _onDragItem = (id: any, afterId: any) => {
    const a = data[id];
    const b = data[afterId];
    if (a === b) {
      return afterId;
    }
    const isUp = afterId < id;
    const count = isUp ? id - afterId : afterId - id;
    console.log('id', id, 'afterId', afterId, 'isUp', isUp, count);
    let index = id;
    const data2 = [...data];
    Array.from({ length: count }).forEach(() => {
      if (isUp) {
        arrayUp(index, data2);
        index--;
      } else {
        arrayDown(index, data2);
        index++;
      }
    });
    console.log('data2', data2);
    requestAnimationFrame(() => {
      store.sorts = data2.reduce((r: any, v: any, i: any) => ({ ...r, [v]: i }), {});
    });
  };

  return (
    <>
      <Modal visible={visible} onClose={onClose} modalContentClassName={clsx('swap-sort-modal-content')}>
        <ModalTitle title={LANG('编辑排序')} onClose={onClose} border />
        <div className='sort-modal'>
          <div className='title'>
            <div>{LANG('交易对')}</div>
            <div>{LANG('置顶')}</div>
            <div>{LANG('拖动')}</div>
          </div>
          <DndProvider backend={HTML5Backend as any}>
            <div className='content'>
              {data.map((item: any, i: any) => {
                return <Item key={item} i={i} item={item} onDragItem={_onDragItem} onDragTop={_onDragTop} />;
              })}
            </div>
          </DndProvider>
        </div>
        <style jsx>{`
          .sort-modal {
            height: 400px;
            display: flex;
            flex-direction: column;
            .title {
              margin: 0 15px;
              display: flex;
              align-items: center;
              height: 46px;
              border-bottom: 1px solid var(--theme-trade-border-color-1);
              > div {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: var(--theme-trade-text-color-3);
                &:nth-child(1) {
                  text-align: left;
                  flex: 1.4;
                }
                &:nth-child(2) {
                  justify-content: center;
                  flex: 1;
                }
                &:nth-child(3) {
                  justify-content: flex-end;
                  flex: 1;
                }
              }
            }
            .content {
              flex: 1;
              overflow: scroll;
              padding-top: 10px;
            }
          }
        `}</style>
        {/* <ModalFooter onConfirm={onClose} onCancel={onClose} /> */}
      </Modal>
      {styles}
    </>
  );
};
const { className, styles } = css.resolve`
  .swap-sort-modal-content {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

export const clsx = clsxWithScope(className);

const arrayUp = (index: number, array: any) => {
  if (index === 0) return false;
  // 将上一个数组元素值替换为当前元素值，并将被替换的元素值赋值给当前元素
  array[index] = array.splice(index - 1, 1, array[index])[0];
  return array;
};
const arrayDown = (index: number, array: any) => {
  if (index === array.length - 1) return false;
  // 将上下个数组元素值替换为当前元素值，并将被替换的元素值赋值给当前元素
  array[index] = array.splice(index + 1, 1, array[index])[0];
  return array;
};

export default SortModal;
