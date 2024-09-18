import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { validateImgCodeApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { paths } from '@/core/network';
import { getUUID } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const CaptchaView = (props: any) => {
  const { ImgCode, resolve } = props;
  const input0 = useRef(null);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const [vHash, refreshvHash] = useState<string>(getUUID(32));
  const [code, setCode] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    setTimeout(() => (input0.current as any).focus());
  }, []);

  const onKeyDown = (e: any) => {
    const inputs: Array<any> = [input0.current, input1.current, input2.current, input3.current];
    const index = e.target.dataset.index;
    const key = e.key;
    // 删除
    if (key === 'Backspace') {
      if (index > 0) setTimeout(() => inputs[index - 1].focus());
    }
    // 确定
    if (key === 'End') {
      if (code.every(Boolean)) submit();
    }
    // 左
    if (key === 'ArrowLeft') {
      if (index > 0) setTimeout(() => inputs[index - 1].focus());
    }
    // 右
    if (key === 'ArrowRight') {
      if (index < 3) setTimeout(() => inputs[+index + 1].focus());
    }
  };

  const onChange = (e: any) => {
    const inputs: Array<any> = [input0.current, input1.current, input2.current, input3.current];
    const index = e.target.dataset.index;
    if (index < 3 && e.target.value) {
      setTimeout(() => inputs[+index + 1].focus());
    }
    setCode((prev) => {
      const arr = [...prev];
      arr[index] = e.target.value;
      return arr;
    });
  };

  const refresh = () => {
    refreshvHash(getUUID(32));
    const inputs: Array<any> = [input0.current, input1.current, input2.current, input3.current];
    inputs.forEach((input) => (input.value = ''));
    setCode(['', '', '', '']);
    setTimeout(() => (input0.current as any).focus());
  };

  const submit = async () => {
    if (!code.every(Boolean)) return;
    try {
      Loading.start();
      const { data } = await validateImgCodeApi({ vHash, code: code.join('') });
      if (data.valid) {
        ImgCode.end();
        resolve({ code: 200, message: 'success', data: { token: data.token, vHash, imgCode: code.join('') } });
      } else {
        refresh();
      }
    } finally {
      Loading.end();
    }
  };

  return (
    <>
      <div className='img-code-wrap' onClick={ImgCode.end}>
        <div className={'img-code-container'} onClick={(e) => e.stopPropagation()}>
          <div className={'img-code-close'} onClick={ImgCode.end}>
            <Image width='14' height='14' src={'/static/images/img-code/close.svg'} alt='Close' />
          </div>
          <div className='title'>{LANG('请输入图片验证码')}</div>
          <div onClick={refresh} className={'img-code-box'}>
            <Image width='125' height='36' className={'img-code'} src={`${paths.img_code}?vHash=${vHash}`} alt='code' />
            {/* <Image width="18" height="18" src={'/static/images/img-code/refresh.svg'} className={'imgtest-icon-refresh'} onClick={() => {}} alt="Refresh" /> */}
          </div>
          <div className={'input-list'}>
            <input type='text' inputMode='numeric' maxLength={1} data-index='0' ref={input0} onKeyDown={onKeyDown} onChange={onChange} />
            <input type='text' inputMode='numeric' maxLength={1} data-index='1' ref={input1} onKeyDown={onKeyDown} onChange={onChange} />
            <input type='text' inputMode='numeric' maxLength={1} data-index='2' ref={input2} onKeyDown={onKeyDown} onChange={onChange} />
            <input type='text' inputMode='numeric' maxLength={1} data-index='3' ref={input3} onKeyDown={onKeyDown} onChange={onChange} />
          </div>
          <div className={'btn'}>
            <Button type='primary' disabled={!code.every(Boolean)} className='confirm-btn' onClick={submit}>
              {LANG('确定')}
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .img-code-wrap {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99998;
          display: flex;
          justify-content: center;
          align-items: center;
          & > .img-code-container {
            position: relative;
            margin: 0 auto;
            background: #fff;
            opacity: 1;
            width: 310px;
            height: 270px;
            border-radius: 4px;
            .title {
              font-size: 14px;
              text-align: center;
              color: #333;
              height: 46px;
              line-height: 46px;
              border-bottom: 1px solid #eaeaea;
            }
            .img-code-close {
              cursor: pointer;
              display: inline-block;
              position: absolute;
              right: 15px;
              top: 15px;
            }
            .img-code-box {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 36px;
              margin: 14px 0 17px;
              font-size: 14px;
              color: red;
              .img-code {
                width: auto;
                height: 100%;
                cursor: pointer;
              }
            }
            .input-list {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 15px 0;
              background: #f5f5f5;
              input {
                height: 40px;
                width: 40px;
                border: 1px solid #8b9bb0;
                border-radius: 4px;
                margin: 0 5px;
                background: transparent;
                outline: none;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                text-align: center;
              }
            }
            .imgtest-icon-refresh {
              cursor: pointer;
              position: absolute;
              right: 65px;
              &.imgtest-icon-loading {
                svg {
                  animation: loading 1s linear infinite;
                }
              }
            }
            :global(.confirm-btn) {
              height: 40px;
              line-height: 40px;
              width: 200px;
              margin: 23px auto 26px;
              cursor: pointer;
            }
          }
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};
