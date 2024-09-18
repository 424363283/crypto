const zone = {
  3: 'America/Sao_Paulo',
  4: 'Pacific/Norfolk',
  5: 'America/Mexico_City',
  6: 'America/El_Salvador',
  7: 'US/Mountain',
  8: 'America/Juneau',
  10: 'Pacific/Honolulu',
  0: 'Atlantic/Reykjavik',
  '-1': 'Pacific/Chatham',
  '-2': 'Africa/Cairo',
  '-3': 'Europe/Tallinn',
  '-4': 'Asia/Dubai',
  '-4.5': 'Asia/Tehran',
  '-5': 'Asia/Ashkhabad',
  '-5.5': 'Asia/Kolkata',
  '-5.75': 'Asia/Kathmandu',
  '-6': 'Asia/Almaty',
  '-7': 'Asia/Bangkok',
  '-8': 'Asia/Shanghai',
  '-9': 'Asia/Seoul',
  '-9.5': 'Australia/Adelaide',
  '-10': 'Australia/Sydney',
  '-13': 'Pacific/Fakaofo',
};

export function timezone() {
  let i = new Date().getTimezoneOffset() / 60;
  if (zone[i]) {
    return zone[i];
  } else {
    return 'Asia/Hong_Kong';
  }
}
