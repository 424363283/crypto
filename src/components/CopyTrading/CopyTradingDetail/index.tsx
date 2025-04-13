import React, { useContext, useEffect, useRef, useState } from 'react';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import DetailTab from './Components/detailTab';
import CopySetting from '../CopySetting/index';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import UserInformation from '@/components/CopyTrading/Components/userInformation';
import BringSetting from './Components/bringSetting';
import { CopyTradeSetting } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
export default function CopyTradingDetail() {
  const { copyActiveType } = useCopyState();
  const ShowCopyTrading = () => {
    if (copyActiveType === CopyTradeSetting.bringSetting) {
      return <BringSetting />;
    } else if (copyActiveType === CopyTradeSetting.futures) {
      return <CopySetting />;
    } else if (copyActiveType === CopyTradeSetting.followDetial) {
      return <DetailTab />;
    } else {
      return <DetailTab />;
    }
  };
  return (
    <div className="copy-detail-box">
      <UserInformation />
      <div className="copy-detail">
        <div className="copy-detail-container">
          <ShowCopyTrading />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .copy-detail-box {
    background-color: var(--bg-1);
  }
  .copy-detail {
    padding-bottom: 120px;
    height: 100%;

    &-container {
      width: 1200px;
      margin: 0 auto;
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
    }
  }
`;
