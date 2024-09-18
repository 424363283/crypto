const DEVICE_SIZE = {
    mobile: 768,
    tablet: 1026,
    desktop: 1026,
  };
  
  const DEVICE_KIND = [
    {
      type: 'ios',
      text: 'App Store',
      name: 'external-apple',
    },
    {
      type: 'google',
      text: 'Google Play',
      name: 'external-google-play',
    },
    {
      type: 'win',
      text: 'Windows',
      name: 'external-windows',
    },
    {
      type: 'mac',
      text: 'Mac OS',
      name: 'external-mac',
    },
    {
      type: 'android',
      text: 'Android',
      name: 'external-android',
    },
  ];
  
  export { DEVICE_KIND, DEVICE_SIZE };
  