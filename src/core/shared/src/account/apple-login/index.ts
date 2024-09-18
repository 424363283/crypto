import { AppleLoginType } from './types';

export const AppleLogin = (type: AppleLoginType): Promise<string> => {
  const appleAuthUrl = `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js`;
  return new Promise((resolve, reject) => {
    const run = async () => {
      try {
        const data = await window.AppleID.auth.signIn();
        const id_token = data.authorization.id_token;
        resolve(id_token);
      } catch (error) {
        reject(error);
      }
    };
    if (document.getElementById('appleid-signin')) {
      run();
    } else {
      const script = document.createElement('script');
      script.src = appleAuthUrl;
      script.id = 'appleid-signin';
      document.body.appendChild(script);
      script.onload = async () => {
        window.AppleID.auth.init({
          clientId: 'com.y-mex.web',
          scope: 'email',
          state: 'webAppleLogin',
          redirectURI: window.location.origin + (AppleLoginType.LOGIN == type ? '/login' : '/register'),
          usePopup: true,
        });
        run();
      };
    }
  });
};
