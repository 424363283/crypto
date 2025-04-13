import { LANG } from '@/core/i18n';
import { Account, FAVORITE_TYPE, Favors, FAVORS_LIST } from '@/core/shared';
import { message } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import CommonIcon from '../common-icon';
import { useSymbolStore } from '@/store/symbol-change';
/* eslint-disable react/display-name */
const StarComponent = (props: {
  code: string;
  type: FAVORITE_TYPE;
  onFavorite?: (list: FAVORS_LIST[]) => void;
  inQuoteList?: boolean;
  width?: number;
  height?: number;
}) => {
  const { code, type, onFavorite, inQuoteList = false, width = 14, height = 14 } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const { togglesymbolStatus, symbolStatus } = useSymbolStore();
  useEffect(() => {
    const handleIsFavorite = async () => {
      const favors = await Favors.getInstance();
      const isFavor = await favors.isFavor(code);
      setIsFavorite(isFavor);
    };
    handleIsFavorite();
  }, [code, symbolStatus]);

  const handleFavorite = async (id: string) => {
    if (!Account.isLogin) {
      message.error(LANG('请先登录'));
      return;
    }
    const favors = await Favors.getInstance();

    const res = await favors.toggleFavors(id, type);
    if (res) {
      const isFavor = await favors.isFavor(code);
      message.success(isFavor ? LANG('收藏成功！') : LANG('取消收藏！'));
      setIsFavorite(isFavor);
      const latestFavorsList = favors.getFavorsList();
      onFavorite?.(latestFavorsList);
      if (code === id) {
        togglesymbolStatus();
      }
    }
  };

  if (inQuoteList) {
    return (
      <CommonIcon
        name={isFavorite ? 'common-star-active-0' : 'common-star-0'}
        width={width}
        enableSkin
        height={height}
        style={{ cursor: 'pointer' }}
        className="star_icon"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          handleFavorite(code);
        }}
      />
    );
  }
  const starImage = isFavorite ? 'common-star-active-0' : 'common-star-0';
  const handleStar = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    handleFavorite(code);
  };
  return <CommonIcon enableSkin name={starImage} size={20} onClick={handleStar} style={{ cursor: 'pointer' }} />;
};
const Star = React.memo(StarComponent);
export default Star;
