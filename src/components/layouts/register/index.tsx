import LoginCommonLayout from '@/components/layouts/login';
import { Loading } from '@/components/loading';
import { getCommonInviteCodeInfoApi } from '@/core/api';
import { getCookie } from '@/core/utils/src/cookie';
import { MediaInfo } from '@/core/utils/src/media-info';
import { useEffect, useState } from 'react';
import { Refer } from './refer';

function Register() {
  const [show, setShow] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const _ru = getCookie('ru');

  useEffect(() => {
    if (_ru) {
      getCommonInviteCodeInfoApi(_ru)
        .then(({ code, data, message }) => {
          if (code == 200 && message === '') {
            setInfo({ ...data, ru: _ru });
            setShow(true);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [_ru]);

  if (loading) return <>{Loading.start()}</>;
  Loading.end();
  return (
    <>
      <LoginCommonLayout
        loginBoxClassName='refer-login-box'
        className={show ? 'refer-layout' : ''}
        logoJumpId='refer-box'
      >
        {show ? <Refer info={info} /> : null}
      </LoginCommonLayout>
      <style jsx>{`
        :global(.login-bg) {
          overflow: hidden;
          position: relative;
        }
        @media ${MediaInfo.desktop} {
          :global(.refer-layout) {
            align-items: flex-start !important;
            padding-top: 97px;
          }
          :global(.refer-login-box) {
            padding: 0 !important;
            margin-left: 76px !important;
          }
        }
        @media ${MediaInfo.tablet} {
          :global(.refer-login-box) {
            padding: 0 !important;
          }
        }
        @media ${MediaInfo.mobileOrTablet} {
          :global(.refer-layout) {
            flex-direction: column-reverse;
            align-items: center;
          }
        }
        @media ${MediaInfo.mobile} {
          :global(.login-bg) {
            padding-top: 32px;
          }
        }
      `}</style>
    </>
  );
}
export default Register;
