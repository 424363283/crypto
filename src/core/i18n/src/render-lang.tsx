import React from 'react';
/**
 * 用法如下：
 *  renderLangContent(LANG('你可以使用{name}来替换'), {name: <span className="name">{LANG('任意值')}</span>})
 */
export const renderLangContent = (text: string, params: { [key: string]: React.ReactNode }) => {
  // 将文本中的占位符替换为 JSX 元素
  const regex = /{(\w+)}/g;
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) => {
        if (params[part] || params[part] === 0) {
          return <React.Fragment key={index}>{params[part]}</React.Fragment>;
        }
        return part;
      })}
    </>
  );
};
