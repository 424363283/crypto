export const GoogleLogin = (callback: Function): Promise<string> => {
    return new Promise((resolve, reject) => {
      // const run = async () => {
      // window.google.accounts.id.prompt((notification: any) => {
      //   prompt('google-prompt', JSON.stringify(notification));
      // });
      // document.querySelector('.g_id_signin')?.dispatchEvent(new Event('click'));
      // };
      const googleScript = document.getElementById('google-signin');
      if (googleScript) {
        document.body.removeChild(googleScript);
      }
  
      //   run();
      // } else {
      const googleAuthUrl = `https://accounts.google.com/gsi/client`;
      const script = document.createElement('script');
      script.src = googleAuthUrl;
      script.id = 'google-signin';
      document.body.appendChild(script);
      // script.onload = run;
  
      // @ts-ignore
      window.google_login_callback = (data: any) => {
        const id_token = data.credential;
        resolve(id_token);
        callback(id_token);
      };
    });
  };
  