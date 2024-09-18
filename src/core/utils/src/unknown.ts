const isUaMobile = () => {
  return /Android|iPhone|SymbianOS|Windows Phone|iPod|iPad|PlayBook/i.test(navigator.userAgent);
};

const serializeObject = (obj: { [key: string]: any }): string => {
  var paramString = '';
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (paramString.length > 0) {
        paramString += '&';
      }
      paramString += key + '=' + encodeURIComponent(obj[key]);
    }
  }
  return paramString;
};

/**
 * 隐藏电话或邮箱
 * */
function hidePartialOfPhoneOrEmail(str: string = '') {
  if (!str) {
    return '';
  }
  if (str.indexOf('@') > -1) {
    return str.replace(/(.{1}).+(.{1}@.+)/g, '$1****$2');
  } else {
    return str.replace(/(\d{3}).+(\d{4})/, '$1****$2');
  }
}

interface CompressedImage {
  file: File;
  imgSrc: string;
}

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const compressImage = (files: File): Promise<CompressedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    let base64: string, size: number;
    const imgName = files?.name || 'test';
    img.onload = () => {
      const maxWidth = 1080;
      const quality = 0.9;
      const canvas = document.createElement('canvas');
      const drawer = canvas.getContext('2d')!;

      const originWidth = img.width;
      const originHeight = img.height;
      const ratio = originHeight / originWidth;
      const canvasHeight = ratio * maxWidth;

      canvas.width = maxWidth;
      canvas.height = canvasHeight;
      drawer.drawImage(img, 0, 0, canvas.width, canvas.height);

      const canvasBase64 = canvas.toDataURL('image/jpeg', quality);
      if (size >= 1024 * 2) {
        base64 = base64.length < canvasBase64.length ? base64 : canvasBase64;
      }
      resolve({ file: dataURLtoFile(base64, imgName), imgSrc: base64 });
    };
    reader.readAsDataURL(files);
    reader.onload = (event: ProgressEvent<FileReader>) => {
      base64 = event.target!.result as string;
      img.src = base64;
      size = Math.ceil(event.total! / 1024);
    };
  });
};

// 小数位转对应最小小数
const toMinNumber = (digit: number) => {
  if (digit <= 0) {
    return 0;
  }
  let str = '';
  for (let i = 0; i < digit - 1; i++) {
    str += '0';
  }
  return Number('0.' + str + '1');
};

function removeCountryCode(countryCode: number, phone: string): string {
  const codeRegex = new RegExp('^' + countryCode);
  if (codeRegex.test(phone)) {
    return phone.replace(codeRegex, '');
  } else {
    return phone;
  }
}
const dispatchGeolocation = function () {
  if (navigator.geolocation) {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          localStorage._latlng = lat + ',' + lon;
        } catch (e) {}
      });
    } catch (e) {}
  }
};

// 截取小数位并向上舍入
const toFixedCeil = (num: number, digit: number) => {
  const fixedAddNum = num.toFixed(digit + 1);
  const fixedNum = num.toFixed(digit);
  if (Number(fixedAddNum[fixedAddNum.length - 1]) > 0) {
    const pow = Math.pow(10, digit);
    return fixedNum.mul(pow).add(1).div(pow);
  }
  return fixedNum;
};

export { compressImage, dataURLtoFile, dispatchGeolocation, hidePartialOfPhoneOrEmail, isUaMobile, removeCountryCode, serializeObject, toFixedCeil, toMinNumber };
