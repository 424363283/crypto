// 从 {field[]: (file)} 格式转换为 {field: (file)}
const mergeMultiFileFields = (data: any) => {
    let form = new FormData();
    for (let [key, val] of Object.entries(data)) {
      if (val instanceof Array) {
        for (let o of val) {
          form.append(key, o);
        }
      } else {
        if (typeof val === 'string') {
          form.append(key, encodeURI(val));
        } else {
          form.append(key, val as any);
        }
      }
    }
    return form;
  };
  export { mergeMultiFileFields };
  