export const mergedArray = (arr1:[], arr2:[],unikey='id') => {
    const mergedMap = {} as any;
    // 遍历 array1，将数据存入对象
    arr1.forEach((item:any) => {
      mergedMap[item[unikey]] = { ...item };
    });
    // 遍历 array2，将数据合并到对象
    arr2.forEach((item:any) => {
      if (mergedMap[item[unikey]]) {
        mergedMap[item[unikey]] = { ...mergedMap[item[unikey]], ...item }; // 合并
      } else {
        mergedMap[item[unikey]] = { ...item }; // 新增
      }
    });
  
    // 将对象转换回数组
    return Object.values(mergedMap);
  };
  